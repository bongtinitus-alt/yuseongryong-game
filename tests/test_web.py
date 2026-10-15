from playwright.sync_api import sync_playwright
import sys
URL=sys.argv[1] if len(sys.argv)>1 else "http://localhost:8790/index.html"
errs=[]
with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_page(viewport={"width":390,"height":844})
    pg.on("pageerror",lambda e:errs.append(str(e)));pg.on("console",lambda m:m.type=="error" and errs.append(m.text))
    pg.goto(URL);pg.evaluate("localStorage.clear()");pg.reload();pg.wait_for_timeout(300)
    pg.screenshot(path="shots/01-title.png")
    pg.click("#bNew");pg.wait_for_timeout(200)
    assert pg.locator(".tut").count()==1; pg.screenshot(path="shots/02-tutorial.png"); pg.click("#tSkip")
    pg.click("#actOK");pg.wait_for_timeout(200)
    pg.screenshot(path="shots/03-board.png")
    pg.locator(".card").first.click();pg.wait_for_timeout(200);pg.screenshot(path="shots/04-card.png")
    assert pg.locator(".cd h2").count()==1
    pg.locator(".tm").first.click() if pg.locator(".tm").count() else None
    pg.wait_for_timeout(150);pg.screenshot(path="shots/05-tooltip.png")
    pg.click("#cX")
    # save slot
    pg.click("#bMenu");pg.click("#mS");pg.locator(".slot").first.click()
    assert pg.evaluate("!!localStorage.ysr_save_1")
    rounds=0;enemy=0;rum=0
    for step in range(600):
        if pg.evaluate("!!(S&&S.over&&S.over.type)") or pg.locator(".end").count(): break
        if pg.locator("#actOK").count() and pg.locator("#actOK").is_visible(): pg.click("#actOK");continue
        if pg.locator("[data-b]").count(): pg.locator("[data-b]").first.click();continue
        if pg.locator(".en").count():
            enemy+=1
            if enemy==1: pg.screenshot(path="shots/06-enemy.png")
            (pg.locator("#eB") if pg.locator("#eB").is_enabled() else pg.locator("#eH")).click();continue
        # resolve first affordable card
        done=False
        n=pg.locator(".card:not(.lock)").count()
        for i in range(n):
            pg.locator(".card:not(.lock)").nth(i).click();pg.wait_for_timeout(30)
            o=pg.locator(".opt:not(.dis)")
            if o.count() and pg.evaluate("S.res.인재>2&&S.res.어명>2&&S.res.군량>2&&S.res.외교>2"):
                if pg.locator(".cd .kd").inner_text()=="풍문": rum+=1
                o.first.click();done=True;break
            pg.click("#cX")
        if not done: pg.click("#bEnd");rounds+=1
    pg.wait_for_timeout(200);pg.screenshot(path="shots/07-end.png",full_page=True)
    txt=pg.inner_text("#app");print("rounds",rounds,"enemy",enemy,"rumor",rum)
    print("END:",txt[:300].replace("\n"," | "))
    assert pg.locator(".end").count()==1
    # 완주 경로: 시뮬 정책으로 이기는 판을 페이지 안에서 재생
    src=open("sim/sim.js").read().split("function play")[1].split("const N=")[0]
    pre=src.split("function val")[0] if False else ""
    head=open("sim/sim.js").read().split("function val")[0].split("\n",1)[1]
    js="(()=>{const Y=YSR;"+head+"function val"+open("sim/sim.js").read().split("function val")[1].split("function play")[0]+"function play"+src+";for(let s=1;s<400;s++){const R=play('C',s);if(R.over&&R.over.type==='win'){S=R;window.S=R;S.over=null;S.phase='bonus';render();return s;}}})()"
    seed=pg.evaluate(js);print("win seed",seed)
    pg.locator("[data-b]").first.click();pg.wait_for_timeout(300)
    pg.screenshot(path="shots/08-jingbirok.png",full_page=True)
    print("WIN:",pg.inner_text(".end")[:400].replace("\n"," | "))
    errs[:]=[e for e in errs if "AudioContext" not in e]
    print("errors",errs);assert not errs
    b.close()
