import numpy as np, random
from PIL import Image, ImageFilter, ImageDraw
import os
ROOT=os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..')
V=os.path.join(ROOT,'art','v2')+'/'
P=os.path.join(ROOT,'public','assets')+'/'
def key(path):
    c=np.array(Image.open(path).convert('RGB')).astype(int)
    d=np.sqrt((c[...,0]-255)**2+c[...,1]**2+(c[...,2]-255)**2)
    m=Image.fromarray(((d<110)*255).astype(np.uint8)); h,w=d.shape
    seeds=[(x,0) for x in range(0,w,8)]+[(x,h-1) for x in range(0,w,8)]+[(0,y) for y in range(0,h,8)]+[(w-1,y) for y in range(0,h,8)]
    for s in seeds:
        if m.getpixel(s)==255: ImageDraw.floodfill(m,s,128)
    bg=(np.array(m)==128)|(d<60)
    fgi=Image.fromarray((~bg).astype(np.uint8)*255).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.MaxFilter(3))
    f=np.array(fgi)>0; er=np.array(fgi.filter(ImageFilter.MinFilter(5)))>0
    edge=f&~er; mag=np.minimum(c[...,0],c[...,2])-c[...,1]
    c[edge&(mag>60)&(d<200)]=[40,25,25]
    al=np.array(fgi.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.6)))
    return Image.fromarray(np.dstack([c,al]).astype(np.uint8),'RGBA')
def place(img,box,size,margin,anchor='center',fit=None):
    im=img.crop(box); bb=im.getchannel('A').point(lambda a:255 if a>20 else 0).getbbox(); im=im.crop(bb)
    W,H=size; s=min((W-2*margin)/im.width,(H-2*margin)/im.height)
    if fit: s=fit(im,s)
    im=im.resize((max(1,round(im.width*s)),max(1,round(im.height*s))),Image.LANCZOS)
    out=Image.new('RGBA',size,(0,0,0,0))
    x=(W-im.width)//2; y=(H-im.height)//2 if anchor=='center' else H-margin-im.height
    out.paste(im,(x,y)); return out
if __name__=='__main__':
    s=key(V+'customer/sheet1.png'); cw=s.width/4; ch=s.height/2
    ids=['banjang','jokka','taekbae','sawi','daughter','cat','grandpa']
    for i,n in enumerate(ids):
        r,c=divmod(i,4)
        place(s,(round(c*cw),round(r*ch),round((c+1)*cw),round((r+1)*ch)),(512,512),4,'bottom').save(P+'customer/'+n+'.png')
    a=key(V+'prop/sheet_cabbage.png'); b=key(V+'prop/sheet_props2.png'); pr=key(V+'prop/sheet_props.png'); sc=key(V+'prop/sheet_scoop.png')
    sz=(420,320)
    place(a,(0,0,a.width//2,a.height),sz,8,'bottom').save(P+'prop/cabbage-raw.png')
    sal=place(b,(0,0,b.width//3,b.height),sz,8,'bottom'); sal.save(P+'prop/cabbage-salted.png')
    # red
    arr=np.array(sal).astype(int); rgb=arr[...,:3]; al=arr[...,3]
    lum=rgb.mean(2); sat=rgb.max(2)-rgb.min(2)
    out=rgb.copy()
    dark=lum<95
    cream=(~dark)&(lum>165)
    olive=(~dark)&(~cream)
    out[olive]=[205,45,25]; out[cream]=[240,125,70]
    rng=random.Random(3); ys,xs=np.where((al>250)&~dark)
    for k in rng.sample(range(len(ys)),90):
        y,x=ys[k],xs[k]; out[max(0,y-1):y+2,max(0,x-1):x+2]=[140,15,10]
    red=Image.fromarray(np.dstack([out,al]).astype(np.uint8),'RGBA'); red.save(P+'prop/cabbage-red.png')
    place(pr,(0,0,pr.width//3,pr.height//2),(520,300),6).save(P+'prop/basin.png')
    place(sc,(0,0,sc.width//2,sc.height),(256,256),6).save(P+'prop/salt-scoop.png')
    place(pr,(2*pr.width//3,0,pr.width,pr.height//2),(300,360),6).save(P+'prop/onggi.png')
    place(pr,(0,pr.height//2,pr.width//3,pr.height),(320,240),6).save(P+'prop/kimchi-plate.png')
    place(b,(2*b.width//3,0,b.width,b.height),(320,320),6).save(P+'prop/stamp-burst.png')
    # contacts
    def contact(files,out,cols,bg=(225,225,225)):
        ims=[Image.open(f) for f in files]; w=max(i.width for i in ims)+20; h=max(i.height for i in ims)+20
        rows=(len(ims)+cols-1)//cols; sh=Image.new('RGBA',(cols*w,rows*h),bg+(255,))
        for k,i in enumerate(ims): sh.alpha_composite(i,((k%cols)*w+10,(k//cols)*h+10))
        sh.save(out)
    contact([P+'customer/%s.png'%n for n in ids],V+'customer/contact.png',4)
    pf=['cabbage-raw','cabbage-salted','cabbage-red','basin','salt-scoop','onggi','kimchi-plate','stamp-burst']
    contact([P+'prop/%s.png'%n for n in pf],V+'prop/contact.png',3)
    base=Image.new('RGBA',sz,(225,225,225,255)); base.alpha_composite(sal)
    m=Image.new('L',sz,0); ImageDraw.Draw(m).rectangle((0,0,210,320),fill=255)
    r2=red.copy(); r2.putalpha(Image.fromarray(np.minimum(np.array(red.getchannel('A')),np.array(m))))
    base.alpha_composite(r2); base.resize((840,640)).save(V+'prop/overlay-check.png')
    for n in ids:
        p=np.array(Image.open(P+'customer/%s.png'%n)).astype(int); vis=p[...,3]>20
        print(n,p.shape[:2],'magenta residual',int((((np.minimum(p[...,0],p[...,2])-p[...,1])>100)&(p[...,0]>200)&(p[...,2]>200)&vis).sum()))
    for n in pf:
        p=np.array(Image.open(P+'prop/%s.png'%n)).astype(int); vis=p[...,3]>20
        print(n,p.shape[1::-1],'magenta residual',int((((np.minimum(p[...,0],p[...,2])-p[...,1])>100)&(p[...,0]>200)&(p[...,2]>200)&vis).sum()))
