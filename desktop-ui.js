/* ============================================================
   desktop-ui.js — Desktop: icons, menyu ya kubofya kulia, kuburuta (drag & drop), drawDesk
   (Inapakiwa kama script ya kawaida; inashiriki global scope na moduli nyingine.
    Mpangilio wa kupakia umo ndani ya index.html — usiubadilishe.)
   ============================================================ */

/* ---------- TAP + ishara ya mguso ---------- */
const TAP=matchMedia('(pointer:coarse)').matches;
document.addEventListener('click',e=>{if(!TAP)return;const t=e.target.closest('.it,.ic');if(t&&t.ondblclick)t.ondblclick(e)});

/* ---------- Icons za awali za desktop ---------- */
DI.filter(x=>!x[3]).forEach(([i,n,f])=>{const d=E('div','ic','<b>'+i+'</b>'+n);d.ondblclick=f;d.onclick=()=>{document.querySelectorAll('.ic').forEach(x=>x.classList.remove('s'));d.classList.add('s')};$('#desk').append(d)});

/* ---------- Menyu ya kubofya kulia (menu, lp, fileMenu, drag, drop) ---------- */
/* ----- menyu ya kubofya kulia / kubonyeza muda mrefu ----- */
const CM=E('div');CM.id='cm';document.body.append(CM);
function menu(x,y,items){CM.innerHTML='';items.forEach(it=>{if(!it){CM.append(E('hr'));return}const d=E('div',it[2]?'off':'',it[0]);if(!it[2])d.onclick=ev=>{ev.stopPropagation();CM.style.display='none';it[1]()};CM.append(d)});CM.style.display='block';const r=CM.getBoundingClientRect();CM.style.left=Math.max(4,Math.min(x,innerWidth-r.width-4))+'px';CM.style.top=Math.max(4,Math.min(y,innerHeight-r.height-4))+'px'}
document.addEventListener('pointerdown',e=>{if(!CM.contains(e.target))CM.style.display='none'},true);
function lp(el,fn){el.addEventListener('contextmenu',e=>{e.preventDefault();e.stopPropagation();lpT=Date.now();fn(e.clientX,e.clientY,e)});
 let t,sx,sy;el.addEventListener('touchstart',e=>{const p=e.touches[0];sx=p.clientX;sy=p.clientY;clearTimeout(t);t=setTimeout(()=>{lpT=Date.now();fn(sx,sy,e)},520)},{passive:true});
 ['touchmove','touchend','touchcancel'].forEach(k=>el.addEventListener(k,e=>{if(k==='touchmove'){const p=e.touches[0];if(Math.hypot(p.clientX-sx,p.clientY-sy)<10)return}clearTimeout(t)},{passive:true}))}
function fileMenu(x,y,fo,names){const it=names.map(n=>[fo,n]),one=names.length===1,bin=fo===BIN,M=[];
 if(!bin)M.push(['Fungua',()=>names.forEach(n=>openE(get(fo,n)))],null);
 if(bin)M.push(['Rejesha (Restore)',()=>restore(it)],null);
 M.push(['⬇️ Hifadhi kwenye Kompyuta',()=>saveOut(it)],['✂️ Kata (Cut)',()=>cp(it,1)],['⧉ Nakili (Copy)',()=>cp(it,0),bin],['✏️ Badili jina',()=>ren(...it[0]),!one||bin],['🗑️ Futa',()=>del(it)]);
 if(!bin){M.push(null,['⬆️ Weka mbele',()=>setFr(it.map(a=>FK(...a)),1)],['↧ Toa mbele',()=>setFr(it.map(a=>FK(...a)),0)],['🖥️ Tuma Desktop',()=>{xfer(it,'Desktop',0);persist()},fo==='Desktop'],['📌 Pin kwenye Taskbar',()=>{it.forEach(a=>pinFile(...a));persist()}],['🔲 Pin kwenye Start',()=>{it.forEach(a=>startFile(...a));persist()}]);
  if(fo==='Desktop')M.push(['↩️ Rudisha kwenye folda asili',()=>{it.forEach(a=>xfer([a],get(...a).o[0],1));persist()}])}
 menu(x,y,M)}
/* ----- kuburuta (drag & drop) kwa kipanya ----- */
function drag(e,items){const sx=e.clientX,sy=e.clientY;let g=null;
 const mv=ev=>{if(!g&&Math.hypot(ev.clientX-sx,ev.clientY-sy)>6){g=E('div','gh','📄 '+items().length);document.body.append(g)}if(g){g.style.left=ev.clientX+12+'px';g.style.top=ev.clientY+12+'px'}};
 const up=ev=>{removeEventListener('pointermove',mv);removeEventListener('pointerup',up);if(!g)return;g.remove();lpT=Date.now();drop(ev,items(),ev.ctrlKey)};
 addEventListener('pointermove',mv);addEventListener('pointerup',up)}
