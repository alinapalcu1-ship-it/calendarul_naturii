from zipfile import ZipFile
from PIL import Image
from pathlib import Path
import hashlib,json
root=Path('public/assets/dress-ready');manifest={}
with ZipFile(r'C:\Users\teodo\Downloads\dress_the_doll_ready_corrected.zip') as z:
 for n in z.namelist():
  if n.startswith(('girl/','boy/')) and n.endswith('.png'):
   p=root/n
   assert p.read_bytes()==z.read(n)
   im=Image.open(p);assert im.size==(1086,1448),(n,im.size)
   manifest[n]=hashlib.sha256(p.read_bytes()).hexdigest()
(root/'sources.json').write_text(json.dumps(manifest,indent=2))
print(len(manifest),'unchanged PNGs, 1086x1448')
