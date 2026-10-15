const Y=window.YSR, D=Y.prep(window.DATA); let S=null; window.D=D;
const $=s=>document.querySelector(s), app=()=>$('#app');
const GL={통신사:'일본에 보낸 외교 사절',몽진:'임금이 난리를 피해 도성을 떠남',분조:'조정을 둘로 나눔',의병:'백성이 스스로 일으킨 군대',승병:'스님들이 일으킨 군대',
 원병:'도우러 온 다른 나라 군대',강화:'싸움을 멈추자는 약속',책봉:'왕으로 인정해 주는 일',탄핵:'벼슬아치의 잘못을 따져 물러나게 함',어명:'임금의 명령과 허락',
 도승지:'임금의 비서실장',판서:'오늘날의 장관',영의정:'가장 높은 신하',호종:'임금을 모시고 따라감',내금위:'임금을 지키는 군대',접반:'손님 장수를 맞아 돌봄',
 훈련도감:'군사를 훈련하는 관청',속오군:'지방에서 모은 군대',작미법:'세금을 쌀로 내게 한 법',수라:'임금의 밥',장예원:'노비 문서를 맡은 관청',
 정명가도:'명을 치러 가니 길을 빌려 달라는 요구',항왜:'조선에 항복한 일본 군사',백의종군:'벼슬 없이 군대를 따라 싸움',무고:'없는 죄를 꾸며 고발함',
 변무사:'누명을 벗기러 보내는 사신',대간:'관리를 감시하는 벼슬',천거:'사람을 추천함',내부:'다른 나라에 들어가 의지함',제승방략:'적이 오면 장수를 내려보내는 방어 방식',
 근왕군:'임금을 도우러 모인 군대',국서:'나라끼리 주고받는 편지',참요:'앞일을 말한다는 노래',기세:'적의 힘이 오른 정도',국운:'나라의 운명',민심:'백성의 마음'};
const TIP={군량:'쌀과 먹을 것. 군사와 백성을 먹여요. 0이 되면 패배.',인재:'일을 맡길 사람들. 0이 되면 패배.',외교:'다른 나라와 이야기하는 힘. 0이 되면 패배.',
 어명:'임금의 믿음과 허락. 큰일에 필요해요. 0이 되면 패배.',민심:'백성의 마음. 0이 되면 민란으로 패배.',국운:'나라의 운. 0이 되면 패배. 낮으면 위기가, 높으면 반격 기회가 자주 와요.',
 탄핵:'나를 쫓아내자는 목소리. 10이 되면 파직(패배). 큰 공을 세워도 올라가요.'};
const THREAT={91:'대마도의 배들이 바다를 메운다.',92:'남쪽 고갯길에 적의 깃발이 보인다.',93:'용인 들판에 적이 숨어 있다는 소문.',94:'황해도 고을마다 불길이 오른다.',
 95:'남쪽 바다에서 적선이 끝없이 몰려온다.',96:'적의 대군이 산성으로 향한다.',97:'적이 명군의 길목에 숨었다.',98:'적의 수군이 밤바다에 흩어졌다.',99:'남원 쪽 하늘이 붉다.',
 100:'적이 북쪽 길을 따라 올라온다.',101:'남해안 성에서 함성이 터진다.',102:'적의 구원 함대가 바닷길을 연다.'};
const KIND_TIP={필수:'꼭 처리해야 하는 일. 미루면 한 번 더 나오고, 또 놓치면 손해예요.',선택:'안 해도 손해는 없어요. 하면 조금 더 좋아요.',대기:'조건이 맞으면 열려요.',
 풍문:'참인지 거짓인지 몰라요. 탐문하면 밝혀져요. 두면 소문이 퍼져요.',결과:'결과가 확률로 정해져요.',분기:'고르는 길에 따라 앞날이 달라져요.',루트:'내가 고른 길에서만 나오는 일이에요.',적:'적의 공격이에요.'};
