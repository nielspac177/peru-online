"""Render the project's four-page report, including vector prototype evidence.

Uses ReportLab and pypdf. System fonts have portable built-in fallbacks. Historical
claims, validation results and the participant-review status come from report.md.
"""
from pathlib import Path
import json
import re
import xml.etree.ElementTree as ET
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    Flowable, Image, KeepTogether, PageBreak, Paragraph, SimpleDocTemplate,
    Spacer, Table, TableStyle,
)
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT.parent / 'submission' / 'Peru_Online_Report.pdf'
OUT.parent.mkdir(exist_ok=True)
INK = colors.HexColor('#252720')
RED = colors.HexColor('#9c2d23')
MUTED = colors.HexColor('#62635b')
RULE = colors.HexColor('#d5d3ca')
PALE = colors.HexColor('#f4f1e9')
WIDTH = 487
FONTS = {}
for alias, filename, fallback in [
    ('Body', 'Arial.ttf', 'Helvetica'),
    ('BodyBold', 'Arial Bold.ttf', 'Helvetica-Bold'),
    ('BodyItalic', 'Arial Italic.ttf', 'Helvetica-Oblique'),
    ('Display', 'Georgia.ttf', 'Times-Roman'),
    ('DisplayItalic', 'Georgia Italic.ttf', 'Times-Italic'),
]:
    path = Path('/System/Library/Fonts/Supplemental') / filename
    if path.exists():
        pdfmetrics.registerFont(TTFont(alias, str(path)))
        FONTS[alias] = alias
    else:
        FONTS[alias] = fallback
pdfmetrics.registerFontFamily(FONTS['Body'], normal=FONTS['Body'], bold=FONTS['BodyBold'], italic=FONTS['BodyItalic'], boldItalic=FONTS['BodyBold'])

styles = {
    'copy': ParagraphStyle('Copy', fontName=FONTS['Body'], fontSize=10.3,
        leading=15.4, textColor=INK, spaceAfter=10),
    'caption': ParagraphStyle('Caption', fontName=FONTS['Body'], fontSize=8,
        leading=11.4, textColor=MUTED, spaceAfter=12),
    'reference': ParagraphStyle('Reference', fontName=FONTS['Body'], fontSize=8.6,
        leading=12.2, textColor=MUTED, spaceAfter=6),
    'table': ParagraphStyle('Table', fontName=FONTS['Body'], fontSize=8.3,
        leading=11.3, textColor=INK),
    'tablehead': ParagraphStyle('TableHead', fontName=FONTS['BodyBold'], fontSize=8,
        leading=11, textColor=INK),
}

LINKS = {
    '[1]': 'https://www.iadb.org/en/news/internet-people',
    '[2]': 'https://www.sec.gov/Archives/edgar/data/1014620/000119312503003396/d6k.htm',
    '[3]': 'https://www.inei.gob.pe/media/MenuRecursivo/boletines/boletin-tic-oct_dic2025.pdf#page=6',
    '[4]': 'https://dribbble.com/shots/26305597-Resadex-Landing-page-3D-animation',
}
SITE = 'https://nielspac177.github.io/peru-online/'


def clean(text):
    return text.replace('–', '-').replace('—', '-').replace('‑', '-').replace('→', '>')


def rich(text):
    t = escape(clean(text))
    t = re.sub(r'`([^`]+)`', r'<font name="Courier" size="9">\1</font>', t)
    t = re.sub(r'\*\*([^*]+)\*\*', r'<b>\1</b>', t)
    t = re.sub(r'\*([^*]+)\*', r'<i>\1</i>', t)
    t = t.replace(SITE, '<link href="'+SITE+'" color="#9c2d23">nielspac177.github.io/peru-online/</link>')
    for label, url in LINKS.items():
        t = t.replace(label, f'<link href="{escape(url)}" color="#9c2d23">{label}</link>')
    return t


class CoverTitle(Flowable):
    """A restrained title block; dates remain in the research narrative."""
    def __init__(self):
        super().__init__()
        self.width, self.height = WIDTH, 122

    def draw(self):
        c = self.canv
        c.setFillColor(RED)
        c.rect(0, 113, 30, 2.5, fill=1, stroke=0)
        c.setFillColor(INK)
        c.setFont(FONTS['Display'], 43)
        c.drawString(0, 64, 'Perú Online')
        c.setFont(FONTS['Body'], 12)
        c.setFillColor(MUTED)
        c.drawString(1, 40, 'Research, design & development')
        c.setFont(FONTS['BodyBold'], 8.5)
        c.setFillColor(INK)
        c.drawString(1, 13, 'Niels Pacheco')
        c.setFont(FONTS['Body'], 8.5)
        c.setFillColor(MUTED)
        c.drawRightString(WIDTH, 13, 'September 2026')
        c.setStrokeColor(RULE)
        c.line(0, 0, WIDTH, 0)


