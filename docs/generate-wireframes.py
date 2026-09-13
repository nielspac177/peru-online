"""Generate original schematic SVGs; labels indicate placement, not final copy."""
from pathlib import Path
from html import escape

ROOT = Path(__file__).resolve().parent.parent
BG, INK, RED, RULE, PALE = '#f4f1e9', '#21241f', '#ad281b', '#c5c1b7', '#e7e3d9'

def make(page, mobile):
    w, h = (390, 1280) if mobile else (1200, 1010)
    m = 24 if mobile else 60
    a = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}" role="img" aria-labelledby="title desc">', f'<title id="title">{escape(page)} — {"mobile" if mobile else "desktop"} proposed wireframe</title>', '<desc id="desc">Original initial layout proposal. Boxes and short labels indicate hierarchy; this is not a screenshot of the completed website.</desc>', f'<rect width="{w}" height="{h}" fill="{BG}"/>']
    def text(x,y,s,size=16,color=INK,serif=False):
        a.append(f'<text x="{x}" y="{y}" font-size="{size}" fill="{color}" font-family="{ "Georgia,serif" if serif else "Helvetica,sans-serif" }">{escape(s)}</text>')
    def line(y):
        a.append(f'<line x1="{m}" y1="{y}" x2="{w-m}" y2="{y}" stroke="{RULE}"/>')
    def box(x,y,bw,bh,label):
        a.append(f'<rect x="{x}" y="{y}" width="{bw}" height="{bh}" fill="{PALE}" stroke="{RULE}"/>')
        text(x+18,y+30,label,13)
    def bars(x,y,bw,n=3):
        for i in range(n):
            a.append(f'<rect x="{x}" y="{y+15*i}" width="{bw if i < n-1 else bw*.72}" height="3" fill="{RULE}"/>')
    def globe(cx,cy,r):
        a.append(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{PALE}" stroke="{RED}" stroke-width="2"/>')
        for f in (.30,.65):
            a.append(f'<ellipse cx="{cx}" cy="{cy}" rx="{r*f}" ry="{r}" fill="none" stroke="{RED}"/>')
            a.append(f'<ellipse cx="{cx}" cy="{cy}" rx="{r}" ry="{r*f}" fill="none" stroke="{RED}"/>')
        a.append(f'<circle cx="{cx-r*.35}" cy="{cy+r*.25}" r="7" fill="{RED}"/>')
    text(m,35,'PERU ONLINE',21,serif=True)
    if mobile:
        text(m,69,'Overview   Timeline',13)
        text(m,94,'Connections   Sources & project',13)
        line(114)
    else:
        text(550,35,'Overview       Timeline       Connections       Sources & project',15)
        line(58)
    top = 153 if mobile else 110
    text(m,top,'INITIAL PROPOSAL  /  1997–2025',11,RED)
    if page == 'Overview':
        text(m,top+56,'A country',43 if mobile else 72,serif=True)
        text(m,top+108,'coming online.',43 if mobile else 72,serif=True)
        if mobile:
            bars(m,top+145,w-2*m,3);box(m,top+205,210,48,'Explore the timeline →')
            globe(195,top+415,127);text(m,top+569,'From shared screens to',25,serif=True);text(m,top+600,'everyday connection.',25,serif=True)
            for i,label in enumerate(['01  The chronology','02  Everyday connections','03  The sources']):
                y=top+636+i*110;line(y);text(m,y+33,label,20,serif=True);bars(m,y+58,w-2*m,2)
        else:
            bars(m,top+160,455,4);box(m,top+252,225,50,'Explore the timeline →');globe(875,top+205,192)
            line(570);text(m,620,'From shared screens to everyday connection.',36,serif=True)
            for i,label in enumerate(['01  The chronology','02  Everyday connections','03  The sources']):
                x=m+365*i;text(x,690,label,23,serif=True);bars(x,723,310,4);text(x,810,'Explore this chapter →',14,RED)
    elif page == 'Timeline':
        text(m,top+57,'A timeline of',40 if mobile else 68,serif=True)
        text(m,top+104,'connection.',40 if mobile else 68,serif=True)
        bars(m,top+138, w-2*m if mobile else 660,3)
        y=top+205
        if mobile:
            box(m,y,100,43,'All years');box(m+112,y,205,43,'Early / Broadband / Mobile')
            text(m,y+77,'Showing matching milestones',12)
            for i,label in enumerate(['Shared access','Broadband expands','A mobile everyday']):
                yy=y+120+i*222;line(yy);text(m,yy+34,'YEAR / SOURCE',12,RED);text(m,yy+72,label,26,serif=True);bars(m,yy+98,w-2*m,4);text(m,yy+180,'Read source ↗',13,RED)
        else:
            for i,label in enumerate(['All years','Early access','Broadband','Mobile era']):box(m+i*185,y,170,44,label)
            text(m,y+83,'Showing matching milestones',13)
            for i,label in enumerate(['Shared access','Broadband expands','A mobile everyday']):
                yy=y+115+i*148;line(yy);text(m,yy+50,'YEAR',29,RED,True);text(300,yy+43,label,28,serif=True);bars(300,yy+65,580,3);text(960,yy+45,'Read source ↗',13,RED)
    elif page == 'Everyday connections':
        text(m,top+56,'How Peru',41 if mobile else 66,serif=True);text(m,top+103,'got online.',41 if mobile else 66,serif=True)
        bars(m,top+145,w-2*m if mobile else 535,3)
        labels=['01  The public cabina','02  Internet in your pocket','03  The distance to access']
        if mobile:
            for i,label in enumerate(labels):
                yy=top+222+i*272;line(yy);text(m,yy+35,label,22,serif=True);box(m,yy+58,342,105,'Original illustrative artwork');bars(m,yy+190,342,3);text(m,yy+250,'Evidence / source ↗',12,RED)
        else:
            box(740,top+35,400,160,'Illustrative art: cabina / phone / terrain')
            line(385)
            for i,label in enumerate(labels):
                x=m+i*365;box(x,430,310,178,'Original illustrative artwork');text(x,655,label,23,serif=True);bars(x,685,310,5);text(x,805,'Evidence / source ↗',13,RED)
    else:
        text(m,top+56,'Behind the',40 if mobile else 66,serif=True);text(m,top+103,'story.',40 if mobile else 66,serif=True);bars(m,top+145,w-2*m if mobile else 680,3)
        yy=top+220;text(m,yy,'Sources & scope',27 if mobile else 36,serif=True)
        if mobile:
            for i in range(3):
                y=yy+30+i*155;line(y);text(m,y+31,f'0{i+1}  Source organisation',19,serif=True);bars(m,y+57,342,3);text(m,y+122,'Publication / year / source link ↗',12,RED)
            line(yy+512);text(m,yy+557,'About this project',26,serif=True);bars(m,yy+586,342,5);text(m,yy+692,'Methods, credits & limitations',15);bars(m,yy+718,342,3)
        else:
            for i in range(3):
                y=yy+40+i*153;line(y);text(m,y+39,f'0{i+1}  Source organisation',25,serif=True);bars(m,y+68,610,3);text(m,y+124,'Publication / year / source link ↗',13,RED)
            box(820,yy+30,320,386,'About this project');text(840,yy+104,'Scope: Peru, 1997–2025',18,serif=True);bars(840,yy+135,260,5);text(840,yy+244,'Methods and credits',18,serif=True);bars(840,yy+275,260,5)
    line(h-65);text(m,h-36,'PERU ONLINE  /  proposed layout',11);text(m,h-16,'Original wireframe · desktop / mobile study',9)
    a.append('</svg>')
    slug={'Overview':'overview','Timeline':'timeline','Everyday connections':'connections','Sources & project':'about'}[page]
    out=ROOT/'evidence'/f'wireframes-{slug}-{"mobile" if mobile else "desktop"}.svg'
    out.write_text('\n'.join(a))
    return out

if __name__ == '__main__':
    for page in ['Overview','Timeline','Everyday connections','Sources & project']:
        for mobile in [False,True]:print(make(page,mobile))
