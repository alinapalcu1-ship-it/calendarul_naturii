const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const base = process.env.TEST_URL || 'http://127.0.0.1:5175/calendarul_naturii/';
(async () => {
 const browser = await chromium.launch({channel:'msedge',headless:true,args:['--autoplay-policy=document-user-activation-required']});
 try {
  const page = await browser.newPage({viewport:{width:1600,height:1100},reducedMotion:'reduce'});
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{
   window.testAudio=[];
   const Original=window.Audio;
   window.Audio=function(src){const a=new Original(src);a.addEventListener('ended',()=>{a.testEnded=true});window.testAudio.push(a);return a;};
  });
  await page.goto(base);
  assert.equal(await page.evaluate(()=>window.testAudio.length),0,'no welcome autoplay');
  const played=[];
  async function listen(locator, file){
   const count=await page.evaluate(()=>window.testAudio.length);
   await locator.click();
   await page.waitForFunction(n=>window.testAudio.length>n,count);
   await page.waitForFunction(()=>{const a=window.testAudio.at(-1);return !a.paused&&a.currentTime>.12&&a.readyState>=2;});
   const actual=await page.evaluate(()=>{const a=window.testAudio.at(-1);return {url:a.src,time:a.currentTime,duration:a.duration,muted:a.muted,volume:a.volume};});
   assert.equal(new URL(actual.url).pathname,'/calendarul_naturii/audio/'+file);
   assert(actual.duration>0&&!actual.muted&&actual.volume>0);
   assert(await page.evaluate(()=>window.testAudio.slice(0,-1).every(a=>a.paused)),'old playback stopped');
   played.push(actual);
  }
  await listen(page.getByRole('button',{name:'Ascultă mesajul de bun venit'}),'buna_dimineata_ne_intalnim.mp3');
  await page.getByRole('button',{name:/Astăzi este/}).click();
  await page.getByRole('button',{name:/^Luna/}).click();
  const months=['Ianuarie','Februarie','Martie','Aprilie','Mai','Iunie','Iulie','August','Septembrie','Octombrie','Noiembrie','Decembrie'];
  for(const month of months) await listen(page.getByRole('button',{name:month,exact:true}),month.toLowerCase()+'.mp3');
  console.log('PASS welcome + 12 months: real playback');
  await page.getByRole('button',{name:'Acasă',exact:true}).click();
  await page.getByRole('button',{name:/Cum este vremea/}).click();
  for(const [label,file] of [['Însorit','insorit'],['Parțial noros','partial_noros'],['Înnorat','innorat'],['Ploaie','ploaie'],['Ninsoare','ninsoare'],['Vânt','vant'],['Ceață','ceata'],['Cald','cald'],['Răcoare','racoare'],['Frig','frig']])
   await listen(page.getByRole('button',{name:label,exact:true}),file+'.mp3');
  await listen(page.getByRole('button',{name:'Ascultă întrebarea Cum este afară'}),'cum_e_afara.mp3');
  console.log('PASS 7 weather + 3 temperature + question: real playback');
  await page.getByRole('button',{name:'Acasă',exact:true}).click();
  await page.getByRole('button',{name:/Ziua noastră/}).click();
  await listen(page.getByRole('button',{name:'Gata! Începem ziua!'}),'impreuna_ziua_e_mai.mp3');
  await listen(page.getByRole('button',{name:'Ascultă mesajul final'}),'impreuna_ziua_e_mai.mp3');
  await page.waitForFunction(()=>window.testAudio.at(-1).testEnded);
  console.log('PASS final message, including playback through ended');
  // Decode the actual files and confirm non-silent sample data, not just HTTP success.
  const files=fs.readdirSync('public/audio',{recursive:true}).filter(f=>f.endsWith('.mp3')).map(f=>'audio/'+f.replaceAll(path.sep,'/'));
  const decoded=await page.evaluate(async files=>{
   const ctx=new AudioContext();
   try{return await Promise.all(files.map(async file=>{
    const response=await fetch(file);if(!response.ok)throw Error(file+': '+response.status);
    const buffer=await ctx.decodeAudioData(await response.arrayBuffer());
    let peak=0;for(const sample of buffer.getChannelData(0))peak=Math.max(peak,Math.abs(sample));
    return {file,duration:buffer.duration,peak};
   }));}finally{await ctx.close();}
  },files);
  assert(decoded.every(a=>a.duration>0&&a.peak>.01));
  assert.deepEqual(errors,[]);
  // A genuine failed request must give feedback and allow a subsequent retry.
  await page.route('**/audio/impreuna_ziua_e_mai.mp3',r=>r.abort());
  await page.getByRole('button',{name:'Ascultă mesajul final'}).click();
  await page.locator('.audio-notice').filter({hasText:'Sunetul nu a pornit'}).waitFor();
  await page.unroute('**/audio/impreuna_ziua_e_mai.mp3');
  await listen(page.getByRole('button',{name:'Ascultă mesajul final'}),'impreuna_ziua_e_mai.mp3');
  assert.equal(await page.locator('.audio-notice').count(),0);
  console.log(`PASS ${decoded.length} MP3s decoded with non-silent samples; failure/retry; no JS errors`);
  if (!process.env.NO_AUDIO_REPORT) fs.writeFileSync('qa/audio-playback-report.json',JSON.stringify({base,played,decoded},null,2));
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
