import json,pathlib
w=pathlib.Path('/workspace/yuseongryong/web')
h=f'''<!doctype html><html lang=ko><head><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1"><title>전시재상 유성룡</title>
<style>{(w/'style.css').read_text()}</style></head><body><div id=app></div><div id=mod></div><div id=tip></div>
<script>window.DATA={(w/'data.json').read_text()};</script><script>{(w/'engine.js').read_text()}</script><script>{(w/'ui.js').read_text()}</script></body></html>'''
(w/'index.html').write_text(h);print(len(h))
