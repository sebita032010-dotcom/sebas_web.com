"""Uso: python scripts/build_data.py ruta/val.csv
Clasifica las preguntas por carrera y curso y genera data/questions.json"""
import pandas as pd, json, re, random, sys
random.seed(7)
df=pd.read_csv(sys.argv[1] if len(sys.argv)>1 else 'val.csv')
K={
'conta':'account|audit|revenue|asset|liabilit|inflation|gdp|econom|market|tax|inventory|depreciation|demand|supply|firm|price|cost|profit|bank|interest rate|stock|invest|budget|manage|marketing|business|employee|consumer|wage|monetary|fiscal|income|equity|cash|loan',
'info':'computer|software|program|algorithm|network|database|sql|python|java|data structure|router|tcp|ip |operating system|cpu|memory|cache|thread|compiler|hadoop|hive|web|encrypt|protocol|binary|code|server|array|pointer|class |function|bit',
'salud':'cell|protein|dna|gene|bacteri|virus|disease|patient|blood|enzyme|organism|species|ecosystem|diagnos|symptom|drug|nutrient|vitamin|hormone|anatom|muscle|nerve|treatment|infect|tissue|organ|clinical|therapy|biolog|plant|evolution|immune',
'ing':'voltage|current|circuit|resistor|capacitor|transistor|motor|torque|power|gear|engine|thermodynamic|heat|pressure|fluid|beam|stress|load|machine|magnetic|electric|turbine|shaft|welding|bearing|steel|concrete|temperature',
'exact':'equation|probability|triangle|angle|integral|derivative|matrix|chord|circle|molar|acid|reaction|chemical|atom|element|solution|bond|ph |mole|compound|velocity|acceleration|mass|vector|polynomial|ratio|percent|volume|area of',
'soc':'war|history|king|empire|philosoph|law|court|legal|psycholog|social|cultur|government|politic|religio|literatur|language|ethic|moral|sociolog|constitution|president|treaty|century|church|parliament|rights|justice|crime|belief',
}
bad=re.compile(r'passage|figure|table|diagram|following statements|all of the above|none of the above|both a and|above',re.I)
rows=[]
for _,r in df.iterrows():
    q=r.Question; o=[str(r[c]) for c in 'ABCD']
    if len(q)>230 or max(map(len,o))>80 or bad.search(q) or any(bad.search(x) for x in o): continue
    t=(q+' '+' '.join(o)).lower()
    sc={k:len(re.findall(p,t)) for k,p in K.items()}
    qs={k:len(re.findall(p,q.lower())) for k,p in K.items()}
    k=max(sc,key=lambda x:(qs[x]*2+sc[x]))
    if qs[k]==0: continue
    rows.append((k,q,o,'ABCD'.index(r.Answer),len(q)+sum(map(len,o))/4))
out={};info={}
for k in K:
    s=sorted([x for x in rows if x[0]==k],key=lambda x:x[4])
    info[k]=len(s); n=len(s); out[k]={}
    for i,c in enumerate('123'):
        seg=s[i*n//3:(i+1)*n//3]; random.shuffle(seg)
        out[k][c]=[[x[1],x[2],x[3]] for x in seg[:40]]
print(info,{k:{c:len(v) for c,v in d.items()} for k,d in out.items()})
json.dump(out,open('data/questions.json','w'),ensure_ascii=False,separators=(',',':'))
print('OK -> data/questions.json')