const MARK_TIP={실제:'실제 역사 기록에 있는 일.',징비록:'유성룡이 쓴 『징비록』에 실린 장면.',야사:'전해 오는 이야기. 사실인지 확실하지 않아요.',가상:'그럴듯하게 만든 이야기.'};
function terms(text,cid){let t=text;for(const k in GL){if(!t.includes(k))continue;
  if(!S.seen[k])S.seen[k]=cid;
  if(S.seen[k]===cid){t=t.replace(k,`<u class=tm data-t="${k}">${k}</u>(${GL[k]})`);} else t=t.replace(k,`<u class=tm data-t="${k}">${k}</u>`);}
  return t;}
let tipT;function tip(html,ev){const b=$('#tip');b.innerHTML=html;b.style.display='block';clearTimeout(tipT);tipT=setTimeout(()=>b.style.display='none',4000);}
document.addEventListener('click',e=>{const t=e.target.closest('[data-tip],.tm');if(t){e.stopPropagation();tip(t.dataset.tip||(`<b>${t.dataset.t}</b>: ${GL[t.dataset.t]}`));} else $('#tip').style.display='none';},true);
const fmt=g=>Object.entries(g||{}).filter(([k,v])=>v).map(([k,v])=>`${k}${v>0?'+':''}${v}`).join(' ');
const costS=k=>Object.entries(k).map(([r,v])=>`${r[0]}${v}`).join(' ')||'무료';
let AC;function sfx(f){try{const a=AC||(AC=new (window.AudioContext||window.webkitAudioContext)());const o=a.createOscillator(),g=a.createGain();o.frequency.value=f;g.gain.value=.05;o.connect(g);g.connect(a.destination);o.start();g.gain.exponentialRampToValueAtTime(.0001,a.currentTime+.3);o.stop(a.currentTime+.3);}catch(e){}}
function save(slot){localStorage.setItem('ysr_save_'+slot,JSON.stringify({S,t:Date.now()}));}
function load(slot){const x=JSON.parse(localStorage.getItem('ysr_save_'+slot)||'null');if(x){S=x.S;window.S=S;render();}}
function auto(){if(S&&!S.over)localStorage.setItem('ysr_auto',JSON.stringify({S,t:Date.now()}));}
function title(){app().innerHTML=`<div class=title>${INK}<h1>전시재상<br><b>유성룡</b></h1><p class=sub>왕이 아닌 재상으로, 7년 전쟁을 버텨라.</p>
 <button id=bNew>새 게임</button>${localStorage.ysr_auto?'<button id=bCont>이어하기</button>':''}<button id=bLoad>불러오기</button>
 <button id=bDex>칭호 도감</button><button id=bRec>기록</button><button id=bHelp>도움말</button></div>`;
 $('#bNew').onclick=()=>startNew();if($('#bCont'))$('#bCont').onclick=()=>{S=JSON.parse(localStorage.ysr_auto).S;window.S=S;render();};
 $('#bLoad').onclick=()=>slots(false);$('#bDex').onclick=dex;$('#bRec').onclick=records;$('#bHelp').onclick=()=>tutorial(true);}
function startNew(seed){S=Y.newGame(D,seed);window.S=S;S.phase='act';render();if(!localStorage.ysr_tut)tutorial();}
window.startNew=startNew;
const TUT=['당신은 재상 유성룡이에요. 왕이 아니라서, 큰일엔 <b>어명</b>(임금의 허락)이 필요해요.','위쪽의 <b>군량·인재·외교·어명</b> 중 하나라도 0이 되면 져요. 민심·국운이 0이 되거나 탄핵이 10이 되어도 져요.',
 '카드를 눌러 자원을 내고 일을 처리하세요. <b>필수</b>는 꼭, <b>선택</b>은 하고 싶을 때만. <b>풍문</b>은 탐문으로 참·거짓을 가려요.','다 했으면 <b>회의 마침</b>. 적이 끼어들고, 적장의 <b>기세</b>가 올라요. 정해진 길은 없어요. 나만의 길로 살아남으세요!'];
