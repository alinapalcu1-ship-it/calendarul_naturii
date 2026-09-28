const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const ts = require('typescript');
function load(file) {
 const source = fs.readFileSync(file, 'utf8').replaceAll('import.meta.env.BASE_URL', '"/calendarul_naturii/"');
 const output = ts.transpileModule(source, {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
 const exports = {}; vm.runInNewContext(output, {exports, require}); return exports;
}
const audio = load('src/utils/audioPrompts.ts');
const { german, translate } = load('src/i18n/translations.ts');
const date = load('src/utils/dateUtils.ts');
const files = fs.readdirSync('public/audio', {recursive:true}).filter(f=>f.endsWith('.mp3'));
assert.equal(files.length,88);
assert.equal(files.filter(f=>f.startsWith('de'+path.sep)).length,47);
const ro = new Set(), de = new Set();
for (const label of Object.keys(german)) for (const language of ['ro','de']) {
 const url=audio.wordAudio(label,language);if(!url)continue;
 assert(url.startsWith('/calendarul_naturii/audio/'));
 assert(fs.existsSync('public/'+url.slice('/calendarul_naturii/'.length)),url);
 (language==='ro'?ro:de).add(url);
}
for(const language of ['ro','de'])for(const key of ['welcome','weatherQuestion','finalMessage']) {
 const url=audio.promptFor(key,language);if(!url)continue;
 assert(fs.existsSync('public/'+url.slice('/calendarul_naturii/'.length)),url);
 (language==='ro'?ro:de).add(url);
}
assert.equal(ro.size,40);assert.equal(de.size,47);
assert.equal(audio.promptFor('weatherQuestion','de'),undefined);
assert.equal(audio.wordAudio('Mic dejun','ro'),undefined);
assert.equal(audio.wordAudio('Fetiță','ro'),undefined);
assert.equal(audio.wordAudio('Luni','de'),'/calendarul_naturii/audio/de/zile/montag.mp3');
assert.equal(translate('Luni','de'),'Montag');assert.equal(translate('Luni','ro'),'Luni');
assert.equal(date.dateText('2026-09-28','de'),'Montag, 28. September 2026');
// Every literal translation key must have a German entry.
for(const file of ['src/App.tsx',...fs.readdirSync('src/pages').map(f=>'src/pages/'+f),...fs.readdirSync('src/components').filter(f=>f.endsWith('.tsx')).map(f=>'src/components/'+f)]) {
 const source=fs.readFileSync(file,'utf8');const ast=ts.createSourceFile(file,source,99,true,4);
 function visit(n){if(ts.isCallExpression(n)&&n.expression.getText(ast)==='t'&&n.arguments[0]&&ts.isStringLiteral(n.arguments[0]))assert(german[n.arguments[0].text]!==undefined,`${file}: ${n.arguments[0].text}`);ts.forEachChild(n,visit);}visit(ast);
}
console.log('PASS: 88 MP3, 40 RO voices + 1 background + 47 DE; every mapped file exists; BASE_URL prefix; missing question intentionally omitted; date and translation keys.');
