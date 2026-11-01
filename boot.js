/* ============================================================
   boot.js — Boot: skrini ya kufunga (lock), Power (Lock/Sleep/Restart/Shut down), boot ya kwanza
   (Inapakiwa kama script ya kawaida; inashiriki global scope na moduli nyingine.
    Mpangilio wa kupakia umo ndani ya index.html — usiubadilishe.)
   ============================================================ */

/* ---------- Lock screen ---------- */
const L=$('#lock');function lock(){L.classList.remove('up')}L.onclick=()=>L.classList.add('up');addEventListener('keydown',()=>L.classList.add('up'));

/* ---------- Power + boot ---------- */
/* ----- Power: Lock, Sleep, Restart, Shut down ----- */
const LGO='<div class="lg"><i></i><i></i><i></i><i></i></div>';
function boot(msg,cb,ms){const b=E('div','',LGO+'<div class="sp"></div>'+(msg?'<p>'+msg+'</p>':''));b.id='bt';document.body.append(b);setTimeout(()=>cb(b),ms||1800)}
function sleep(){const o=E('div');o.id='bt';o.onclick=()=>{o.remove();lock()};document.body.append(o)}
function shut(){boot('Shutting down…',b=>{b.innerHTML='<button class="pw" title="Washa">⏻</button>';b.firstChild.onclick=()=>{b.innerHTML=LGO+'<div class="sp"></div>';setTimeout(()=>{b.remove();lock()},1800)}},1600)}
const power=(x,y)=>menu(x,y,[['🔒 Funga (Lock)',lock],['🌙 Sleep',sleep],['🔄 Restart',()=>boot('Restarting…',()=>location.reload())],['⏻ Shut down',shut]]);
M.addEventListener('click',e=>{const s=e.target.closest('.ft span');if(s&&/⏻/.test(s.textContent)){e.stopPropagation();e.preventDefault();M.style.display='none';power(e.clientX,e.clientY)}},true);
try{if(!sessionStorage.getItem('w11b')){sessionStorage.setItem('w11b',1);boot('',b=>b.remove(),1400)}}catch(_){}
