/* ============================================================
   account.js — Akaunti: Firebase Auth + Firestore (kusawazisha data/mafaili) + kurudisha madirisha
   (Inapakiwa kama script ya kawaida; inashiriki global scope na moduli nyingine.
    Mpangilio wa kupakia umo ndani ya index.html — usiubadilishe.)
   ============================================================ */

/* ---------- Akaunti (Firebase) ---------- */
/* ===== AKAUNTI (Firebase Auth + Firestore) ===== */
(()=>{
const CFG={apiKey:"AIzaSyDCKHDp1VpDTRr4-HGqgE1OFkEwWIDZyqI",authDomain:"sadegpt-f79d7.firebaseapp.com",projectId:"sadegpt-f79d7",storageBucket:"sadegpt-f79d7.firebasestorage.app",messagingSenderId:"474328809093",appId:"1:474328809093:web:e3f1199223bf80369fb3ec",measurementId:"G-7FVTDRC5Y2"};
const SDK='https://www.gstatic.com/firebasejs/10.12.2/',LS=localStorage,CH=250000;
let auth,db,user=null,ready=false,busy=false,pending=false,last='',upT,unsub=null;
const load=u=>new Promise((res,rej)=>{const s=document.createElement('script');s.src=u;s.onload=res;s.onerror=()=>rej(new Error('sdk'));document.head.append(s)});
const nm=u=>u.displayName||(u.email||'').split('@')[0];
const ref=()=>db.collection('users').doc(user.uid);
const say=(m,t)=>{try{toast(m,t)}catch(_){}};
const ERR={'auth/invalid-email':'Email si sahihi','auth/email-already-in-use':'Email hii tayari imesajiliwa. Tumia "Ingia"','auth/weak-password':'Nenosiri liwe na angalau herufi 6','auth/invalid-credential':'Email au nenosiri si sahihi. Kama ulijisajili kwa Google, tumia "Endelea na Google"','auth/user-not-found':'Email au nenosiri si sahihi','auth/wrong-password':'Email au nenosiri si sahihi','auth/network-request-failed':'Hakuna mtandao','auth/operation-not-allowed':'Email/Password haijawashwa kwenye Firebase Console','auth/too-many-requests':'Umejaribu mara nyingi, subiri kidogo','auth/missing-password':'Weka nenosiri','auth/unauthorized-domain':'Domain hii haijaruhusiwa kwenye Firebase (Authentication → Settings → Authorized domains)','auth/account-exists-with-different-credential':'Email hii imesajiliwa kwa njia nyingine ya kuingia','auth/popup-blocked':'Kivinjari kimezuia dirisha la Google'};
const em=e=>ERR[e&&e.code]||('Hitilafu: '+((e&&e.message)||e));
const why=e=>{const c=(e&&e.code)||'',m=(e&&e.message)||'';
 if(c==='permission-denied')return 'Firestore Rules hazijaruhusu akaunti hii kuhifadhi data. Weka rules za users/{uid}.';
 if(c==='not-found'||/does not exist|NOT_FOUND/i.test(m))return 'Firestore Database haijaundwa. Kwenye Firebase Console: Firestore Database → Create database.';
 if(c==='unavailable'||c==='deadline-exceeded')return 'Mtandao hautoshi, itajaribu tena.';
 return em(e)};
const WEB=/^https?:$/.test(location.protocol);
let syncMsg='',booting=null,lastAD='',lastWs='',wsReady=false,restored=false;

async function pull(){
 const d=await ref().get();if(!d.exists)return null;const m=d.data();LS.setItem('sadets',m.updated||0);
 const ps=await Promise.all(Array.from({length:m.n||0},(_,i)=>ref().collection('chunks').doc('c'+i).get()));
 return ps.map(p=>p.data().t).join('');
}
async function push(){
 if(!user||!ready||busy)return;const s=JSON.stringify(V);
 if(s===last){LS.removeItem('sadedirty');return}
 busy=true;pending=false;let ok=false;
 try{
  const parts=[];for(let i=0;i<s.length;){let j=Math.min(i+CH,s.length);const c=s.charCodeAt(j-1);if(j<s.length&&c>=0xD800&&c<=0xDBFF)j--;parts.push(s.slice(i,j));i=j}
  const old=await ref().get(),oldN=old.exists?(old.data().n||0):0,b=db.batch();
  parts.forEach((t,i)=>b.set(ref().collection('chunks').doc('c'+i),{t}));
  for(let i=parts.length;i<oldN;i++)b.delete(ref().collection('chunks').doc('c'+i));
  const ts=Date.now();LS.setItem('sadets',ts);b.set(ref(),{n:parts.length,updated:ts,email:user.email||''},{merge:true});
  await b.commit();last=s;ok=true;syncMsg='';LS.setItem('sadesync',Date.now());LS.removeItem('sadedirty');LS.setItem('sadeuid',user.uid);
 }catch(e){console.warn('sync',e);LS.setItem('sadedirty','1');syncMsg=why(e);say('Imeshindwa kuhifadhi mtandaoni: '+syncMsg,'w')}
 finally{busy=false}
 if(ok&&JSON.stringify(V)!==last){clearTimeout(upT);pending=true;upT=setTimeout(push,2500)}
}
function apply(json){
 const o=JSON.parse(json);
 Object.keys(V).forEach(k=>{if(k!=='set')delete V[k]});
 Object.keys(o).forEach(k=>{if(k==='set')Object.assign(V.set,o.set);else V[k]=o[k]});
 if(V.appdata){Object.keys(V.appdata).forEach(k=>{try{LS.setItem(k,V.appdata[k])}catch(_){}});lastAD=JSON.stringify(V.appdata);mirrorFile(V.appdata)}
 try{purgeSeed()}catch(_){}
 LS.setItem(VK,JSON.stringify(V));window.saveV&&window.saveV();
 try{refresh()}catch(_){}try{applyS()}catch(_){}
}
const _sv=window.saveV;
window.saveV=function(){_sv&&_sv.apply(this,arguments);if(user&&ready){LS.setItem('sadedirty','1');clearTimeout(upT);pending=true;upT=setTimeout(push,2500)}else if(!user)LS.setItem('sadeguest','1')};


/* ----- Hifadhi ya mafaili kwenye akaunti (Firestore, vipande vya 700KB) ----- */
const PART=700000,MAXB=40*1024*1024;
const bref=k=>ref().collection('files').doc(String(k).replace(/[\/\s]/g,'_'));
const cloud={
 async put(k,b,o){
  if(b.size>MAXB)throw new Error('Faili ni kubwa mno (zaidi ya 40MB)');
  const r=bref(k),old=await r.get();
  if(o&&o.skipExisting&&old.exists&&old.data().size===b.size){BS.known.add(k);return}
  const u8=new Uint8Array(await b.arrayBuffer()),n=Math.max(1,Math.ceil(u8.length/PART));
  for(let i=0;i<n;i+=6){const bt=db.batch();for(let j=i;j<Math.min(n,i+6);j++)bt.set(r.collection('parts').doc(String(j)),{b:firebase.firestore.Blob.fromUint8Array(u8.slice(j*PART,(j+1)*PART))});await bt.commit()}
  await r.set({n,size:b.size,type:b.type||'',updated:Date.now()});
  const on=old.exists?(old.data().n||0):0;
  if(on>n){const bt=db.batch();for(let j=n;j<on;j++)bt.delete(r.collection('parts').doc(String(j)));await bt.commit()}
  BS.known.add(k);
 },
 async get(k){
  const r=bref(k),m=await r.get();if(!m.exists)return undefined;
  const d=m.data(),parts=[];
  for(let i=0;i<d.n;i+=6){const got=await Promise.all(Array.from({length:Math.min(6,d.n-i)},(_,j)=>r.collection('parts').doc(String(i+j)).get()));got.forEach(x=>parts.push(x.data().b.toUint8Array()))}
  BS.known.add(k);return new Blob(parts,{type:d.type||''});
 },
 async del(k){
  const r=bref(k),m=await r.get();if(!m.exists)return;
  const bt=db.batch();for(let i=0;i<(m.data().n||0);i++)bt.delete(r.collection('parts').doc(String(i)));bt.delete(r);await bt.commit();BS.known.delete(k);
 }
};
async function flushMem(){
 if(!BS.cloud)return;
 for(const [k,b] of [...BS.mem]){if(k==='appdata-mirror'||BS.known.has(k))continue;try{await cloud.put(k,b,{skipExisting:true})}catch(e){console.warn('flush',e)}}
}

async function logout(){
 try{saveAppData();saveWs()}catch(_){}
 clearTimeout(upT);await push();
 if(LS.getItem('sadedirty')&&!confirm('Mabadiliko ya hivi karibuni hayajahifadhiwa mtandaoni. Bado unataka kutoka?'))return false;
 try{await auth.signOut()}catch(_){}
 await new Promise(r=>setTimeout(r,900));
 try{Object.keys(snapLS()).forEach(k=>LS.removeItem(k))}catch(_){}
 ['sadevfs2','sadeuser','sadedirty','sadeuid','sadefs_ok','sadeguest','sadesync','sadets'].forEach(k=>LS.removeItem(k));
 location.reload();return true;
}

function listen(){
 if(unsub)unsub();
 unsub=ref().onSnapshot(async d=>{
  if(!d.exists||d.metadata.hasPendingWrites||!user||busy||pending)return;
  const t=d.data().updated;if(!t||t===+LS.getItem('sadets'))return;
  try{
   const c=await pull();if(!c||pending||busy)return;
   ready=false;apply(c);last=JSON.stringify(V);ready=true;
   LS.setItem('sadesync',Date.now());LS.removeItem('sadedirty');say('Data imesasishwa kutoka kifaa kingine');
  }catch(e){ready=true;console.warn(e)}
 },e=>console.warn('listen',e));
}
const chip=E('div');chip.style.cssText='position:absolute;top:18px;right:18px;background:rgba(255,255,255,.22);color:#fff;padding:8px 14px;border-radius:20px;font-size:14px;cursor:pointer;backdrop-filter:blur(6px)';
chip.onclick=e=>{e.stopPropagation();window.loginBox()};$('#lock').append(chip);
const paintChip=()=>{chip.textContent='🧑‍💻 '+(LS.getItem('sadeuser')||'Log in')};paintChip();
async function sync(){
 const u=user;if(!u)return;ready=false;syncMsg='';
 try{
  const c=await pull(),mine=LS.getItem('sadeuid')===u.uid;
  let useCloud=!!c&&!(LS.getItem('sadedirty')&&mine);
  if(useCloud&&!mine&&LS.getItem('sadeguest')&&c!==JSON.stringify(V))
   useCloud=confirm('Akaunti hii tayari ina data iliyohifadhiwa.\n\nOK = tumia data ya akaunti\nCancel = hifadhi mipangilio/mafaili ya kifaa hiki kwenye akaunti (data ya awali ya akaunti itabadilishwa)');
  LS.removeItem('sadeguest');
  if(useCloud){apply(c);last=JSON.stringify(V);LS.setItem('sadeuid',u.uid);LS.setItem('sadesync',Date.now());LS.removeItem('sadedirty');ready=true;say('Data yako imepakiwa kutoka kwenye akaunti: '+nm(u))}
  else{ready=true;await push()}
 }catch(e){ready=false;console.warn(e);syncMsg=why(e);say('Umeingia, lakini kusawazisha kumeshindwa: '+syncMsg,'e')}
 if(ready&&user===u)listen();
 if(ready&&!restored){restored=true;restoreSession().catch(()=>{wsReady=true})}
 try{if(M.style.display==='flex')buildMenu()}catch(_){}
}
function init(){
 if(!firebase.apps.length)firebase.initializeApp(CFG);
 auth=firebase.auth();db=firebase.firestore();
 try{db.settings({experimentalAutoDetectLongPolling:true,merge:true})}catch(_){}
 auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch(()=>auth.setPersistence(firebase.auth.Auth.Persistence.SESSION).catch(()=>{}));
 auth.getRedirectResult().catch(x=>say(em(x),'e'));
 auth.onAuthStateChanged(async u=>{
  user=u;ready=false;BS.cloud=u?cloud:null;
  if(unsub){unsub();unsub=null}
  if(!u){LS.removeItem('sadeuser');paintChip();return}
  LS.setItem('sadeuser',nm(u));paintChip();
  await sync();
  flushMem().catch(()=>{});
 });
}
const SDK2='https://cdnjs.cloudflare.com/ajax/libs/firebase/10.12.2/';
function boot(){
 if(auth)return Promise.resolve();if(booting)return booting;
 const seq=(base,sfx)=>load(base+'firebase-app-compat'+sfx).then(()=>Promise.all([load(base+'firebase-auth-compat'+sfx),load(base+'firebase-firestore-compat'+sfx)]));
 booting=seq(SDK,'.js').catch(()=>seq(SDK2,'.min.js')).then(init).catch(e=>{booting=null;throw e});
 return booting;
}

window.loginBox=function(){
  const o=E('div');o.style.cssText='position:fixed;inset:0;z-index:1000001;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center';
 const b=E('div');b.style.cssText='background:#fff;color:#111;border-radius:12px;padding:22px;width:min(340px,92vw);font:14px system-ui,sans-serif;box-shadow:0 10px 40px #0007';
 const inp='width:100%;box-sizing:border-box;padding:10px;border:1px solid #bbb;border-radius:8px;font-size:15px;margin-top:8px';
 const btn=(t,bg,fg)=>{const x=E('button','',t);x.style.cssText='padding:9px 14px;border:0;border-radius:8px;cursor:pointer;font-size:14px;background:'+bg+';color:'+fg;return x};
 const close=()=>o.remove();o.onclick=e=>{if(e.target===o)close()};o.onkeydown=e=>e.stopPropagation();
 const draw=mode=>{
  b.innerHTML='';
  if(!auth){
   b.innerHTML='<b style="font-size:18px">Log in</b><div style="margin:12px 0;color:#555">Inapakia mfumo wa akaunti…</div>';
   const r=E('div');r.style.cssText='display:flex;gap:8px;justify-content:flex-end';const cl=btn('Funga','#e5e5e5','#111');cl.onclick=close;r.append(cl);b.append(r);
   boot().then(()=>{if(o.isConnected)draw(mode)}).catch(()=>{if(!o.isConnected)return;b.innerHTML='<b style="font-size:18px">Log in</b><div style="margin:12px 0;color:#b00020">Haikuweza kupakia mfumo wa akaunti. Angalia mtandao wako.</div>';const r2=E('div');r2.style.cssText='display:flex;gap:8px;justify-content:flex-end';const rt=btn('Jaribu tena','#1e88e5','#fff'),c2=btn('Funga','#e5e5e5','#111');rt.onclick=()=>draw(mode);c2.onclick=close;r2.append(c2,rt);b.append(r2)});
   return;
  }
  if(user){
   b.innerHTML='<b style="font-size:18px">Akaunti</b><div style="margin:10px 0;color:#333">Umeingia kama <b></b><br><small style="color:#666"></small></div><div style="color:#666;font-size:12px">Data yako inahifadhiwa kwenye akaunti yako kiotomatiki na itapatikana kwenye kifaa chochote utakachoingia.'+(+LS.getItem('sadesync')?'<br>Imesawazishwa mwisho: '+new Date(+LS.getItem('sadesync')).toLocaleString():'')+'</div>';
   b.querySelector('b+div b, div b').textContent=nm(user);b.querySelector('small').textContent=user.email||'';
   const r=E('div');r.style.cssText='display:flex;gap:8px;margin-top:16px;justify-content:flex-end';
   const out=btn('Toka','#fde0e0','#b00020'),cl=btn('Funga','#e5e5e5','#111');
   out.onclick=async()=>{out.disabled=true;out.textContent='Inahifadhi…';const d=await logout();if(!d){out.disabled=false;out.textContent='Toka'}};cl.onclick=close;if(syncMsg){const w=E('div');w.style.cssText='color:#b00020;font-size:12px;margin-top:10px';w.textContent=syncMsg;b.append(w);const rt=btn('Sawazisha tena','#e3f2fd','#0d47a1');rt.style.marginTop='8px';rt.onclick=async()=>{rt.disabled=true;rt.textContent='Subiri…';await sync();draw()};b.append(rt)}
   r.append(out,cl);b.append(r);return;
  }
  const reg=mode==='reg';
  b.innerHTML='<b style="font-size:18px">'+(reg?'Jisajili':'Log in')+'</b><div style="margin-top:4px;color:#555">'+(reg?'Tengeneza akaunti kwa email yako':'Ingia kwa email na nenosiri')+'</div>';
  let n;if(reg){n=E('input');n.placeholder='Jina lako';n.maxLength=30;n.autocomplete='name';n.style.cssText=inp;b.append(n)}
  const e=E('input');e.type='email';e.placeholder='Email';e.autocomplete='email';e.style.cssText=inp;
  const p=E('input');p.type='password';p.placeholder='Nenosiri (angalau herufi 6)';p.autocomplete=reg?'new-password':'current-password';p.style.cssText=inp;
  const sp=E('label');sp.style.cssText='display:block;margin-top:8px;font-size:12px;color:#555;cursor:pointer';const cb=E('input');cb.type='checkbox';cb.onchange=()=>{p.type=cb.checked?'text':'password'};sp.append(cb,' Onyesha nenosiri');
  const er=E('div');er.style.cssText='color:#b00020;font-size:12px;min-height:16px;margin-top:8px';
  const gb=btn('Endelea na Google','#fff','#111');gb.style.cssText+=';border:1px solid #bbb;width:100%;margin-top:14px';
  gb.onclick=async()=>{er.textContent='';try{await auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());close()}catch(x){if(x.code==='auth/popup-blocked'||x.code==='auth/operation-not-supported-in-this-environment'){auth.signInWithRedirect(new firebase.auth.GoogleAuthProvider())}else if(x.code!=='auth/popup-closed-by-user'&&x.code!=='auth/cancelled-popup-request'){er.textContent=em(x)}}};
  const go=btn(reg?'Jisajili':'Ingia','#1e88e5','#fff'),cl=btn('Ghairi','#e5e5e5','#111');
  const r=E('div');r.style.cssText='display:flex;gap:8px;margin-top:6px;justify-content:flex-end';r.append(cl,go);
  const sw=E('div');sw.style.cssText='margin-top:12px;font-size:13px;color:#1e88e5;cursor:pointer';sw.textContent=reg?'Una akaunti? Ingia':'Huna akaunti? Jisajili';sw.onclick=()=>draw(reg?'in':'reg');
  b.append(e,p,sp,er,r);if(WEB)b.append(gb);b.append(sw);if(!WEB){const nt=E('div');nt.style.cssText='font-size:12px;color:#8a6d00;margin-top:10px';nt.textContent='Unatumia faili la ndani/APK: kuingia kwa Google hakupatikani hapa. Tumia email na nenosiri.';b.append(nt)}
  if(!reg){const fp=E('div');fp.style.cssText='margin-top:8px;font-size:13px;color:#1e88e5;cursor:pointer';fp.textContent='Umesahau nenosiri?';fp.onclick=async()=>{const v=e.value.trim();if(!v){er.textContent='Andika email kwanza';return}try{await auth.sendPasswordResetEmail(v);er.style.color='#2e7d32';er.textContent='Link ya kubadili nenosiri imetumwa kwenye email yako'}catch(x){er.style.color='#b00020';er.textContent=em(x)}};b.append(fp)}
  const submit=async()=>{
   const ev=e.value.trim(),pv=p.value;er.style.color='#b00020';er.textContent='';
   if(!ev||!pv){er.textContent='Jaza email na nenosiri';return}
   go.disabled=true;go.textContent='Subiri…';
   try{
    if(reg){const c=await auth.createUserWithEmailAndPassword(ev,pv);const nv=n.value.trim();if(nv){await c.user.updateProfile({displayName:nv});LS.setItem('sadeuser',nv);paintChip()}}
    else await auth.signInWithEmailAndPassword(ev,pv);
    close();
   }catch(x){er.textContent=em(x);go.disabled=false;go.textContent=reg?'Jisajili':'Ingia'}
  };
  go.onclick=submit;cl.onclick=close;[e,p].forEach(i=>i.onkeydown=ev=>{if(ev.key==='Enter')submit();if(ev.key==='Escape')close()});
  setTimeout(()=>(n||e).focus(),50);
 };
 draw('in');o.append(b);document.body.append(o);
};


/* ----- Data za programu + hali ya madirisha (kwa waliong'oa login tu) ----- */
const SKIP=/^(sadevfs2|sadeuser|sadedirty|sadeuid|sadesync|sadets|sadeguest|sadefs_ok|sade_fs)$|^firebase|^__/;
function snapLS(){const o={};for(let i=0;i<LS.length;i++){const k=LS.key(i);if(SKIP.test(k))continue;const v=LS.getItem(k);if(v!=null&&v.length<1500000)o[k]=v}return o}
function mirrorFile(o){
 return; /* hakuna faili la mfumo linaloonekana kwenye AppData */
 try{
  const FN='AppData',n='data-za-programu.json';
  if(!V.F[FN]){V.F[FN]=[];if(!V.U.includes(FN))V.U.push(FN)}
  const blob=new Blob([JSON.stringify(o,null,1)],{type:'application/json'}),t=Date.now();
  let e=V.F[FN].find(x=>x.n===n);
  if(!e){e={n,o:['Upload',n],id:'ad'+t.toString(36),bk:'appdata-mirror',sz:blob.size,ct:t,mt:t,h:''};V.F[FN].push(e)}
  else{e.sz=blob.size;e.mt=t;e.bk=e.bk||'appdata-mirror'}
  try{window.BS.mem.set(e.bk,blob)}catch(_){}
 }catch(_){}
}
function saveAppData(){
 if(!user||!ready)return;
 const o=snapLS(),j=JSON.stringify(o);if(j===lastAD)return;
 lastAD=j;V.appdata=o;mirrorFile(o);
 try{LS.setItem(VK,JSON.stringify(V))}catch(_){}
 window.saveV&&window.saveV();try{refresh()}catch(_){}
}
const tag=(fn,mk)=>function(){const n0=wins.length;const r=fn.apply(this,arguments);try{if(wins.length>n0){const w=wins[wins.length-1];if(!w.rs)w.rs=mk.apply(null,arguments)}}catch(_){}return r};
try{if(typeof openF==='function')openF=tag(openF,(f,n)=>({t:'f',a:[f,n]}))}catch(_){}
try{if(typeof window.explorer==='function')window.explorer=tag(window.explorer,f=>({t:'x',a:[f]}))}catch(_){}
try{if(typeof settings==='function')settings=tag(settings,()=>({t:'s',a:[]}))}catch(_){}
try{if(typeof window.openE==='function')window.openE=tag(window.openE,e=>({t:'e',a:[e&&e.id||'',e&&e.n||'']}))}catch(_){}
function cap(w){
 const el=w.el,it={t:w.rs.t,a:w.rs.a,z:parseInt(el.style.zIndex)||0,min:el.style.display==='none'?1:0,mx:el.classList.contains('mx')?1:0,l:el.offsetLeft,tp:el.offsetTop,w:el.offsetWidth,h:el.offsetHeight};
 if(w.rs.t==='f'){try{const cw=el.querySelector('iframe').contentWindow;it.hash=cw.location.hash||'';it.sy=Math.round(cw.scrollY||(cw.document.scrollingElement&&cw.document.scrollingElement.scrollTop)||0)}catch(_){}}
 return it;
}
function saveWs(){
 if(!user||!ready||!wsReady)return;
 const a=wins.filter(x=>x.rs).map(cap),j=JSON.stringify(a);if(j===lastWs)return;
 lastWs=j;V.ws={w:a,at:Date.now()};
 try{LS.setItem(VK,JSON.stringify(V))}catch(_){}
 window.saveV&&window.saveV();
}
async function restoreSession(){
 const ws=V.ws;
 if(!ws||!ws.w||!ws.w.length||wins.length){wsReady=true;return}
 const small=innerWidth<760;let n=0;
 for(const it of ws.w.slice().sort((a,b)=>(a.z||0)-(b.z||0))){
  const n0=wins.length;
  try{
   if(it.t==='f')openF(...it.a);
   else if(it.t==='x')window.explorer(it.a[0]);
   else if(it.t==='s')settings();
   else if(it.t==='e'){const e=Object.values(V.F).flat().find(x=>x&&((it.a[0]&&x.id===it.a[0])||(!it.a[0]&&x.n===it.a[1])));if(e)window.openE(e)}
  }catch(_){}
  await new Promise(r=>setTimeout(r,40));
  if(wins.length>n0){
   const w=wins[wins.length-1],el=w.el;n++;
   if(!small){el.style.left=it.l+'px';el.style.top=Math.max(0,it.tp)+'px';el.style.width=Math.min(it.w,innerWidth-10)+'px';el.style.height=Math.min(it.h,innerHeight-60)+'px';el.classList.toggle('mx',!!it.mx)}
   if(it.min){el.style.display='none';w.tk.classList.remove('on')}
   if(it.t==='f'&&(it.hash||it.sy)){const fr=el.querySelector('iframe');let k=0;const iv=setInterval(()=>{try{const cw=fr.contentWindow;if(cw&&cw.location.href!=='about:blank'&&cw.document.readyState==='complete'){clearInterval(iv);if(it.hash)cw.location.hash=it.hash;if(it.sy)cw.scrollTo(0,it.sy)}}catch(_){clearInterval(iv)}if(++k>40)clearInterval(iv)},250)}
  }
 }
 lastWs=JSON.stringify(wins.filter(x=>x.rs).map(cap));wsReady=true;
 if(n)say('Nimekurudisha ulipoishia: madirisha '+n);
}
setInterval(()=>{try{saveAppData();saveWs()}catch(_){}},4000);
let stT;addEventListener('storage',()=>{clearTimeout(stT);stT=setTimeout(()=>{try{saveAppData()}catch(_){}},1500)});
const flush=()=>{try{saveAppData();saveWs();if(user&&ready&&LS.getItem('sadedirty')){clearTimeout(upT);push()}}catch(_){}};
addEventListener('pagehide',flush);document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')flush()});

boot().catch(()=>console.warn('Firebase SDK haikupakia (hakuna mtandao?)'));
})();
