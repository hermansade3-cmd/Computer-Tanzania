/* ============================================================
   file-explorer.js — File Explorer: matoleo ya zamani (yanabadilishwa) + Explorer Pro (dialogs, upload/download, viewer, Recycle Bin, auto-save)
   (Inapakiwa kama script ya kawaida; inashiriki global scope na moduli nyingine.
    Mpangilio wa kupakia umo ndani ya index.html — usiubadilishe.)
   ============================================================ */

/* ---------- Explorer v1 (ya zamani, inabadilishwa na Pro) ---------- */
/* ===== EXPLORER ===== */
function explorer(f){
 let cur=f||null,H=[cur],hi=0;const box=wrap(),side=E('div','sd'),body=E('div','grid'),ad=E('div','ad'),stt=E('div','stt'),q=E('input');q.placeholder='Tafuta';q.style.width='120px';
 const go=(c,p)=>{cur=c;if(!p){H=H.slice(0,hi+1);H.push(c);hi++}q.value='';draw()};
 const bk=E('button','','←'),fw=E('button','','→'),up=E('button','','↑');bk.onclick=()=>{if(hi>0){hi--;go(H[hi],1)}};fw.onclick=()=>{if(hi<H.length-1){hi++;go(H[hi],1)}};up.onclick=()=>go(null);
 const nav=E('div','bar');nav.append(bk,fw,up,ad,q);const row=E('div');row.style.cssText='display:flex;flex:1;min-height:0';row.append(side,body);body.style.flex=1;body.style.overflow='auto';
 function draw(){ad.textContent='Kompyuta Hii › Diski (C:)'+(cur?' › '+cur:'');side.innerHTML='';
  const si=(t,c)=>{const d=E('div',c===cur?'on':'',t);d.onclick=()=>go(c);side.append(d)};si(IA('pc')+' Kompyuta Hii',null);Object.keys(FOLD).forEach(k=>si(FD(k)+' '+k.split(' ')[0],k));
  body.innerHTML='';body.classList.add('lst');let n=0;const t=q.value.toLowerCase();
  body.append(E('div','lh','<span>#</span><span></span><span>Jina</span><span>Aina</span>'));
  const mk=(ic,nm,ty,fn)=>{n++;const i=E('div','it','<em>'+String(n).padStart(2,'0')+'</em><b>'+ic+'</b><span>'+esc(nm)+'</span><small>'+ty+'</small>');i.ondblclick=fn;i.onclick=()=>{body.querySelectorAll('.it').forEach(z=>z.style.background='');i.style.background='#cce4f7'};body.append(i)};
  if(!cur)Object.keys(FOLD).filter(k=>k.toLowerCase().includes(t)).forEach(k=>mk(FD(k),k,'Folda · '+FOLD[k].split(',').length+' vitu',()=>go(k)));
  else FOLD[cur].split(',').filter(x=>x.toLowerCase().includes(t)).sort((x,y)=>x.localeCompare(y,undefined,{sensitivity:'base'})).forEach(x=>mk(fi(x),x,ext(x).toUpperCase()+' · Faili',()=>openF(cur,x)));
  stt.textContent=n+' vitu'+(OFFN?'  ·  💾 '+OFFN+' vimehifadhiwa offline':'')}
 q.oninput=draw;draw();box.append(nav,row,stt);win('Explorer',FD('Nyaraka'),680,420,box)}

/* ---------- Explorer v2 (ya zamani, inabadilishwa na Pro) ---------- */
/* ----- Explorer mpya ----- */
function explorer(f){
 let cur=f||null,H=[cur],hi=0,multi=0,sel=new Set(),last=null,order=[],n=0;const box=wrap(),side=E('div','sd'),body=E('div','grid'),ad=E('div','ad'),stt=E('div','stt'),q=E('input');q.placeholder='Tafuta';q.style.width='120px';
 const go=(c,p)=>{cur=c;sel.clear();last=null;if(!p){H=H.slice(0,hi+1);H.push(c);hi++}q.value='';draw()};
 const bk=E('button','','←'),fw=E('button','','→'),up=E('button','','↑');bk.onclick=()=>{if(hi>0){hi--;go(H[hi],1)}};fw.onclick=()=>{if(hi<H.length-1){hi++;go(H[hi],1)}};up.onclick=()=>go(null);
 const nav=E('div','bar');nav.append(bk,fw,up,ad,q);const tbr=E('div','bar');
 const S=()=>cur?[...sel].map(x=>[cur,x]):[],ctx={folder:()=>cur,S,all:()=>{if(cur){V.F[cur].forEach(e=>sel.add(e.n));paint()}}};
 const B=(t,ti,fn)=>{const b=E('button','',t);b.title=ti;b.onclick=()=>{ACT=ctx;fn()};tbr.append(b);return b};
 B('✂️','Kata (Cut)',()=>cp(S(),1));B('⧉','Nakili (Copy)',()=>cp(S(),0));B('📋','Bandika (Paste)',()=>paste(cur));B('✏️','Badili jina',()=>{const s=S();if(s.length===1)ren(...s[0])});B('🗑️','Futa',()=>del(S()));
 B('🖥️','Tuma Desktop',()=>{xfer(S(),'Desktop',0);persist()});B('⬇️','Hifadhi kwenye Kompyuta (Download)',()=>saveOut(S()));B('📤','Pakia faili kutoka Kompyuta',()=>pickUpload(cur&&cur!==BIN?cur:'Desktop'));B('📌','Pin Taskbar',()=>{S().forEach(a=>pinFile(...a));persist()});B('⬆️','Weka mbele (kwanza kwenye orodha)',()=>setFr(S().map(a=>FK(...a)),1));B('↧','Toa mbele',()=>setFr(S().map(a=>FK(...a)),0));B('🔤','Panga A→Z / Z→A',togSort);B('➕','Folda mpya',()=>cur?alert('Fungua "Kompyuta Hii" kutengeneza folda mpya.'):newF());
 const mb=B('☑','Chagua vingi (multi-select)',()=>{multi=!multi;mb.style.background=multi?'#cce4f7':''});
 const row=E('div');row.style.cssText='display:flex;flex:1;min-height:0';row.append(side,body);body.style.flex=1;body.style.overflow='auto';
 const status=()=>{stt.textContent=n+' vitu'+(sel.size?'  ·  '+sel.size+' vimechaguliwa':'')+(CB?'  ·  📋 '+CB.items.length+(CB.cut?' vimekatwa':' vimenakiliwa'):'')};
 const paint=()=>{body.querySelectorAll('.it').forEach(r=>r.classList.toggle('sel',sel.has(r.dataset.k)));status()};
 const pick=(k,e)=>{if(multi||e.ctrlKey||e.metaKey){sel.has(k)?sel.delete(k):sel.add(k)}else if(e.shiftKey&&last!=null){const a=order.indexOf(last),b=order.indexOf(k);order.slice(Math.min(a,b),Math.max(a,b)+1).forEach(x=>sel.add(x))}else{sel.clear();sel.add(k)}last=k;paint()};
 const nm=k=>FD(k)+' '+(k===BIN?'Recycle Bin':k==='Desktop'?'Desktop':k.split(' ')[0]);
 function draw(){if(cur&&!V.F[cur])cur=null;ad.textContent='Kompyuta Hii › Diski (C:)'+(cur?' › '+cur:'');side.innerHTML='';
  const si=(t,c)=>{const d=E('div',c===cur?'on':'',t);d.onclick=()=>go(c);if(c)d.dataset.fold=c;side.append(d)};si(IA('pc')+' Kompyuta Hii',null);keys().forEach(k=>si(nm(k),k));
  body.innerHTML='';body.classList.add('lst');body.dataset.fold=cur||'';order=[];n=0;const t=q.value.toLowerCase();
  body.append(E('div','lh','<span>#</span><span></span><span>Jina</span><span>Aina</span>'));
  const mk=(ic,name,ty,fn,key)=>{n++;order.push(key);const cut=CB&&CB.cut&&cur&&CB.items.some(x=>x[0]===cur&&x[1]===key);
   const i=E('div','it'+(sel.has(key)?' sel':'')+(cut?' cut':''),'<em>'+String(n).padStart(2,'0')+'</em><b>'+ic+'</b><span>'+(isFr(cur?FK(cur,key):'k:'+key)?'📌 ':'')+esc(name)+'</span><small>'+ty+'</small>');i.dataset.k=key;if(!cur)i.dataset.fold=key;
   i.ondblclick=()=>{if(!multi&&Date.now()-lpT>700)fn()};i.onclick=e=>{ACT=ctx;pick(key,e)};
   i.onpointerdown=e=>{if(!cur||e.pointerType!=='mouse'||e.button)return;if(!sel.has(key)&&!e.ctrlKey){sel.clear();sel.add(key);paint()}drag(e,S)};
   lp(i,(x,y)=>{ACT=ctx;if(!cur)return menu(x,y,[['Fungua',()=>go(key)],[isFr('k:'+key)?'⬇️ Toa mbele':'⬆️ Weka mbele',()=>setFr(['k:'+key],!isFr('k:'+key))],['Futa folda',()=>delF(key),!V.U.includes(key)]]);if(!sel.has(key)){sel.clear();sel.add(key);paint()}fileMenu(x,y,cur,[...sel])});body.append(i)};
  if(!cur)keys().filter(k=>k.toLowerCase().includes(t)).sort((a,b)=>cmpF('k:'+a,a,'k:'+b,b)).forEach(k=>mk(FD(k),k,'Folda · '+V.F[k].length+' vitu',()=>go(k),k));
  else V.F[cur].filter(e=>e.n.toLowerCase().includes(t)).sort((x,y)=>cmpF(FK(cur,x.n),x.n,FK(cur,y.n),y.n)).forEach(e=>mk(fi(e.o[1]),e.n,ext(e.n).toUpperCase()+' · Faili',()=>cur===BIN?alert('Rejesha faili kwanza ili kulifungua.'):openE(e),e.n));
  status()}
 lp(body,(x,y,e)=>{if(e.target.closest('.it'))return;ACT=ctx;menu(x,y,[['📋 Bandika (Paste)',()=>paste(cur),!CB||!cur],['Chagua zote',ctx.all,!cur],['➕ Folda mpya',newF,!!cur],['🔄 Onyesha upya',draw],cur===BIN?['🧹 Mwaga Recycle Bin',()=>del(V.F[BIN].map(a=>[BIN,a.n])),!V.F[BIN].length]:null].filter(Boolean))});
 q.oninput=draw;EXP.add(draw);draw();box.append(nav,tbr,row,stt);win('Explorer',FD('Nyaraka'),680,420,box,()=>{EXP.delete(draw);if(ACT===ctx)ACT=dctx})}