function tutorial(force){let i=0;const show=()=>{modal(`<div class=tut><p>${TUT[i]}</p><div class=row2><button id=tSkip>건너뛰기</button><button id=tNext>${i<3?'다음':'시작'}</button></div><small>${i+1}/4</small></div>`);
 $('#tNext').onclick=()=>{if(++i<4)show();else{closeM();localStorage.ysr_tut=1;if(S)render();}};$('#tSkip').onclick=()=>{closeM();localStorage.ysr_tut=1;if(S)render();};};show();}
function modal(h){$('#mod').innerHTML=`<div class=mbox>${h}</div>`;$('#mod').style.display='flex';}
function closeM(){$('#mod').style.display='none';$('#mod').innerHTML='';}
const ACT_INTRO=['1590년. 일본에 갔던 사신들이 돌아온다. 바다 건너의 속셈을 읽어라.','1592년 봄. 남쪽 바다에 수많은 배가 나타났다.','평양의 싸움이 끝났다. 그러나 전쟁은 아직 끝나지 않았다.'];
function render(){if(!S){title();return;}auto();window.S=S;
 if(S.over&&S.over.type)return endScreen();
 if(S.phase==='bonus')return bonusScr();
 const v=Y.VIL[S.act],band=['위태','버팀','회복'][Y.bandOf(S)];
 const hint=v.h[S.kise>=6?2:S.kise>=3?1:0];
 const fac={조정:[],장수:[],의병:[],명:[]};S.chars.forEach(c=>fac[Y.CHARS[c]].push(c));
 app().innerHTML=`${INKBG}<header><div class=top><span class=act>${Y.ACTN[S.act]} · ${S.round}/${Y.ROUNDS[S.act]}</span><button id=bMenu class=sm>≡</button></div>
 <div class=res>${Y.RES.map(r=>`<span class=chip data-tip="${TIP[r]}">${r}<b>${S.res[r]}</b></span>`).join('')}</div>
 <div class=res>${['민심','국운'].map(r=>`<span class="chip trk" data-tip="${TIP[r]}">${r}<b>${S.trk[r]}</b></span>`).join('')}
 <span class="chip tan" data-tip="${TIP.탄핵}">탄핵<i class=bar><i style="width:${S.trk.탄핵*10}%"></i></i><b>${S.trk.탄핵}/10</b></span></div>
 <div class=vil data-tip="<b>${v.n}</b> · 기세 ${S.kise}/8<br>${hint}">${SEAL}<span>${v.n}</span><i class="bar kb"><i style="width:${Math.min(100,S.kise*12.5)}%"></i></i><b>${S.kise}</b></div>
 <div class=fac>${Object.keys(fac).map(f=>`<span class=fc data-tip="${Y.FAC_TIP[f]}"><em>${f}</em>${fac[f].map(c=>`<i data-tip="<b>${c}</b>: ${Y.CHAR_TIP[c]}">${c}</i>`).join('')||'<i class=no>-</i>'}</span>`).join('')}</div></header>
 ${S.news.length?`<div class=news>${S.news.map(n=>`<p>${terms(n,'news')}</p>`).join('')}</div>`:''}
 <div id=row>${S.row.map((x,i)=>tile(x,i)).join('')||'<p class=empty>이번 회의에 올라온 일이 없다.</p>'}</div>
 ${S.enemy.length?`<p class=warn>적의 움직임이 느껴진다… (${S.enemy.length})</p>`:''}
 <footer><button id=bTam>정세 탐문</button><button id=bEnd class=pri>회의 마침</button></footer>`;
 document.querySelectorAll('.card').forEach(el=>el.onclick=e=>{if(e.target.closest('[data-tip]'))return;openCard(+el.dataset.i);});
 $('#bEnd').onclick=endRoundUI;$('#bTam').onclick=tamun;$('#bMenu').onclick=menu;
 if(S.phase==='act'){modal(`<div class=actm><h2>${Y.ACTN[S.act]}</h2><p>${ACT_INTRO[S.act]}</p><p class=vn>${SEAL} 적장: ${v.n}</p><button id=actOK class=pri>시작</button></div>`);$('#actOK').onclick=()=>{S.phase='play';closeM();render();};}}
