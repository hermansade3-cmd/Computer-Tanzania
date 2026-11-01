/* ============================================================
   file-system.js — Mfumo wa mafaili: orodha ya mafaili ya mfumo (FOLD/AL) + VFS (V, copy/cut/paste, pin, sort) + njia za mkato za kinanda
   (Inapakiwa kama script ya kawaida; inashiriki global scope na moduli nyingine.
    Mpangilio wa kupakia umo ndani ya index.html — usiubadilishe.)
   ============================================================ */

/* ---------- Orodha ya mafaili ya mfumo (FOLD, AL, ico, ICN) ---------- */
/* ================= MAFAILI YOTE (kila faili mstari wake) ================= */
const AL={"Microsoft-Edge.exe": "Web-Browser.exe", "Microsoft-Copilot.exe": "AI-Assistant.exe", "Microsoft-Office.exe": "Office-Suite.exe", "Microsoft-Word.exe": "Writer.exe", "Microsoft-Excel.exe": "Spreadsheet.exe", "Microsoft-PowerPoint.exe": "Presenter.exe", "Microsoft-Outlook.exe": "Mail-Client.exe", "Microsoft-OneNote.exe": "Notebook.exe", "Mozilla-Firefox.exe": "Open-Browser.exe", "Google-Chrome.exe": "Fast-Browser.exe", "Microsoft-Games.exe": "Game-Center.exe", "Microsoft-Photos.exe": "Photo-Gallery.exe", "Microsoft-MediaPlayer.exe": "Media-Player.exe", "Microsoft-Maps.exe": "Map-Navigator.exe", "Microsoft-Weather.exe": "Weather-Forecast.exe", "Microsoft-Translator.exe": "Translator.exe", "Microsoft-Calendar.exe": "Calendar.exe", "Microsoft-Clock.exe": "World-Clock.exe", "Microsoft-Camera.exe": "Camera.exe", "Microsoft-Money.exe": "Currency-Exchange.exe", "Microsoft-News.exe": "News-Reader.exe", "Microsoft-TaskManager.exe": "Process-Monitor.exe", "Microsoft-Dictionary.exe": "Dictionary.exe", "Microsoft-Encyclopedia.exe": "Knowledge-Base.exe", "Microsoft-Todo.exe": "Task-List.exe", "Microsoft-StickyNotes.exe": "Quick-Notes.exe", "Microsoft-Recorder.exe": "Voice-Recorder.exe", "Microsoft-QRCode.exe": "QR-Code.exe", "Microsoft-Converter.exe": "Unit-Converter.exe", "Microsoft-Passwords.exe": "Password-Vault.exe", "Microsoft-Crypto.exe": "Crypto-Markets.exe", "Microsoft-DeviceManager.exe": "Hardware-Manager.exe", "Microsoft-Backup.exe": "Backup-Restore.exe", "Microsoft-DiskCleanup.exe": "Disk-Cleaner.exe", "Microsoft-PDFReader.exe": "PDF-Reader.exe", "Microsoft-ScreenRecorder.exe": "Screen-Recorder.exe", "Microsoft-Contacts.exe": "Contacts.exe", "Microsoft-Clipboard.exe": "Clipboard-History.exe", "Microsoft-TextToSpeech.exe": "Text-to-Speech.exe", "Microsoft-Network.exe": "Network-Status.exe", "Microsoft-Accessibility.exe": "Accessibility.exe", "Microsoft-Store.exe": "Software-Store.exe", "Visual-Studio-Code.exe": "Code-Editor.exe", "Python-IDE.exe": "Script-IDE.exe", "Facebook.exe": "Social-Connect.exe", "Instagram.exe": "Photo-Share.exe", "TikTok.exe": "Short-Videos.exe", "YouTube.exe": "Video-Stream.exe", "regedit.exe": "Registry-Editor.exe", "wordpad.exe": "Rich-Text-Editor.exe", "msinfo32.exe": "System-Info.exe", "charmap.exe": "Character-Map.exe", "Scientific-Calculator.exe": "Scientific-Calculator.exe", "cmd.exe": "Terminal.exe", "calc.exe": "Calculator.exe", "paint.exe": "Draw.exe", "notepad.exe": "Text-Pad.exe", "windows.iso": "system.iso", "windows.wmv": "system-video.wmv", "apple.mov": "fruit.mov", "Calculator.lnk": "Calculator-Shortcut.lnk"};
const _j=a=>a.join(',');
const FOLD={
/* 01. Nyaraka (Documents) — mafaili 11 */
"Nyaraka (Documents)":_j([
  "notes.txt",                 // 01
  "report.doc",                // 02
  "report.docx",               // 03
  "manual.pdf",                // 04
  "letter.rtf",                // 05
  "document.odt",              // 06
  "presentation.ppt",          // 07
  "presentation.pptx",         // 08
  "budget.xls",                // 09
  "budget.xlsx",               // 10
  "data.csv",                  // 11
]),
/* 02. Picha (Pictures) — mafaili 8 */
"Picha (Pictures)":_j([
  "picha1.jpg",                // 01
  "picha2.jpeg",               // 02
  "nembo.png",                 // 03
  "mchezo.gif",                // 04
  "old.bmp",                   // 05
  "mpya.webp",                 // 06
  "mchoro.svg",                // 07
  "app.ico",                   // 08
]),
/* 03. Video (Videos) — mafaili 6 */
"Video (Videos)":_j([
  "video1.mp4",                // 01
  "filamu.mkv",                // 02
  "zamani.avi",                // 03
  "apple.mov",                 // 04
  "windows.wmv",               // 05
  "wavuti.webm",               // 06
]),
/* 04. Muziki (Music) — mafaili 6 */
"Muziki (Music)":_j([
  "wimbo.mp3",                 // 01
  "ubora.wav",                 // 02
  "aac-sauti.aac",             // 03
  "flac-sauti.flac",           // 04
  "ogg-sauti.ogg",             // 05
  "app-sauti.m4a",             // 06
]),
/* 05. Programu (Programs) — mafaili 73 */
"Programu (Programs)":_j([
  "cmd.exe",                   // 01
  "calc.exe",                  // 02
  "notepad.exe",               // 03
  "paint.exe",                 // 04
  "setup.msi",                 // 05
  "vipengele.dll",             // 06
  "driver.sys",                // 07
  "anza.bat",                  // 08
  "amri.cmd",                  // 09
  "script.ps1",                // 10
  "Calculator.lnk",            // 11
  "Microsoft-Edge.exe",        // 12
  "Microsoft-Copilot.exe",     // 13
  "Microsoft-Office.exe",      // 14
  "Microsoft-Word.exe",        // 15
  "Microsoft-Excel.exe",       // 16
  "Microsoft-PowerPoint.exe",  // 17
  "Microsoft-Outlook.exe",     // 18
  "Microsoft-OneNote.exe",     // 19
  "Mozilla-Firefox.exe",       // 20
  "Google-Chrome.exe",         // 21
  "Microsoft-Games.exe",        // 22
  "Microsoft-Photos.exe",  // 23
  "Microsoft-MediaPlayer.exe",  // 24
  "Microsoft-Maps.exe",  // 25
  "Microsoft-Weather.exe",  // 26
  "Microsoft-Translator.exe",  // 27
  "Microsoft-Calendar.exe",  // 28
  "Microsoft-Clock.exe",  // 29
  "Microsoft-Camera.exe",  // 30
  "Microsoft-Money.exe",  // 31
  "Microsoft-News.exe",  // 32
  "Microsoft-TaskManager.exe",  // 33
  "Microsoft-Dictionary.exe",  // 34
  "Microsoft-Encyclopedia.exe",  // 35
  "Microsoft-Todo.exe",  // 36
  "Microsoft-StickyNotes.exe",  // 37
  "Microsoft-Recorder.exe",  // 38
  "Microsoft-QRCode.exe",  // 39
  "Microsoft-Converter.exe",  // 40
  "Microsoft-Passwords.exe",  // 41
  "Microsoft-Crypto.exe",  // 42
  "Microsoft-DeviceManager.exe",  // 43
  "Microsoft-Backup.exe",  // 44
  "Microsoft-DiskCleanup.exe",  // 45
  "Microsoft-PDFReader.exe",  // 46
  "Microsoft-ScreenRecorder.exe",  // 47
  "Microsoft-Contacts.exe",  // 48
  "Microsoft-Clipboard.exe",  // 49
  "Microsoft-TextToSpeech.exe",  // 50
  "Microsoft-Network.exe",  // 51
  "Microsoft-Accessibility.exe",  // 52
  "Visual-Studio-Code.exe",  // 53
  "Python-IDE.exe",  // 54
  "HTML-CSS-JS-Editor.exe",  // 55
  "Scientific-Calculator.exe",  // 56
  "Circuit-Designer.exe",  // 57
  "Music-DJ-Mix.exe",  // 58
  "Facebook.exe",  // 59
  "Instagram.exe",  // 60
  "TikTok.exe",  // 61
  "YouTube.exe",  // 62
  "regedit.exe",  // 63
  "wordpad.exe",  // 64
  "msinfo32.exe",  // 65
  "charmap.exe",  // 66
  "Hex-Viewer.exe",  // 67
  "Hash-Checker.exe",  // 68
  "Zip-Manager.exe",  // 69
  "Text-Compare.exe",  // 70
  "Color-Picker.exe",  // 71
  "Dev-Toolbox.exe",  // 72
  "Microsoft-Store.exe",  // 73
]),
/* 06. Code (Dev) — mafaili 12 */
"Code (Dev)":_j([
  "index.html",                // 01
  "style.css",                 // 02
  "app.js",                    // 03
  "config.json",               // 04
  "data.xml",                  // 05
  "hello.py",                  // 06
  "Hello.java",                // 07
  "main.cpp",                  // 08
  "index.php",                 // 09
  "query.sql",                 // 10
  "app.ts",                    // 11
  "README.md",                 // 12
]),
/* 07. Zilizobanwa (Archives) — mafaili 5 */
"Zilizobanwa (Archives)":_j([
  "mafaili.zip",               // 01
  "backup.rar",                // 02
  "picha.7z",                  // 03
  "source.tar",                // 04
  "logs.gz",                   // 05
]),
/* 08. Database — mafaili 6 */
"Database":_j([
  "app.db",                    // 01
  "watu.sqlite",               // 02
  "watu.sqlite3",              // 03
  "ofisi.mdb",                 // 04
  "mauzo.accdb",               // 05
  "database.bak",              // 06
]),
/* 09. Mfumo (System) — mafaili 9 */
"Mfumo (System)":_j([
  "mfumo.log",                 // 01
  "muda.tmp",                  // 02
  "settings.ini",              // 03
  "config.cfg",                // 04
  "data.dat",                  // 05
  "usajili.reg",               // 06
  "kazi.cab",                  // 07
  "hati.vbs",                  // 08
  "hitilafu.dmp",              // 09
]),
/* 10. Diski (Disks) — mafaili 7 */
"Diski (Disks)":_j([
  "windows.iso",               // 01
  "diski.img",                 // 02
  "mashine.vhd",               // 03
  "mashine.vhdx",              // 04
  "vmware.vmdk",               // 05
  "paketi.ova",                // 06
  "paketi.ovf",                // 07
]),
};
const ico={"txt": "📄", "doc": "📘", "docx": "📘", "pdf": "📕", "rtf": "📝", "odt": "📃", "ppt": "📙", "pptx": "📙", "xls": "📗", "xlsx": "📗", "csv": "📊", "jpg": "🖼️", "jpeg": "🖼️", "png": "🖼️", "gif": "🎞️", "bmp": "🖼️", "webp": "🖼️", "svg": "🎨", "ico": "⭐", "mp4": "🎬", "Music": "🎵", "exe": "⚙️", "msi": "📦", "dll": "🧩", "sys": "🛠️", "bat": "📟", "cmd": "📟", "ps1": "📟", "lnk": "🔗", "html": "🌐", "css": "🎨", "js": "🟨", "json": "🧾", "xml": "🧾", "py": "🐍", "java": "☕", "cpp": "➕", "php": "🐘", "sql": "🗃️", "ts": "🟦", "md": "📝", "zip": "🗜️", "rar": "🗜️", "7z": "🗜️", "tar": "🗜️", "gz": "🗜️", "db": "🗄️", "sqlite": "🗄️", "sqlite3": "🗄️", "mdb": "🗄️", "accdb": "🗄️", "bak": "💾", "log": "📜", "tmp": "🕑", "ini": "⚙️", "cfg": "⚙️", "dat": "🔢", "reg": "🧬", "cab": "📦", "vbs": "📜", "dmp": "💥", "iso": "💿", "img": "💿", "vhd": "💽", "vhdx": "💽", "vmdk": "💽", "ova": "🖥️", "ovf": "🖥️"};
const ICN={"Microsoft-Edge.exe":"🌐","Microsoft-Copilot.exe":"✨","Microsoft-Office.exe":"🏢","Microsoft-Word.exe":"📘","Microsoft-Excel.exe":"📗","Microsoft-PowerPoint.exe":"📙","Microsoft-Outlook.exe":"📧","Microsoft-OneNote.exe":"📓","Mozilla-Firefox.exe":"🦊","Google-Chrome.exe":"🌍","Microsoft-Games.exe":"🎮","Microsoft-Photos.exe":"🖼️","Microsoft-MediaPlayer.exe":"🎵","Microsoft-Maps.exe":"🗺️","Microsoft-Weather.exe":"☀️","Microsoft-Translator.exe":"🌐","Microsoft-Calendar.exe":"📅","Microsoft-Clock.exe":"⏰","Microsoft-Camera.exe":"📷","Microsoft-Money.exe":"💱","Microsoft-News.exe":"📰","Microsoft-TaskManager.exe":"📊","Microsoft-Dictionary.exe":"📖","Microsoft-Encyclopedia.exe":"📚","Microsoft-Todo.exe":"✅","Microsoft-StickyNotes.exe":"🗒️","Microsoft-Recorder.exe":"🎙️","Microsoft-QRCode.exe":"🔳","Microsoft-Converter.exe":"📐","Microsoft-Passwords.exe":"🔐","Microsoft-Crypto.exe":"🪙","Microsoft-DeviceManager.exe":"🖥️","Microsoft-Backup.exe":"🛡️","Microsoft-DiskCleanup.exe":"🧹","Microsoft-PDFReader.exe":"📕","Microsoft-ScreenRecorder.exe":"🎥","Microsoft-Contacts.exe":"👥","Microsoft-Clipboard.exe":"📋","Microsoft-TextToSpeech.exe":"🗣️","Microsoft-Network.exe":"📡","Microsoft-Accessibility.exe":"♿","Visual-Studio-Code.exe":"💻","Python-IDE.exe":"🐍","HTML-CSS-JS-Editor.exe":"🌐","Scientific-Calculator.exe":"🔬","Circuit-Designer.exe":"🔌","Music-DJ-Mix.exe":"🎧","Facebook.exe":"📘","Instagram.exe":"📸","TikTok.exe":"🎵","YouTube.exe":"▶️","regedit.exe":"🧩","wordpad.exe":"📝","msinfo32.exe":"ℹ️","charmap.exe":"🔣","Hex-Viewer.exe":"🔢","Hash-Checker.exe":"#️⃣","Zip-Manager.exe":"🗜️","Text-Compare.exe":"🔀","Color-Picker.exe":"🎨","Dev-Toolbox.exe":"🛠️"};

