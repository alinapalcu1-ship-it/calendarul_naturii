"""Deterministic extraction of the supplied final sheet; never regenerates artwork.
Run with Python + Pillow + NumPy. Coordinates refer to the original 1448×1086 sheet.
"""
from pathlib import Path
from collections import deque
import json
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / 'public/assets/haine/extracted'
sheet = Image.open(ROOT / 'public/assets/haine/haine_sheet.png').convert('RGB')
# Tight regions exclude the section labels and borders. Sloping boundaries separate
# adjacent sleeves without borrowing pixels from the neighbouring garment.
regions = {
 'fata_top': [(12,62,168,197),(158,64,273,198),(262,68,386,197),(373,57,508,202),(492,68,622,198),(601,68,731,198)],
 'baiat_top': [(747,64,881,198),(865,64,989,198),(975,56,1114,203),(1096,59,1223,200),(1209,65,1338,198),(1317,63,1436,198)],
 'fata_bottom': [(53,270,176,466),(202,270,322,467),(330,300,541,444),(527,259,709,466)],
 'baiat_bottom': [(767,270,912,466),(927,272,1080,470),(1096,272,1252,471),(1258,286,1427,443)],
 'fata_shoes': [(14,539,135,652),(117,547,240,660),(232,539,358,660),(346,534,480,669),(474,540,598,657),(591,539,723,662)],
 'baiat_shoes': [(747,540,864,655),(850,545,973,661),(967,535,1090,662),(1081,533,1206,670),(1198,540,1320,661),(1314,539,1436,665)],
 'fata_outer': [(16,730,167,882),(152,728,306,885),(286,730,433,893),(424,733,529,875),(528,742,637,878),(635,748,727,875),(26,883,201,1040),(195,885,361,1041),(380,902,567,1025),(564,895,711,1021)],
 'baiat_outer': [(744,725,886,880),(869,731,1022,886),(1008,731,1155,894),(1147,734,1257,879),(1256,744,1349,889),(1344,751,1433,863),(761,882,936,1039),(923,890,1094,1041),(1089,899,1252,1029),(1257,907,1433,1027)],
}
# Masks trace only shared edges; the remaining silhouette is obtained from the
# connected pale background, preserving cream fabric and interior white details.
polygons = {
 'fata_top_01': [(0,0),(148,0),(144,61),(156,113),(145,135),(0,135)],
 'fata_top_02': [(15,0),(99,0),(109,73),(115,134),(0,134),(10,83),(0,59)],
 'fata_top_03': [(11,0),(112,0),(112,64),(124,122),(0,129),(0,96),(8,62)],
 'fata_top_04': [(12,0),(121,0),(126,62),(135,126),(124,145),(0,145),(0,109),(8,76)],
 'fata_top_05': [(15,0),(113,0),(130,60),(111,86),(113,130),(0,130),(9,82),(0,52)],
 'fata_top_06': [(13,0),(130,0),(130,130),(0,130),(7,78),(0,58)],
}
# Source-space outlines cut away neighbours where the printed items touch.
outlines = {
 'fata_top_02': [(181,65),(243,65),(257,95),(267,179),(253,192),(178,193),(160,177),(164,121)],
 'fata_top_03': [(289,72),(354,71),(370,94),(385,179),(369,187),(365,195),(276,195),(262,179),(270,115)],
 'fata_top_04': [(402,59),(474,58),(485,95),(507,178),(485,187),(481,198),(396,198),(394,184),(373,175),(389,108)],
 'fata_top_05': [(523,71),(576,71),(599,83),(615,113),(596,135),(589,191),(508,193),(503,133),(492,113),(508,88)],
 'fata_top_06': [(630,70),(697,70),(719,78),(719,103),(732,174),(716,185),(612,192),(600,177),(611,117),(609,82)],
 'baiat_top_01': [(782,67),(843,65),(860,83),(880,176),(860,184),(857,194),(767,194),(747,177),(759,111)],
 'baiat_top_02': [(895,68),(956,68),(974,85),(987,174),(973,186),(970,194),(881,193),(863,175),(878,108)],
 'baiat_top_03': [(1006,59),(1076,59),(1091,96),(1113,178),(1093,186),(1087,198),(997,198),(993,185),(975,175),(991,101)],
 'baiat_top_04': [(1130,62),(1187,62),(1201,84),(1220,174),(1201,186),(1196,198),(1123,198),(1117,186),(1098,174),(1111,102)],
 'baiat_top_05': [(1246,69),(1291,69),(1313,82),(1331,112),(1312,136),(1307,194),(1230,194),(1225,133),(1210,114),(1226,84)],
 'baiat_top_06': [(1353,68),(1401,67),(1420,90),(1437,174),(1418,183),(1415,193),(1335,193),(1331,178),(1317,175),(1326,105)],
 'fata_shoes_01': [(58,541),(114,539),(134,582),(115,623),(88,650),(39,649),(14,627),(14,594)],
 'fata_shoes_02': [(154,549),(218,549),(237,592),(216,647),(182,658),(139,650),(118,633),(127,594)],
 'fata_shoes_03': [(276,542),(339,541),(356,589),(335,637),(308,660),(261,654),(233,634),(244,591)],
 'fata_shoes_04': [(378,536),(456,539),(476,564),(470,633),(447,663),(401,669),(363,653),(348,634),(359,595)],
 'fata_shoes_05': [(510,544),(574,542),(596,580),(578,628),(550,655),(505,651),(475,634),(480,594)],
 'fata_shoes_06': [(631,541),(694,541),(722,580),(702,631),(672,662),(626,657),(592,641),(604,593)],
 'baiat_shoes_01': [(788,542),(843,543),(862,584),(847,626),(823,654),(780,653),(748,636),(749,604)],
 'baiat_shoes_02': [(895,547),(954,547),(973,586),(953,639),(928,661),(881,652),(852,634),(864,594)],
 'baiat_shoes_03': [(1000,537),(1068,540),(1088,577),(1082,628),(1056,662),(1009,658),(970,639),(967,613),(985,578)],
 'baiat_shoes_04': [(1110,535),(1180,539),(1203,562),(1197,631),(1175,666),(1137,670),(1094,650),(1081,632),(1094,597)],
 'baiat_shoes_05': [(1238,542),(1298,541),(1319,580),(1300,630),(1272,659),(1229,656),(1198,634),(1210,594)],
 'baiat_shoes_06': [(1350,541),(1410,541),(1435,581),(1418,637),(1390,665),(1346,656),(1315,638),(1325,594)],
 'fata_outer_01': [(49,731),(113,731),(132,762),(163,851),(143,862),(138,878),(39,878),(16,858),(23,817)],
 'fata_outer_02': [(184,730),(249,730),(268,757),(305,848),(281,862),(269,881),(165,881),(152,851),(166,786)],
 'fata_outer_03': [(341,732),(377,732),(393,761),(433,857),(415,875),(377,893),(330,890),(286,863),(304,822),(327,770)],
 'fata_outer_04': [(460,735),(496,735),(508,766),(509,787),(526,834),(526,869),(427,872),(424,838),(440,791),(444,768)],
 'baiat_outer_01': [(776,727),(845,727),(860,760),(882,851),(867,864),(858,880),(768,880),(744,860),(750,803)],
 'baiat_outer_02': [(909,732),(970,731),(992,754),(1020,852),(1001,865),(991,886),(890,886),(870,858),(884,793)],
 'baiat_outer_03': [(1065,732),(1095,732),(1114,763),(1154,861),(1138,876),(1099,894),(1053,889),(1009,865),(1031,812),(1050,771)],
 'baiat_outer_04': [(1180,735),(1219,735),(1234,765),(1231,789),(1256,835),(1254,876),(1150,876),(1147,842),(1166,790),(1163,771)],
}
for name,points in outlines.items():
    group,index=name.rsplit('_',1)
    x,y,_,_=regions[group][int(index)-1]
    polygons[name]=[(px-x,py-y) for px,py in points]

