import re
import sys
import zipfile
from pathlib import Path

def read_xlsx(path):
    with zipfile.ZipFile(path) as z:
        ss = z.read('xl/sharedStrings.xml').decode('utf-8', 'ignore')
        strings = [re.sub(r'<[^>]+>', '', s) for s in re.findall(r'<t[^>]*>(.*?)</t>', ss, re.S)]
        sheet = z.read('xl/worksheets/sheet1.xml').decode('utf-8', 'ignore')
        rows = re.findall(r'<row[^>]*>(.*?)</row>', sheet, re.S)
        out = []
        for row in rows:
            cells = re.findall(r'<c[^>]*>(.*?)</c>', row, re.S)
            vals = []
            for c in cells:
                m = re.search(r't="(\d+)"', c)
                if m:
                    vals.append(strings[int(m.group(1))])
                else:
                    v = re.search(r'<v>(.*?)</v>', c)
                    if v:
                        vals.append(v.group(1))
            if vals:
                out.append(vals)
        return out

if __name__ == '__main__':
    base = Path(__file__).resolve().parents[1] / 'imagenes'
    for name in sorted(base.glob('*Coverage*.xlsx')):
        print('\n===', name.name, '===')
        for row in read_xlsx(name)[:40]:
            print(' | '.join(str(c)[:100] for c in row))
