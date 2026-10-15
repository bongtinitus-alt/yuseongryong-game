// 《전시재상 유성룡》 엔진 (브라우저·node 공용)
(function(root){
let INCOME={군량:2,인재:2,외교:1,어명:1};const RES=['군량','인재','외교','어명'], TRK=['민심','국운','탄핵'];
const ROUNDS=[3,5,5], ACTN=['서막 · 통신사','1막 · 임진','2막 · 정유'];
const VIL=[{n:'도요토미 히데요시',h:['대비 없는 평화는 적에게 시간을 준다.','바다 건너에서 배를 모은다는 소문이 들린다.','칼끝이 이미 바다를 향했다.']},
 {n:'고니시 유키나가',h:['바다가 막히면 그의 발도 멈춘다.','그는 빠르다. 막지 못한 일이 그를 더 빠르게 한다.','북쪽 끝이 가까워진다.']},
 {n:'가토 기요마사',h:['바다와 직산을 지키면 그는 남해안에 갇힌다.','깨진 약속은 그를 다시 부른다.','그의 진군 뒤에는 울음뿐이다.']}];
const CHARS={선조:'조정',이항복:'조정',이덕형:'조정',이순신:'장수',권율:'장수',김시민:'장수',곽재우:'의병',사명대사:'의병',고경명:'의병',이여송:'명',심유경:'명',양호:'명'};
const CHAR_TIP={선조:'조선의 임금. 큰일은 임금의 허락(어명)이 있어야 해요. 피란길 비용이 줄어요.',이항복:'임금 곁을 지킨 신하. 재치가 많아요. 탄핵이 높을 때 막마다 한 번 줄여 줘요.',
 이덕형:'명나라와 이야기를 잘하는 신하. 명 관련 일의 외교 비용이 줄어요.',이순신:'바다를 지키는 장수. 해전에 드는 인재가 줄어요.',권율:'성을 잘 지키는 장수. 행주·남원·진주 비용이 줄어요.',
 김시민:'진주성을 지킨 장수. 첫 진주성 싸움에서 반드시 이겨요.',곽재우:'붉은 옷의 의병장. 1막 동안 매 라운드 민심이 올라요.',사명대사:'스님 군대를 이끈 승려. 가토와 담판할 수 있어요.',
 고경명:'나이 든 의병장. 금산에서 싸우다 쓰러졌어요.',이여송:'명나라 장군. 평양 싸움이 쉬워지지만 군량을 많이 먹어요.',심유경:'싸움을 멈추자는 이야기를 맡은 명나라 사람. 강화 비용이 줄어요.',양호:'명나라 장군. 나라의 운을 조금 올려 줘요.'};
const FAC_TIP={조정:'임금과 신하들이 모인 곳이에요.',장수:'나라의 군대를 이끄는 장군들이에요.',의병:'백성과 스님들이 스스로 일으킨 군대예요.',명:'조선을 도우러 온 명나라 사람들이에요.'};
function rng(S){let t=S.seed+=0x6D2B79F5;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;}
function newGame(D,seed){
  const S={v:1,seed:(seed??(Date.now()%2147483647))|0,act:0,round:0,res:{군량:5,인재:4,외교:4,어명:4},trk:{민심:6,국운:6,탄핵:1},
   kise:0,kmax:0,chars:['선조'],flags:{},route:'A',done:{},row:[],enemy:[],news:[],chron:[],drawn:{},streak:0,bottom:false,shield:0,
   stat:{tamun:0,block:0},seen:{},over:null,phase:'play',freeze:0,unbook:{},actlog:[],bonus:null};
  S.D=null; startRound(D,S); return S;}
const card=(D,id)=>D.byId[id];
function prep(D){D.byId={};D.cards.forEach(c=>D.byId[c.id]=c);return D;}
function log(S,t){S.news.push(t);}
function add(S,g,src){for(const k in g){const v=g[k];if(!v)continue;
  if(k==='기세'){ if(v>0&&S.freeze>0){continue;} S.kise=Math.max(0,S.kise+v); S.kmax=Math.max(S.kmax,S.kise);}
  else if(RES.includes(k))S.res[k]+=v; else if(TRK.includes(k))S.trk[k]=Math.max(0,S.trk[k]+v);}}
function reqOK(D,S,c){return !(c.req||[]).some(r=>{const [t,v]=r.split(':');
  if(r[0]==='c'&&/^c\d+$/.test(r))return !S.done[+r.slice(1)]; if(t==='ch')return !S.chars.includes(v);
  if(t==='f')return !S.flags[v]; if(t==='r')return !S.flags['r'+v]; return false;});}
function removedByRoute(S,id){
  if(S.flags.rB&&[42,43,44,45,46,47,48,98,99,100,117,50,102].includes(id))return true;
  if(S.flags.rC&&[42,43,44,98,46].includes(id))return true;
  if(!S.flags.rB&&S.flags.osakaDone&&[113].includes(id))return true;
  return false;}
function costOf(D,S,c,o,worse){const k={...o.c};const ch=S.chars;
  const dec=(r,n)=>{if(k[r])k[r]=Math.max(0,k[r]-n);};
  if(ch.includes('이순신')&&[15,16,17,46,50,119,44,125].includes(c.id))dec('인재',1);
  if(ch.includes('권율')&&[31,45,33].includes(c.id))dec('인재',1);
  if(ch.includes('이덕형')&&[24,27,28,88,72,30].includes(c.id))dec('외교',1);
  if([13,70,73,74,78].includes(c.id))dec('어명',1);
  if(ch.includes('심유경')&&[39,113].includes(c.id))dec('외교',2);
  if(ch.includes('사명대사')&&c.id===41)dec('외교',1);
  if(ch.includes('이여송')&&c.id===28)dec('군량',2);
  if(S.flags.rD&&[24,27,28,88,72].includes(c.id)){const r=Object.keys(k)[0]||'외교';k[r]=(k[r]||0)+1;}
  if(worse){let best=null;for(const r in k)if(!best||k[r]>k[best])best=r; best=best||'군량'; k[best]=(k[best]||0)+1;}
  for(const r in k)if(!k[r])delete k[r]; return k;}
function canPay(S,k){return Object.keys(k).every(r=>S.res[r]-k[r]>=1);}
function bandOf(S){const g=S.trk.국운;return g<=4?0:g<=9?1:2;}
const BANDW=[[5,3,2],[4,3,3],[3,3,4]], MOODS=['위기','중립','반격'];
function poolAvail(D,S){return D.cards.filter(c=>c.pool&&c.act===S.act&&!S.drawn[c.id]&&!removedByRoute(S,c.id)&&(!c.route||S.flags['r'+c.route]));}
function drawOne(D,S,force){const av=poolAvail(D,S);if(!av.length)return null;
  let w=BANDW[bandOf(S)].slice(); if(S.trk.국운>=15)w[0]+=1;
  let mood=force;
  if(!mood){if(S.streak>=3)mood='반격';else{const tot=MOODS.reduce((a,m,i)=>a+(av.some(c=>c.mood===m)?w[i]:0),0);let r=rng(S)*tot;
    for(let i=0;i<3;i++){if(!av.some(c=>c.mood===MOODS[i]))continue;r-=w[i];if(r<0){mood=MOODS[i];break;}}}}
  let cand=av.filter(c=>c.mood===mood); if(!cand.length)cand=av;
  const c=cand[Math.floor(rng(S)*cand.length)]; S.drawn[c.id]=1;
  S.streak=c.mood==='위기'?S.streak+1:0; return c;}
function place(D,S,c){if(c.kind==='적'){S.enemy.push(c.id);return;}
  if(c.auto){autoResolve(D,S,c);return;}
  S.row.push({id:c.id,worse:0,ttl:c.kind==='풍문'?2:0,rev:false});}
function rollP(D,S,c,o){let P=o.p;
  if(P==='osaka'){const p=0.2+(S.flags.fixletter?0.45:0);P=[[p,{외교:1},'강화가 맺어졌다','r:B'],[1-p,{},'국서가 히데요시를 노하게 했다','f:jeong']];}
  if(P==='chil'){let f=0.85+(S.flags.hit98?0.2:0)-(S.flags.sok?0.2:0)-(S.flags.hun?0.1:0);f=Math.max(0.1,Math.min(0.95,f));P=[[1-f,{국운:1},'수군이 살아남았다'],[f,{국운:-2,인재:-1},'수군이 칠천량에서 무너졌다']];}
  if(P==='jinju1'){const p=S.chars.includes('김시민')?1:0.6;P=[[p,{국운:2},'진주성을 지켜 냈다'],[1-p,{국운:-1},'진주성이 크게 흔들렸다']];}
  if(P==='desert'){P=S.res.군량<4?[[0.5,{인재:-1},'군사들이 밤에 달아났다'],[0.5,{},'군사들이 남았다']]:[[1,{},'군량이 있어 군사들이 남았다']];}
  if(c.id===12){let p=0.3+(S.flags.jeseung?0.15:0)-(S.flags.disdain?0.1:0);P=[[p,P[0][1],P[0][2]],[1-p,P[1][1],P[1][2]]];}
  let r=rng(S),pick=P[P.length-1];for(const x of P){r-=x[0];if(r<0){pick=x;break;}}
  add(S,pick[1]); if(pick[3])fx(D,S,pick[3]); return {text:pick[2],p:pick[0]};}
function fx(D,S,f){if(f.startsWith('f:'))S.flags[f.slice(2)]=1;
  else if(f.startsWith('r:')){S.flags['r'+f.slice(2)]=1;S.route=f.slice(2);routeEnter(D,S,f.slice(2));}
  else if(f.startsWith('대비'))S.flags.daebi=(S.flags.daebi||0)+(+f.slice(2));
  else if(f.startsWith('탄핵'))add(S,{탄핵:+f.slice(2)});
  else if(f==='shield')S.shield++;}
function routeEnter(D,S,r){
  if(r==='B'){S.kise=Math.max(0,S.kise-3);add(S,{민심:-2});S.row=S.row.filter(x=>!removedByRoute(S,x.id));log(S,'강화가 맺어졌다. 그러나 화친을 비난하는 소리가 높다.');}
  if(r==='C'){S.row=S.row.filter(x=>!removedByRoute(S,x.id));log(S,'장수는 바다에 남았다. 임금의 눈길이 차가워졌다.');}
  if(r==='D')add(S,{외교:-1,군량:-1});if(r==='D')log(S,'조선의 포수들이 자라고 있다. 남의 군대에 덜 기대게 된다.');
  if(r==='E'){add(S,{어명:2});}if(r==='E')log(S,'남들이 비웃을 때 성을 쌓았다. 원망도 함께 쌓인다.');}
function recruit(S,c){(c.recruit||[]).forEach(n=>{if(!S.chars.includes(n)){S.chars.push(n);if(n==='양호')add(S,{국운:1});}});}
function chron(S,c,t){S.chron.push({id:c.id,act:S.act,t:t||''});}
function autoResolve(D,S,c){
  if(c.id===69){if(!S.done[6]){S.flags.disdain=1;log(S,'신립이 조총을 가볍게 여긴다.');}else log(S,'방어 방식을 고쳐 두었다.');}
  else if(c.id===123){if(S.flags.hwang&&S.done[5]&&S.done[8]&&!S.flags.rB){fx(D,S,'r:E');}else return;}
  else if(c.id===120){if(S.flags.hun&&S.flags.sok&&S.flags.jak&&!S.flags.rB&&!S.flags.rC){fx(D,S,'r:D');add(S,{인재:1});}else return;}
  else if(c.id===83){add(S,{탄핵:S.res.어명>=4?1:2});log(S,'개성에서 대신들이 줄줄이 파직되었다.');}
  else if(c.id===49){add(S,{기세:-2});log(S,'바다 건너에서 큰 소식이 왔다. 적이 흔들린다.');}
  else if(c.opts&&c.opts[0]&&c.opts[0].p){if(c.id===25&&!S.done[24])return;const r=rollP(D,S,c,c.opts[0]);log(S,c.name+': '+r.text+` (${Math.round(r.p*100)}%)`);}
  else if((c.fx||[]).includes('passive')){log(S,c.name);}
  S.done[c.id]=1; chron(S,c);}
function startRound(D,S){S.round++;S.news=[];S.freeze=Math.max(0,S.freeze-1);
  if(S.round>ROUNDS[S.act]){return endAct(D,S);}
  // 수입
  add(S,INCOME);
  if(S.chars.includes('곽재우')&&S.act===1)add(S,{민심:1});
  if(S.chars.includes('이여송'))add(S,{군량:-1});
  if(S.flags.hun)add(S,{인재:1}); if(S.flags.jak)add(S,{군량:1});
  if(S.flags.rC&&S.act===2)add(S,{어명:-1,탄핵:1});
  if(S.flags.rD&&S.act===2)add(S,{군량:-1,탄핵:S.round>=3?S.round%2:0});
  if(S.flags.rB&&S.act===2)add(S,{탄핵:1});
  if(S.flags.rE&&(S.act===0||S.act===1&&S.round<=2))add(S,{민심:-1});
  if(S.act===2&&S.round>=2)add(S,{탄핵:1});
  if(S.act===2&&S.kise>=5)add(S,{민심:-1});
  if(S.act===1&&S.round===1&&S.flags.h6)add(S,{국운:-2});
  // 일정 카드
  for(const id of (D.sched[S.act][S.round]||[])){const c=card(D,id);
    if(removedByRoute(S,id)||S.done[id])continue; if(c.route&&![113,117,120,123].includes(id)&&!S.flags['r'+c.route])continue;
    place(D,S,c);}
  // 가중 추첨
  let n=2+(S.act===2&&S.kise>=3?1:0)+(S.act===1&&S.round===1&&S.flags.h4?1:0);
  const got=[];for(let i=0;i<n;i++){const c=drawOne(D,S);if(c)got.push(c);}
  if(bandOf(S)===0&&!got.some(c=>c.mood==='반격')){const c=drawOne(D,S,'반격');if(c&&c.mood==='반격')got.push(c);}
  if(S.trk.국운<=2&&!S.bottom){S.bottom=true;const c=drawOne(D,S,'반격');if(c){got.push(c);log(S,'나라가 위태롭자 곳곳에서 사람들이 일어선다.');}}
  got.forEach(c=>place(D,S,c));
  checkOver(S); if(S.act===2&&S.round===5&&!S.over)S.flags.last=1; return S;}
function avail(D,S,x){const c=card(D,x.id);return reqOK(D,S,c);}
function resolve(D,S,idx,oi){const x=S.row[idx];const c=card(D,x.id);if(!avail(D,S,x))return {err:'아직 조건이 맞지 않아요'};
  const o=c.opts[oi||0];if(!o)return {err:'선택지 없음'};const k=costOf(D,S,c,o,x.worse);
  if(!canPay(S,k))return {err:'자원이 모자라요 (어떤 자원도 0이 되면 안 돼요)'};
  for(const r in k)S.res[r]-=k[r];
  let out={};
  if(c.kind==='풍문'){x.rev=true;S.stat.tamun++;let g=o.g;let t=c.truth;
    if(t==='50%'){t=rng(S)<0.5?'참':'거짓';g=t==='참'?{국운:1}:{민심:1};}
    if(c.id===64)g={인재:1};
    add(S,g);out.truth=t;}
  else {add(S,o.g);(o.fx||[]).forEach(f=>fx(D,S,f));(c.fx||[]).forEach(f=>f!=='passive'&&fx(D,S,f));
    if(o.p){out=rollP(D,S,c,o);}
    if(c.id===26||c.id===87)S.freeze=Math.max(S.freeze,1);
    if(c.id===47&&S.flags.hit100)add(S,{기세:-2});}
  recruit(S,c); if(c.id===24&&!S.chars.includes('이여송'))S.chars.push('이여송');
  S.done[c.id]=1;S.row.splice(idx,1);chron(S,c,(o.l||'')+(out.text?' — '+out.text:''));
  if(c.id===40&&!S.flags.rB){S.flags.osakaDone=1;add(S,{기세:3});log(S,'약속이 깨졌다. 적이 다시 바다를 건너온다.');}
  checkOver(S);return out;}
function enemyAct(D,S,id,block){const c=card(D,id);S.enemy=S.enemy.filter(e=>e!==id);
  if(block&&canPay(S,c.block)){for(const r in c.block)S.res[r]-=c.block[r];S.stat.block++;if(id===93)add(S,{기세:-1});chron(S,c,'막아냄');}
  else if(S.shield>0){S.shield--;chron(S,c,'호위가 막아냄');}
  else {let h={...c.hit};if(id===96&&S.done[31])h={};add(S,h);if(id===98)S.flags.hit98=1;if(id===100)S.flags.hit100=1;chron(S,c,'피해');}
  S.done[id]=1;checkOver(S);}
function vilStep(D,S){const before=S.kise;
  if(S.act===0){if(!S.roundDaebi)S.kise++;}
  else if(S.freeze>0){} else S.kise++;
  if(S.act===1&&S.unres>0)S.kise++;
  S.kmax=Math.max(S.kmax,S.kise);
  const cross=t=>before<t&&S.kise>=t;
  if(S.act===0){if(cross(2)&&!S.drawn[91]){S.drawn[91]=1;S.enemy.push(91);}if(cross(4))S.flags.h4=1;if(cross(6))S.flags.h6=1;if(cross(8))S.flags.h8=1;}
  if(S.act===1){if(cross(3))add(S,{국운:-1});if(cross(5))add(S,{국운:-1,민심:-1});if(cross(7))add(S,{국운:-3});if(S.kise>=8)add(S,{국운:-1});}
  if(S.act===2){if(cross(7))add(S,{국운:-2});if(cross(8))add(S,{국운:-4});}}
function endRound(D,S){if(S.enemy.length)return {need:'enemy'};
  S.unres=0;S.roundDaebi=['5','6','8','66'].some(i=>S.done[i]&&!S['_d'+i]&&(S['_d'+i]=1));
  const keep=[];
  for(const x of S.row){const c=card(D,x.id);
    if(c.kind==='풍문'){x.ttl--;if(x.ttl<=0){add(S,c.pen);S.done[c.id]=1;log(S,'소문이 퍼졌다: '+c.name);}else keep.push(x);continue;}
    if(c.kind==='대기'){keep.push(x);continue;}
    if(c.id===40){S.flags.osakaDone=1;add(S,{기세:3});S.done[40]=1;log(S,'약속이 깨졌다. 적이 다시 바다를 건너온다.');continue;}
    if(c.id===42){S.flags.yosira=1;S.done[42]=1;continue;}
    if((c.kind==='필수'||c.kind==='결과'||(c.kind==='루트'&&Object.keys(c.pen||{}).length))&&reqOK(D,S,c)){
      if(!x.worse){x.worse=1;keep.push(x);S.unres++;continue;}
      const p=Object.keys(c.pen||{}).length?c.pen:{민심:-1,국운:-1};add(S,p);S.unres++;S.done[c.id]=1;chron(S,c,'놓침');log(S,'놓친 일: '+c.name);continue;}
    if(c.id===40){S.flags.osakaDone=1;add(S,{기세:3});S.done[40]=1;log(S,'약속이 깨졌다. 적이 다시 바다를 건너온다.');continue;}
    if(c.id===42){S.flags.yosira=1;S.done[42]=1;continue;}
  }
  S.row=keep; vilStep(D,S);
  if(S.chars.includes('이항복')&&S.trk.탄핵>=6&&!S['hang'+S.act]){S['hang'+S.act]=1;add(S,{탄핵:-1});log(S,'이항복이 웃음으로 대간의 칼끝을 무디게 했다.');}
  checkOver(S); if(S.over)return {over:S.over};
  const pr=S.act;startRound(D,S);return {actEnd:S.act!==pr||S.phase!=='play'};}
function endAct(D,S){S.actlog.push({act:S.act,kise:S.kise,kmax:S.kmax});
  S.row=S.row.filter(x=>card(D,x.id).kind==='풍문'&&false);
  if(S.act===2){S.phase='bonus';return S;}
  const prevK=S.kise; S.act++;S.round=0;
  if(S.act===1){S.kise=Math.max(0,(S.flags.h8?3:1)-Math.floor((S.flags.daebi||0)/2));}
  else S.kise=1;
  S.kmax=S.kise;S.phase='act';startRound(D,S);S.phase='act';return S;}
function checkOver(S){if(S.over)return;for(const r of RES)if(S.res[r]<=0){S.over={type:'lose',act:S.act,round:S.round,why:{군량:'군량이 바닥나 군사와 백성이 굶주렸다.',인재:'나라를 맡길 사람이 남지 않았다.',외교:'도와줄 나라가 없다. 조선은 홀로 남았다.',어명:'임금의 신임을 잃고 벼슬을 빼앗겼다.'}[r]};return;}
  if(S.trk.민심<=0)S.over={type:'lose',why:'백성이 등을 돌렸다. 곳곳에서 민란이 일어났다.'};
  else if(S.trk.국운<=0)S.over={type:'lose',why:'종묘와 사직이 무너졌다.'};
  else if(S.trk.탄핵>=10)S.over={type:'lose',why:'탄핵 상소가 쌓여 파직되었다. 전쟁은 다른 이의 손에 넘어갔다.'};
  if(S.over){S.over.act=S.act;S.over.round=S.round;S.phase='over';}}
const BONUS=[{id:'write',n:'『징비록』을 쓴다',t:'지난 일을 적어 뒷날을 경계한다.'},{id:'teach',n:'후학을 기른다',t:'남은 인재가 점수가 된다.'},{id:'relief',n:'고향 백성을 돌본다',t:'남은 군량이 점수가 된다.'}];
function bonus(D,S,id){S.bonus=id;S.phase='end';const e=ending(D,S);S.over={type:'win',...e};return S.over;}
const ROUTE_NAME={A:'징비',B:'화의',C:'백의 없는 바다',D:'훈련도감의 나라',E:'선견'};
const ROUTE_LINE={A:'나는 같은 날 바다의 장수와 조정의 자리를 함께 잃었다.',B:'칼 대신 붓으로 나라를 지켰으나, 사람들은 나를 화친한 자라 불렀다.',
 C:'그를 옥에 보내지 않았기에, 칠천량의 바다는 끝내 붉어지지 않았다.',D:'남의 군사에 기대지 않고, 우리 포수로 성을 되찾았다.',E:'모두가 김성일을 믿을 때 나는 성을 쌓았다. 원망을 들었으나 부산은 버텼다.'};
function titles(D,S){const T=[],d=S.done,t=(c,n)=>c&&T.push(n);
  t(S.flags.hwang&&(S.flags.daebi||0)>=3,'선견지명');t(d[17],'한산의 학익진');t(d[46],'열세 척');t(S.flags.rB,'화의의 붓');t(S.flags.rC,'바다를 지킨 재상');
  t(S.flags.rD,'자강');t(S.flags.rE,'선견');t(S.route==='A','징비');t(S.trk.탄핵<=1,'탄핵 없는 재상');t(S.trk.민심>=12,'민심의 재상');t(S.trk.국운>=15,'국운 융성');
  t(S.stat.tamun>=4,'풍문 감별사');t(S.stat.block>=5,'철벽');t([70,73,74,78,82].every(i=>d[i]),'몽진의 버팀목');t(S.chars.includes('이항복')&&S.chars.includes('이덕형'),'오성과 한음');
  t([20,21,22].every(i=>d[i]),'의병의 벗');t(S.actlog[1]&&S.actlog[1].kise<=2,'고니시를 막다');t(S.actlog[2]&&S.actlog[2].kise<=2,'가토를 막다');t(S.trk.탄핵>=7,'파직의 재상');t(d[50],'노량의 별');
  return T;}
function yearOf(c){const m=(c.note||'').match(/(1[56]\d\d)/);return m?m[1]+'년':'';}
function ending(D,S){const T=titles(D,S);const sum=RES.reduce((a,r)=>a+S.res[r],0);
  let b=0;if(S.bonus==='write')b=4+(S.trk.탄핵>=7?2:0);if(S.bonus==='teach')b=Math.floor(S.res.인재/2)+1;if(S.bonus==='relief')b=Math.floor(S.res.군량/3)+1;
  const score=S.trk.민심+S.trk.국운+Math.floor(sum/2)+T.length*2+5-S.trk.탄핵+b;
  const grade=score>=80?'중흥':score>=66?'보전':score>=52?'신승':'참담';
  const lines=['지난 일을 징계하여 뒷근심을 삼가노라(予其懲而毖後患).',ROUTE_LINE[S.route]];
  const keyIds=new Set([1,2,3,10,12,13,17,23,28,31,35,39,40,46,50,51,60,66,67,68,70,71,73,74,75,78,82,72,113,117,119,122,125]);
  S.chron.filter(e=>keyIds.has(e.id)).slice(0,9).forEach(e=>{const c=card(D,e.id);lines.push(`${yearOf(c)} ${c.name}${e.t?' — '+e.t.replace(/^ — /,''):''}.`.trim());});
  lines.push(S.flags.rB?'바다의 장수는 칼을 거두고 고향의 바다를 지켰다.':S.done[50]?(S.flags.sunsin_dead?'장수는 노량의 바다에서 쓰러졌다.':'장수는 노량에서 살아 돌아왔다.'):'');
  lines.push(S.trk.탄핵>=7?'전쟁이 끝나 갈 무렵 나는 탄핵을 받고 하회로 돌아왔다.':'나는 끝까지 자리를 지켰고, 늙어 하회로 돌아왔다.');
  return {score,grade,titles:T,lines:lines.filter(Boolean),route:S.route,routeName:ROUTE_NAME[S.route]};}
const API={setIncome:x=>INCOME=x,RES,TRK,ROUNDS,ACTN,VIL,CHARS,CHAR_TIP,FAC_TIP,BONUS,ROUTE_NAME,prep,newGame,startRound,resolve,enemyAct,endRound,bonus,costOf,canPay,avail,reqOK,bandOf,card,rng,ending,titles,BANDW};
if(typeof module!=='undefined')module.exports=API;else root.YSR=API;
})(this);
