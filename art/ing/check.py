from PIL import Image
import numpy as np, glob, os
ids=['gochugaru','garlic','ginger','saeujeot','myeolchi','radish','scallion','pear','ricepaste','oyster','mustleaf','sugar','mintchoco','soda','cheese','mala','jelly','banana','chocolate','ramen','pineapple','mayo','money','battery','sock','toothpaste']
bad=0
sheet=Image.new('RGBA',(6*260,5*260),(225,225,225,255))
for k,n in enumerate(ids):
    im=Image.open(f'../../public/assets/ing/{n}.png'); a=np.array(im).astype(int)
    m=a[...,3]>0; R,G,B=a[...,0],a[...,1],a[...,2]
    mag=((np.minimum(R,B)-G)>40)&m
    print(n,im.size,im.getchannel('A').getbbox(),int(mag.sum()))
    sheet.alpha_composite(im,((k%6)*260+2,(k//6)*260+2))
sheet.convert('RGB').save('contact.png')