function tile(x,i){const c=Y.card(D,x.id);const ok=Y.avail(D,S,x);const o=c.opts[0];
 const cost=o?costS(Y.costOf(D,S,c,o,x.worse)):'';
 return `<div class="card k-${c.kind}${ok?'':' lock'}${x.worse?' worse':''}" data-i=${i}><div class=tg><span class=kd data-tip="${KIND_TIP[c.kind]||''}">${c.kind}</span><span class="mk m-${c.mark}" data-tip="${MARK_TIP[c.mark]}">${c.mark}</span>${x.worse?'<span class=wr data-tip="한 번 미뤘어요. 비용이 1 늘었고, 또 놓치면 손해예요.">악화</span>':''}${c.kind==='풍문'?`<span class=tt>${x.rev?'':'참? 거짓?'}</span>`:''}</div>
 <h3>${c.name}</h3><p class=cs>${ok?cost:'조건: '+reqText(c)}</p></div>`;}
function reqText(c){return (c.req||[]).map(r=>r.startsWith('ch:')?r.slice(3)+' 필요':r.startsWith('c')?'「'+Y.card(D,+r.slice(1)).name+'」 먼저':'앞일이 먼저').join(', ');}
function openCard(i){const x=S.row[i],c=Y.card(D,x.id),ok=Y.avail(D,S,x);
 const opts=c.opts.map((o,oi)=>{const k=Y.costOf(D,S,c,o,x.worse);const can=ok&&Y.canPay(S,k);
  let pr='';if(Array.isArray(o.p))pr=o.p.map(p=>`${Math.round(p[0]*100)}% ${fmt(p[1])||'변화 없음'}`).join(' / ');
  if(o.p==='chil')pr='패배 확률은 수군의 준비에 따라 달라요';if(o.p==='osaka')pr='성공 확률 '+Math.round((0.2+(S.flags.fixletter?0.45:0))*100)+'%';if(o.p==='jinju1')pr='성공 '+(S.chars.includes('김시민')?100:60)+'%';
  return `<button class="opt${can?'':' dis'}" data-o=${oi} ${can?'':'disabled'}><b>${c.kind==='풍문'?'탐문한다':o.l||'처리한다'}</b><span>${costS(k)} → ${c.kind==='풍문'?'참·거짓을 밝힌다':fmt(o.g)||''}</span>${pr?`<small>${pr}</small>`:''}</button>`;}).join('');
 const pen=Object.keys(c.pen||{}).length?`<p class=pn>${c.kind==='풍문'?'두면':'놓치면'}: ${fmt(c.pen)}</p>`:(c.kind==='필수'?'<p class=pn>놓치면: 민심-1 국운-1</p>':'');
 modal(`<div class=cd><div class=tg><span class=kd data-tip="${KIND_TIP[c.kind]||''}">${c.kind}</span><span class="mk m-${c.mark}" data-tip="${MARK_TIP[c.mark]}">${c.mark}</span></div><h2>${c.name}</h2>
 <p class=note>${terms(c.note,c.id)}</p>${c.easy?`<button class="sm bg" data-tip="${c.easy}">쉽게 보기</button>`:''}
 ${c.kind==='풍문'&&x.rev?'':''}${opts}${pen}<button id=cX class=sm>닫기</button></div>`);
 document.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{const r=Y.resolve(D,S,i,+b.dataset.o);if(r.err){tip(r.err);return;}sfx(520);
  let msg=r.truth?`소문은 <b>${r.truth}</b>이었다.`:r.text?`${r.text} <small>(${Math.round(r.p*100)}%)</small>`:'';closeM();render();if(msg)tip(msg);});
 $('#cX').onclick=closeM;}
function tamun(){if(S.res.인재<=1){tip('인재가 모자라요.');return;}S.res.인재--;const w=Y.BANDW[Y.bandOf(S)];
 tip(`국운 구간: <b>${['위태','버팀','회복'][Y.bandOf(S)]}</b> · 위기 ${w[0]} : 중립 ${w[1]} : 반격 ${w[2]}<br>다가오는 적의 움직임: ${S.enemy.length}건 · 적장 기세 ${S.kise}/8`);render();}
