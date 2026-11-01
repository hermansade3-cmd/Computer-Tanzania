/* ============================================================
   storage.js — Hifadhi ya offline (IndexedDB/DB, fetchF, sync) + kiashiria cha 💾 + service worker
   (Inapakiwa kama script ya kawaida; inashiriki global scope na moduli nyingine.
    Mpangilio wa kupakia umo ndani ya index.html — usiubadilishe.)
   ============================================================ */

/* ---------- Offline storage ---------- */
/* ===== OFFLINE STORAGE (IndexedDB) ===== */
let OFFN=0,PAT=null,syncing=0;
const DB=(()=>{const f=new Map(),m=new Map();return{get:async k=>f.get(k),put:async(k,v)=>{f.set(k,v)},keys:async()=>[...f.keys()],getM:async k=>m.get(k),putM:async(k,v)=>{m.set(k,v)}}})();
const cnt=()=>DB.keys().then(k=>{OFFN=k?k.length:0;const o=$('#off');if(o)o.title='💾 Mafaili '+OFFN+' vimepakiwa kwenye kumbukumbu ya kikao hiki'});
const paths=(s,n)=>{const e=encodeURIComponent(n)+'.html',P=[e,'faili/'+s+'/'+e,'Sade-Computer/'+e,'Sade-Computer/faili/'+s+'/'+e,'faili/'+e];return P.concat(P.map(x=>x.toLowerCase()))};
async function fetchF(s,n,fast){const L=paths(s,n);if(location.protocol==='file:')return{p:L[0]};if(!navigator.onLine)return null;
 for(const i of(fast&&PAT!=null?[PAT]:[...L.keys()])){const c=new AbortController(),t=setTimeout(()=>c.abort(),8000);
  try{const r=await fetch(L[i],{cache:'no-store',signal:c.signal});if(r.ok&&/html/.test(r.headers.get('content-type')||'')){const txt=await r.text();clearTimeout(t);if(PAT==null)PAT=i;return{p:L[i],txt}}}catch(_){}clearTimeout(t)}
 return null}
/* Pakua mafaili yote nyuma ya pazia mtu akiwa online, yahifadhiwe kwenye IndexedDB */
async function sync(){return;if(syncing||location.protocol==='file:'||!navigator.onLine)return;syncing=1;
 DB.putM('manifest',{FOLD,t:Date.now()});const jobs=[];Object.keys(FOLD).forEach(k=>FOLD[k].split(',').forEach(n=>jobs.push([k.split(' ')[0],n])));
 const now=Date.now(),AGE=432e5;let idx=0;
 const work=async()=>{while(idx<jobs.length){const[s,n]=jobs[idx++],key=s+'/'+n,old=await DB.get(key),ms=await DB.getM('miss:'+key);
  if(old&&now-old.t<AGE)continue;if(ms&&now-ms<AGE)continue;
  const r=await fetchF(s,n,1);if(r&&r.txt!=null){await DB.put(key,{html:r.txt,t:Date.now()});cnt()}else if(navigator.onLine)DB.putM('miss:'+key,Date.now())}};
 await Promise.all([work(),work(),work()]);syncing=0;cnt()}
const _off=E('span','tr','💾');_off.id='off';_off.title='💾 Offline inaandaa…';$('#tray').insertBefore(_off,$('#tray').firstChild);
if(navigator.storage&&navigator.storage.persist)navigator.storage.persist().catch(()=>{});
addEventListener('load',()=>{setTimeout(cnt,300);setTimeout(sync,1500)});addEventListener('online',sync);
if('serviceWorker' in navigator&&/^https?:/.test(location.protocol))navigator.serviceWorker.register('sw.js').catch(()=>{});
