const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
 const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const url=process.env.TEST_URL || 'http://127.0.0.1:5175/calendarul_naturii/';
 const read=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('calendarul-naturii-v1')));
 await page.goto(url);await page.waitForFunction(()=>localStorage.getItem('calendarul-naturii-v1'));
 const fresh=await read();assert.equal(fresh.group,'');assert.equal(fresh.children.length,30);assert(fresh.children.every(c=>c.name===''&&c.birthday===''&&!c.photo));
 assert(!/Copil \d|Grupa Mămăruțelor/.test(await page.locator('body').innerText()));
 await page.getByRole('button',{name:/Cine este la grădiniță/}).click();assert.equal(await page.locator('.child-card').count(),30);assert.equal(await page.locator('.child-card strong').filter({hasText:'Loc disponibil'}).count(),30);
 await page.getByRole('button',{name:'Setări educatoare'}).click();assert.equal(await page.locator('.child-editor').count(),30);
 await page.getByLabel('Numele grupei',{exact:true}).fill('Grupa Exploratorilor');
 await page.getByLabel('Nume copil 30',{exact:true}).fill('Ana');await page.getByLabel('Aniversare copil 30',{exact:true}).fill('2021-05-12');
 await page.getByLabel('Fotografie copil 30',{exact:true}).setInputFiles('public/assets/dress-ready/girl/thumbs/girl-top-01.png');
 await page.waitForFunction(()=>JSON.parse(localStorage.getItem('calendarul-naturii-v1')).children[29].photo?.startsWith('data:image/'));
 await page.reload();const configured=await read();assert.equal(configured.group,'Grupa Exploratorilor');assert.equal(configured.children[29].name,'Ana');assert.equal(configured.children[29].birthday,'2021-05-12');assert(configured.children[29].photo);
 const legacy={...configured,group:'Grupa Mămăruțelor',children:configured.children.slice(0,22).map((c,i)=>({...c,name:`Copil ${i+1}`}))};legacy.children[4]={...configured.children[29],id:5};
 await page.evaluate(s=>localStorage.setItem('calendarul-naturii-v1',JSON.stringify(s)),legacy);await page.reload();const migrated=await read();assert.equal(migrated.group,'');assert.equal(migrated.children.length,30);assert.equal(new Set(migrated.children.map(c=>c.id)).size,30);assert.equal(migrated.children[4].name,'Ana');assert.equal(migrated.children[4].photo,configured.children[29].photo);assert.equal(migrated.children[4].birthday,'2021-05-12');assert(migrated.children.every((c,i)=>i===4||c.name===''));
 await page.reload();assert.deepEqual((await read()).children,migrated.children);
 await page.getByRole('button',{name:'Setări educatoare'}).click();await page.getByRole('button',{name:'Resetează complet aplicația'}).click();await page.getByRole('button',{name:'Da, șterge tot'}).click();const reset=await read();assert.equal(reset.group,'');assert.equal(reset.children.length,30);assert(reset.children.every(c=>!c.name&&!c.photo&&!c.birthday));
 assert.deepEqual(errors,[]);console.log('PASS 30 empty slots, neutral labels, all fields on slot 30, local persistence, migration from 22, preserved photos/names/birthdays, idempotent migration, full reset; no JS errors');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
