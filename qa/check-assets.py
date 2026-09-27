from pathlib import Path
from PIL import Image
import json,hashlib
root=Path('public/assets/haine')
files=list((root/'extracted').glob('*.png'))
assert len(files)==66
for path in files:
 im=Image.open(path)
 assert im.mode=='RGBA' and im.getchannel('A').getextrema()==(0,255),path
print('PASS: 52 transparent article PNGs + 14 limb overlays')
sources={name:hashlib.sha256((root/name).read_bytes()).hexdigest() for name in ['haine_sheet.png','manechin_baiat.png','manechin_fata.png']}
assert sources==json.loads((root/'sources.json').read_text(encoding='utf-8'))
print('PASS: original source hashes unchanged')
