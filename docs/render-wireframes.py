"""Render this project's simple original SVG primitives with Pillow for the report.

This deliberately handles only the primitives written by generate-wireframes.py;
it is not a general SVG renderer. No external assets or network calls are used.
"""
from pathlib import Path
from xml.etree import ElementTree as ET
from PIL import Image, ImageDraw, ImageFont
ROOT=Path(__file__).resolve().parent.parent
OUT=ROOT/'evidence'
FONT='/System/Library/Fonts/Helvetica.ttc'
SERIF='/System/Library/Fonts/Supplemental/Georgia.ttf'

def font(size,serif=False):
    try:return ImageFont.truetype(SERIF if serif else FONT,int(size))
    except OSError:return ImageFont.load_default(size=int(size))

def render(path):
    root=ET.parse(path).getroot()
    im=Image.new('RGB',(int(root.get('width')),int(root.get('height'))),'#f4f1e9')
    d=ImageDraw.Draw(im)
    for el in root:
        kind=el.tag.split('}')[-1]; a=el.attrib
        n=lambda key:float(a.get(key,0))
        fill=a.get('fill'); fill=None if fill=='none' else fill
        stroke=a.get('stroke'); sw=int(float(a.get('stroke-width','1')))
        if kind=='rect':d.rectangle((n('x'),n('y'),n('x')+n('width'),n('y')+n('height')),fill=fill,outline=stroke,width=sw)
        elif kind=='line':d.line((n('x1'),n('y1'),n('x2'),n('y2')),fill=stroke,width=sw)
        elif kind in ['circle','ellipse']:
            rx=n('r') if kind=='circle' else n('rx');ry=n('r') if kind=='circle' else n('ry')
            d.ellipse((n('cx')-rx,n('cy')-ry,n('cx')+rx,n('cy')+ry),fill=fill,outline=stroke,width=sw)
        elif kind=='text':d.text((n('x'),n('y')),el.text or '',font=font(n('font-size'),'Georgia' in a.get('font-family','')),fill=fill,anchor='ls')
    dest=path.with_suffix('.png');im.save(dest);return im

if __name__=='__main__':
    sheet=Image.new('RGB',(1800,1640),'#f4f1e9');d=ImageDraw.Draw(sheet)
    d.text((30,25),'PERU ONLINE / INITIAL RESPONSIVE WIREFRAMES',font=font(34,True),fill='#21241f')
    d.text((30,73),'Version 0 · Proposed layouts · Desktop 1200 px / mobile 390 px · Human review pending',font=font(19),fill='#ad281b')
    for i,(slug,title) in enumerate([('overview','01 Overview'),('timeline','02 Timeline'),('connections','03 Everyday connections'),('about','04 Sources & project')]):
        x=30+(i%2)*890;y=125+(i//2)*740
        d.text((x,y),title,font=font(25,True),fill='#21241f')
        for device,dx,tw in [('desktop',0,640),('mobile',660,185)]:
            im=render(OUT/f'wireframes-{slug}-{device}.svg');th=round(im.height*tw/im.width)
            im=im.resize((tw,th),Image.Resampling.LANCZOS);sheet.paste(im,(x+dx,y+44))
            d.rectangle((x+dx,y+44,x+dx+tw,y+44+th),outline='#c5c1b7',width=1)
            d.text((x+dx,y+52+th),device.capitalize(),font=font(15),fill='#21241f')
    sheet.save(OUT/'wireframes-contact-sheet.png')
    print(OUT/'wireframes-contact-sheet.png')
