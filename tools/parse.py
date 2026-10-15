import re,json
rows=[]
for l in open('design.md'):
    m=re.match(r'^\| (\d{1,3}) \| ([서12]) \|(.*)\|\s*$',l)
    if not m: continue
    p=[x.strip() for x in m.group(3).split('|')]
    rows.append(dict(id=int(m.group(1)),act={'서':0,'1':1,'2':2}[m.group(2)],name=p[0],type=p[1],eff=p[2],note=p[3]))
RES={'군':'군량','인':'인재','외':'외교','어':'어명'}
G=r'(민심|국운|탄핵|군량|인재|외교|어명|히데요시 기세|고니시 기세|가토 기세|모든 빌런 기세|기세)([+-]\d)'
def cost(s):
    return {RES[a]:int(b) for a,b in re.findall(r'(?<![가-힣])([군인외어])(\d)',s)}
def gains(s):
    d={}
    for k,v in re.findall(G,s):
        k={'히데요시 기세':'기세','고니시 기세':'기세','가토 기세':'기세','모든 빌런 기세':'기세'}.get(k,k)
        d[k]=d.get(k,0)+int(v)
    return d
BAD=re.compile(r'미해결|방치|못 |실패 시|두면')
out=[]
for r in rows:
    e=r['eff']; c={'id':r['id'],'act':r['act'],'name':r['name'],'type':r['type'],'note':r['note'],'raw':e}
    segs=[s.strip() for s in e.split(' / ')]
    opts=[];pen={};prob=[]
    base=cost(e.split('→')[0]) if '→' in e else {}
    for s in segs:
        pm=re.search(r'(\d+)%',s)
        if BAD.search(s):
            pen.update(gains(s)); continue
        if pm and r['type'].find('결과')>=0 or (pm and '확률' not in s and '%(' in s):
            prob.append({'p':int(pm.group(1))/100,'g':gains(s),'t':re.sub(r'^.*?→','',s).strip()}); continue
        lab=''
        body=s
        if '→' in s:
            L,R=s.split('→',1); body=R
            lm=re.match(r'^([^:]+):',L.strip())
            if lm and not cost(lm.group(1)): lab=lm.group(1).strip()
        lm=re.match(r'^\s*([^:→]{1,12}):',body)
        if lm and not re.search(G,lm.group(1)): lab=lm.group(1).strip(); body=body[lm.end():]
        oc=cost(s.split('→')[0]) if '→' in s else {}
        opts.append({'label':lab,'cost':oc or base,'g':gains(body),'t':body.strip()})
    c.update(opts=opts,pen=pen,prob=prob)
    out.append(c)
json.dump(out,open('tools/cards_raw.json','w'),ensure_ascii=False,indent=0)
print(len(out))
for c in out: print(c['id'],c['name'],'|',[(o['label'],o['cost'],o['g']) for o in c['opts']],'P',c['pen'],'R',[(x['p'],x['g']) for x in c['prob']])
