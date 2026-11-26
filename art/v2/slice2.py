import sys
from PIL import Image, ImageFilter, ImageDraw
import numpy as np
src=sys.argv[1]; out='../../public/assets/grandma/'
a=np.array(Image.open(src).convert('RGB')).astype(int)
names=['happy','angry','faint','suspicious','proud','blank']
def keyed(c):
    d=np.sqrt((c[...,0]-255)**2+c[...,1]**2+(c[...,2]-255)**2)
    m=Image.fromarray(((d<110)*255).astype(np.uint8))
    h,w=d.shape
    for x,y in [(0,0),(w-1,0),(0,h-1),(w-1,h-1)]+[(x,0) for x in range(0,w,16)]+[(x,h-1) for x in range(0,w,16)]+[(0,y) for y in range(0,h,16)]+[(w-1,y) for y in range(0,h,16)]:
        if m.getpixel((x,y))==255: ImageDraw.floodfill(m,(x,y),128)
    bg=(np.array(m)==128)|(d<60)
    return d,~bg
for i,n in enumerate(names):
    r,cx=divmod(i,3)
    c=a[r*512:(r+1)*512,cx*512:(cx+1)*512].copy()
    d,fg=keyed(c)
    fgi=Image.fromarray(fg.astype(np.uint8)*255)
    fgi=fgi.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.MaxFilter(3))
    f=np.array(fgi)>0
    er=np.array(fgi.filter(ImageFilter.MinFilter(5)))>0
    edge=f&~er
    mag=np.minimum(c[...,0],c[...,2])-c[...,1]
    c[edge&(mag>60)&(d<200)]=[40,25,25]
    al=np.array(fgi.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.6)))
    img=Image.fromarray(np.dstack([c,al]).astype(np.uint8),'RGBA')
    img.save(out+n+'.png')
    p=np.array(img).astype(int); vis=p[...,3]>20
    rem=((np.minimum(p[...,0],p[...,2])-p[...,1])>100)&(p[...,0]>200)&(p[...,2]>200)&vis
    print(n,img.size,img.getchannel('A').getbbox(),'residual magenta',int(rem.sum()))
