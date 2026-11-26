import sys
from PIL import Image, ImageFilter
import numpy as np
ids={'A':['gochugaru','garlic','ginger','saeujeot','myeolchi','radish','scallion','pear','ricepaste'],
'B':['oyster','mustleaf','sugar','mintchoco','soda','cheese','mala','jelly','banana'],
'D':['ricepaste','mayo'],
'C':['chocolate','ramen','pineapple','mayo','money','battery','sock','toothpaste']}
def key(im):
    c=np.array(im.convert('RGB')).astype(int)
    R,G,B=c[...,0],c[...,1],c[...,2]
    mag=np.minimum(R,B)-G
    bg=(mag>90)&(abs(R-B)<100)
    al=np.array(Image.fromarray((~bg).astype(np.uint8)*255).filter(ImageFilter.MinFilter(3)))
    purple=(mag>40)&(al>0)&~((R>200)&(B<90))
    c[purple]=[25,15,25]
    return np.dstack([c,al]).astype(np.uint8)
def run(sheet,only=None):
    im=Image.open(f'sheet_{sheet}.png'); W,H=im.size; w,h=W//3,H//3
    for i,n in enumerate(ids[sheet]):
        if only and n not in only: continue
        r,cx=divmod(i,3)
        cell=Image.fromarray(key(im.crop((cx*w,r*h,(cx+1)*w,(r+1)*h))),'RGBA')
        cell=cell.crop(cell.getchannel('A').point(lambda v:255 if v>128 else 0).getbbox())
        s=205/max(cell.size)
        cell=cell.resize((max(1,round(cell.width*s)),max(1,round(cell.height*s))),Image.LANCZOS)
        out=Image.new('RGBA',(256,256),(0,0,0,0))
        out.paste(cell,((256-cell.width)//2,(256-cell.height)//2))
        out.save(f'../../public/assets/ing/{n}.png')
if __name__=='__main__':
    run(sys.argv[1],sys.argv[2:] or None)