def cut(box, polygon=None):
    im = sheet.crop(box).convert('RGBA')
    rgb = np.array(im)[:,:,:3].astype(int)
    pale = (rgb.min(2) > 237) & ((rgb.max(2)-rgb.min(2)) < 20)
    h,w = pale.shape
    visited = np.zeros((h,w), dtype=bool)
    q=deque()
    for x in range(w): q.extend([(0,x),(h-1,x)])
    for y in range(h): q.extend([(y,0),(y,w-1)])
    while q:
        y,x=q.popleft()
        if visited[y,x] or not pale[y,x]: continue
        visited[y,x]=True
        for dy,dx in ((-1,0),(1,0),(0,-1),(0,1)):
            ny,nx=y+dy,x+dx
            if 0<=ny<h and 0<=nx<w and not visited[ny,nx]: q.append((ny,nx))
    alpha=np.where(visited,0,255).astype('uint8')
    # Remove tiny isolated background flecks, not garment features.
    seen=np.zeros((h,w),bool)
    components=[]
    for yy,xx in zip(*np.where(alpha>0)):
        if seen[yy,xx]: continue
        stack=[(yy,xx)]; seen[yy,xx]=True; component=[]
        while stack:
            y,x=stack.pop(); component.append((y,x))
            for dy,dx in ((-1,0),(1,0),(0,-1),(0,1)):
                ny,nx=y+dy,x+dx
                if 0<=ny<h and 0<=nx<w and alpha[ny,nx] and not seen[ny,nx]:
                    seen[ny,nx]=True; stack.append((ny,nx))
        components.append(component)
    largest=max(map(len,components),default=0)
    for component in components:
        if len(component)<max(22,largest*.14):
            for y,x in component: alpha[y,x]=0
    if polygon:
        mask=Image.new('L',(w,h)); ImageDraw.Draw(mask).polygon(polygon,fill=255)
        alpha=np.minimum(alpha,np.array(mask))
        # Re-evaluate connectivity after the separating outline is applied.
        seen=np.zeros((h,w),bool); groups=[]
        for yy,xx in zip(*np.where(alpha>0)):
            if seen[yy,xx]: continue
            stack=[(yy,xx)]; seen[yy,xx]=True; group=[]
            while stack:
                y,x=stack.pop(); group.append((y,x))
                for dy,dx in ((-1,0),(1,0),(0,-1),(0,1)):
                    ny,nx=y+dy,x+dx
                    if 0<=ny<h and 0<=nx<w and alpha[ny,nx] and not seen[ny,nx]:
                        seen[ny,nx]=True; stack.append((ny,nx))
            groups.append(group)
        biggest=max(map(len,groups),default=0)
        for group in groups:
            if len(group)<biggest*.20:
                for y,x in group: alpha[y,x]=0
    im.putalpha(Image.fromarray(alpha))
    bounds=im.getbbox()
    return im.crop(bounds) if bounds else im

