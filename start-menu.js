/* ============================================================
   start-menu.js — Start menu: buildMenu, toggle, kubofya kwa muda mrefu kwenye Start
   (Inapakiwa kama script ya kawaida; inashiriki global scope na moduli nyingine.
    Mpangilio wa kupakia umo ndani ya index.html — usiubadilishe.)
   ============================================================ */

/* ---------- Start menu ---------- */
const M=$('#menu'),REC=[];
function buildMenu(){M.innerHTML='';const q=E('input');q.placeholder='Tafuta programu, mafaili…';const sc=E('div','sc'),close=()=>M.style.display='none';
 const home=()=>{sc.innerHTML='<h4>Zilizobandikwa</h4>';const g=E('div','pg6');DI.forEach(([i,n,f])=>{const d=E('div','sa','<b>'+i+'</b>'+n);d.onclick=()=>{close();f()};g.append(d)});sc.append(g);
  sc.append(E('h4','','Mitandao ya Kijamii'));const r=E('div','rg');[['YouTube.exe','Video Stream','Tazama video'],['Facebook.exe','Social Connect','Marafiki na habari'],['Instagram.exe','Photo Share','Picha na reels'],['TikTok.exe','Short Videos','Video fupi']].forEach(([x,n,d])=>{const e=E('div','rc','<b>'+fi(x)+'</b><span>'+n+'<br><small style="color:#666">'+d+'</small></span>');e.onclick=()=>{close();openF('Programu (Programs)',x)};r.append(e)});sc.append(r)};
 q.oninput=()=>{const t=q.value.toLowerCase();if(!t)return home();sc.innerHTML='<h4>Matokeo</h4>';const L=[];DI.forEach(x=>x[1].toLowerCase().includes(t)&&L.push([x[0],x[1],x[2]]));Object.keys(FOLD).forEach(k=>FOLD[k].split(',').forEach(n=>(AL[n]||n).toLowerCase().includes(t)&&L.push([fi(n),AL[n]||n,()=>openF(k,n)])));
  L.slice(0,9).forEach(([i,n,f])=>{const d=E('div','rc','<b>'+i+'</b><span>'+n+'</span>');d.onclick=()=>{close();f()};sc.append(d)});if(!L.length)sc.append('Hakuna kilichopatikana')};
 const ft=E('div','ft');const usr=E('span','');usr.style.cursor='pointer';const uN=localStorage.getItem('sadeuser');usr.textContent='🧑‍💻 '+(uN||'Log in');usr.title=uN?'Akaunti yako':'Ingia / Jisajili';usr.onclick=()=>{close();loginBox()};ft.append(usr);const pw=E('span','','⏻ Funga');pw.onclick=()=>{close();lock()};const rs=E('span','','🧹 Reset');rs.onclick=()=>{localStorage.removeItem('sadepc');localStorage.removeItem('sadevfs2');(window.resetV?resetV():Promise.resolve()).then(()=>location.reload())};const r2=E('div');r2.append(rs,pw);ft.append(r2);
 home();M.append(q,sc,ft);if(!TAP)setTimeout(()=>q.focus(),50)}
const toggle=e=>{e.stopPropagation();if(M.style.display==='flex')M.style.display='none';else{buildMenu();M.style.display='flex'}};
$('#st').onclick=toggle;$('#sr').onclick=toggle;M.onclick=e=>e.stopPropagation();document.addEventListener('click',()=>M.style.display='none');

/* ---------- Menyu ya kubonyeza muda mrefu kwenye Start ---------- */
lp(M,(x,y,e)=>{const s=e.target.closest&&e.target.closest('.pg6 .sa');if(!s)return;const k=[...s.parentNode.children].indexOf(s),d=DI[k];if(!d)return;
 menu(x,y,[['Fungua',()=>{M.style.display='none';d[2]()}],['📌 Pin kwenye Taskbar',()=>{if(!V.pin.some(p=>p.t==='d'&&p.k===k))V.pin.push({t:'d',k});persist()}],k>=ORIG?['Ondoa kwenye Start',()=>{V.sp=V.sp.filter(p=>p.n!==d[1]);DI.splice(k,1);V.pin=V.pin.filter(p=>p.t!=='d'||p.k<DI.length);persist();buildMenu()}]:null].filter(Boolean))});
