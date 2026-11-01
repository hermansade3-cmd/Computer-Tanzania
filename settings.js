/* ============================================================
   settings.js — Settings: hali ya mipangilio (Sx), dark mode, accent, brightness, dirisha la Settings
   (Inapakiwa kama script ya kawaida; inashiriki global scope na moduli nyingine.
    Mpangilio wa kupakia umo ndani ya index.html — usiubadilishe.)
   ============================================================ */

/* ---------- Hali ya mipangilio + applyS() ---------- */
V.set=Object.assign({dark:0,acc:'#0067c0',wifi:1,bt:1,air:0,nl:0,bs:0,vol:60,br:100},V.set||{});const Sx=V.set,sv=()=>{try{localStorage.setItem(VK,JSON.stringify(V))}catch(_){}window.saveV&&saveV();};
WP.length=0;WP.push(
 'radial-gradient(55% 75% at 30% 65%,#59b4ff,transparent 62%),radial-gradient(50% 70% at 72% 38%,#0b4fd6,transparent 66%),radial-gradient(35% 45% at 55% 55%,#a5dcff,transparent 60%),linear-gradient(135deg,#041a4d,#0a3fb8)',
 'radial-gradient(55% 75% at 30% 65%,#7b4dff,transparent 62%),radial-gradient(50% 70% at 72% 38%,#c2185b,transparent 66%),linear-gradient(135deg,#0b0b1e,#25124d)',
 'radial-gradient(55% 75% at 30% 65%,#43e0a1,transparent 62%),radial-gradient(50% 70% at 72% 38%,#0b8457,transparent 66%),linear-gradient(135deg,#032a1d,#0b6b4b)',
 'radial-gradient(55% 75% at 30% 65%,#ffb067,transparent 62%),radial-gradient(50% 70% at 72% 38%,#e5484d,transparent 66%),linear-gradient(135deg,#3b0a2a,#b3315a)');
const dim=E('div');dim.id='dim';const nlo=E('div');nlo.id='nl';document.body.append(dim,nlo);
function applyS(){document.body.classList.toggle('dark',!!Sx.dark);document.documentElement.style.setProperty('--ac',Sx.acc);dim.style.background='rgba(0,0,0,'+((100-Sx.br)/100*.85)+')';nlo.style.display=Sx.nl?'block':'none';
 const t=[...document.querySelectorAll('#tray .tr')].find(x=>/📶|🚫|✈/.test(x.textContent));if(t)t.textContent=(Sx.air?'✈️':Sx.wifi?'📶':'🚫')+' 🔊 '+(Sx.bs?'🌿':'🔋')}

/* ---------- Dirisha la Settings ---------- */
/* ----- Settings ----- */
function settings(){const box=wrap(),row=E('div'),side=E('div','sd'),main=E('div','s11');row.style.cssText='display:flex;flex:1;min-height:0';row.append(side,main);box.append(row);let cur='🎨 Personalization';
 const card=h=>{const c=E('div','card',h||'');main.append(c);return c},tog=(c,k)=>{const s=E('div','swt'+(Sx[k]?' on':''));s.onclick=()=>{Sx[k]=Sx[k]?0:1;sv();applyS();s.classList.toggle('on')};c.append(s)},
 rng=(c,k,min)=>{const i=E('input');i.type='range';i.min=min;i.max=100;i.value=Sx[k];i.style.cssText='flex:1;accent-color:var(--ac)';i.oninput=()=>{Sx[k]=+i.value;sv();applyS()};c.append(i)};
 const pg={'🎨 Personalization':()=>{main.innerHTML='<h3>Personalization</h3>';const w=card('Background');WP.forEach((g,i)=>{const d=E('div','wp'+(V.wp%WP.length===i?' on':''));d.style.background=g;d.onclick=()=>{V.wp=i;persist();draw()};w.append(d)});
   const a=card('Accent color');['#0067c0','#107c10','#c42b1c','#8764b8','#ca5010','#00b7c3'].forEach(c=>{const d=E('div','ac1'+(Sx.acc===c?' on':''));d.style.background=c;d.onclick=()=>{Sx.acc=c;sv();applyS();draw()};a.append(d)});
   tog(card('<span style="flex:1">Dark mode</span>'),'dark')},
  '🖥️ System':()=>{main.innerHTML='<h3>System</h3>';let c=card('☀️ Brightness');rng(c,'br',20);tog(card('<span style="flex:1">🌙 Night light</span>'),'nl');c=card('🔊 Volume');rng(c,'vol',0);tog(card('<span style="flex:1">🌿 Battery saver</span>'),'bs')},
  'ℹ️ About':()=>{main.innerHTML='<h3>About</h3>';card('<div><b>MY-PC</b><br>Pro OS 11 · My Computer<br>Version 23H2 · OS build 22631<br>Mafaili: '+Object.values(V.F).reduce((a,b)=>a+b.length,0)+' · Recycle Bin: '+V.F[BIN].length+'</div>')}};
 function draw(){side.innerHTML='';Object.keys(pg).forEach(k=>{const d=E('div',k===cur?'on':'',k);d.onclick=()=>{cur=k;draw()};side.append(d)});pg[cur]()}
 draw();win('Settings',IA('set'),640,440,box)}
applyS();
