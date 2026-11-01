/* ============================================================
   taskbar.js — Taskbar: pins, saa, skrini nzima, Action Center (kalenda/quick settings), Show Desktop
   (Inapakiwa kama script ya kawaida; inashiriki global scope na moduli nyingine.
    Mpangilio wa kupakia umo ndani ya index.html — usiubadilishe.)
   ============================================================ */

/* ---------- Pins za awali ---------- */
[0,5,6,7,8].forEach(k=>{const b=E('button','',DI[k][0]);b.title=DI[k][1];b.onclick=DI[k][2];$('#pins').append(b)});

/* ---------- Saa (tick) ---------- */
const tick=()=>{const n=new Date();$('#clk').innerHTML=n.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})+'<br>'+n.toLocaleDateString();$('#lt').textContent=n.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});$('#ld').textContent=n.toLocaleDateString('sw-TZ',{weekday:'long',day:'numeric',month:'long'})};tick();setInterval(tick,1000);

/* ---------- drawPins + menyu ya madirisha ya taskbar ---------- */
/* ----- Taskbar pins na Start ----- */
function drawPins(){const P=$('#pins');P.innerHTML='';V.pin.forEach((p,i)=>{let ic,ti,fn;if(p.t==='d'){const d=DI[p.k];if(!d)return;ic=d[0];ti=d[1];fn=d[2]}else{ic=fi(p.o[1]);ti=p.n;fn=()=>openE({n:p.n,o:p.o})}
 const b=E('button','',ic);b.title=ti;b.onclick=fn;lp(b,(x,y)=>menu(x,y,[['Fungua',fn],['📌 Ondoa kwenye Taskbar',()=>{V.pin.splice(i,1);persist()}]]));P.append(b)})}
lp($('#tasks'),(x,y,e)=>{const b=e.target.closest&&e.target.closest('button');const w=b&&wins.find(o=>o.tk===b);if(w)menu(x,y,[['Fungua',()=>w.foc()],['✕ Funga dirisha',()=>w.close()]])});

/* ---------- Skrini nzima, pin ya Software Store, refresh() ya kwanza ---------- */
/* ----- SKRINI NZIMA ----- */
const fsOn=()=>document.fullscreenElement||document.webkitFullscreenElement;
function toggleFS(){const d=document.documentElement;try{if(fsOn()){localStorage.setItem('sade_fs','0');(document.exitFullscreen||document.webkitExitFullscreen).call(document)}else{localStorage.setItem('sade_fs','1');const p=(d.requestFullscreen||d.webkitRequestFullscreen).call(d);p&&p.catch&&p.catch(()=>{})}}catch(e){}}
$('#fsb').onclick=e=>{e.stopPropagation();toggleFS()};
const fsUp=()=>{$('#fsb').textContent=fsOn()?'🗗':'⛶';$('#fsb').title=fsOn()?'Toka skrini nzima':'Skrini nzima'};
['fullscreenchange','webkitfullscreenchange'].forEach(ev=>document.addEventListener(ev,fsUp));
const fsAuto=()=>{removeEventListener('pointerdown',fsAuto,true);removeEventListener('keydown',fsAuto,true);if(localStorage.getItem('sade_fs')!=='0'&&!fsOn()){try{const d=document.documentElement,p=(d.requestFullscreen||d.webkitRequestFullscreen).call(d);p&&p.catch&&p.catch(()=>{})}catch(e){}}};
addEventListener('pointerdown',fsAuto,true);addEventListener('keydown',fsAuto,true);
{const k=DI.findIndex(d=>d[1]==='Software Store');if(k>=0&&!V.stp){V.stp=1;if(!V.pin.some(p=>p.t==='d'&&p.k===k))V.pin.splice(Math.min(4,V.pin.length),0,{t:'d',k});try{localStorage.setItem(VK,JSON.stringify(V))}catch(_){}}}
refresh();

/* ---------- Action Center + Show Desktop ---------- */
/* ----- Action Center: quick settings + kalenda ----- */
const QP=E('div');QP.id='qp';document.body.append(QP);let cal=new Date();
const TL=[['📶','Wi-Fi','wifi'],['🔵','Bluetooth','bt'],['✈️','Airplane mode','air'],['🌙','Night light','nl'],['🌓','Dark mode','dark'],['🌿','Battery saver','bs']];
function drawQ(){QP.innerHTML='';const g=E('div','qg');TL.forEach(([i,n,k])=>{const t=E('div','qt'+(Sx[k]?' on':''),'<b>'+i+'</b><span>'+n+'</span>');t.onclick=()=>{Sx[k]=Sx[k]?0:1;if(k==='air'&&Sx.air)Sx.wifi=Sx.bt=0;if((k==='wifi'||k==='bt')&&Sx[k])Sx.air=0;sv();applyS();drawQ()};g.append(t)});QP.append(g);
 const sl=(ic,k,min)=>{const r=E('div','qs','<span>'+ic+'</span>'),i=E('input');i.type='range';i.min=min;i.max=100;i.value=Sx[k];i.oninput=()=>{Sx[k]=+i.value;sv();applyS()};r.append(i);QP.append(r)};sl('☀️','br',20);sl('🔊','vol',0);
 const y=cal.getFullYear(),m=cal.getMonth(),h=E('div','ch','<b>'+cal.toLocaleDateString('sw-TZ',{month:'long',year:'numeric'})+'</b>'),pv=E('button','','▲'),nx=E('button','','▼');pv.onclick=()=>{cal=new Date(y,m-1,1);drawQ()};nx.onclick=()=>{cal=new Date(y,m+1,1);drawQ()};h.append(pv,nx);QP.append(h);
 const cg=E('div','cg');for(let i=0;i<7;i++)cg.append(E('span','dh',new Date(2023,0,1+i).toLocaleDateString('sw-TZ',{weekday:'short'}).slice(0,3)));
 const f=new Date(y,m,1).getDay(),n=new Date(y,m+1,0).getDate(),T=new Date();for(let i=0;i<f;i++)cg.append(E('span'));
 for(let d=1;d<=n;d++)cg.append(E('span',y===T.getFullYear()&&m===T.getMonth()&&d===T.getDate()?'td':'',d));QP.append(cg)}
function togQ(e){e&&e.stopPropagation();if(QP.style.display==='block'){QP.style.display='none';return}M.style.display='none';cal=new Date();drawQ();QP.style.display='block'}
document.addEventListener('pointerdown',e=>{if(QP.style.display==='block'&&!QP.contains(e.target)&&!e.target.closest('#clk,#tray .tr'))QP.style.display='none'},true);
$('#clk').onclick=togQ;document.querySelectorAll('#tray .tr').forEach(x=>x.onclick=togQ);
const sd2=E('i');sd2.id='sd2';sd2.title='Onyesha Desktop';$('#tb').append(sd2);
sd2.onclick=()=>{const a=wins.some(w=>w.el.style.display!=='none');wins.forEach(w=>{w.el.style.display=a?'none':'flex';w.tk.classList.toggle('on',!a)})};
