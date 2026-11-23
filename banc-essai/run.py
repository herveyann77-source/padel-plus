import json,sys,time
from playwright.sync_api import sync_playwright
URL=sys.argv[1] if len(sys.argv)>1 else 'http://127.0.0.1:8765/index.html'
LIM=int(sys.argv[2]) if len(sys.argv)>2 else 99999
js=open('/home/claude/bench/banc.js',encoding='utf8').read()
res=[];t0=time.time()
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome')
    c=b.new_context(viewport={'width':1366,'height':1024},service_workers='block'); pg=c.new_page()
    perr=[]; pg.on('pageerror',lambda e:perr.append(str(e)[:200]))
    pg.goto(URL); pg.wait_for_timeout(2500); pg.add_script_tag(content=js)
    cfgs=pg.evaluate('__cfgs()')
    seen=set();U=[]
    for c0 in cfgs:
        k=json.dumps(c0,sort_keys=True)
        if k not in seen: seen.add(k);U.append(c0)
    U=U[:LIM]
    print(len(U),'formules x 2 modes',flush=True)
    for i,cf in enumerate(U):
        for mode in ('fav','rand'):
            perr.clear()
            r=pg.evaluate('c=>__banc(c)',{**cf,'mode':mode})
            r['err']+= ['erreur JS : '+e for e in perr]
            res.append(r)
        if i%25==0: print(i,round(time.time()-t0),'s',flush=True)
    b.close()
json.dump(res,open('/home/claude/bench/resultats.json','w'),ensure_ascii=False,indent=0)
bad=[r for r in res if r['err']]; warn=[r for r in res if r['warn']]
print('TOTAL',len(res),'OK',len(res)-len(bad),'ERREURS',len(bad),'ALERTES',len(warn),'durée',round(time.time()-t0),'s')
from collections import Counter
cnt=Counter(e.split(':')[0] for r in bad for e in r['err']); print(cnt.most_common(15))
for r in bad[:12]: print(r['cfg'],r['err'][:2])
for r in warn[:6]: print('W',r['cfg'],r['warn'][:2])