/* ---------- EXPLORER PRO + FILE SYSTEM v2 ---------- */
/* ===== EXPLORER PRO + FILE SYSTEM v2 (IndexedDB blobs + metadata, folda ndani ya folda, Recycle Bin, duplicates) ===== */
(()=>{
const uid=()=>Math.random().toString(36).slice(2,9)+Date.now().toString(36).slice(-4);
const K=(fo,n)=>fo+'|'+n,pk=(p,n)=>p+'/'+n,eid=e=>e.id||(e.id=uid());
const sub=k=>Object.keys(V.F).filter(x=>x===k||x.startsWith(k+'/'));
const rekey=(a,b)=>{if(a===b)return;sub(a).forEach(x=>{V.F[b+x.slice(a.length)]=V.F[x];delete V.F[x]})};
const cloneTree=(a,b)=>sub(a).forEach(x=>{V.F[b+x.slice(a.length)]=V.F[x].map(e=>({...e,id:uid()}))});
const owner=e=>Object.keys(V.F).find(k=>V.F[k].includes(e));
const SZ=n=>n<1024?n+' B':n<1048576?(n/1024).toFixed(1)+' KB':n<1073741824?(n/1048576).toFixed(1)+' MB':(n/1073741824).toFixed(2)+' GB';
const DT=t=>t?new Date(t).toLocaleString([],{dateStyle:'medium',timeStyle:'short'}):'—';
const xe=n=>n.includes('.')?ext(n):'',attr=s=>esc(s).replace(/"/g,'&quot;');
const EX={img:'jpg,jpeg,png,gif,webp,svg,bmp,ico,avif',vid:'mp4,webm,mkv,mov,3gp,ogv',aud:'mp3,wav,ogg,m4a,aac,flac,opus',txt:'txt,md,csv,json,js,css,xml,log,ini,yml,yaml,html,htm,tsv,sql',doc:'pdf,doc,docx,xls,xlsx,ppt,pptx,odt,rtf',app:'exe,apk,msi'};
const kind=e=>{if(e.dir)return'dir';const x=xe(e.n);for(const k in EX)if(EX[k].split(',').includes(x))return k;return e.bk?'oth':'app'};
const TY=e=>e.dir?'Folda':(xe(e.n)?xe(e.n).toUpperCase()+' faili':'Faili')+(e.bk?'':' · Mfumo');
const MT={txt:'text/plain',csv:'text/csv',json:'application/json',md:'text/plain',html:'text/html',pdf:'application/pdf',svg:'image/svg+xml'};
const lab=k=>k===BIN?'Recycle Bin':V.U.includes(k)?k:k.split(' ')[0];
const save=()=>{try{localStorage.setItem(VK,JSON.stringify(V))}catch(_){}window.saveV&&saveV()};
/* ---- arifa (toast) + loading ---- */
const tw=E('div');tw.id='xtw';tw.setAttribute('role','status');tw.setAttribute('aria-live','polite');document.body.append(tw);
window.toast=(m,t)=>{const d=E('div','xtoast '+(t||''),esc(m));tw.append(d);setTimeout(()=>{d.classList.add('out');setTimeout(()=>d.remove(),300)},t==='e'?5500:2800);return d};
let bz=0;const busy=on=>{bz=Math.max(0,bz+(on?1:-1));document.body.classList.toggle('xbusy',bz>0)};
/* ---- dialogs (hakuna alert/confirm/prompt) ---- */
function dlg(title,body,btns){return new Promise(res=>{const ov=E('div','xo'),d=E('div','xd'),b=E('div','xdb'),f=E('div','xdf');d.setAttribute('role','dialog');d.setAttribute('aria-modal','true');d.setAttribute('aria-label',title);
 if(typeof body==='string')b.innerHTML=body;else b.append(body);
 const kd=e=>{if(e.key==='Escape'){e.stopPropagation();close(null)}},close=v=>{ov.remove();removeEventListener('keydown',kd,true);res(v)};
 btns.forEach(([t,v,p])=>{const x=E('button',p?'pri':'',esc(t));x.onclick=()=>close(typeof v==='function'?v():v);f.append(x)});
 addEventListener('keydown',kd,true);d.append(E('h3','',esc(title)),b,f);ov.append(d);ov.onpointerdown=e=>{if(e.target===ov)close(null)};document.body.append(ov);(d.querySelector('input')||f.firstChild).focus()})}
const ask=(t,m,ok)=>dlg(t,'<p>'+esc(m)+'</p>',[['Ghairi',false],[ok,true,1]]).then(Boolean);
const BAD=/[\\/:*?"<>|\x00-\x1f]/;
const vbase=v=>!v?'Jina haliwezi kuwa tupu.':v.length>200?'Jina ni refu mno (herufi 200 juu).':BAD.test(v)?'Jina haliruhusu herufi: \\ / : * ? " < > |':/^\.+$/.test(v)?'Jina si sahihi.':'';
const vdup=(fo,self)=>v=>vbase(v)||((V.F[fo]||[]).some(x=>x.n.toLowerCase()===v.toLowerCase()&&x.n!==self)?'Jina hilo lipo tayari kwenye folda hii.':'');
async function askName(title,def,chk){let v=def,err='';for(;;){const i=E('input'),m=E('div','xer',esc(err)),b=E('div');i.value=v;i.setAttribute('aria-label',title);b.append(i,m);const p=dlg(title,b,[['Ghairi',null],['Sawa',()=>i.value.trim(),1]]);
 setTimeout(()=>{i.focus();const d=i.value.lastIndexOf('.');i.setSelectionRange(0,d>0?d:i.value.length)},30);i.onkeydown=e=>{if(e.key==='Enter'){const o=b.closest('.xd');o&&o.querySelector('.pri').click()}};
 const r=await p;if(r==null)return null;err=chk(r);if(!err)return r;v=r}}
/* ---- Hifadhi ya mafaili: kwenye akaunti (Firestore) + kumbukumbu ya kikao. Hakuna IndexedDB ---- */
const BS=window.BS=window.BS||{mem:new Map(),cloud:null,known:new Set()};
const bput=async(k,b)=>{BS.mem.set(k,b);if(BS.cloud){await BS.cloud.put(k,b)}else if(!BS.warned){BS.warned=1;try{toast('Hujaingia: faili halitahifadhiwa ukifunga ukurasa. Bonyeza Log in ili lihifadhiwe kwenye akaunti yako.','w')}catch(_){}}};
const bget=async k=>{if(BS.mem.has(k))return BS.mem.get(k);if(BS.cloud){const b=await BS.cloud.get(k);if(b){BS.mem.set(k,b);return b}}return undefined};
const bdel=async k=>{BS.mem.delete(k);if(BS.cloud)await BS.cloud.del(k)};
async function sha(b){try{if(b.size>2e8||!crypto.subtle)return'';return[...new Uint8Array(await crypto.subtle.digest('SHA-256',await b.arrayBuffer()))].map(x=>x.toString(16).padStart(2,'0')).join('')}catch(_){return''}}
window.saveV=()=>{};
try{navigator.storage&&navigator.storage.persist&&navigator.storage.persist()}catch(_){}
/* ---- operesheni za mfumo wa mafaili ---- */
const mkdirp=(p,n)=>{let d=V.F[p].find(x=>x.dir&&x.n===n);if(!d){const t=Date.now();d={n,dir:1,o:['Folda',n],id:uid(),ct:t,mt:t};V.F[p].push(d);V.F[pk(p,n)]=V.F[pk(p,n)]||[]}return pk(p,n)};
const stat=(fo,e)=>{if(!e.dir)return{f:1,d:0,s:e.sz||0};const k=e.top?e.n:fo===BIN?BIN+'/'+eid(e):pk(fo,e.n),r={f:0,d:0,s:0};sub(k).forEach(x=>V.F[x].forEach(c=>{if(c.dir)r.d++;else{r.f++;r.s+=c.sz||0}}));return r};
async function purge(fo,e){V.F[fo]=V.F[fo].filter(x=>x!==e);const gone=[e];if(e.dir){const k=fo===BIN?BIN+'/'+eid(e):pk(fo,e.n);sub(k).forEach(x=>{gone.push(...V.F[x]);delete V.F[x]})}
 for(const b of new Set(gone.filter(x=>x.bk).map(x=>x.bk)))if(!Object.values(V.F).some(L=>L.some(x=>x.bk===b)))await bdel(b)}
window.xfer=function(items,dest,cut){if(!V.F[dest])return;let n=0;items.forEach(([fo,nm])=>{const e=get(fo,nm);if(!e)return;if(fo===BIN&&!cut)return;if(cut&&fo===dest)return;
 if(e.dir&&fo!==BIN){const s=pk(fo,nm);if(dest===s||dest.startsWith(s+'/')){toast('Huwezi kuhamisha folda ndani yake yenyewe','w');return}}
 const name=uniq(dest,fo===BIN?(e.on||e.n):nm);
 if(cut){V.F[fo]=V.F[fo].filter(x=>x!==e);if(e.dir)rekey(fo===BIN?BIN+'/'+eid(e):pk(fo,nm),pk(dest,name));e.n=name;delete e.on;delete e.d;delete e.dt;e.mt=Date.now();V.F[dest].push(e)}
 else{const c={...e,n:name,id:uid(),ct:Date.now()};V.F[dest].push(c);if(e.dir)cloneTree(pk(fo,nm),pk(dest,name))}n++});n&&toast((cut?'Vimehamishwa: ':'Vimenakiliwa: ')+n)};
window.del=async function(items){items=items.filter(a=>get(a[0],a[1]));if(!items.length)return;
 try{if(items.every(a=>a[0]===BIN)){if(!await ask('Futa kabisa','Vitu '+items.length+' vitafutwa kabisa na haviwezi kurejeshwa. Endelea?','Futa kabisa'))return;for(const[fo,n]of items)await purge(fo,get(fo,n));toast('Vimefutwa kabisa: '+items.length)}
 else{const R=items.filter(a=>a[0]!==BIN);if(!await ask('Futa vitu','Hamisha '+R.length+' kwenye Recycle Bin? Unaweza kuvirejesha baadaye.','Futa'))return;
  R.forEach(([fo,n])=>{const e=get(fo,n);if(!e)return;V.F[fo]=V.F[fo].filter(x=>x!==e);if(e.dir)rekey(pk(fo,n),BIN+'/'+eid(e));e.on=e.n;e.d=fo;e.dt=Date.now();e.n=uniq(BIN,e.n);V.F[BIN].push(e)});toast('Vimehamishiwa Recycle Bin: '+R.length)}
 persist()}catch(x){toast('Imeshindwa kufuta: '+(x&&x.message||x),'e')}};
window.restore=function(items){let n=0;items.forEach(([fo,nm])=>{const e=get(BIN,nm);if(!e)return;const d=V.F[e.d]?e.d:'Desktop',name=uniq(d,e.on||e.n);V.F[BIN]=V.F[BIN].filter(x=>x!==e);if(e.dir)rekey(BIN+'/'+eid(e),pk(d,name));e.n=name;delete e.on;delete e.d;delete e.dt;V.F[d].push(e);n++});persist();n&&toast('Vimerejeshwa: '+n)};
window.ren=async function(fo,n){const e=get(fo,n);if(!e||fo===BIN)return;const v=await askName('Badili jina',n,vdup(fo,n));if(v==null||v===n)return;if(e.dir)rekey(pk(fo,n),pk(fo,v));e.n=v;e.mt=Date.now();persist();toast('Jina limebadilishwa')};
window.newF=async function(parent){const fo=parent&&V.F[parent]&&parent!==BIN?parent:null;
 const v=await askName('Folda mpya','Folda mpya',fo?vdup(fo,null):s=>vbase(s)||(V.F[s]?'Jina hilo lipo tayari.':''));if(v==null)return;
 if(fo){mkdirp(fo,v)}else{V.F[v]=[];V.U.push(v)}persist();toast('Folda imetengenezwa')};
async function mkFile(fo){if(!fo||!V.F[fo]||fo===BIN)return;const v=await askName('Faili jipya','Hati mpya.txt',vdup(fo,null));if(v==null)return;const t=Date.now(),b=new Blob([''],{type:'text/plain'}),bk=uid();
 try{await bput(bk,b);V.F[fo].push({n:v,o:['Upload',v],id:uid(),bk,sz:0,ct:t,mt:t,h:await sha(b)});persist()}catch(x){toast('Imeshindwa kuunda faili: '+(x&&x.message||x),'e')}}
function dupl(items){items.forEach(a=>{if(a[0]!==BIN)xfer([a],a[0],0)});persist()}
/* ---- upload / download ---- */
async function addFiles(files,dest){if(!dest||!V.F[dest]||dest===BIN){toast('Fungua folda kwanza kisha pakia faili','w');return}
 busy(1);const pt=toast('Inapakia…'),ok={n:0,s:0,f:0};let pol=null,i=0;
 try{for(const f of files){pt.textContent='Inapakia '+(++i)+'/'+files.length+' · '+f.name;
  try{let d=dest;const rp=f.webkitRelativePath;if(rp&&rp.includes('/'))for(const p of rp.split('/').slice(0,-1))d=mkdirp(d,p);
   let name=(f.name||'faili').replace(/[\\/:*?"<>|\x00-\x1f]/g,'_').trim().slice(0,200)||'faili';const h=await sha(f);
   const dup=V.F[d].find(x=>!x.dir&&x.bk&&(h?x.h===h:x.sz===f.size&&x.n===name));let bk=null;
   if(dup){let r=pol;if(!r){const cb=E('input');cb.type='checkbox';const b=E('div');b.innerHTML='<p><b>'+esc(name)+'</b> lina maudhui sawa na <b>'+esc(dup.n)+'</b> kwenye folda hii.</p>';const l=E('label','','');l.append(cb,' Fanya hivi kwa yote yanayofuata');b.append(l);
    const x=await dlg('Faili nakala limegunduliwa',b,[['Ruka',()=>({v:'skip',a:cb.checked})],['Weka nakala',()=>({v:'both',a:cb.checked}),1]]);r=x?x.v:'skip';if(x&&x.a)pol=r}
    if(r==='skip'){ok.s++;continue}bk=dup.bk}
   if(!bk){bk=uid();await bput(bk,f)}
   const t=Date.now();V.F[d].push({n:uniq(d,name),o:['Upload',name],id:uid(),bk,sz:f.size,ct:t,mt:f.lastModified||t,h,ty:f.type||MT[xe(name)]||''});ok.n++}
  catch(x){ok.f++;if(x&&x.name==='QuotaExceededError'){toast('Hifadhi imejaa — futa vitu au toa nafasi','e');break}console.warn(x)}}
 }finally{busy(0);pt.remove();persist()}
 toast('Yamepakiwa: '+ok.n+(ok.s?' · yamerukwa: '+ok.s:'')+(ok.f?' · yameshindwa: '+ok.f:''),ok.f?'w':'')}
window.pickUpload=(dest,dir)=>{const i=E('input');i.type='file';i.multiple=true;if(dir)i.webkitdirectory=true;i.style.display='none';document.body.append(i);i.onchange=()=>{addFiles([...i.files],dest&&V.F[dest]?dest:'Desktop');i.remove()};i.click()};
const dl=(b,name)=>{const u=URL.createObjectURL(b),a=E('a');a.href=u;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),5e3)};
async function sysBlob(e){const s=e.o[0].split(' ')[0],k=s+'/'+e.o[1];let c=await DB.get(k),t=c&&c.html;if(t==null){const r=await fetchF(s,e.o[1]);t=r&&r.txt}return t!=null?new Blob([t],{type:'text/html'}):null}
window.saveOut=async function(items){let n=0;busy(1);try{for(const[fo,nm]of items){const e=get(fo,nm);if(!e)continue;if(e.dir){toast('Folda "'+e.n+'" haiwezi kupakuliwa moja kwa moja — chagua faili ndani yake','w');continue}
 try{const b=e.bk?await bget(e.bk):await sysBlob(e);if(!b){toast('"'+e.n+'" halipatikani kupakuliwa (jaribu ukiwa online)','w');continue}dl(b,e.bk?e.n:e.o[1]+'.html');n++}catch(x){toast('Imeshindwa kupakua '+e.n,'e')}}}finally{busy(0)}n&&toast('Imepakuliwa: '+n)};
/* ---- recent + fungua ---- */
const rcAdd=e=>{const o=owner(e);if(!o||o===BIN)return;V.rc=(V.rc||[]).filter(r=>!(r.fo===o&&r.n===e.n));V.rc.unshift({fo:o,n:e.n,t:Date.now()});V.rc.length=Math.min(V.rc.length,30);save()};
const _oe=window.openE;
window.openE=function(e){if(!e)return;try{if(!e.bk&&e.o&&e.o[0]==='Upload'){const r=Object.values(V.F).flat().find(x=>x.bk&&x.n===e.n);if(r)e=r}
 if(e.dir){const o=owner(e);if(o&&o!==BIN)explorer(pk(o,e.n));return}rcAdd(e);if(e.bk)return viewer(e)}catch(x){toast('Imeshindwa kufungua: '+(x&&x.message||x),'e');return}_oe(e)};
/* ---- preview / viewer ---- */
const info=(e,fo)=>{const s=stat(fo,e);return'<div class="xpc"><div class="xbig">'+(e.dir?FD(e.n):fi(e.o?e.o[1]:e.n))+'</div><b>'+esc(e.n)+'</b><small>'+(e.dir?s.f+' faili · '+s.d+' folda':TY(e)+(e.bk?' · '+SZ(e.sz||0):''))+'</small></div>'};
async function renderPrev(e,fo,host,edit){(host._u||[]).forEach(u=>URL.revokeObjectURL(u));host._u=[];host._ta=null;
 if(e.dir||!e.bk){host.innerHTML=info(e,fo)+(e.bk||e.dir?'':'<div class="xpc"><small>Faili la mfumo — bonyeza mara mbili kulifungua</small></div>');return}
 host.innerHTML='<div class="xpc">Inapakia…</div>';let b;try{b=await bget(e.bk)}catch(x){host.innerHTML='<div class="xpc">Imeshindwa kusoma hifadhi: '+esc(x.message||x)+'</div>';return}
 if(!b){host.innerHTML='<div class="xpc">⚠ Data ya faili haipatikani kwenye hifadhi</div>';return}
 const k=kind(e),u=()=>{const x=URL.createObjectURL(b);host._u.push(x);return x};host.innerHTML='';
 if(k==='img'){const i=E('img','xim');i.src=u();i.alt=e.n;host.append(i)}
 else if(k==='vid'||k==='aud'){const m=E(k==='vid'?'video':'audio','xim');m.controls=true;m.src=u();host.append(m)}
 else if(xe(e.n)==='pdf'){const f=E('iframe','xim');f.src=u();host.append(f)}
 else if(k==='txt'||(b.size<2e5&&/^text\//.test(b.type))){const t=await b.slice(0,edit?5e6:2e5).text();if(edit){const a=E('textarea','xta');a.value=t;host._ta0=t;a.spellcheck=false;a.setAttribute('aria-label','Hariri '+e.n);host.append(a);host._ta=a}else{const p=E('pre','xtx');p.textContent=t;host.append(p)}}
 else host.innerHTML=info(e,fo)}
function viewer(e){const fo=owner(e)||'Desktop',box=E('div','xp'),tb=E('div','xvb'),host=E('div','xvh');box.append(tb,host);
 const B=(t,f)=>{const b=E('button','xb',t);b.onclick=f;tb.append(b);return b};
 B('⬇️ Pakua',()=>saveOut([[fo,e.n]]));
 let sv2=null;if(kind(e)==='txt'){sv2=async(auto)=>{if(!host._ta)return;try{const v=host._ta.value,b=new Blob([v],{type:'text/plain'});if(Object.values(V.F).some(L=>L.some(x=>x!==e&&x.bk===e.bk)))e.bk=uid();await bput(e.bk,b);e.sz=b.size;e.mt=Date.now();e.h=await sha(b);host._ta0=v;persist();toast(auto===1?'Mabadiliko yamehifadhiwa: '+e.n:'Imehifadhiwa')}catch(x){toast('Imeshindwa kuhifadhi: '+(x&&x.message||x),'e')}};B('💾 Hifadhi (Ctrl+S)',sv2);box.addEventListener('keydown',ev=>{if((ev.ctrlKey||ev.metaKey)&&ev.key.toLowerCase()==='s'){ev.preventDefault();sv2()}})}
 renderPrev(e,fo,host,true);const wv=win(e.n,fi(e.o[1]),680,460,box,()=>(host._u||[]).forEach(u=>URL.revokeObjectURL(u)));
 hookClose(wv,async()=>{if(!(sv2&&host._ta&&host._ta.value!==host._ta0&&owner(e)&&owner(e)!==BIN))return true;
  const r=await dlg('Hifadhi mabadiliko?','<p>Umebadilisha <b>'+esc(e.n)+'</b>. Yahifadhiwe kwenye <b>'+esc(fpath(owner(e)))+'</b>?</p>',[['Ghairi',null],['Usihifadhi',()=>'no'],['Hifadhi',()=>'yes',1]]);
  if(!r)return false;if(r==='yes'){await sv2(1);return host._ta.value===host._ta0}return true})}
async function props(recs){recs=recs.filter(Boolean);if(!recs.length)return;const row=(a,b)=>'<tr><td>'+a+'</td><td>'+esc(b)+'</td></tr>';let h;
 if(recs.length===1){const{fo,e}=recs[0],s=stat(fo,e);h='<table class="xpt">'+row('Jina',e.n)+row('Aina',TY(e))+row('Mahali','Diski (C:)\\'+(fo||'').replace(/\//g,'\\'))+row('Ukubwa',e.dir?SZ(s.s)+' ('+s.f+' faili, '+s.d+' folda)':e.bk?SZ(e.sz||0):'Faili la mfumo')+row('Imetengenezwa',DT(e.ct))+row('Imebadilishwa',DT(e.mt))+(e.h?row('SHA-256',e.h.slice(0,20)+'…'):'')+(e.id?row('ID',e.id):'')+'</table>'}
 else{const t=recs.reduce((a,{fo,e})=>{const s=stat(fo,e);a.f+=s.f;a.d+=s.d+(e.dir?1:0);a.s+=s.s;return a},{f:0,d:0,s:0});h='<table class="xpt">'+row('Vitu',recs.length+' vimechaguliwa')+row('Faili',t.f)+row('Folda',t.d)+row('Ukubwa wote',SZ(t.s))+'</table>'}
 await dlg('Properties',h,[['Funga',null,1]])}
async function findDup(){const m={};Object.keys(V.F).filter(k=>k!==BIN&&!k.startsWith(BIN+'/')).forEach(k=>V.F[k].forEach(e=>{if(e.bk&&e.h)(m[e.h]=m[e.h]||[]).push([k,e])}));const g=Object.values(m).filter(a=>a.length>1);
 if(!g.length){toast('Hakuna faili nakala zilizopatikana');return}const ex=g.reduce((a,x)=>a+x.length-1,0);
 const r=await dlg('Nakala zilizopatikana: makundi '+g.length,'<div class="xdl">'+g.map(a=>'<div><b>'+esc(a[0][1].n)+'</b> · '+SZ(a[0][1].sz||0)+a.map(([k,e])=>'<br>• '+esc(k.replace(/\//g,' › '))+' / '+esc(e.n)).join('')+'</div>').join('')+'</div>',[['Funga',null],['Futa nakala '+ex+' (acha moja kila kundi)',true,1]]);
 if(r)await del(g.flatMap(a=>a.slice(1).map(([k,e])=>[k,e.n])))}
/* OS drag-drop kwenye Desktop */
{const D2=$('#desk');D2.addEventListener('dragover',e=>{if(e.dataTransfer&&[...e.dataTransfer.types].includes('Files'))e.preventDefault()});D2.addEventListener('drop',e=>{if(e.target.closest('.w')||!e.dataTransfer||!e.dataTransfer.files.length)return;e.preventDefault();addFiles([...e.dataTransfer.files],'Desktop')})}
/* ================= EXPLORER PRO ================= */
window.explorer=function(f){
 let cur=(f===BIN||(f&&V.F[f]))?f:null,H=[cur],hi=0,last=null,arr=[],multi=0,lim=400,pt=0,est=0;const sel=new Set(),byK=new Map(),ex=new Set(),thc=new Map(),X=V.xs=Object.assign({by:'name',dir:'a',view:'det',pv:1,flt:'all'},V.xs||{});
 const root=E('div','xp');root.tabIndex=0;root.setAttribute('aria-label','File Explorer');
 root.innerHTML='<div class="xld"></div><div class="xt" role="toolbar" aria-label="Amri za faili"></div><div class="xa"><button class="xb xhb" aria-label="Folda">☰</button><button class="xb" title="Nyuma (Alt+←)" aria-label="Nyuma">←</button><button class="xb" title="Mbele (Alt+→)" aria-label="Mbele">→</button><button class="xb" title="Juu (Alt+↑)" aria-label="Juu">↑</button><button class="xb" title="Onyesha upya (F5)" aria-label="Onyesha upya">⟳</button><nav class="xc" aria-label="Anwani"></nav><input class="xq" type="search" placeholder="Tafuta (Ctrl+F)" aria-label="Tafuta"></div><div class="xm"><div class="xs" role="tree" aria-label="Folda"></div><div class="xg"><div class="xh"><span></span><span>Jina</span><span>Tarehe</span><span>Aina</span><span>Ukubwa</span></div><div class="xl" role="listbox" aria-multiselectable="true" aria-label="Faili"></div></div><div class="xv" aria-label="Preview"></div></div><div class="xf"><span class="x1"></span><span class="x2"></span></div>';
 const Q=s=>root.querySelector(s),tb=Q('.xt'),[hb,bkb,fwb,upb,rfb]=root.querySelectorAll('.xa>button'),cr=Q('.xc'),qi=Q('.xq'),side=Q('.xs'),lg=Q('.xl'),hd=Q('.xh'),pv=Q('.xv'),s1=Q('.x1'),s2=Q('.x2');
 const real=()=>cur&&cur!=='@recent'&&cur!==BIN&&V.F[cur]?cur:null,R=()=>[...sel].map(k=>byK.get(k)).filter(Boolean),S=()=>R().filter(r=>r.fo).map(r=>[r.fo,r.e.n]);
 const ctx={folder:real,S,all:()=>{arr.forEach(r=>sel.add(K(r.fo,r.e.n)));paint()}};
 const sv2=()=>{save();draw()},go=(c,p)=>{if(c&&c!=='@recent'&&!V.F[c])c=null;cur=c;sel.clear();last=null;lim=400;qi.value='';root.classList.remove('so');if(!p){H=H.slice(0,hi+1);H.push(c);hi++}draw()};
 const bk=()=>{if(hi>0){hi--;go(H[hi],1)}},fw=()=>{if(hi<H.length-1){hi++;go(H[hi],1)}},up=()=>go(cur&&cur!=='@recent'&&cur.includes('/')?cur.slice(0,cur.lastIndexOf('/')):null);
 bkb.onclick=bk;fwb.onclick=fw;upb.onclick=up;rfb.onclick=()=>{draw();toast('Imeonyeshwa upya')};hb.onclick=()=>root.classList.toggle('so');
 const mkDir=()=>cur===null?newF():real()?newF(real()):toast('Fungua folda kwanza','w');
 const dd=(r,it)=>menu(r.left,r.bottom+2,it),mark=(c,t)=>(c?'● ':'○ ')+t;
 const B=(ic,lb,tt,fn)=>{const b=E('button','xb','<span aria-hidden="true">'+ic+'</span><span class="xl2">'+lb+'</span>');b.title=tt||lb;b.setAttribute('aria-label',tt||lb);b.onclick=()=>{ACT=ctx;fn(b.getBoundingClientRect())};tb.append(b);return b};
 const one=fn=>{const s=S();if(s.length!==1){toast('Chagua kitu kimoja','w');return}fn(s[0])};
 B('➕','Mpya','Mpya',r=>dd(r,[['📁 Folda mpya (Ctrl+Shift+N)',mkDir,cur!==null&&!real()],['📄 Faili la maandishi',()=>mkFile(real()),!real()]]));
 tb.append(E('span','xsep'));
 B('✂️','Kata','Kata (Ctrl+X)',()=>cp(S(),1));B('⧉','Nakili','Nakili (Ctrl+C)',()=>cp(S(),0));B('📋','Bandika','Bandika (Ctrl+V)',()=>real()?paste(real()):toast('Fungua folda kubandika','w'));B('✏️','Jina','Badili jina (F2)',()=>one(a=>ren(...a)));B('🗑️','Futa','Futa (Del)',()=>S().length?del(S()):toast('Chagua kitu kwanza','w'));
 const rsb=B('↩️','Rejesha','Rejesha',()=>restore(S().length?S():V.F[BIN].map(e=>[BIN,e.n])));tb.append(E('span','xsep'));
 B('↕️','Panga','Panga',r=>dd(r,[['Jina',()=>{X.by='name';sv2()}],['Tarehe',()=>{X.by='date';sv2()}],['Aina',()=>{X.by='type';sv2()}],['Ukubwa',()=>{X.by='size';sv2()}],null,['⬆ Kupanda (A→Z)',()=>{X.dir='a';sv2()}],['⬇ Kushuka (Z→A)',()=>{X.dir='d';sv2()}]].map((a,i)=>a&&i<4?[mark(X.by===['name','date','type','size'][i],a[0]),a[1]]:a)));
 B('👁','Tazama','Mwonekano',r=>dd(r,[[mark(X.view==='grd','Gridi (icons kubwa)'),()=>{X.view='grd';sv2()}],[mark(X.view==='lst','Orodha'),()=>{X.view='lst';sv2()}],[mark(X.view==='det','Maelezo (Details)'),()=>{X.view='det';sv2()}],null,[(X.pv?'☑':'☐')+' Preview pane (Alt+P)',togPv],['🌓 Badili mada (Giza/Mwanga)',()=>{Sx.dark=Sx.dark?0:1;document.body.classList.toggle('dark',!!Sx.dark);sv()}]]));
 B('⏷','Chuja','Chuja kwa aina',r=>dd(r,[['all','Zote'],['dir','Folda'],['img','Picha'],['vid','Video'],['aud','Sauti'],['txt','Maandishi'],['doc','Hati'],['app','Programu']].map(([k,t])=>[mark(X.flt===k,t),()=>{X.flt=k;sv2()}])));
 B('⬆️','Pakia','Pakia kutoka Kompyuta',r=>dd(r,[['📤 Pakia faili',()=>pickUpload(real()),!real()],['📂 Pakia folda nzima',()=>pickUpload(real(),1),!real()]]));B('⬇️','Pakua','Pakua (Download)',()=>S().length?saveOut(S()):toast('Chagua faili kwanza','w'));
 const mb=B('☑','Chagua','Chagua vingi (multi-select)',()=>{multi=!multi;mb.classList.toggle('on',!!multi)});
 B('⋯','','Zaidi',r=>dd(r,[['Chagua zote (Ctrl+A)',ctx.all],['ℹ️ Properties (Alt+Enter)',()=>props(R().length?R():[curRec()])],['🔍 Tafuta faili nakala (duplicates)',findDup],['🖥️ Tuma Desktop',()=>{xfer(S(),'Desktop',0);persist()},!S().length],cur===BIN?['🧹 Mwaga Recycle Bin',()=>del(V.F[BIN].map(e=>[BIN,e.n])),!V.F[BIN].length]:null].filter(Boolean)));
 const curRec=()=>{if(!real())return null;if(!cur.includes('/'))return{fo:'',e:{n:cur,dir:1,top:1}};const p=cur.slice(0,cur.lastIndexOf('/')),n=cur.slice(cur.lastIndexOf('/')+1);const e=get(p,n);return e&&{fo:p,e}};
 const togPv=()=>{X.pv=X.pv?0:1;save();layout()};
 const layout=()=>{const w=root.clientWidth;root.classList.toggle('nar',w<600);root.classList.toggle('nopv',w<980);root.classList.toggle('cmp',(lg.clientWidth||w)<560);root.classList.toggle('hpv',!X.pv);['grd','lst','det'].forEach(v=>root.classList.toggle(v,X.view===v))};
 const ro=window.ResizeObserver?new ResizeObserver(layout):null;
 /* --- orodha, utafutaji, kupanga --- */
 const cmp=(a,b)=>{if(!!a.e.dir!==!!b.e.dir)return a.e.dir?-1:1;const p=isFr(FK(a.fo,a.e.n)),q=isFr(FK(b.fo,b.e.n));if(p!==q)return p?-1:1;let r=0;if(X.by==='date')r=(a.e.mt||0)-(b.e.mt||0);else if(X.by==='size')r=(a.e.sz||0)-(b.e.sz||0);else if(X.by==='type')r=xe(a.e.n).localeCompare(xe(b.e.n));
  if(!r)r=a.e.n.localeCompare(b.e.n,undefined,{sensitivity:'base',numeric:true});return r*(X.dir==='d'?-1:1)};
 const items=()=>{const q=qi.value.trim().toLowerCase();let L=[];
  if(q){const ks=cur&&cur!=='@recent'?sub(cur):Object.keys(V.F).filter(k=>k!==BIN&&!k.startsWith(BIN+'/'));ks.forEach(k=>V.F[k].forEach(e=>{if(e.n.toLowerCase().includes(q))L.push({e,fo:k,p:1})}))}
  else if(cur==='@recent')L=(V.rc||[]).map(r=>{const e=get(r.fo,r.n);return e&&{e,fo:r.fo}}).filter(Boolean);
  else if(cur)L=V.F[cur].map(e=>({e,fo:cur}));else L=keys().map(k=>({e:{n:k,dir:1,top:1,o:['Folda',k],id:'t'+k},fo:''}));
  if(X.flt!=='all')L=L.filter(r=>kind(r.e)===X.flt);if(cur!==null&&!(cur==='@recent'&&!q))L.sort(cmp);return L};
 const paint=()=>{lg.querySelectorAll('.xi').forEach(i=>{const r=arr[+i.dataset.i],on=r&&sel.has(K(r.fo,r.e.n));i.classList.toggle('sel',!!on);i.setAttribute('aria-selected',!!on)});stat2();pvUp()};
 const stat2=()=>{const r=R();s1.textContent=arr.length+' vitu'+(r.length?'  ·  '+r.length+' vimechaguliwa'+(r.some(x=>!x.e.dir)?' ('+SZ(r.reduce((a,x)=>a+(x.e.dir?0:x.e.sz||0),0))+')':''):'')+(CB?'  ·  📋 '+CB.items.length+(CB.cut?' vimekatwa':' vimenakiliwa'):'')};
 const pvUp=()=>{clearTimeout(pt);pt=setTimeout(()=>{if(!X.pv||root.classList.contains('nopv')||!root.isConnected)return;const r=R();if(r.length===1)renderPrev(r[0].e,r[0].fo,pv,false);else{(pv._u||[]).forEach(u=>URL.revokeObjectURL(u));pv._u=[];pv.innerHTML='<div class="xpc"><small>'+(r.length?r.length+' vimechaguliwa':'Chagua faili kuona preview')+'</small></div>'}},130)};
 const pick=(k,e)=>{const ks=arr.map(r=>K(r.fo,r.e.n));if(multi||e.ctrlKey||e.metaKey){sel.has(k)?sel.delete(k):sel.add(k)}else if(e.shiftKey&&last!=null){const a=ks.indexOf(last),b=ks.indexOf(k);if(a>=0&&b>=0){if(!e.ctrlKey)sel.clear();ks.slice(Math.min(a,b),Math.max(a,b)+1).forEach(x=>sel.add(x))}}else{sel.clear();sel.add(k)}last=k;paint()};
 const open=r=>{const e=r.e;if(e.top)return go(e.n);if(r.fo===BIN){toast('Rejesha kwanza ili kufungua "'+e.n+'"','w');return}if(e.dir)return go(pk(r.fo,e.n));openE(e)};
 const crumb=()=>{cr.innerHTML='';const P=[['💻 Kompyuta Hii',null],['Diski (C:)',null]];if(cur==='@recent')P.push(['Hivi karibuni','@recent']);else if(cur){let p='';cur.split('/').forEach((s,i)=>{p=i?p+'/'+s:s;P.push([i?s:lab(s),p])})}
  P.forEach(([t,p],i)=>{if(i)cr.append(E('i','','›'));const b=E('button','',esc(t));b.onclick=()=>go(p);if(i===P.length-1)b.setAttribute('aria-current','page');cr.append(b)});cr.scrollLeft=1e5};
 const drawSide=()=>{side.innerHTML='';if(cur&&cur.includes('/')){let p='';cur.split('/').slice(0,-1).forEach((s,i)=>{p=i?p+'/'+s:s;ex.add(p)})}
  const add=(k,label,ic,dep)=>{const kids=k&&k!=='@recent'&&k!==BIN&&V.F[k]?V.F[k].filter(e=>e.dir):[],open=ex.has(k),d=E('div','xs1'+(k===cur?' on':''));d.setAttribute('role','treeitem');d.style.paddingLeft=6+dep*14+'px';if(k&&k!=='@recent')d.dataset.fold=k;
   d.innerHTML='<i class="xch">'+(kids.length?(open?'▾':'▸'):'')+'</i><span>'+ic+'</span><span class="xsn">'+esc(label)+'</span>';d.querySelector('.xch').onclick=ev=>{ev.stopPropagation();open?ex.delete(k):ex.add(k);drawSide()};d.onclick=()=>go(k);
   lp(d,(x,y)=>menu(x,y,[['Fungua',()=>go(k)]]));side.append(d);if(kids.length&&open)kids.sort((a,b)=>a.n.localeCompare(b.n)).forEach(e=>add(pk(k,e.n),e.n,FD(e.n),dep+1))};
  add('@recent','Hivi karibuni','🕘',0);add(null,'Kompyuta Hii',IA('pc'),0);keys().forEach(k=>add(k,lab(k),FD(k),1));side.append(E('div','xsp'));const m=E('div','xsm');side.append(m);
  if(navigator.storage&&navigator.storage.estimate&&Date.now()-est>3000){est=Date.now();navigator.storage.estimate().then(s=>{m.textContent='💾 '+SZ(s.usage||0)+' / '+SZ(s.quota||0);s2.textContent=m.textContent}).catch(()=>{})}};
 function draw(){while(cur&&cur!=='@recent'&&!V.F[cur])cur=cur.includes('/')?cur.slice(0,cur.lastIndexOf('/')):null;layout();rsb.style.display=cur===BIN?'':'none';
  const q=qi.value.trim();arr=items();byK.clear();arr.forEach(r=>byK.set(K(r.fo,r.e.n),r));[...sel].forEach(k=>{if(!byK.has(k))sel.delete(k)});
  hd.querySelectorAll('span').forEach((s,i)=>{const b=['','name','date','type','size'][i];if(b)s.textContent=['','Jina','Tarehe','Aina','Ukubwa'][i]+(X.by===b?(X.dir==='a'?' ▲':' ▼'):'')});
  let h='';arr.slice(0,lim).forEach((r,i)=>{const e=r.e,k=K(r.fo,e.n),cut=CB&&CB.cut&&CB.items.some(x=>x[0]===r.fo&&x[1]===e.n),ic=e.dir?FD(e.n):fi(e.o?e.o[1]:e.n),fd=e.dir&&r.fo!==BIN?e.top?e.n:pk(r.fo,e.n):'';
   h+='<div class="xi'+(sel.has(k)?' sel':'')+(cut?' cut':'')+'" role="option" aria-selected="'+sel.has(k)+'" data-i="'+i+'"'+(fd?' data-fold="'+attr(fd)+'"':'')+'><span class="xn" aria-hidden="true">'+ic+'</span><span class="xe" title="'+attr(e.n)+'">'+(isFr(FK(r.fo,e.n))?'📌 ':'')+esc(e.n)+(r.p||cur==='@recent'?'<small>'+esc(r.fo.replace(/\//g,' › '))+'</small>':'')+'</span><span class="xd2">'+DT(e.mt)+'</span><span class="xt2">'+esc(TY(e))+'</span><span class="xz">'+(e.dir?(e.top?V.F[e.n].length+' vitu':''):e.bk?SZ(e.sz||0):'')+'</span></div>'});
  if(!arr.length)h='<div class="xem">'+(q?'Hakuna matokeo ya "'+esc(q)+'"':cur===BIN?'Recycle Bin ni tupu':cur==='@recent'?'Hakuna faili ulizofungua hivi karibuni':'Folda hii ni tupu — buruta faili hapa, au bonyeza "Pakia"')+'</div>';
  if(arr.length>lim)h+='<button class="xmore">Onyesha zaidi ('+(arr.length-lim)+' zimebaki)</button>';lg.innerHTML=h;lg.dataset.fold=real()||(cur===BIN?BIN:'');
  crumb();drawSide();stat2();pvUp();
  lg.querySelectorAll('.xi').forEach(el=>{const r=arr[+el.dataset.i],e=r.e;if(!e.bk||kind(e)!=='img'||(e.sz||0)>8e6||thc.size>150&&!thc.has(e.bk))return;const n=el.querySelector('.xn'),use=u=>{n.style.backgroundImage='url("'+u+'")';n.classList.add('th')};
   if(thc.has(e.bk))return use(thc.get(e.bk));bget(e.bk).then(b=>{if(!b||!root.isConnected)return;const u=URL.createObjectURL(b);thc.set(e.bk,u);use(u)}).catch(()=>{})})}
 /* --- matukio --- */
 const rec=t=>{const i=t.closest&&t.closest('.xi');return i?arr[+i.dataset.i]:null};
 root.addEventListener('pointerdown',()=>{ACT=ctx});
 lg.onclick=e=>{ACT=ctx;if(e.target.closest('.xmore')){lim+=400;draw();return}const r=rec(e.target);if(!r){if(!e.ctrlKey&&!e.shiftKey){sel.clear();paint()}return}
  if(TAP&&!multi&&!e.ctrlKey&&!e.shiftKey){if(Date.now()-lpT>700)open(r);return}pick(K(r.fo,r.e.n),e)};
 lg.ondblclick=e=>{if(TAP)return;const r=rec(e.target);r&&Date.now()-lpT>700&&open(r)};
 lg.onpointerdown=e=>{ACT=ctx;if(e.pointerType!=='mouse'||e.button)return;const r=rec(e.target);if(!r||!r.fo)return;const k=K(r.fo,r.e.n);if(!sel.has(k)&&!e.ctrlKey){sel.clear();sel.add(k);paint()}drag(e,S)};
 hd.onclick=e=>{const i=[...hd.children].indexOf(e.target.closest('span')),b=['','name','date','type','size'][i];if(!b)return;if(X.by===b)X.dir=X.dir==='a'?'d':'a';else{X.by=b;X.dir='a'}sv2()};
 side.addEventListener('pointerdown',e=>e.stopPropagation(),false);
 lg.ondragover=e=>{if(e.dataTransfer&&[...e.dataTransfer.types].includes('Files')){e.preventDefault();lg.classList.add('dz')}};lg.ondragleave=()=>lg.classList.remove('dz');
 lg.ondrop=e=>{lg.classList.remove('dz');if(!e.dataTransfer||!e.dataTransfer.files.length)return;e.preventDefault();addFiles([...e.dataTransfer.files],real())};
 const itemMenu=(x,y)=>{const rs=R(),bin=cur===BIN,it=S(),single=rs.length===1,anyDir=rs.some(r=>r.e.dir);
  if(rs.some(r=>!r.fo)){const k=rs[0].e.n;return menu(x,y,[['Fungua',()=>go(k)],['ℹ️ Properties',()=>props(rs)],V.U.includes(k)?['🗑️ Futa folda',()=>delF(k)]:null].filter(Boolean))}
  menu(x,y,bin?[['↩️ Rejesha (Restore)',()=>restore(it)],['🗑️ Futa kabisa',()=>del(it)],null,['ℹ️ Properties',()=>props(rs)]]:
   [['Fungua (Enter)',()=>rs.forEach(open)],null,['✂️ Kata',()=>cp(it,1)],['⧉ Nakili',()=>cp(it,0)],['⧉ Tengeneza nakala (Ctrl+D)',()=>dupl(it)],['✏️ Badili jina (F2)',()=>ren(...it[0]),!single],['🗑️ Futa (Del)',()=>del(it)],null,['⬇️ Pakua',()=>saveOut(it)],['🖥️ Tuma Desktop',()=>{xfer(it,'Desktop',0);persist()},cur==='Desktop'],['📌 Pin Taskbar',()=>{it.forEach(a=>pinFile(...a));persist()},anyDir],['🔲 Pin Start',()=>{it.forEach(a=>startFile(...a));persist()},anyDir],null,['ℹ️ Properties (Alt+Enter)',()=>props(rs)]])};
 const bgMenu=(x,y)=>menu(x,y,[['📁 Folda mpya',mkDir,cur!==null&&!real()],['📄 Faili jipya la maandishi',()=>mkFile(real()),!real()],null,['📋 Bandika',()=>paste(real()),!CB||!real()],['📤 Pakia faili',()=>pickUpload(real()),!real()],['☑ Chagua zote',ctx.all],null,
  [X.view==='det'?'▦ Onyesha kama Gridi':'☰ Onyesha kama Maelezo',()=>{X.view=X.view==='det'?'grd':'det';sv2()}],['🔄 Onyesha upya',draw],cur===BIN?['🧹 Mwaga Recycle Bin',()=>del(V.F[BIN].map(e=>[BIN,e.n])),!V.F[BIN].length]:undefined,['ℹ️ Properties ya folda',()=>props([curRec()]),!curRec()]].filter(a=>a!==undefined));
 lp(lg,(x,y,e)=>{ACT=ctx;const r=rec(e.target);if(r){const k=K(r.fo,r.e.n);if(!sel.has(k)){sel.clear();sel.add(k);paint()}itemMenu(x,y)}else bgMenu(x,y)});
 qi.oninput=()=>{lim=400;draw()};
 root.onkeydown=e=>{if(/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)){if(e.key==='Escape'&&e.target===qi){qi.value='';draw();root.focus()}return}const c=e.ctrlKey||e.metaKey,k=e.key,kl=k.toLowerCase();
  if(k==='Enter'&&e.altKey){e.preventDefault();props(R());return}if(k==='Enter'){R().forEach(open);return}
  if(k==='Backspace'||(e.altKey&&k==='ArrowLeft')){e.preventDefault();bk();return}if(e.altKey&&k==='ArrowRight'){fw();return}if(e.altKey&&k==='ArrowUp'){up();return}
  if(k==='F5'){e.preventDefault();draw();return}if(c&&kl==='f'){e.preventDefault();qi.focus();return}if(c&&e.shiftKey&&kl==='n'){e.preventDefault();mkDir();return}if(c&&kl==='d'){e.preventDefault();dupl(S());return}if(e.altKey&&kl==='p'){togPv();return}
  if(k==='Escape'){sel.clear();paint();return}
  if(k.startsWith('Arrow')&&arr.length){e.preventDefault();const cols=X.view==='grd'?Math.max(1,Math.floor(lg.clientWidth/108)):1,d=k==='ArrowRight'?1:k==='ArrowLeft'?-1:k==='ArrowDown'?cols:-cols,ks=arr.map(r=>K(r.fo,r.e.n));let i=last?ks.indexOf(last):-1;i=Math.max(0,Math.min(ks.length-1,i<0?0:i+d));
   if(i>=lim){lim=i+60;draw()}if(!e.shiftKey)sel.clear();sel.add(ks[i]);last=ks[i];paint();const el=lg.querySelector('[data-i="'+i+'"]');el&&el.scrollIntoView({block:'nearest'})}};
 EXP.add(draw);ro&&ro.observe(root);
 const w=win('Explorer',FD('Nyaraka'),880,540,root,()=>{EXP.delete(draw);ro&&ro.disconnect();clearTimeout(pt);thc.forEach(u=>URL.revokeObjectURL(u));(pv._u||[]).forEach(u=>URL.revokeObjectURL(u));if(ACT===ctx)ACT=dctx});
 draw();setTimeout(()=>{layout();root.focus()},0);return w};

/* ===== AUTO-SAVE: kazi ya programu inahifadhiwa kwenye Explorer unapofunga dirisha (✕) ===== */
const SESS=new Set();
const AS_SKIP=/passwords|vault|calc|weather|clock|maps|navigator|news|taskmanager|process|network|msinfo|system-info|charmap|character|crypto|money|currency|converter|qr-?code|games|game-center|mediaplayer|media-player|youtube|facebook|instagram|tiktok|edge|chrome|firefox|browser|store|camera|photos|gallery|devicemanager|hardware|accessibility|text-?to-?speech|diskcleanup|disk-cleaner|clipboard|backup|screen-?recorder|voice-?recorder|regedit|registry/i;
const AS_RULES=[
 [/paint|draw|circuit|color-?picker/i,{m:'canvas',fo:'Picha (Pictures)',ext:'png'}],
 [/excel|spreadsheet/i,{m:'csv',fo:'Nyaraka (Documents)',ext:'csv'}],
 [/word|writer|wordpad|rich-text/i,{m:'html',fo:'Nyaraka (Documents)',ext:'html'}],
 [/python|script-ide/i,{m:'text',fo:'Code (Dev)',ext:'py'}],
 [/html-css-js|visual-studio|code-editor|dev-toolbox/i,{m:'text',fo:'Code (Dev)',ext:'auto'}],
 [/notepad|text-?pad|onenote|notebook|stickynotes|quick-notes|todo|task-list|powerpoint|presenter|contacts|dictionary|encyclopedia|knowledge|translator/i,{m:'text',fo:'Nyaraka (Documents)',ext:'txt',min:1}]
];
const asRule=n=>{const k=n+' '+(AL[n]||'');if(AS_SKIP.test(k))return null;for(const[r,v]of AS_RULES)if(r.test(k))return v;return{m:'text',fo:'Nyaraka (Documents)',ext:'txt',min:10}};
const dataBlob=u=>{const i=u.indexOf(','),m=/:(.*?);/.exec(u.slice(0,i)),bin=atob(u.slice(i+1)),a=new Uint8Array(bin.length);for(let j=0;j<bin.length;j++)a[j]=bin.charCodeAt(j);return new Blob([a],{type:m?m[1]:'application/octet-stream'})};
const guessExt=t=>/^\s*<(!doctype|html)/i.test(t)?'html':/^\s*(def |import |from \w+ import|print\()/m.test(t)?'py':/#include\s*</.test(t)?'cpp':/\bSELECT\b[\s\S]*\bFROM\b/i.test(t)?'sql':/\b(function|const|let|var)\b|=>/.test(t)?'js':'txt';
const docOf=fr=>{try{return fr.contentDocument}catch(_){return null}};
function asSnap(S){
 const d=docOf(S.fr);if(!d||!d.body)return null;const R=S.rule;
 if(R.m==='canvas'){let best=null,ba=0;d.querySelectorAll('canvas').forEach(c=>{const a=c.width*c.height;if(a>ba){ba=a;best=c}});if(!best||ba<2500)return null;
  try{const u=best.toDataURL('image/png'),z=document.createElement('canvas');z.width=best.width;z.height=best.height;if(u===z.toDataURL('image/png'))return null;return{sig:'c'+u,blob:dataBlob(u),ext:'png',fo:R.fo}}catch(_){return null}}
 if(R.m==='csv'){let best=null,bc=0;d.querySelectorAll('table').forEach(t=>{const c=t.querySelectorAll('td,th').length;if(c>bc){bc=c;best=t}});
  if(best){const rows=[...best.rows].map(r=>[...r.cells].map(c=>{const i=c.querySelector('input,textarea');return String(i?i.value:c.innerText).trim()}));
   while(rows.length&&rows[rows.length-1].every(v=>!v))rows.pop();if(rows.some(r=>r.some(v=>v))){const csv=rows.map(r=>r.map(v=>/[",\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v).join(',')).join('\n');return{sig:'v'+csv,blob:new Blob([csv],{type:'text/csv'}),ext:'csv',fo:R.fo}}}}
 const html=R.m==='html',parts=[];
 d.querySelectorAll('textarea').forEach(a=>{if(a.value&&a.value.trim())parts.push(a.value)});
 d.querySelectorAll('[contenteditable]:not([contenteditable="false"])').forEach(el=>{if(el.parentElement&&el.parentElement.closest('[contenteditable]'))return;const v=html?el.innerHTML:el.innerText;if(v&&v.replace(/<br\s*\/?>|&nbsp;|\s/g,'').length)parts.push(v)});
 if(!parts.length&&d.designMode==='on'){const v=html?d.body.innerHTML:d.body.innerText;if(v&&v.trim())parts.push(v)}
 if(!parts.length)return null;let txt=html?parts.join('<hr>'):parts.join('\n\n');
 if(!html&&txt.trim().length<(R.min||1))return null;
 let ext=R.ext==='auto'?guessExt(txt):R.ext,type='text/plain';
 if(html){txt='<!doctype html><meta charset="utf-8"><title>'+esc(S.title)+'</title>\n'+txt;type='text/html'}
 return{sig:'t'+ext+txt,blob:new Blob([txt],{type}),ext,fo:R.fo}}
const asFind=id=>{for(const k of Object.keys(V.F)){const e=V.F[k].find(x=>x.id===id);if(e)return{fo:k,e}}return null};
const asStamp=()=>{const d=new Date(),p=x=>String(x).padStart(2,'0');return d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate())+' '+p(d.getHours())+'.'+p(d.getMinutes())};
const fpath=k=>{const p=k.split('/');return [lab(p[0]),...p.slice(1)].join(' › ')};
const asFolders=()=>{const L=[];keys().filter(k=>k!==BIN).forEach(k=>sub(k).sort().forEach(x=>{if(V.F[x]&&x!==BIN&&!x.startsWith(BIN+'/'))L.push(x)}));return L};
/* hifadhi: pick={fo,name}; inarudisha true/false */
async function asSave(S,s,final,pick){
 if(!s)return false;
 try{
  let fo=pick&&V.F[pick.fo]&&pick.fo!==BIN?pick.fo:(s.fo&&V.F[s.fo]?s.fo:'Nyaraka (Documents)'),e=null,created=false;
  if(S.id){const f=asFind(S.id);if(f&&f.fo!==BIN&&!f.fo.startsWith(BIN+'/')){e=f.e;fo=f.fo}}
  if(e&&Object.values(V.F).some(L=>L.some(x=>x!==e&&x.bk===e.bk)))e.bk=uid();
  const bk=e?e.bk:uid();await bput(bk,s.blob);const t=Date.now(),h=await sha(s.blob);
  if(!e){let nm=((pick&&pick.name)||s.name||(S.title+' '+asStamp())).trim().replace(/[\\/:*?"<>|]/g,'_');if(!/\.[A-Za-z0-9]{1,8}$/.test(nm))nm+='.'+s.ext;nm=uniq(fo,nm);
   e={n:nm,o:['Upload',nm],id:uid(),bk,sz:s.blob.size,ct:t,mt:t,h,ty:s.blob.type||''};V.F[fo].push(e);S.id=e.id;created=true}
  else{e.sz=s.blob.size;e.mt=t;e.h=h}
  S.last=s.sig;persist();if(created)try{rcAdd(e)}catch(_){}
  if(final)toast('Kazi yako imehifadhiwa: '+fpath(fo)+' › '+e.n);
  return true
 }catch(x){toast('Imeshindwa kuhifadhi kazi: '+(x&&x.message||x),'e');return false}}
/* Dirisha la kuuliza: jina la faili + chagua folda. Inarudisha 'saved' | 'no' | 'cancel' */
async function asAsk(S,x){
 let name=S.title+' '+asStamp()+'.'+x.ext,sel=x.fo&&V.F[x.fo]?x.fo:'Nyaraka (Documents)',err='';
 for(;;){
  const box=E('div'),msg=E('p','',''),lb1=E('div'),inp=E('input'),er=E('div','xer',esc(err)),lb2=E('div'),list=E('div');
  msg.innerHTML='Umefanya kazi kwenye <b>'+esc(S.title)+'</b>. Unataka kuihifadhi? Andika jina la faili, kisha chagua folda ya kuihifadhia — utaipata baadaye kupitia Explorer.';
  lb1.innerHTML='<b>Jina la faili</b>';lb1.style.cssText='margin:8px 0 4px';inp.value=name;inp.setAttribute('aria-label','Jina la faili');inp.style.cssText='width:100%;box-sizing:border-box';
  lb2.innerHTML='<b>Hifadhi kwenye folda</b>';lb2.style.cssText='margin:10px 0 4px';
  list.style.cssText='max-height:220px;overflow:auto;border:1px solid rgba(128,128,128,.35);border-radius:8px;padding:4px';list.setAttribute('role','listbox');
  const paint=()=>{[...list.children].forEach(r=>{const on=r.dataset.k===sel;r.style.background=on?'rgba(30,136,229,.22)':'transparent';r.style.fontWeight=on?'700':'400';r.setAttribute('aria-selected',on)})};
  asFolders().forEach(k=>{const dep=k.split('/').length-1,top=k.split('/')[0],r=E('div','','<span style="width:26px;height:26px;display:inline-flex">'+FD(top)+'</span><span>'+esc(dep?k.split('/').pop():lab(k))+(dep?'':'')+'</span>');
   r.dataset.k=k;r.setAttribute('role','option');r.style.cssText='display:flex;align-items:center;gap:8px;padding:5px 8px;border-radius:6px;cursor:pointer;margin-left:'+dep*18+'px';r.title=fpath(k);r.onclick=()=>{sel=k;paint()};r.ondblclick=()=>{sel=k;paint();const o=box.closest('.xd');o&&o.querySelector('.pri').click()};list.append(r)});
  inp.onkeydown=ev=>{if(ev.key==='Enter'){const o=box.closest('.xd');o&&o.querySelector('.pri').click()}};
  box.append(msg,lb1,inp,er,lb2,list);paint();
  const r=await dlg('Hifadhi kazi yako?',box,[['Ghairi',null],['Usihifadhi',()=>({a:'no'})],['Hifadhi',()=>({a:'save',name:inp.value.trim(),fo:sel}),1]]);
  if(!r)return 'cancel';if(r.a==='no')return 'no';
  name=r.name;sel=r.fo;err=vbase(name);if(err)continue;
  return (await asSave(S,x,true,{fo:sel,name}))?'saved':'cancel'}}
/* kamata kitufe cha ✕: guard() inaamua kama dirisha lifungwe */
function hookClose(w,guard){const oc=w.close;let bz=false;
 w.close=function(){if(bz||!w.el.isConnected)return;bz=true;Promise.resolve().then(guard).then(ok=>{bz=false;if(ok!==false)oc.call(w)}).catch(()=>{bz=false;oc.call(w)})};
 const xb=w.el.querySelector('.h .x');if(xb)xb.onclick=()=>w.close()}
function asTrack(w,n){
 const fr=w.el.querySelector('iframe');if(!fr)return;const rule=asRule(n);if(!rule)return;
 const S={fr,rule,title:TT(n),id:null,last:null,init:null,pushed:false};SESS.add(S);
 fr.addEventListener('load',()=>setTimeout(()=>{try{const x=asSnap(S);S.init=x?x.sig:null}catch(_){}},1500));
 hookClose(w,async()=>{
  if(S.pushed){SESS.delete(S);return true}
  const x=asSnap(S);if(!x||(!S.id&&x.sig===S.init)||x.sig===S.last){SESS.delete(S);return true}
  const r=await asAsk(S,x);if(r==='cancel')return false;SESS.delete(S);return true})
}
/* Programu inaweza kutuma kazi yake moja kwa moja: parent.postMessage({sadeSave:{name,text|dataUrl,mime,ext,folder}},'*') */
addEventListener('message',e=>{const m=e.data&&e.data.sadeSave;if(!m)return;let S=null;SESS.forEach(x=>{try{if(x.fr.contentWindow===e.source)S=x}catch(_){}});if(!S)return;
 try{let ext=String(m.ext||(m.name&&m.name.includes('.')?m.name.split('.').pop():'')||(m.dataUrl?'png':'txt')).toLowerCase().replace(/[^a-z0-9]/g,''),blob=m.dataUrl?dataBlob(m.dataUrl):new Blob([String(m.text||'')],{type:m.mime||'text/plain'}),
  fo=m.folder&&V.F[m.folder]&&m.folder!==BIN?m.folder:EX.img.split(',').includes(ext)?'Picha (Pictures)':EX.vid.split(',').includes(ext)?'Video (Videos)':EX.aud.split(',').includes(ext)?'Muziki (Music)':/^(py|js|ts|java|cpp|php|sql|css|json|xml|html)$/.test(ext)?'Code (Dev)':'Nyaraka (Documents)',
  nm=m.name?String(m.name).replace(/\.[^.]*$/,''):null;S.pushed=true;asSave(S,{sig:'p'+(m.dataUrl||m.text)+ext,blob,ext,fo,name:nm},!!m.final)}catch(_){}});
{const _of=openF;openF=function(f,n){const n0=wins.length,r=_of.apply(this,arguments);try{if(wins.length>n0)asTrack(wins[wins.length-1],n)}catch(_){}return r}}
})();
