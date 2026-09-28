const { chromium, devices } = require('playwright');
const fs = require('node:fs');
const assert = require('node:assert/strict');
const base = process.env.TEST_URL || 'http://127.0.0.1:5176/calendarul_naturii/';
(async () => {
 const browser = await chromium.launch({channel:'msedge', headless:true, args:['--autoplay-policy=document-user-activation-required']});
 try {
  for (const mobile of [false,true]) {
   const context = await browser.newContext(mobile ? devices['iPhone 13'] : {viewport:{width:1600,height:1100}});
   const page = await context.newPage(); const errors=[], responses=[];
   page.on('pageerror',e=>errors.push(e.message));
   page.on('response',r=>{if(r.url().includes('/audio/'))responses.push({url:r.url(),status:r.status()});});
   // Isolated test context: no teacher's browser data is used or cleared.
   await page.addInitScript(() => {
    window.qaAudio=[]; const Original=window.Audio;
    window.Audio=function(src){const a=new Original(src);window.qaAudio.push(a);return a;};
   });
   await page.goto(base);
   await page.getByRole('heading',{name:'Bună dimineața!',exact:true}).waitFor();
   assert.equal(await page.evaluate(()=>qaAudio.length),0,'no autoplay on load');
   const click=async name=>{const b=page.getByRole('button',{name,exact:true});if(mobile)await b.tap();else await b.click();};
   const home=async()=>click(await page.locator('html').getAttribute('lang')==='de'?'Startseite':'Acasă');
   const play=async(name,file)=>{
    const before=await page.evaluate(()=>qaAudio.length);await click(name);
    await page.waitForFunction(n=>qaAudio.length>n&&qaAudio.at(-1).currentTime>0.05,before);
    assert.equal(await page.evaluate(()=>new URL(qaAudio.at(-1).src).pathname),'/calendarul_naturii/audio/'+file);
   };
   await play('Ascultă mesajul de bun venit','buna_dimineata_ne_intalnim.mp3');
   await play('Luni','zile/zi_luni.mp3');
   await page.getByRole('button',{name:/Astăzi este…/}).click();
   await page.getByRole('button',{name:/^Luna/}).click();await play('Septembrie','septembrie.mp3');await home();
   await page.getByRole('button',{name:/Cum este vremea\?/}).click();
   await play('Însorit','insorit.mp3');await play('Cald','cald.mp3');await play('Ascultă întrebarea Cum este afară','cum_e_afara.mp3');await home();
   await click('Ziua noastră');await play('Gata! Începem ziua!','impreuna_ziua_e_mai.mp3');await play('Ascultă mesajul final','impreuna_ziua_e_mai.mp3');await home();
   await click('Deutsch');assert.equal(await page.locator('html').getAttribute('lang'),'de');
   await play('Begrüßung anhören','de/mesaje/start.mp3');await play('Montag','de/zile/montag.mp3');
   await play('Fröhlich','de/emotii/froehlich.mp3');await play('Mädchen','de/personaje/maedchen.mp3');await play('Frühstück','de/rutina/fruehstueck.mp3');
   await page.getByRole('button',{name:/Heute ist …/}).click();await page.getByRole('button',{name:/^Monat/}).click();await play('September','de/luni/september.mp3');await home();
   await page.getByRole('button',{name:/Die Jahreszeit/}).click();await play('Frühling','de/anotimpuri/fruehling.mp3');await home();
   await page.getByRole('button',{name:/Wie ist das Wetter\?/}).click();
   assert.equal(await page.locator('.section-audio-row button').count(),0);
   await play('Sonnig','de/vreme/sonnig.mp3');await play('Kühl','de/vreme/kuehl.mp3');await home();
   await click('Unser Tag');await play('Los geht’s! Wir starten in den Tag!','de/mesaje/ende.mp3');await play('Abschlussnachricht anhören','de/mesaje/ende.mp3');await home();
   // Configure through the existing UI, including a real existing image as a test photo.
   await click('Einstellungen für die Erzieherin');await click('Einstellungen entsperren');await click('Ich bin die Erzieherin, weiter');
   await page.getByLabel('Name von Kind 1',{exact:true}).fill('QA Kind');
   await page.getByLabel('Foto von Kind 1',{exact:true}).setInputFiles('public/assets/dress-ready/girl/girl-base.png');
   await page.getByText('Auf diesem Gerät gespeichert',{exact:true}).waitFor();await home();
   await page.locator('.board-child-presence').first().click();
   await click('Mädchen');await page.locator('[data-garment="fata_top_01"]').click();
   await click('Junge');await page.locator('[data-garment="baiat_top_01"]').click();
   await page.getByText('Auf diesem Gerät gespeichert',{exact:true}).waitFor();
   const saved=()=>page.evaluate(()=>localStorage.getItem('calendarul-naturii-v1'));
   const before=await saved();const photo=await page.locator('.board-child-presence img').first().getAttribute('src');
   assert(photo&&photo.startsWith('data:image/'));
   const state=JSON.parse(before);assert.equal(state.season,'Primăvara');assert.equal(state.temperature,'Răcoare');assert(state.present.includes(1));assert(state.outfits.girl.includes('fata_top_01'));assert(state.outfits.boy.includes('baiat_top_01'));
   const voices=await page.evaluate(()=>qaAudio.filter(a=>!a.loop).length);
   await click('Română');await click('Deutsch');await click('Română');
   assert.equal(await saved(),before,'language does not write pedagogical state');
   assert.equal(await page.locator('.board-child-presence img').first().getAttribute('src'),photo);
   assert.equal(await page.evaluate(()=>qaAudio.filter(a=>!a.loop).length),voices,'switch never starts a voice');
   await page.reload();await page.getByRole('heading',{name:'Bună dimineața!',exact:true}).waitFor();
   assert.equal(await page.locator('.board-child-presence img').first().getAttribute('src'),photo,'photo survives reload/IndexedDB');
   assert.equal(await page.evaluate(()=>qaAudio.length),0);
   await click('Deutsch');
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'no horizontal overflow');
   await page.screenshot({path:`qa/bilingual-${mobile?'mobile':'desktop'}.png`,fullPage:true});
   assert(responses.length>0); console.log("Audio responses:",responses.length);assert(responses.every(r=>[200,206].includes(r.status)));
   assert.deepEqual(errors,[]);
   console.log('PASS bilingual UI/audio, canonical state, outfits, attendance, photo/IndexedDB, persistence and layout:',mobile?'iPhone emulation':'desktop');
   await context.close();
  }
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});

