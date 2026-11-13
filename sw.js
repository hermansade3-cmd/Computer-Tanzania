/* sw.js — Sade Computer: Cache API + IndexedDB hufanya kazi pamoja. Ukurasa unaandika kurasa za programu kwenye cache 'sade-apps-v1'; SW hizi hutoa offline. */
const C='sade-shell-v2';
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(['./','./index.html'])).catch(()=>{}))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C&&x!=='sade-apps-v1').map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
const net=(r,c)=>fetch(r).then(res=>{if(res.ok||res.type==='opaque'){const cp=res.clone();c.put(r,cp).catch(()=>{})}return res});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
 if(u.origin!==location.origin&&u.hostname!=='www.gstatic.com')return;
 const fresh=r.mode==='navigate'||r.cache==='no-store'||r.cache==='reload'; /* ukurasa mkuu na usasishaji wa programu: mtandao kwanza */
 e.respondWith((async()=>{const c=await caches.open(C);
  if(fresh){try{return await net(r,c)}catch(_){const m=await caches.match(r);return m||(r.mode==='navigate'?await caches.match('./index.html'):null)||Response.error()}}
  const m=await caches.match(r);const up=net(r,c).catch(()=>null);
  return m||(await up)||Response.error()})())});
