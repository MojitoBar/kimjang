from PIL import Image, ImageFilter
import numpy as np
im=Image.open('sheet1.png').convert('RGB'); a=np.array(im).astype(int)
names=['happy','angry','faint','suspicious','proud','blank']
for i,n in enumerate(names):
    r,cx=divmod(i,3)
    c=a[r*512:(r+1)*512,cx*512:(cx+1)*512].copy()
    R,G,B=c[...,0],c[...,1],c[...,2]
    # magenta-ness: both R and B well above G
    mag=(np.minimum(R,B)-G)
    bg=(mag>90)&(abs(R-B)<100)
    fg=(~bg).astype(np.uint8)*255
    fgi=Image.fromarray(fg).filter(ImageFilter.MinFilter(3))  # erode 1px
    al=np.array(fgi)
    # despill remaining purple-ish edge pixels to dark outline
    purple=(mag>40)&(al>0)&~((R>200)&(B<90))
    c[purple]=[25,15,25]
    img=Image.fromarray(np.dstack([c,al]).astype(np.uint8),'RGBA')
    print(n,img.getchannel('A').getbbox())
    img.save(f'../../public/assets/grandma/{n}.png')
