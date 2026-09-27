const { chromium } = require('playwright');
const assert = require('node:assert/strict');
(async()=>{
 const b=await chromium.launch({channel:'msedge',headless:true});
 try {
 const p=await b.newPage({viewport:{width:1600,height:1100},reducedMotion:'reduce'});
 const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(process.env.TEST_URL || 'http://127.0.0.1:5175/calendarul_naturii/');
 await p.getByRole('button',{name:/Cum ne îmbrăcăm/}).click();
 for(const [gender,name] of [['baiat','Băiat'],['fata','Fetiță']]){
 await p.getByRole('button',{name,exact:true}).click();
 await p.getByRole('button',{name:'Încep din nou',exact:true}).click();
 for(const [cat,suffix]of [['Partea de sus','top_01'],['Partea de jos','bottom_01'],['Încălțăminte','shoes_01'],['Accesorii','accessory_03']]){
 await p.getByRole('button',{name:cat,exact:true}).click();await p.locator(`[data-garment="${gender}_${suffix}"]`).click();}
 assert.equal(await p.locator('.fitted-mannequin [data-slot=gloves]').count(),2);
 assert.equal(await p.locator('.fitted-mannequin [data-slot=shoes]').count(),2);
 await p.locator('.fitted-mannequin').screenshot({path:`qa/after-${gender}.png`});
 await p.locator(`[data-garment="${gender}_accessory_02"]`).click();
 await p.locator('.fitted-mannequin').screenshot({path:`qa/hat-${gender}.png`});
 await p.getByRole('button',{name:'Partea de jos',exact:true}).click();
 await p.locator(`[data-garment="${gender}_bottom_03"]`).click();
 await p.locator('.fitted-mannequin').screenshot({path:`qa/alternate-${gender}.png`});
 await p.getByRole('button',{name:'Încep din nou',exact:true}).click();
 assert.equal(await p.locator('.fitted-layer').count(),0);
 for(const [cat,id] of [['Partea de jos','bottom_02'],['Încălțăminte','shoes_04'],['Accesorii','accessory_01'],['Exterior','outer_01']]){
 await p.getByRole('button',{name:cat,exact:true}).click();await p.locator('[data-garment="'+gender+'_'+id+'"]').click();}
 await p.locator('.fitted-mannequin').screenshot({path:'qa/outer-'+gender+'.png'});
 assert(await p.locator('.fitted-mannequin img').evaluateAll(images=>images.every(im=>im.complete&&im.naturalWidth>0)));
 }
 await p.setViewportSize({width:390,height:844});
 await p.locator('.fitted-mannequin').screenshot({path:'qa/dressing-mobile.png'});
 assert(await p.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth));
 assert.deepEqual(errors,[]);
 console.log('PASS boy/girl trousers, skirt, shoes, gloves, hats, coats, boots; reset; loaded images; mobile overflow; no JS errors');
 } finally {await b.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
