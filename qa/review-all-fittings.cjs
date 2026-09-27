const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({channel:'msedge',headless:true});try{
const p=await b.newPage({viewport:{width:1600,height:1200},reducedMotion:'reduce'});await p.goto(process.env.TEST_URL||'http://127.0.0.1:5174/calendarul_naturii/');await p.getByRole('button',{name:/Cum ne îmbrăcăm/}).click();
for(const [gender,name]of [['fata','Fetiță'],['baiat','Băiat']]){
 await p.getByRole('button',{name,exact:true}).click();await p.getByRole('button',{name:'Încep din nou',exact:true}).click();const shots=[];
 async function choose(cat,id){await p.getByRole('button',{name:cat,exact:true}).click();if(await p.locator('[data-garment="'+gender+'_'+id+'"]').getAttribute('aria-pressed')!=='true')await p.locator('[data-garment="'+gender+'_'+id+'"]').click();}
 await choose('Accesorii','accessory_03');await choose('Accesorii','accessory_02');
 for(let i=1;i<=4;i++){const n=String(i).padStart(2,'0');await choose('Partea de sus','top_'+n);await choose('Partea de jos','bottom_'+n);await choose('Încălțăminte','shoes_'+n);await p.locator('.fitted-mannequin img').evaluateAll(imgs=>Promise.all(imgs.map(im=>im.decode())));shots.push(await p.locator('.fitted-mannequin').evaluate(e=>e.outerHTML));}
 for(let i=1;i<=4;i++){await choose(i===4?'Accesorii':'Exterior','outer_0'+i);await p.locator('.fitted-mannequin img').evaluateAll(imgs=>Promise.all(imgs.map(im=>im.decode())));shots.push(await p.locator('.fitted-mannequin').evaluate(e=>e.outerHTML));}
 await p.evaluate(({shots,gender})=>{const gallery=document.createElement('div');gallery.id='fitting-review';gallery.style.cssText='position:absolute;top:0;left:0;z-index:9999;background:#fff8ef;display:grid;grid-template-columns:repeat(4,300px);gap:12px;padding:12px';gallery.innerHTML=shots.map((html,i)=>'<div><p>'+gender+' '+(i<4?'Ținuta '+(i+1):'Exterior '+(i-3))+'</p>'+html+'</div>').join('');document.body.append(gallery)}, {shots,gender});await p.locator('#fitting-review').screenshot({path:'qa/fittings-'+gender+'.png'});await p.locator('#fitting-review').evaluate(e=>e.remove());
}
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
