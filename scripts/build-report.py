"""Build the short, illustrated report from its editable Markdown source.
Dependencies: reportlab, pypdf, Pillow. The PDF word count includes all extracted text.
"""
from pathlib import Path
import re
from xml.sax.saxutils import escape
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Image, KeepTogether, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.utils import ImageReader
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT.parent / 'submission' / 'Peru_Online_Report.pdf'
OUT.parent.mkdir(exist_ok=True)
INK = colors.HexColor('#252720'); RED = colors.HexColor('#a52b1f'); MUTED = colors.HexColor('#62635b'); PAPER=colors.HexColor('#f4f1e9')
styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name='Copy',fontName='Helvetica',fontSize=10.1,leading=14.4,textColor=INK,spaceAfter=9))
styles.add(ParagraphStyle(name='SectionTitle',fontName='Helvetica-Bold',fontSize=17,leading=21,textColor=RED,spaceBefore=12,spaceAfter=13,keepWithNext=True))
styles.add(ParagraphStyle(name='ReportTitle',fontName='Helvetica-Bold',fontSize=29,leading=33,textColor=INK,spaceAfter=12))
styles.add(ParagraphStyle(name='CaptionText',fontName='Helvetica',fontSize=8,leading=11,textColor=MUTED,spaceAfter=10))
styles.add(ParagraphStyle(name='IntroNote',fontName='Helvetica',fontSize=9,leading=12.5,textColor=RED,spaceAfter=15,borderPadding=10,backColor=PAPER))
styles.add(ParagraphStyle(name='Reference',fontName='Helvetica',fontSize=8.7,leading=12,textColor=MUTED,spaceAfter=7))

source=(ROOT/'docs/report.md').read_text()
links={
 '[1]':'https://www.iadb.org/en/news/internet-people',
 '[2]':'https://www.sec.gov/Archives/edgar/data/1014620/000119312503003396/d6k.htm',
 '[3]':'https://www.inei.gob.pe/media/MenuRecursivo/boletines/boletin-tic-oct_dic2025.pdf#page=6',
 '[4]':'https://dribbble.com/shots/26305597-Resadex-Landing-page-3D-animation',
}
def rich(text):
    text=text.replace('–','-').replace('—','-').replace('‑','-').replace('→','to')
    t=escape(text)
    t=re.sub(r'`([^`]+)`',r'<font name="Courier" size="9">\1</font>',t)
    t=re.sub(r'\*\*([^*]+)\*\*',r'<b>\1</b>',t)
    t=re.sub(r'\*([^*]+)\*',r'<i>\1</i>',t)
    t=re.sub(r'https://nielspac177.github.io/peru-online/',r'<link href="https://nielspac177.github.io/peru-online/" color="#a52b1f">nielspac177.github.io/peru-online/</link>',t)
    for n,url in links.items(): t=t.replace(n,f'<link href="{escape(url)}" color="#a52b1f">{n}</link>')
    return t

def picture(path,maxwidth,maxheight):
    w,h=ImageReader(str(path)).getSize(); scale=min(maxwidth/w,maxheight/h)
    return Image(str(path),width=w*scale,height=h*scale)