/* ---------- VFS: hali (V), persist/refresh, xfer, del, restore, paste, ren, newF, pin, sort ---------- */
/* ===== MFUMO WA MAFAILI (VFS): copy, cut, paste, delete, rename, desktop, pin, recycle bin ===== */
const VK='sadevfs2',BIN='Recycle Bin';let V,CB=null,ACT=null,lpT=0;const EXP=new Set(),dsel=new Set();
try{V=JSON.parse(localStorage.getItem(VK)||'null')}catch(_){}
V=V||{};V.F=V.F||{};V.U=V.U||[];V.seen=V.seen||{};V.sp=V.sp||[];V.wp=V.wp||0;
V.pin=V.pin||[0,5,6,7,8].map(k=>({t:'d',k}));
/* Folda zote ziko TUPU. Mafaili yanaonekana ni yale tu ambayo mtumiaji ameyaweka (kupakia / kutengeneza / kunakili). Orodha ya FOLD inabaki kama rejista ya programu tu (haionyeshwi kama mafaili). */
function purgeSeed(){
 const isSeed=e=>e&&!e.bk&&!e.dir&&e.o&&Object.prototype.hasOwnProperty.call(FOLD,e.o[0]);
 Object.keys(V.F||{}).forEach(k=>{V.F[k]=(V.F[k]||[]).filter(e=>!isSeed(e)&&!(e.bk==='appdata-mirror'))});
 V.seen={};V.rc=(V.rc||[]).filter(r=>V.F[r.fo]&&V.F[r.fo].some(e=>e.n===r.n));
 Object.keys(FOLD).forEach(k=>{V.F[k]=V.F[k]||[]});
 V.F.Desktop=V.F.Desktop||[];V.F[BIN]=V.F[BIN]||[];
 if(!V.F.AppData){V.F.AppData=[]}if(!V.U.includes('AppData'))V.U.push('AppData');
}
window.purgeSeed=purgeSeed;
V.F.Desktop=V.F.Desktop||[];V.F[BIN]=V.F[BIN]||[];purgeSeed();
/* uhamisho: hali iliyohifadhiwa na majina ya zamani */
Object.values(V.F).forEach(L=>L.forEach(e=>{if(e.o&&e.n===e.o[1]&&AL[e.n])e.n=AL[e.n]}));
[...V.sp,...V.pin].forEach(p=>{if(p.o&&p.n===p.o[1]&&AL[p.n])p.n=AL[p.n]});
const keys=()=>[...Object.keys(FOLD),'Desktop',...V.U,BIN],get=(fo,n)=>(V.F[fo]||[]).find(x=>x.n===n);
const persist=()=>{try{localStorage.setItem(VK,JSON.stringify(V))}catch(_){}window.saveV&&saveV();refresh()};
const refresh=()=>{EXP.forEach(f=>f());drawDesk();drawPins()};
const uniq=(fo,n)=>{const L=V.F[fo].map(x=>x.n);if(!L.includes(n))return n;const i=n.lastIndexOf('.'),b=i>0?n.slice(0,i):n,x=i>0?n.slice(i):'';let k=1,m;do{m=b+' - Copy'+(k>1?' ('+k+')':'')+x;k++}while(L.includes(m));return m};
function xfer(items,dest,cut){items.forEach(([fo,n])=>{const e=get(fo,n);if(!e||(cut&&fo===dest))return;V.F[dest].push({n:uniq(dest,n),o:e.o});if(cut)V.F[fo]=V.F[fo].filter(x=>x!==e)})}
function del(items){if(!items.length)return;if(items.every(x=>x[0]===BIN)){if(!confirm('Futa kabisa vitu '+items.length+'? Haviwezi kurejeshwa.'))return;items.forEach(([fo,n])=>V.F[BIN]=V.F[BIN].filter(x=>x.n!==n))}
 else items.forEach(([fo,n])=>{if(fo===BIN)return;const e=get(fo,n);if(!e)return;V.F[fo]=V.F[fo].filter(x=>x!==e);V.F[BIN].push({n:e.n,o:e.o,d:fo})});persist()}
