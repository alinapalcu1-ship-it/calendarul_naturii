const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true,args:['--autoplay-policy=document-user-activation-required']});
 try{
 const p=await browser.newPage({viewport:{width:1600,height:1100}});const errors=[],network=[];
 p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.url().includes('/audio/'))network.push({url:r.url(),status:r.status()})});
 await p.addInitScript(()=>{window.audios=[];const Original=window.Audio;window.Audio=function(src){const a=new Original(src);window.audios.push(a);return a;}});
 await p.goto(process.env.TEST_URL||'http://127.0.0.1:5175/calendarul_naturii/');
 assert.equal(await p.evaluate(()=>window.audios.length),0,'no autoplay/audio creation on load');
 await p.getByRole('button',{name:'Pornește muzica',exact:true}).click();
 await p.waitForFunction(()=>window.audios[0].currentTime>.1);
 assert.deepEqual(await p.evaluate(()=>({loop:window.audios[0].loop,volume:window.audios[0].volume})),{loop:true,volume:.15});
 async function listen(label,file,scope=p){
  const n=await p.evaluate(()=>window.audios.length);
  await scope.getByRole('button',{name:label,exact:true}).click();
  await p.waitForFunction(n=>window.audios.length>n&&window.audios.at(-1).currentTime>.1&&!window.audios.at(-1).paused,n);
  assert.equal(await p.evaluate(()=>new URL(window.audios.at(-1).src).pathname),'/calendarul_naturii/audio/'+file);
  assert.equal(await p.evaluate(()=>window.audios[0].volume),.025);
  assert(await p.evaluate(()=>window.audios.slice(1,-1).every(a=>a.paused)),'voice replaced across components');
 }
 for(const [name,file] of [['Luni','luni'],['Marți','marti'],['Miercuri','miercuri'],['Joi','joi'],['Vineri','vineri']]){await listen(name,'zile/zi_'+file+'.mp3');assert.equal(await p.getByRole('button',{name,exact:true}).getAttribute('aria-pressed'),'true');}
 for(const [name,file] of [['Vesel','vesel'],['Trist','trist'],['Supărat','suparat'],['Speriat','speriat'],['Obosit','obosit'],['Liniștit','linistit']]){await listen(name,'emotii/emotie_'+file+'.mp3');assert.equal(await p.getByRole('button',{name,exact:true}).getAttribute('aria-pressed'),'true');}
 await p.getByRole('button',{name:/Anotimpul/}).click();
 for(const [name,file]of [['Primăvara','primavara'],['Vara','vara'],['Toamna','toamna'],['Iarna','iarna']]){await listen(name,'anotimpuri/anotimp_'+file+'.mp3');assert.equal(await p.getByRole('button',{name,exact:true}).getAttribute('aria-pressed'),'true');}
 await p.waitForFunction(()=>window.audios.at(-1).ended);assert.equal(await p.evaluate(()=>window.audios[0].volume),.15);
 console.log('PASS all 5 weekdays, 6 emotions, 4 seasons; real playback and selection; music ducking/restoration');
 await p.getByRole('button',{name:'Acasă',exact:true}).click();await p.getByRole('button',{name:/Astăzi este/}).click();await listen('Luni','zile/zi_luni.mp3');await listen('Miercuri','zile/zi_miercuri.mp3');
 await p.getByRole('button',{name:'Acasă',exact:true}).click();await p.getByRole('button',{name:/Cum ne simțim/}).click();await listen('Vesel','emotii/emotie_vesel.mp3');await listen('Trist','emotii/emotie_trist.mp3');
 await p.getByRole('button',{name:'Acasă',exact:true}).click();await p.getByRole('button',{name:/Cine este la grădiniță/}).click();await p.locator('.child-card').first().click();await p.locator('.child-emotion-button').first().click();await listen('Vesel','emotii/emotie_vesel.mp3',p.getByRole('dialog'));assert.equal(await p.getByRole('dialog').count(),0);await p.waitForFunction(()=>window.audios.at(-1).ended);assert.equal(await p.evaluate(()=>window.audios[0].volume),.15);
 // A real failed voice request restores the background level and can be retried.
 await p.getByRole('button',{name:'Acasă',exact:true}).click();await p.route('**/audio/emotii/emotie_trist.mp3',r=>r.abort());await p.getByRole('button',{name:'Trist',exact:true}).click();await p.locator('.audio-notice').waitFor();assert.equal(await p.evaluate(()=>window.audios[0].volume),.15);await p.unroute('**/audio/emotii/emotie_trist.mp3');await listen('Trist','emotii/emotie_trist.mp3');
 await p.getByRole('button',{name:'Oprește muzica',exact:true}).click();assert(await p.evaluate(()=>window.audios[0].paused));await p.waitForFunction(()=>window.audios.at(-1).ended);assert(await p.evaluate(()=>window.audios[0].paused),'voice ending must not restart disabled music');
 await p.getByRole('button',{name:'Pornește muzica',exact:true}).click();await p.getByRole('button',{name:'Oprește muzica',exact:true}).click();await p.getByRole('button',{name:'Pornește muzica',exact:true}).click();await p.waitForFunction(()=>window.audios.at(-1).currentTime>.1);assert(await p.evaluate(()=>window.audios.slice(0,-1).every(a=>a.paused)));
 assert(network.every(r=>[200,206].includes(r.status)),JSON.stringify(network));assert(network.every(r=>new URL(r.url).pathname.startsWith('/calendarul_naturii/audio/')));assert.equal(new Set(network.map(r=>r.url)).size,16);assert.deepEqual(errors,[]);
 await p.reload();assert.equal(await p.evaluate(()=>window.audios.length),0);
 console.log('PASS calendar/emotion/dialog surfaces, no dialog truncation, failed-request recovery, music on/off and rapid toggle, no MP3 404s (16 URLs), no autoplay after reload');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