manifest=[]
for group,boxes in regions.items():
    for i,box in enumerate(boxes,1):
        name=f'{group}_{i:02}'
        im=cut(box,polygons.get(name))
        # Colour-qualified cleanup only at shared outer edges. These colours
        # belong to the adjacent item, not to the garment being extracted.
        arr=np.array(im); r,g,b=arr[:,:,0].astype(int),arr[:,:,1].astype(int),arr[:,:,2].astype(int)
        edge=np.broadcast_to((np.arange(im.width)<im.width*.16)|(np.arange(im.width)>im.width*.84),(im.height,im.width))
        unwanted=None
        if name=='fata_top_02': unwanted=(b>r)&(b>g+10)
        if name=='fata_top_03': unwanted=(r>b+12)&(r>g+25)
        if name=='baiat_top_01': unwanted=(g>r+3)&(g>b+3)
        if name=='baiat_top_02': unwanted=(b>g+8)
        if name=='baiat_top_03': unwanted=(r>b+20)
        if name=='baiat_top_05': unwanted=(g>r)&(g>b)
        if name=='fata_outer_02': unwanted=((r>210)&(g>160)&(b<150))|((r>b+15)&(r>g+25))
        if name=='baiat_outer_02': unwanted=(r>180)&(g>130)&(b<130)
        if unwanted is not None:
            arr[:,:,3][edge&unwanted]=0; im=Image.fromarray(arr)
        # Close pinholes left by edge colour cleanup and remove one-pixel spurs.
        # The original source/mannequin files are never modified.
        matte=im.getchannel('A').filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.MinFilter(3))
        matte=matte.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.MaxFilter(3))
        im.putalpha(matte.filter(ImageFilter.GaussianBlur(.35)))
        im.save(DEST/f'{name}.png')
        if '_shoes_' in name or name.endswith('outer_06'):
            # Isolate the complete foreground shoe / mitten rather than slicing
            # a pair vertically. Mirror this one piece for the opposite limb.
            if '_shoes_' in name:
                # Boots need a higher shaft than low shoes; using one mask for
                # both used to clip their lining and ankle opening.
                points = ([(.55,.12),(.87,.10),(1,.19),(1,.65),(.86,.91),(.67,1),(.40,.97),(.23,.86),(.23,.73),(.43,.52),(.48,.25)]
                    if name.endswith('shoes_04') or name=='baiat_shoes_03'
                    else [(.65,.10),(.89,.12),(1,.28),(1,.63),(.85,.86),(.69,1),(.43,1),(.25,.92),(.22,.80),(.34,.60),(.45,.42),(.51,.22)])
            else:
                points=[(.64,.22),(.83,.24),(1,.43),(.99,.70),(.84,1),(.45,.88),(.37,.73),(.35,.57),(.45,.39)]
            mask=Image.new('L',im.size)
            ImageDraw.Draw(mask).polygon([(int(x*im.width),int(y*im.height)) for x,y in points],fill=255)
            wear=im.copy(); wear.putalpha(Image.fromarray(np.minimum(np.array(im.getchannel('A')),np.array(mask))))
            wear=wear.crop(wear.getbbox())
            wear.putalpha(wear.getchannel('A').filter(ImageFilter.GaussianBlur(.4)))
            wear.save(DEST/f'{name}_wear.png')
        manifest.append({'id':name,'sourceBox':box,'width':im.width,'height':im.height})
(DEST/'manifest.json').write_text(json.dumps(manifest,indent=2),encoding='utf-8')
contact=Image.new('RGB',(1040,((len(manifest)+7)//8)*165),'#dce9df')
d=ImageDraw.Draw(contact)
for i,item in enumerate(manifest):
    im=Image.open(DEST/f"{item['id']}.png"); im.thumbnail((118,132))
    x=(i%8)*130; y=(i//8)*165
    contact.paste(im,(x+(130-im.width)//2,y),im)
    d.text((x+3,y+138),item['id'],fill='#243d36')
contact.save(ROOT/'qa/clothing-contact.png')
print(f'Extracted {len(manifest)} transparent garments.')