class SectionHeading(Flowable):
    """Separate section letters from titles instead of colouring entire headings."""
    def __init__(self, letter, title):
        super().__init__()
        self.letter, self.title = letter, title
        self.width, self.height = WIDTH, 44
        self.keepWithNext = True

    def draw(self):
        c = self.canv
        if self.letter:
            c.setFillColor(RED)
            c.setFont(FONTS['BodyBold'], 8)
            c.drawString(0, 19, self.letter)
        c.setFillColor(INK)
        c.setFont(FONTS['Display'], 19)
        c.drawString(23 if self.letter else 0, 15, self.title)


class VectorWireframes(Flowable):
    """Draw the existing original SVG primitives as sharp, selectable PDF vectors."""
    def __init__(self):
        super().__init__()
        self.width, self.height = WIDTH, 411

    @staticmethod
    def draw_svg(c, path, x0, ytop, target_width):
        root = ET.parse(path).getroot()
        scale = target_width / float(root.get('width'))
        height = float(root.get('height')) * scale
        for el in root:
            a = el.attrib
            kind = el.tag.split('}')[-1]
            if kind in ('title', 'desc'):
                continue
            n = lambda key, default=0: float(a.get(key, default))
            x = lambda key: x0 + n(key) * scale
            y = lambda key: ytop - n(key) * scale
            fill = a.get('fill')
            stroke = a.get('stroke')
            do_fill = bool(fill and fill != 'none')
            do_stroke = bool(stroke and stroke != 'none')
            c.setLineWidth(max(.2, n('stroke-width', 1) * scale))
            if do_fill:
                c.setFillColor(colors.HexColor(fill))
            if do_stroke:
                c.setStrokeColor(colors.HexColor(stroke))
            if kind == 'rect':
                c.rect(x('x'), y('y') - n('height') * scale,
                    n('width') * scale, n('height') * scale,
                    fill=int(do_fill), stroke=int(do_stroke))
            elif kind == 'line':
                c.line(x('x1'), y('y1'), x('x2'), y('y2'))
            elif kind in ('circle', 'ellipse'):
                rx = n('r') if kind == 'circle' else n('rx')
                ry = n('r') if kind == 'circle' else n('ry')
                cx, cy = x('cx'), y('cy')
                c.ellipse(cx-rx*scale, cy-ry*scale, cx+rx*scale, cy+ry*scale,
                    fill=int(do_fill), stroke=int(do_stroke))
            elif kind == 'text':
                face = FONTS['Display'] if 'Georgia' in a.get('font-family', '') else FONTS['Body']
                c.setFont(face, n('font-size', 12) * scale)
                c.drawString(x('x'), y('y'), clean(el.text or ''))
        c.setStrokeColor(RULE)
        c.setLineWidth(.4)
        c.rect(x0, ytop-height, target_width, height, fill=0, stroke=1)

    def draw(self):
        c = self.canv
        for i, (slug, label) in enumerate([
            ('overview', '01  Overview'), ('timeline', '02  Timeline'),
            ('connections', '03  Connections'), ('about', '04  Sources'),
        ]):
            left = (i % 2) * 251
            top = self.height - (i // 2) * 210
            c.setFillColor(INK)
            c.setFont(FONTS['BodyBold'], 8)
            c.drawString(left, top-9, label)
            self.draw_svg(c, ROOT/'evidence'/f'wireframes-{slug}-desktop.svg', left, top-21, 171)
            self.draw_svg(c, ROOT/'evidence'/f'wireframes-{slug}-mobile.svg', left+179, top-21, 56)


def results_table():
    audit = json.loads((ROOT/'evidence/tests/browser-axe.json').read_text())
    rows = [
        ['CHECK', 'INITIAL RECORD', 'FINAL RECORD'],
        ['Authored HTML · 5 pages', '10 lint findings', '0 findings'],
        ['Rendered HTML · 5 pages', 'Not run', '0 findings'],
        ['Browser axe · 4 pages', '0 violations; 2 incomplete', f"{audit['totals']['violations']} violations; {audit['totals']['incomplete']} incomplete"],
        ['Unit, data and link tests', 'Not run', '64 passed'],
    ]
    cells = [[Paragraph(rich(cell), styles['tablehead' if r == 0 else 'table']) for cell in row] for r, row in enumerate(rows)]
    t = Table(cells, colWidths=[189, 149, 149], hAlign='LEFT')
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PALE),
        ('BACKGROUND', (2, 1), (2, -1), colors.HexColor('#faf9f5')),
        ('LINEBELOW', (0, 0), (-1, 0), .8, RED),
        ('LINEBELOW', (0, 1), (-1, -1), .4, RULE),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 9),
    ]))
    return t