function drop(ev,items,copy){const el=document.elementFromPoint(ev.clientX,ev.clientY);if(!el||!items.length)return;
 if(el.closest('#tb')){items.forEach(a=>pinFile(...a));persist();return}
 const t=el.closest('[data-fold]');if(!t||!t.dataset.fold||(t.id==='desk'&&el.closest('.w')))return;const d=t.dataset.fold;
 if(d===BIN){del(items);return}xfer(items,d,!copy);persist()}

/* ---------- Desktop (D, dctx, WP, drawDesk) ---------- */
/* ----- Desktop ----- */
const D=$('#desk');D.dataset.fold='Desktop';
const dctx={folder:()=>'Desktop',S:()=>[...dsel].map(x=>['Desktop',x]),all:()=>{V.F.Desktop.forEach(e=>dsel.add(e.n));paintD()}};ACT=dctx;
const paintD=()=>D.querySelectorAll(':scope>.ic').forEach(r=>r.classList.toggle('s',dsel.has(r.dataset.k)));
const WP=['linear-gradient(135deg,#0b3d91,#1e88e5 55%,#5ec8ff)','linear-gradient(135deg,#1b5e20,#43a047 55%,#a5d6a7)','linear-gradient(135deg,#4a148c,#8e24aa 55%,#f48fb1)','linear-gradient(135deg,#111,#37474f 60%,#78909c)'];
function drawDesk(){const LL=[];document.body.style.background=WP[V.wp%WP.length];D.querySelectorAll(':scope>.ic').forEach(x=>x.remove());
 DI.forEach(([i,name,fn,fl],k)=>{if(fl)return;const d=E('div','ic','<b>'+i+'</b>'+(isFr('d:'+name)?'📌 ':'')+name);d.dataset.k='#'+k;d.ondblclick=()=>{if(Date.now()-lpT>700)fn()};d.onclick=()=>{dsel.clear();paintD();d.classList.add('s');ACT=dctx};
  lp(d,(x,y)=>menu(x,y,[['Fungua',fn],[isFr('d:'+name)?'↧ Toa mbele':'⬆️ Weka mbele',()=>setFr(['d:'+name],!isFr('d:'+name))],['📌 Pin kwenye Taskbar',()=>{if(!V.pin.some(p=>p.t==='d'&&p.k===k))V.pin.push({t:'d',k});persist()}]]));LL.push(['d:'+name,name,d])});
 V.F.Desktop.forEach(e=>{const d=E('div','ic','<b>'+fi(e.o[1])+'</b>'+(isFr(FK('Desktop',e.n))?'📌 ':'')+esc(e.n));d.dataset.k=e.n;d.ondblclick=()=>{if(Date.now()-lpT>700)openE(e)};
  d.onclick=ev=>{ACT=dctx;if(!(ev.ctrlKey||ev.metaKey))dsel.clear();dsel.has(e.n)?dsel.delete(e.n):dsel.add(e.n);paintD()};
  d.onpointerdown=ev=>{if(ev.pointerType!=='mouse'||ev.button)return;if(!dsel.has(e.n)){if(!ev.ctrlKey)dsel.clear();dsel.add(e.n);paintD()}drag(ev,dctx.S)};
  lp(d,(x,y)=>{ACT=dctx;if(!dsel.has(e.n)){dsel.clear();dsel.add(e.n);paintD()}fileMenu(x,y,'Desktop',[...dsel])});LL.push([FK('Desktop',e.n),e.n,d])});LL.sort((a,b)=>cmpF(a[0],a[1],b[0],b[1])).forEach(x=>D.append(x[2]));paintD()}
D.addEventListener('click',e=>{if(e.target===D){dsel.clear();paintD();ACT=dctx}});
lp(D,(x,y,e)=>{if(e.target.closest('.ic,.w'))return;ACT=dctx;menu(x,y,[['📋 Bandika (Paste)',()=>paste('Desktop'),!CB],['Chagua zote',dctx.all],['📤 Pakia faili kutoka Kompyuta',()=>pickUpload('Desktop')],['🔄 Onyesha upya',refresh],[V.sort==='az'?'🔤 Panga: Z→A':'🔤 Panga: A→Z',togSort],['⛶ Skrini nzima (F11)',toggleFS],['🖼️ Badilisha mandhari',()=>{V.wp=(V.wp+1)%WP.length;persist()}],['⚙️ Settings (Personalize)',()=>settings()],['💻 Kompyuta Hii',()=>explorer()]])});
