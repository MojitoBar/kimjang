from PIL import Image, ImageFilter
import numpy as np, os
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
def key(im):
    c=np.array(im.convert('RGB')).astype(int); R,G,B=c[...,0],c[...,1],c[...,2]
    mag=np.minimum(R,B)-G
    bg=(mag>90)&(abs(R-B)<100)
    al=np.array(Image.fromarray((~bg).astype(np.uint8)*255).filter(ImageFilter.MinFilter(3)))
    # drop specks: keep as is, then despill
    inner=np.array(Image.fromarray(al).filter(ImageFilter.MinFilter(7)))>0
    edge=(al>0)&~inner
    c[edge&(mag>40)&~((R>200)&(B<90))]=[25,15,25]
    c[edge&(mag>25)&(R>200)&(B>150)]=[25,15,25]
    return Image.fromarray(np.dstack([c,al]).astype(np.uint8),'RGBA')
def fit(img,size,margin,bbox=None):
    bb=bbox or img.getchannel('A').getbbox()
    cr=img.crop(bb); w,h=cr.size
    s=min((size[0]-2*margin)/w,(size[1]-2*margin)/h)
    cr=cr.resize((max(1,round(w*s)),max(1,round(h*s))),Image.LANCZOS)
    out=Image.new('RGBA',size,(0,0,0,0))
    out.paste(cr,((size[0]-cr.width)//2,(size[1]-cr.height)//2),cr)
    return out
def cells(im,cols,rows):
    W,H=im.size; cw,ch=W/cols,H/rows
    for i in range(cols*rows):
        r,c=divmod(i,cols)
        yield i,im.crop((round(c*cw),round(r*ch),round((c+1)*cw),round((r+1)*ch)))
ids=['banjang','jokka','taekbae','sawi','daughter','cat','grandpa']
sh=Image.open('art/customer/sheet_raw.png')
for i,cell in cells(sh,4,2):
    if i>=7: break
    fit(key(cell),(256,256),3).save(f'public/assets/customer/{ids[i]}.png')
# cabbage
cb=Image.open('art/prop/candB.png'); ks=[key(c) for _,c in cells(cb,3,1)]
x0=min(k.getchannel('A').getbbox()[0] for k in ks);y0=min(k.getchannel('A').getbbox()[1] for k in ks)
x1=max(k.getchannel('A').getbbox()[2] for k in ks);y1=max(k.getchannel('A').getbbox()[3] for k in ks)
for n,k in zip(['cabbage-raw','cabbage-salted','cabbage-red'],ks):
    out=fit(k,(420,320),4,(x0,y0,x1,y1)); out.save(f'public/assets/prop/{n}.png')
s2=Image.open('art/prop/sheet2_raw.png'); ks2=[key(c) for _,c in cells(s2,3,2)]
for k,n,sz in zip(ks2,['basin','salt-scoop','onggi','kimchi-plate','stamp-burst'],[(520,300),(256,256),(300,360),(320,240),(320,320)]):
    fit(k,sz,4).save(f'public/assets/prop/{n}.png')