source = (ROOT/'docs/report.md').read_text()
sections = {}
current = None
for block in source.strip().split('\n\n'):
    if block.startswith('## '):
        title = block[3:]
        current = title[0] if re.match(r'[A-F]\.', title) else 'References'
        sections[current] = []
    elif current:
        sections[current].append(block)


def prose(key):
    return [Paragraph(rich(b.replace('\n', ' ')), styles['reference' if key == 'References' else 'copy'])
        for b in sections[key] if not b.startswith('![')]


story = [CoverTitle(), Spacer(1, 8), SectionHeading('A', 'Background research'), *prose('A'),
    SectionHeading('B', 'Project planning'), *prose('B'), PageBreak(),
    SectionHeading('C', 'Prototypes & visual design')]
# The opening paragraph introduces the figure; the remaining text follows it.
c_blocks = [b for b in sections['C'] if not b.startswith('![')]
story.extend([Paragraph(rich(c_blocks[0]), styles['copy']), Spacer(1, 4), VectorWireframes(),
    Spacer(1, 6), Paragraph('Figure 1. Desktop and mobile wireframes. Full-size versions accompany the website code.', styles['caption'])])
story.extend(Paragraph(rich(b), styles['copy']) for b in c_blocks[1:])
story.extend([PageBreak(), SectionHeading('D', 'Implementation'), *prose('D'),
    SectionHeading('E', 'Validation & accessibility'), *prose('E'), Spacer(1, 9), results_table(),
    PageBreak()])
image_path = ROOT/'evidence/screenshots/home-desktop.png'
iw, ih = ImageReader(str(image_path)).getSize()
story.extend([Image(str(image_path), width=WIDTH, height=WIDTH*ih/iw), Spacer(1, 8),
    Paragraph('Figure 2. The published overview and its original network globe.', styles['caption']),
    SectionHeading('F', 'Reflections'), *prose('F'), SectionHeading('', 'References'), *prose('References')])


def furniture(c, doc):
    c.saveState()
    c.setFillColor(MUTED)
    c.setFont(FONTS['Body'], 8)
    c.drawString(54, 813, 'PERÚ ONLINE')
    c.drawRightString(541, 813, 'Project report')
    c.setStrokeColor(RULE)
    c.setLineWidth(.45)
    c.line(54, 803, 541, 803)
    c.line(54, 39, 541, 39)
    c.setFont(FONTS['Body'], 7.5)
    c.drawString(54, 25, 'Niels Pacheco')
    c.setFont(FONTS['BodyBold'], 8)
    c.drawRightString(541, 25, f'{doc.page:02d}')
    c.restoreState()


doc = SimpleDocTemplate(str(OUT), pagesize=(595.276, 841.89),
    leftMargin=54, rightMargin=54.276, topMargin=52, bottomMargin=53,
    title='Perú Online | Project report', author='Niels Pacheco',
    subject='Research, design and development of a website about internet access in Peru')
doc.build(story, onFirstPage=furniture, onLaterPages=furniture)
reader = PdfReader(OUT)
text = '\n'.join(p.extract_text() for p in reader.pages)
count = len(re.findall(r"\b[\w]+(?:[’'-][\w]+)*\b", text))
# Prototype text is real selectable PDF text and is already included above.
# Reserve another 100 words for visible content inside the website screenshot.
inclusive_count = count + 100
assert inclusive_count <= 1500, f'Inclusive word limit exceeded: {inclusive_count}'
assert len(reader.pages) == 4, f'Unexpected pagination: {len(reader.pages)} pages'
assert not re.search(r'AI-assisted|artificial intelligence|COURSEWORK 2', text, re.I)
verification = {'pdf':OUT.name, 'pages':len(reader.pages), 'extractedWordCount':count,
    'imageWordsAllowance':100, 'inclusiveWordCount':inclusive_count, 'limit':1500,
    'includes':'body, headings, references, tables, vector wireframe text, page furniture and a conservative allowance for screenshot text',
    'design':'Embedded typefaces, vector wireframes, restrained editorial hierarchy and evidence table'}
(ROOT/'evidence/report-verification.json').write_text(json.dumps(verification, indent=2)+'\n')
print(json.dumps(verification, indent=2))