function endRoundUI(){if(S.enemy.length){const id=S.enemy[0],c=Y.card(D,id);const can=Y.canPay(S,c.block);sfx(180);
  modal(`<div class=en>${SEAL}<p class=th>“${THREAT[id]||'적이 움직인다.'}”<small> — 적진의 소문(가상)</small></p><h2>${c.name}</h2><p class=note>${terms(c.note,c.id)}</p>
  <button id=eB class="opt${can?'':' dis'}" ${can?'':'disabled'}><b>막는다</b><span>${costS(c.block)}</span></button><button id=eH class=opt><b>견딘다</b><span>${fmt(c.hit)||'피해 없음'}${S.shield?' (호위가 막아 줌)':''}</span></button></div>`);
  $('#eB').onclick=()=>{Y.enemyAct(D,S,id,true);closeM();S.over?render():endRoundUI();};$('#eH').onclick=()=>{Y.enemyAct(D,S,id,false);closeM();S.over?render():endRoundUI();};return;}
 const r=Y.endRound(D,S);sfx(330);render();}
function menu(){modal(`<div class=mn><h2>메뉴</h2><button id=mS>저장</button><button id=mL>불러오기</button><button id=mT>도움말</button><button id=mQ>표지로</button><button id=mX class=sm>닫기</button></div>`);
 $('#mS').onclick=()=>slots(true);$('#mL').onclick=()=>slots(false);$('#mT').onclick=()=>tutorial(true);$('#mQ').onclick=()=>{closeM();S=null;title();};$('#mX').onclick=closeM;}