function restore(items){items.forEach(([fo,n])=>{const e=get(BIN,n);if(!e)return;const d=V.F[e.d]?e.d:'Desktop';V.F[BIN]=V.F[BIN].filter(x=>x!==e);V.F[d].push({n:uniq(d,e.n),o:e.o})});persist()}
function paste(d){if(!CB||!d)return;if(d===BIN){if(CB.cut){del(CB.items);CB=null}return}xfer(CB.items,d,CB.cut);if(CB.cut)CB=null;persist()}
function ren(fo,n){const e=get(fo,n);if(!e)return;const v=(prompt('Jina jipya:',n)||'').trim();if(!v||v===n)return;if(get(fo,v)){alert('Jina hilo lipo tayari.');return}e.n=v;persist()}
const cp=(items,cut)=>{if(items.length){CB={cut,items:items.slice()};refresh()}};
function newF(){const v=(prompt('Jina la folda mpya:','Folda mpya')||'').trim();if(!v)return;if(V.F[v]){alert('Jina hilo lipo tayari.');return}V.F[v]=[];V.U.push(v);persist()}
function delF(k){if(V.F[k].length){alert('Folda ina vitu. Vihamishe au vifute kwanza.');return}delete V.F[k];V.U=V.U.filter(x=>x!==k);persist()}
const pinFile=(fo,n)=>{const e=get(fo,n);if(e&&!V.pin.some(p=>p.t==='f'&&p.n===e.n&&p.o+''===e.o+''))V.pin.push({t:'f',o:e.o,n:e.n})};
V.fr=V.fr||[];V.sort=V.sort||'az';
const FK=(fo,n)=>fo+'/'+n,isFr=k=>V.fr.includes(k),setFr=(ks,on)=>{ks.forEach(k=>{const i=V.fr.indexOf(k);if(on&&i<0)V.fr.push(k);if(!on&&i>=0)V.fr.splice(i,1)});persist()},
cmpN=(a,b)=>(V.sort==='za'?-1:1)*String(a).localeCompare(String(b),undefined,{sensitivity:'base',numeric:true}),
cmpF=(ka,na,kb,nb)=>{const fa=V.fr.indexOf(ka),fb=V.fr.indexOf(kb);if(fa>=0||fb>=0)return fa<0?1:fb<0?-1:fa-fb;return cmpN(na,nb)},
togSort=()=>{V.sort=V.sort==='az'?'za':'az';persist()};

/* ---------- Kinanda: Ctrl+C / X / V / A, Delete, F2 ---------- */
/* ----- Kinanda: Ctrl+C / X / V, Delete, F2, Ctrl+A ----- */
addEventListener('keydown',e=>{if(!ACT||/INPUT|TEXTAREA/.test(e.target.tagName))return;const c=e.ctrlKey||e.metaKey,k=e.key.toLowerCase();
 if(c&&k==='c'){cp(ACT.S(),0)}else if(c&&k==='x'){cp(ACT.S(),1)}else if(c&&k==='v'){paste(ACT.folder())}else if(c&&k==='a'){e.preventDefault();ACT.all()}else if(k==='delete'){del(ACT.S())}else if(k==='f2'){const s=ACT.S();if(s.length===1)ren(...s[0])}});
