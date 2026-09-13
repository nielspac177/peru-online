"""Create the requested standard ZIP without dependencies, Git internals or output recursion."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED

root = Path(__file__).resolve().parents[1]
out = root.parent / 'submission' / 'Peru_Online_Website.zip'
out.parent.mkdir(exist_ok=True)
exclude = {'.git', 'node_modules', 'output', 'tmp', '__pycache__'}
with ZipFile(out, 'w', compression=ZIP_DEFLATED, compresslevel=9) as archive:
    for path in sorted(root.rglob('*')):
        relative = path.relative_to(root)
        if not path.is_file() or any(part in exclude for part in relative.parts):
            continue
        if path.name == '.DS_Store' or path.suffix in {'.zip', '.pyc'}:
            continue
        archive.write(path, Path('peru-online') / relative)
with ZipFile(out) as archive:
    assert archive.testzip() is None
print(f'{out}: {out.stat().st_size:,} bytes; {len(archive.namelist())} files; integrity OK')