function slots(isSave){let h='';for(let i=1;i<=5;i++){const x=JSON.parse(localStorage.getItem('ysr_save_'+i)||'null');
  h+=`<button class=slot data-s=${i}>${i}. ${x?`${Y.ACTN[x.S.act].split(' ')[0]} ${x.S.round}R · ${new Date(x.t).toLocaleString('ko-KR',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'})}`:'빈 칸'}</button>`;}
 modal(`<div class=mn><h2>${isSave?'저장':'불러오기'} (5칸)</h2>${h}<button id=sX class=sm>닫기</button></div>`);
 document.querySelectorAll('.slot').forEach(b=>b.onclick=()=>{const s=b.dataset.s;if(isSave){save(s);tip('저장했어요.');closeM();}else{if(localStorage.getItem('ysr_save_'+s)){closeM();load(s);}}});$('#sX').onclick=closeM;}
function bonusScr(){app().innerHTML=`${INKBG}<div class=bonus><h2>하회에서</h2><p>전쟁이 끝났다. 남은 날을 어디에 쓸까.</p>${Y.BONUS.map(b=>`<button class=opt data-b=${b.id}><b>${b.n}</b><span>${b.t}</span></button>`).join('')}</div>`;
 document.querySelectorAll('[data-b]').forEach(b=>b.onclick=()=>{Y.bonus(D,S,b.dataset.b);record();render();});}
const ALLT=['선견지명','한산의 학익진','열세 척','화의의 붓','바다를 지킨 재상','자강','선견','징비','탄핵 없는 재상','민심의 재상','국운 융성','풍문 감별사','철벽','몽진의 버팀목','오성과 한음','의병의 벗','고니시를 막다','가토를 막다','파직의 재상','노량의 별'];
function record(){const R=JSON.parse(localStorage.ysr_records||'{"win":[],"lose":[]}');const o=S.over;
 if(o.type==='win'){R.win.push({s:o.score,g:o.grade,r:o.routeName,t:Date.now(),ti:o.titles[0]||''});R.win.sort((a,b)=>b.s-a.s);R.win=R.win.slice(0,20);
  const T=new Set(JSON.parse(localStorage.ysr_titles||'[]'));o.titles.forEach(t=>T.add(t));localStorage.ysr_titles=JSON.stringify([...T]);
  o.rank=R.win.findIndex(x=>x.t===R.win.find(y=>y.s===o.score).t)+1;}
 else {R.lose.unshift({w:o.why,a:o.act,r:o.round,t:Date.now()});R.lose=R.lose.slice(0,20);}
 localStorage.ysr_records=JSON.stringify(R);localStorage.removeItem('ysr_auto');S.recorded=1;}
function endScreen(){const o=S.over;if(!S.recorded)record();
 if(o.type==='lose'){app().innerHTML=`${INKBG}<div class=end><h2>패배</h2><p>${o.why}</p><p class=sub>${Y.ACTN[o.act]} ${o.round}라운드</p><button id=bT>표지로</button><button id=bN class=pri>다시 하기</button></div>`;}
 else app().innerHTML=`${INKBG}<div class=end><div class=scroll><h2>『징비록』</h2>${o.lines.map(l=>`<p>${l}</p>`).join('')}</div>
 <p class=grade>${o.routeName} · <b>${o.grade}</b> · ${o.score}점 ${o.rank===1?'· 신기록':o.rank?'· 역대 '+o.rank+'위':''}</p><p class=tl>${o.titles.map(t=>`<span class=chip>${t}</span>`).join('')}</p>
 <p class=sub>결말 문장과 루트 이야기는 게임을 위해 지은 것이에요.</p><button id=bT>표지로</button><button id=bN class=pri>다시 하기</button></div>`;
 $('#bT').onclick=()=>{S=null;title();};$('#bN').onclick=()=>startNew();}
function dex(){const T=new Set(JSON.parse(localStorage.ysr_titles||'[]'));modal(`<div class=mn><h2>칭호 도감 ${T.size}/${ALLT.length}</h2><div class=dex>${ALLT.map(t=>`<span class="chip${T.has(t)?'':' no'}">${T.has(t)?t:'？'}</span>`).join('')}</div><button id=dX class=sm>닫기</button></div>`);$('#dX').onclick=closeM;}
function records(){const R=JSON.parse(localStorage.ysr_records||'{"win":[],"lose":[]}');modal(`<div class=mn><h2>기록</h2><h4>완주</h4>${R.win.map((x,i)=>`<p>${i+1}. ${x.s}점 ${x.g} · ${x.r}</p>`).join('')||'<p>-</p>'}<h4>패배</h4>${R.lose.slice(0,5).map(x=>`<p>${Y.ACTN[x.a].split(' ')[0]} ${x.r}R · ${x.w.slice(0,18)}…</p>`).join('')||'<p>-</p>'}<button id=rX class=sm>닫기</button></div>`);$('#rX').onclick=closeM;}
const SEAL='<svg class=seal viewBox="0 0 20 20"><rect x="2" y="2" width="16" height="16" rx="2" fill="#a8322a"/><path d="M6 6h8M10 6v8M6 14h8" stroke="#f3ead8" stroke-width="1.6"/></svg>';
const INKD=`<defs><filter id=ink><feTurbulence type="fractalNoise" baseFrequency=".02" numOctaves="3" seed="4"/><feDisplacementMap in="SourceGraphic" scale="14"/><feGaussianBlur stdDeviation="1.2"/></filter></defs>`;
const INKBG=`<svg class=inkbg viewBox="0 0 390 300" preserveAspectRatio="xMidYMax slice">${INKD}<g filter="url(#ink)"><path d="M0 230 Q60 150 110 210 T220 190 T320 150 T390 200 V300 H0Z" fill="#2b2a28" opacity=".10"/><path d="M0 260 Q80 200 150 250 T300 230 T390 250 V300 H0Z" fill="#2b2a28" opacity=".16"/></g></svg>`;
const INK=`<svg class=inkt viewBox="0 0 390 420">${INKD}<g filter="url(#ink)"><circle cx="290" cy="90" r="38" fill="#a8322a" opacity=".75"/><path d="M0 330 Q70 190 140 290 Q190 200 250 280 Q310 170 390 260 V420 H0Z" fill="#2b2a28" opacity=".55"/><path d="M0 370 Q90 300 180 360 T390 340 V420 H0Z" fill="#2b2a28" opacity=".8"/><path d="M40 380 h60 l-10 10 h-40z M60 380 v-30" stroke="#2b2a28" stroke-width="2" fill="#2b2a28" opacity=".7"/></g></svg>`;
window.addEventListener('load',()=>{const x=localStorage.ysr_auto;title();});
