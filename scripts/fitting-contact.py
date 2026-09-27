from PIL import Image,ImageDraw
from pathlib import Path
for gender in ['fata','baiat']:
 files=sorted(Path('qa').glob('fit-'+gender+'*.png'))
 canvas=Image.new('RGB',(7*150,4*230),'#f8f4e7');d=ImageDraw.Draw(canvas)
 for i,file in enumerate(files):
  im=Image.open(file);im.thumbnail((150,200));x=(i%7)*150;y=(i//7)*230;canvas.paste(im,(x+(150-im.width)//2,y));d.text((x+2,y+202),file.stem[4:],fill='#263c33')
 canvas.save('qa/fittings-'+gender+'.png')
