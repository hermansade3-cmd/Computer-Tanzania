/* ============================================================
   window-manager.js — Windows: vifaa vya msingi ($, E, esc, TT), win(), bar(), wrap(), Snap ya madirisha
   (Inapakiwa kama script ya kawaida; inashiriki global scope na moduli nyingine.
    Mpangilio wa kupakia umo ndani ya index.html — usiubadilishe.)
   ============================================================ */

/* ---------- Vifaa vya msingi + win()/bar()/wrap() ---------- */
const $=s=>document.querySelector(s),E=(t,c,h)=>{const e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e};
const esc=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const ext=n=>n.split('.').pop().toLowerCase();
const TTO={"Backup-Restore": "Backup & Restore", "HTML-CSS-JS-Editor": "HTML/CSS/JS Editor", "Circuit-Designer": "Circuit Designer", "Music-DJ-Mix": "Music DJ Mix"};
const TT=n=>{n=String(AL[n]||n);const b=n.replace(/\.[^.]+$/,'')||n;return TTO[b]||b.replace(/-/g,' ')};
/* ===== WINDOWS ===== */
let Z=10,wins=[];
function win(title,icon,w,h,body,onclose){
 const el=E('div','w'),hd=E('div','h','<span>'+icon+' &nbsp;'+esc(title)+'</span><i>─</i><i>☐</i><i class="x">✕</i>'),b=E('div','b');
 b.append(body);el.append(hd,b);
 const n=wins.length%8*26;el.style.cssText=`left:${40+n}px;top:${30+n}px;width:${Math.min(w,innerWidth-10)}px;height:${Math.min(h,innerHeight-60)}px;z-index:${++Z}`;
 $('#desk').append(el);if(innerWidth<760)el.classList.add('mx');
 const tk=E('button','',icon);tk.title=title;$('#tasks').append(tk);
 const o={el,close(){onclose&&onclose();el.remove();tk.remove();wins=wins.filter(x=>x!==o)},foc(){el.style.zIndex=++Z;el.style.display='flex';wins.forEach(x=>x.tk.classList.remove('on'));tk.classList.add('on')},tk};
 wins.push(o);o.foc();
 el.addEventListener('pointerdown',()=>o.foc());
 const [mn,mx,cl]=hd.querySelectorAll('i');cl.onclick=o.close;mx.onclick=()=>el.classList.toggle('mx');mn.onclick=()=>{el.style.display='none';tk.classList.remove('on')};
 hd.ondblclick=()=>el.classList.toggle('mx');
 tk.onclick=()=>el.style.display==='none'||!tk.classList.contains('on')?o.foc():mn.onclick();
 let d=null;hd.onpointerdown=e=>{if(e.target.tagName==='I'||el.classList.contains('mx'))return;d=[e.clientX-el.offsetLeft,e.clientY-el.offsetTop];hd.setPointerCapture(e.pointerId)};
 hd.onpointermove=e=>{if(d){el.style.left=e.clientX-d[0]+'px';el.style.top=Math.max(0,e.clientY-d[1])+'px'}};hd.onpointerup=()=>d=null;
 return o}
function bar(...a){const d=E('div','bar');a.forEach(x=>{if(typeof x==='string')d.append(E('span','',x));else{const bt=E('button','',x[0]);bt.onclick=x[1];d.append(bt)}});return d}
const wrap=(...c)=>{const d=E('div');d.style.cssText='display:flex;flex-direction:column;flex:1;min-height:0';d.append(...c);return d};

/* ---------- Snap: buruta dirisha ukingoni ---------- */
/* ----- Snap: buruta dirisha ukingoni (kushoto/kulia = nusu, juu = maximize) ----- */
const _win=win;win=function(...a){const o=_win(...a),hd=o.el.querySelector('.h');
 hd.addEventListener('pointerup',e=>{if(innerWidth<760||o.el.classList.contains('mx'))return;const W=innerWidth,H=innerHeight-48,s=o.el.style;
  if(e.clientY<4)o.el.classList.add('mx');else if(e.clientX<6||e.clientX>W-6){s.top='0px';s.height=H+'px';s.width=W/2+'px';s.left=e.clientX<6?'0px':W/2+'px'}});return o};
