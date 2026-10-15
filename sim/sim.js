const Y=require('../web/engine.js');const D=Y.prep(require('../web/data.json'));
const W={국운:3,민심:2.2,탄핵:-2.2,군량:0.8,인재:1,외교:0.9,어명:1,기세:-1.2};
const ROUTE_PREF={A:{},B:{113:30,39:15,40:12,117:-99},C:{117:30,113:-99},D:{35:20,36:20,37:20,113:-99,117:-99},E:{3:12,5:20,8:20},
 };
function val(S,c,o,route,k){let v=0;for(const r in o.g)v+=(W[r]||0)*o.g[r];
  if(o.p&&Array.isArray(o.p))for(const [p,g] of o.p)for(const r in g)v+=p*(W[r]||0)*g[r];
  if(typeof o.p==='string')v+=3;
  for(const r in c.pen||{})v-=(W[r]||0)*c.pen[r]*1.2;
  if(c.kind==='필수'||c.kind==='결과')v+=3;
  if(c.recruit)v+=4; if(c.kind==='대기')v+=3;
  if(c.id===2)v+=route==='E'?(o.l.includes('황')?20:-20):(o.l.includes('김')?2:0);
  if(c.id===75&&o.l.includes('막는'))v+=4;
  v+=(ROUTE_PREF[route]||{})[c.id]||0;
  let cost=0;for(const r in k)cost+=k[r]*(S.res[r]<=3?2:1);return v-cost;}
function play(route,seed){const S=Y.newGame(D,seed);let guard=0;
  while(!S.over&&guard++<200){
    if(S.phase==='act')S.phase='play';
    if(S.phase==='bonus'){const o=['write','teach','relief'];Y.bonus(D,S,'write');break;}
    // 풍문
    let acted=true;while(acted&&!S.over){acted=false;let best=null;
      S.row.forEach((x,i)=>{const c=Y.card(D,x.id);if(!Y.avail(D,S,x))return;c.opts.forEach((o,oi)=>{const k=Y.costOf(D,S,c,o,x.worse);if(!Y.canPay(S,k))return;
        let v=c.kind==='풍문'?(S.res.인재>=3?2.5:-1)+(-Object.values(c.pen||{}).reduce((a,b)=>a+b,0)) :val(S,c,o,route,k);
        if(c.id===42&&route==='C')v=-50;
        if(!best||v>best.v)best={i,oi,v};});});
      if(best&&best.v>0){Y.resolve(D,S,best.i,best.oi);acted=true;}}
    if(S.over)break;
    while(S.enemy.length){const c=Y.card(D,S.enemy[0]);const sum=Object.values(c.hit).reduce((a,b)=>a+Math.abs(b),0);
      Y.enemyAct(D,S,c.id,Y.canPay(S,c.block)&&sum>=1&&Object.keys(c.block).every(r=>S.res[r]-c.block[r]>=2));}
    if(S.over)break;Y.endRound(D,S);}
  return S;}
const N=+process.argv[2]||2000;const out={};
for(const r of ['A','B','C','D','E']){let win=0,reach=0,sc=0,rw=0,why={};
  for(let i=0;i<N;i++){const S=play(r,i*7919+r.charCodeAt(0));const w=S.over&&S.over.type==='win';if(w){win++;sc+=S.over.score;}
    if(S.route===r){reach++;if(w)rw++;} if(!w&&S.over){const k=`${S.over.act}:${S.over.why.slice(0,8)}`;why[k]=(why[k]||0)+1;}}
  out[r]={생존:(100*win/N).toFixed(1)+'%',루트도달:(100*reach/N).toFixed(1)+'%',도달시생존:reach?(100*rw/reach).toFixed(1)+'%':'-',평균점수:win?(sc/win).toFixed(1):'-',
   패배:Object.entries(why).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([k,v])=>k+'×'+v).join(', ')};}
console.table(out);
if(require.main===module&&process.argv[3])console.log(JSON.stringify(out));
module.exports={play};