story=[];ref=False
for para in source.strip().split('\n\n'):
    para=para.strip()
    if not para:continue
    if para.startswith('# '):
        story.append(Paragraph('PERÚ ONLINE',styles['ReportTitle']))
        story.append(Paragraph('CM1040 / COURSEWORK 2 / 1997-2025',styles['CaptionText']))
    elif para.startswith('## '):
        title=para[3:]
        if title.startswith(('C.','D.')):
            story.append(PageBreak())
        if title.startswith('F.'):
            audit = __import__('json').loads((ROOT/'evidence/tests/browser-axe.json').read_text())
            rows=[['Automated report extracts','First check','Final check'],
                  ['Authored HTML (5 pages)','10 lint findings','0 findings'],
                  ['Rendered HTML (5 pages)','Not run','0 findings'],
                  ['Browser axe (4 pages)','0 violations; 2 incomplete',f"{audit['totals']['violations']} violations; {audit['totals']['incomplete']} incomplete"],
                  ['Unit/data/link tests','Not run','64 passed']]
            cells=[[Paragraph(rich(c),styles['Reference']) for c in row] for row in rows]
            table=Table(cells,colWidths=[205,145,145],hAlign='LEFT')
            table.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),PAPER),('LINEBELOW',(0,0),(-1,0),.6,RED),('LINEBELOW',(0,1),(-1,-1),.35,colors.HexColor('#cccac0')),('VALIGN',(0,0),(-1,-1),'TOP'),('TOPPADDING',(0,0),(-1,-1),5),('BOTTOMPADDING',(0,0),(-1,-1),2)]))
            story.append(Spacer(1,8));story.append(table)
            story.append(PageBreak())
            story.append(picture(ROOT/'evidence/screenshots/home-desktop.png',490,225))
            story.append(Spacer(1,7))
            story.append(Paragraph('Figure 2. Implemented overview with original globe artwork.',styles['CaptionText']))
        ref=title=='References'
        story.append(Paragraph(rich(title),styles['SectionTitle']))
    elif para.startswith('!['):
        caption=re.search(r'!\[([^]]+)\]',para).group(1)
        story.append(picture(ROOT/'evidence/wireframes-contact-sheet.png',480,355))
        story.append(Spacer(1,6))
        story.append(Paragraph(rich(caption)+' Full-size individual prototypes are included in the ZIP.',styles['CaptionText']))
    elif para.startswith('AI-assisted'):
        story.append(Paragraph(rich(para),styles['IntroNote']))
    else:
        story.append(Paragraph(rich(para.replace('\n',' ')),styles['Reference' if ref else 'Copy']))

def furniture(canvas,doc):
    canvas.saveState()
    canvas.setStrokeColor(colors.HexColor('#cccac0'));canvas.setLineWidth(.6);canvas.line(48,805,547,805)
    canvas.setFillColor(MUTED);canvas.setFont('Helvetica',8)
    canvas.drawString(48,814,'PERÚ ONLINE   /   PROJECT REPORT')
    canvas.drawRightString(547,814,'CM1040 · 2026')
    canvas.line(48,40,547,40)
    canvas.drawString(48,27,'AI-assisted review version · Human prototype feedback outstanding')
    canvas.drawRightString(547,27,str(doc.page))
    canvas.restoreState()

doc=SimpleDocTemplate(str(OUT),pagesize=(595.276,841.89),rightMargin=48,leftMargin=48,topMargin=51,bottomMargin=54,title='Perú Online: CM1040 Coursework 2 report',author='Niels Pacheco',subject='Internet history in Peru, 1997–2025; development, research and testing')
doc.build(story,onFirstPage=furniture,onLaterPages=furniture)
r=PdfReader(OUT);words=re.findall(r'\b[\w]+(?:[’\'-][\w]+)*\b','\n'.join(p.extract_text() for p in r.pages))
# Count image text too: all eight SVG labels plus the contact-sheet headings.
import xml.etree.ElementTree as ET
figure_words = 0
for svg in (ROOT/'evidence').glob('wireframes-*.svg'):
    for el in ET.parse(svg).iter():
        if el.tag.endswith('}text'):
            figure_words += len(re.findall(r'\b[\w]+(?:[’\'-][\w]+)*\b',''.join(el.itertext())))
figure_words += 50  # conservative allowance for contact-sheet title, version and labels
figure_words += 100  # conservative allowance for visible words in the desktop screenshot
inclusive_count = len(words) + figure_words
assert inclusive_count<=1500,f'Report exceeds inclusive word limit: {inclusive_count}'
print(f'{OUT}\nPages: {len(r.pages)}\nExtracted words: {len(words)}; image words allowance: {figure_words}; inclusive word count: {inclusive_count}')
(ROOT/'evidence/report-verification.json').write_text(__import__('json').dumps({'pdf':'Peru_Online_Report.pdf','pages':len(r.pages),'extractedWordCount':len(words),'imageWordsAllowance':figure_words,'inclusiveWordCount':inclusive_count,'limit':1500,'includes':'body, headers, captions, references, page furniture and conservative count of text within the wireframe image'},indent=2)+'\n')
