import numpy as np
from PIL import Image, ImageFilter, ImageDraw
OUT='../../../public/assets/ing/'
sheets={'c3.png':['gochugaru','garlic','ginger','saeujeot','myeolchi','radish','scallion','pear','ricepaste'],
 'c1.png':['oyster','mustleaf','sugar','mintchoco','soda','cheese','mala','jelly','banana'],
 'c2.png':['chocolate','ramen','pineapple','mayo','money','battery','sock','toothpaste']}
def key(c):
    d=np.sqrt((c[...,0]-255)**2+c[...,1]**2+(c[...,2]-255)**2)
    m=Image.fromarray(((d<120)*255).astype(np.uint8)); h,w=d.shape
    for p in [(0,0),(w-1,0),(0,h-1),(w-1,h-1)]+[(x,0) for x in range(0,w,8)]+[(x,h-1) for x in range(0,w,8)]+[(0,y) for y in range(0,h,8)]+[(w-1,y) for y in range(0,h,8)]:
        if m.getpixel(p)==255: ImageDraw.floodfill(m,p,128)
    bg=(np.array(m)==128)|(d<60)
    return d,~bg
for f,names in sheets.items():
    a=np.array(Image.open(f).convert('RGB')).astype(int); H,W=a.shape[:2]
    for i,n in enumerate(names):
        r,cx=divmod(i,3)
        c=a[r*H//3:(r+1)*H//3, cx*W//3:(cx+1)*W//3].copy()
        d,fg=key(c)
        fgi=Image.fromarray(fg.astype(np.uint8)*255).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.MaxFilter(3))
        f2=np.array(fgi)>0
        edge=f2&~(np.array(fgi.filter(ImageFilter.MinFilter(5)))>0)
        mag=np.minimum(c[...,0],c[...,2])-c[...,1]
        c[edge&(mag>60)&(d<200)]=[40,25,25]
        al=np.array(fgi.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.6)))
        img=Image.fromarray(np.dstack([c,al]).astype(np.uint8),'RGBA')
        bb=img.getchannel('A').point(lambda v:255 if v>40 else 0).getbbox()
        ch,cw=c.shape[:2]
        flag='EDGE' if bb[0]<=2 or bb[1]<=2 or bb[2]>=cw-2 or bb[3]>=ch-2 else ''
        img=img.crop(bb); s=205/max(img.size)
        img=img.resize((max(1,round(img.width*s)),max(1,round(img.height*s))),Image.LANCZOS)
        o=Image.new('RGBA',(256,256),(0,0,0,0)); o.paste(img,((256-img.width)//2,(256-img.height)//2))
        o.save(OUT+n+'.png')
        p=np.array(o).astype(int); vis=p[...,3]>20
        rem=((np.minimum(p[...,0],p[...,2])-p[...,1])>100)&(p[...,0]>200)&(p[...,2]>200)&vis
        print(n,img.size,'residual',int(rem.sum()),flag)
