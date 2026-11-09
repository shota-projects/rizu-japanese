(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))n(a);new MutationObserver(a=>{for(const o of a)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&n(r)}).observe(document,{childList:!0,subtree:!0});function s(a){const o={};return a.integrity&&(o.integrity=a.integrity),a.referrerPolicy&&(o.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?o.credentials="include":a.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(a){if(a.ep)return;a.ep=!0;const o=s(a);fetch(a.href,o)}})();const Ye="data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA=";let we=!1;const re=new Audio;re.preload="auto";re.setAttribute("playsinline","");re.setAttribute("webkit-playsinline","");const de=new Audio;function Ae(){if(!we){we=!0;try{de.muted=!0,de.src=Ye;const e=de.play();e&&typeof e.catch=="function"&&e.catch(()=>{})}catch{}}}function ne(){Ae(),document.removeEventListener("pointerdown",ne,!0),document.removeEventListener("touchstart",ne,!0)}document.addEventListener("pointerdown",ne,!0);document.addEventListener("touchstart",ne,!0);function z(e,t={}){return Promise.resolve(!1)}function ye(){try{re.pause()}catch{}}function Se(){const e=window;return e.SpeechRecognition||e.webkitSpeechRecognition||null}function Z(){return!!Se()}let Y=null;function ie(){const e=Se();if(!e)return Promise.reject(new Error("unsupported"));if(Y)try{Y.abort()}catch{}return new Promise((t,s)=>{const n=new e;Y=n,n.lang="ja-JP",n.interimResults=!1,n.maxAlternatives=5;let a=!1;n.onresult=o=>{a=!0;const r=[];for(let i=0;i<o.results.length;i++){const m=o.results[i];for(let l=0;l<m.length;l++)r.push(m[l].transcript)}t(r)},n.onerror=o=>{a||(a=!0,s(new Error(o.error||"error")))},n.onend=()=>{Y=null,a||(a=!0,t([]))};try{n.start()}catch(o){s(o instanceof Error?o:new Error("error"))}})}function Ke(){if(Y)try{Y.stop()}catch{}}function K(e,t){return`${e}:${t}`}function Je(e){const t=new Map;for(const s of e.units)for(const n of s.phrases){const a=K(s.id,n.jp);t.set(a,{id:a,phrase:n,unit:s})}return{tracks:e.tracks,units:e.units,byId:t}}async function _e(){const e=await fetch(new URL("data/speak.json",document.baseURI));if(!e.ok)throw new Error("Could not load lessons");return Je(await e.json())}function V(e,t){return e.units.filter(s=>s.track===t)}function X(e){const t=V(e,"family"),s=V(e,"around"),n=[],a=Math.max(t.length,s.length);for(let r=0;r<a;r++)t[r]&&n.push(t[r]),s[r]&&n.push(s[r]);const o=[];for(const r of n)for(const i of r.phrases){const m=K(r.id,i.jp),l=e.byId.get(m);l&&o.push(l)}return o}let xe=e=>{location.hash=e};function Qe(e){xe=e}function I(e){location.hash===e?xe(e):location.hash=e}function Ve(e,t){return e&&t}let $e=!1;function Ze(){if(!("serviceWorker"in navigator))return;const e=()=>{navigator.serviceWorker.register("./sw.js",{scope:"./",updateViaCache:"none"}).then(t=>{const s=document.getElementById("update-banner"),n=document.getElementById("update-apply"),a=()=>{Ve(!!navigator.serviceWorker.controller,!!t.waiting)&&s&&(s.hidden=!1)};a(),t.addEventListener("updatefound",()=>{const o=t.installing;o==null||o.addEventListener("statechange",()=>{o.state==="installed"&&a()})}),n==null||n.addEventListener("click",()=>{var o;(o=t.waiting)==null||o.postMessage({type:"SKIP_WAITING"}),$e=!0}),navigator.serviceWorker.addEventListener("controllerchange",()=>{$e&&window.location.reload()}),document.addEventListener("visibilitychange",()=>{document.visibilityState==="visible"&&t.update().catch(()=>{})}),window.setInterval(()=>t.update().catch(()=>{}),3600*1e3)}).catch(()=>{})};document.readyState==="complete"?e():window.addEventListener("load",e)}const ue="rizu-jp-v2",Xe="eliz-jp-v1",ke=864e5,et={1:0,2:1,3:3,4:7,5:16},Be={showKana:!0,romaji:"show",dailyNew:3};function he(){return{quizBest:0,roleplayDone:!1,listenDone:!1}}function _(e=Date.now()){return{version:2,revision:0,updatedAt:e,seen:{},srs:{},units:{},days:{},read:{},settings:{value:{...Be},updatedAt:e},curriculum:{value:{unlocked:0},updatedAt:e},daily:{value:null,updatedAt:e},lastBackupAt:0}}function U(e=new Date){const t=s=>String(s).padStart(2,"0");return`${e.getFullYear()}-${t(e.getMonth()+1)}-${t(e.getDate())}`}function je(e,t){const[s,n,a]=e.split("-").map(Number),o=new Date(s,(n||1)-1,a||1);return o.setDate(o.getDate()+t),U(o)}function tt(e,t=U()){const s=new Set(e);let n=t;s.has(n)||(n=je(n,-1));let a=0;for(;s.has(n);)a++,n=je(n,-1);return a}function B(e){return e&&typeof e=="object"&&!Array.isArray(e)?e:{}}function q(e,t){return typeof e=="number"&&Number.isFinite(e)?e:t}function Me(e){const t=B(e),s=t.dailyNew===5||t.dailyNew===7?t.dailyNew:3,n=t.romaji==="fade"||t.romaji==="hide"?t.romaji:"show";return{showKana:t.showKana!==!1,romaji:n,dailyNew:s}}function De(e){const t=B(e);if(typeof t.date!="string")return null;const s=Array.isArray(t.newIds)?t.newIds.filter(n=>typeof n=="string"):[];return{date:t.date,warmDone:!!t.warmDone,newIds:s,newDone:!!t.newDone,convoDone:!!t.convoDone,listenDone:!!t.listenDone,done:!!t.done}}function st(e){const t=B(e);return{box:t.box===2||t.box===3||t.box===4||t.box===5?t.box:1,due:q(t.due,0)}}function nt(e){const t=B(e);return{quizBest:q(t.quizBest,0),roleplayDone:!!t.roleplayDone,listenDone:!!t.listenDone}}function Te(e,t=Date.now()){var v;const s=B(e),n=_(t),a=q(s.lastBackupAt,0),o=B(s.seen);for(const[y,c]of Object.entries(o)){const f=q(c,a||t);n.seen[y]={value:f,updatedAt:f}}const r=B(s.srs);for(const[y,c]of Object.entries(r)){const f=((v=n.seen[y])==null?void 0:v.updatedAt)??(a||t);n.srs[y]={value:st(c),updatedAt:f}}const i=B(s.units);for(const[y,c]of Object.entries(i))n.units[y]={value:nt(c),updatedAt:a||t};const m=B(s.read);for(const[y,c]of Object.entries(m))c&&(n.read[y]={value:!0,updatedAt:a||t});if(Array.isArray(s.days))for(const y of s.days){if(typeof y!="string"||!/^\d{4}-\d{2}-\d{2}$/.test(y))continue;const c=Date.parse(`${y}T12:00:00`);n.days[y]={value:!0,updatedAt:Number.isFinite(c)?c:t}}const l=Me(s.settings??Be);n.settings={value:l,updatedAt:a||t};const d=B(s.curriculum),p=typeof d.unlocked=="number"?d.unlocked:Object.keys(n.seen).length;return n.curriculum={value:{unlocked:Math.max(0,p)},updatedAt:a||t},n.daily={value:De(s.daily),updatedAt:a||t},n.lastBackupAt=a,n.updatedAt=t,n}function at(e){const t=B(e);return t.version===2&&!!t.settings&&!!t.curriculum&&typeof t.seen=="object"}function qe(e,t=Date.now()){var o,r,i,m,l,d,p;if(!at(e))return null;const s=_(t),n=e,a=Me((o=n.settings)==null?void 0:o.value);return{...s,...n,version:2,revision:q(n.revision,0),updatedAt:q(n.updatedAt,t),seen:n.seen&&typeof n.seen=="object"?n.seen:{},srs:n.srs&&typeof n.srs=="object"?n.srs:{},units:n.units&&typeof n.units=="object"?n.units:{},days:n.days&&typeof n.days=="object"?n.days:{},read:n.read&&typeof n.read=="object"?n.read:{},settings:{value:a,updatedAt:q((r=n.settings)==null?void 0:r.updatedAt,t)},curriculum:{value:{unlocked:Math.max(0,q((m=(i=n.curriculum)==null?void 0:i.value)==null?void 0:m.unlocked,0))},updatedAt:q((l=n.curriculum)==null?void 0:l.updatedAt,t)},daily:{value:De((d=n.daily)==null?void 0:d.value),updatedAt:q((p=n.daily)==null?void 0:p.updatedAt,t)},lastBackupAt:q(n.lastBackupAt,0)}}function ot(e){const t={};for(const[o,r]of Object.entries(e.seen))t[o]=r.value;const s={};for(const[o,r]of Object.entries(e.srs))s[o]={box:r.value.box,due:r.value.due};const n={};for(const[o,r]of Object.entries(e.units))n[o]={...he(),...r.value};const a={};for(const[o,r]of Object.entries(e.read))r.value&&(a[o]=!0);return{seen:t,srs:s,units:n,read:a,days:Object.keys(e.days).sort(),settings:e.settings.value,curriculum:{unlocked:e.curriculum.value.unlocked},daily:e.daily.value,lastBackupAt:e.lastBackupAt}}function rt(e){const t=B(e);return["seen","srs","units","read","days","settings","curriculum","daily"].some(s=>s in t)}const me="EJP1.",it=new TextEncoder,ct=new TextDecoder;function lt(e){let t="";for(let s=0;s<e.length;s++)t+=String.fromCharCode(e[s]);return btoa(t).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}function dt(e){const t=e.length%4===0?"":"=".repeat(4-e.length%4),s=atob(e.replace(/-/g,"+").replace(/_/g,"/")+t),n=new Uint8Array(s.length);for(let a=0;a<s.length;a++)n[a]=s.charCodeAt(a);return n}async function ut(e){if(typeof CompressionStream=="function")try{const s=new CompressionStream("deflate"),n=new Blob([e]).stream().pipeThrough(s),a=new Uint8Array(await new Response(n).arrayBuffer()),o=new Uint8Array(1+a.length);return o[0]=1,o.set(a,1),o}catch{}const t=new Uint8Array(1+e.length);return t[0]=0,t.set(e,1),t}async function pt(e){if(!e.length)throw new Error("empty");const t=e[0],s=e.subarray(1);if(t===0)return s;if(t===1){if(typeof DecompressionStream!="function")throw new Error("This browser can’t read compressed backups");const n=new DecompressionStream("deflate"),a=new Blob([s]).stream().pipeThrough(n);return new Uint8Array(await new Response(a).arrayBuffer())}throw new Error("Unknown backup format")}async function ht(e){const t={version:2,state:e,...ot(e)},s=await ut(it.encode(JSON.stringify(t)));return me+lt(s)}async function Ie(e,t=Date.now()){const s=String(e||"").trim().replace(/\s+/g,"");if(!s.startsWith(me))throw new Error("That doesn’t look like a backup code. It should start with EJP1.");let n;try{n=await pt(dt(s.slice(me.length)))}catch{throw new Error("Couldn’t read that code. Double-check you copied the whole thing.")}let a;try{a=JSON.parse(ct.decode(n))}catch{throw new Error("That code isn’t valid. Try copying it again.")}const o=a&&typeof a=="object"?a:null;if((o==null?void 0:o.version)===2&&o.state){const r=qe(o.state,t);if(r)return r}if(!rt(a))throw new Error("That code doesn’t have progress data in it.");return Te(a,t)}function mt(e){return{load(){try{const t=e.getItem(ue);if(t){const s=qe(JSON.parse(t));if(s)return s}}catch{}try{const t=e.getItem(Xe);if(!t)return null;const s=Te(JSON.parse(t));return e.setItem(ue,JSON.stringify(s)),s}catch{return null}},save(t){e.setItem(ue,JSON.stringify(t))}}}function ft(e,t=Date.now){let s=e.load()??_(t());const n=()=>{s.revision+=1,s.updatedAt=t(),e.save(s)},a={get state(){return s},load(){s=e.load()??_(t())},replace(o){s=o,n()},touchDay(){const o=U(new Date(t()));if(s.days[o])return;s.days[o]={value:!0,updatedAt:t()};const r=Object.keys(s.days).sort();if(r.length>400)for(const i of r.slice(0,r.length-400))delete s.days[i];n()},streak(){return tt(Object.keys(s.days),U(new Date(t())))},markSeen(o){a.touchDay();let r=!1;if(!s.seen[o]){const i=t();s.seen[o]={value:i,updatedAt:i},r=!0}if(!s.srs[o]){const i=t();s.srs[o]={value:{box:1,due:i},updatedAt:i},r=!0}r&&n()},grade(o,r){var d;a.touchDay();const i=((d=s.srs[o])==null?void 0:d.value)??{box:1},m=r?Math.min(5,i.box+1):1,l=t();s.srs[o]={value:{box:m,due:l+et[m]*ke},updatedAt:l},s.seen[o]||(s.seen[o]={value:l,updatedAt:l}),n()},box(o){var r;return((r=s.srs[o])==null?void 0:r.value.box)??0},dueIds(o=t()){return Object.keys(s.srs).filter(r=>s.srs[r].value.due<=o).sort((r,i)=>s.srs[r].value.box-s.srs[i].value.box||s.srs[r].value.due-s.srs[i].value.due)},unit(o){var r;return((r=s.units[o])==null?void 0:r.value)??he()},setUnit(o,r){var m;a.touchDay();const i=((m=s.units[o])==null?void 0:m.value)??he();s.units[o]={value:{...i,...r},updatedAt:t()},n()},setting(o,r){return r===void 0?s.settings.value[o]:(s.settings={value:{...s.settings.value,[o]:r},updatedAt:t()},n(),r)},ensureDaily(){const o=U(new Date(t())),r=s.daily.value;if(r&&r.date===o)return r;const i={date:o,warmDone:!1,newIds:[],newDone:!1,convoDone:!1,listenDone:!1,done:!1};return s.daily={value:i,updatedAt:t()},n(),i},setDaily(o){const r=a.ensureDaily(),i={...r,...o,date:r.date};return s.daily={value:i,updatedAt:t()},n(),i},setUnlocked(o){const r=s.curriculum.value.unlocked,i=Math.max(r,Math.max(0,o));i!==r&&(s.curriculum={value:{unlocked:i},updatedAt:t()},n())},reset(){const o=s.settings;s=_(t()),s.settings=o,n()},markBackup(){s.lastBackupAt=t(),n()},needsBackupReminder(o=7){return s.lastBackupAt?t()-s.lastBackupAt>=o*ke:Object.keys(s.seen).length>0},exportBackup(){return ht(s)},async importBackup(o){const r=await Ie(o,t());return r.lastBackupAt=t(),s=r,n(),s}};return a}const h=ft(mt(localStorage));let w;function yt(e){w=e}const E={play:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/></svg>',slow:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',mic:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',check:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',gear:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3.2" fill="none" stroke="currentColor" stroke-width="1.9"/><path d="M12 2.8v2.6M12 18.6v2.6M2.8 12h2.6M18.6 12h2.6M5.5 5.5l1.8 1.8M16.7 16.7l1.8 1.8M5.5 18.5l1.8-1.8M16.7 7.3l1.8-1.8" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>',ear:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 9.5a5 5 0 0 1 10 0c0 3-3 3.6-3 6.5a2.5 2.5 0 0 1-4.6 1.3" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/><path d="M10 10a2 2 0 0 1 4 0" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>'},$={skull:'<svg class="deco" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3c-4.6 0-8 3.1-8 7.3 0 2.4 1.2 4.3 3 5.4V19a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-3.3c1.8-1.1 3-3 3-5.4C20 6.1 16.6 3 12 3z" fill="currentColor"/><circle cx="9" cy="11" r="1.7" fill="#1b1522"/><circle cx="15" cy="11" r="1.7" fill="#1b1522"/><path d="M9.2 16.2h1.3v1.4H9.2zm2.15 0h1.3v1.4h-1.3zm2.15 0h1.3v1.4h-1.3z" fill="#1b1522"/></svg>',heart:'<svg class="deco" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.2s-7.2-4.4-7.2-9.6A4 4 0 0 1 12 8.2a4 4 0 0 1 7.2 2.4c0 5.2-7.2 9.6-7.2 9.6z" fill="currentColor"/></svg>',star:'<svg class="deco" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.2 14.4 8.4l5.7.7-4.2 3.9 1.1 5.6L12 16.1 6.9 18.6 8 13 3.8 9.1l5.8-.7z" fill="currentColor"/></svg>',bow:'<svg class="deco" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 12 4.2 7.6c-1.2-.6-2 .2-2 1.3v6.2c0 1.1.8 1.9 2 1.3zM12 12l7.8-4.4c1.2-.6 2 .2 2 1.3v6.2c0 1.1-.8 1.9-2 1.3z" fill="currentColor"/><rect x="10.2" y="10" width="3.6" height="4" rx="1.2" fill="currentColor"/></svg>'},vt={wave:"./img/mascot-wave.png",cheer:"./img/mascot-cheer.png",think:"./img/mascot-think.png"};function x(e,t=""){return`<img class="mascot mascot-${e} ${t}" src="${vt[e]}" alt="" width="120" height="120">`}let ae=0,Le=0;function bt(){return ae+=1,ae}function Ce(){return ae}function Ne(e){return e===ae}function gt(){const e=document.getElementById("app");if(!e)throw new Error("missing app");return e}function j(e){const t=gt();return t.innerHTML=e,window.scrollTo(0,0),t}function N(e){const t=document.getElementById("toast");t&&(t.textContent=e,t.classList.add("show"),window.clearTimeout(Le),Le=window.setTimeout(()=>t.classList.remove("show"),2200))}function D(e,t){const s=document.getElementById("topbar");if(s){if(!t){s.classList.add("hidden"),s.innerHTML="";return}s.classList.remove("hidden"),s.innerHTML=`<a class="iconbtn" href="${t}" aria-label="Back"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 5.5 8 12l6.5 6.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></a><div class="topbar-title">${e}</div><span class="streak-mini" title="Day streak">${$.star}${h.streak()}日</span>`}}function wt(e){if(!e||matchMedia("(prefers-reduced-motion: reduce)").matches)return;const t=e.getBoundingClientRect(),s=document.createElement("div");s.className="sparkles",s.style.left=`${t.left+t.width/2}px`,s.style.top=`${t.top+Math.min(t.height/2,80)}px`;const n=[$.star,$.heart,$.star,$.bow];for(let a=0;a<8;a++){const o=document.createElement("span"),r=a/8*Math.PI*2,i=46+Math.random()*36;o.style.setProperty("--dx",`${Math.cos(r)*i}px`),o.style.setProperty("--dy",`${Math.sin(r)*i}px`),o.className=`spark c${a%3}`,o.innerHTML=n[a%n.length],s.appendChild(o)}document.body.appendChild(s),window.setTimeout(()=>s.remove(),900)}function M(e){e==null||e.classList.add("bounce"),wt(e)}function C(e){const t=e.phrases.filter(o=>h.state.seen[K(e.id,o.jp)]).length,s=h.unit(e.id),a=[t===e.phrases.length,s.listenDone,s.roleplayDone,s.quizBest>=70].filter(Boolean).length;return{seen:t,total:e.phrases.length,...s,done:a===4,steps:a}}function $t(){const e=V(w,"family"),t=V(w,"around"),s=[],n=Math.max(e.length,t.length);for(let a=0;a<n;a++)e[a]&&s.push(e[a]),t[a]&&s.push(t[a]);return s}function He(e){const t=$t(),s=e?Math.max(0,t.findIndex(n=>n.id===e)+1):0;for(let n=s;n<t.length;n++)if(!C(t[n]).done)return t[n];for(const n of t)if(!C(n).done)return n;return t[0]}function kt(){const e=X(w);let t=0;for(;t<e.length&&h.state.seen[e[t].id];)t++;h.setUnlocked(t)}function jt(e){const t=X(w),s=h.state.curriculum.value.unlocked||0;return t.slice(s,s+e)}function Lt(e){const t=X(w),s=h.state.curriculum.value.unlocked||0,n=h.ensureDaily(),a=n.newIds&&n.newIds.length||Math.min(e,Math.max(0,t.length-s)),o=n.newDone?s:s+a;return t.slice(o,o+Math.min(3,e))}function ve(){const e=h.ensureDaily(),s=[e.warmDone,e.newDone,e.convoDone,e.listenDone].filter(Boolean).length;return{d:e,done:s,total:4,finished:!!e.done||s===4}}function Pe(){const{d:e,finished:t}=ve();return t&&e.done?"#/today/done":e.warmDone?e.newDone?e.convoDone?e.listenDone?"#/today/done":"#/today/listen":"#/today/convo":"#/today/new":"#/today/warm"}function fe(e,t){return h.box(K(e.id,t))>=3}const Et=55,At=e=>e.replace(/[\u30a1-\u30f6]/g,t=>String.fromCharCode(t.charCodeAt(0)-96));function F(e){return At((e||"").normalize("NFKC").toLowerCase()).replace(/[\s、。！？!?,.・「」『』（）()〜~ー-]/g,"")}function St(e,t){const s=e.length,n=t.length;if(!s)return n;if(!n)return s;let a=Array.from({length:n+1},(o,r)=>r);for(let o=1;o<=s;o++){const r=[o];for(let i=1;i<=n;i++)r[i]=Math.min(a[i]+1,r[i-1]+1,a[i-1]+(e[o-1]===t[i-1]?0:1));a=r}return a[n]}function xt(e,t){return e=F(e),t=F(t),!e||!t?0:1-St(e,t)/Math.max(e.length,t.length)}function ce(e,t){let s=0,n=e[0]||"";for(const a of e)for(const o of t){let r=xt(a,o);F(a).includes(F(o))&&F(o).length>=2&&(r=Math.max(r,.95)),r>s&&(s=r,n=a)}return{score:Math.round(s*100),heard:n}}function be(e){return e>=Et}function u(e){return String(e??"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}function H(e){const t=e.slice();for(let s=t.length-1;s>0;s--){const n=Math.floor(Math.random()*(s+1));[t[s],t[n]]=[t[n],t[s]]}return t}function ee(e){return!h.setting("showKana")||!e.kana||!e.jp?"":F(e.kana)!==F(e.jp)?e.kana:""}function te(e,t,s){if(!e)return"";const n=h.setting("romaji");return n==="hide"?"":n==="fade"&&s?`<button type="button" class="romaji-peek ${t}" data-reveal="${u(e)}" data-cls="${t}">tap for romaji</button>`:`<span class="${t}">${u(e)}</span>`}function ge(e,t){const s=h.setting("romaji");return!e.romaji||s==="hide"||s==="fade"&&t?"":`<span class="opt-romaji">${u(e.romaji)}</span>`}function G(e,t={}){const s=t.big!==!1,n=t.showEn!==!1,a=ee(e),o=[...e.jp||""].length,r=o>18?"xlong":o>12?"long":"";return`<div class="phrase ${s?"big":""} ${r}">
    <div class="jp phrase-jp" lang="ja">${u(e.jp)}</div>
    ${a?`<div class="jp phrase-kana" lang="ja">${u(a)}</div>`:""}
    <div class="phrase-romaji-wrap">${te(e.romaji,"phrase-romaji",!!t.known)}</div>
    ${n?`<div class="phrase-en">${u(e.en)}</div>`:""}
  </div>`}function se(e,t=""){return`<div class="audio-row ${t}">
    <button type="button" class="pill" data-say="${u(e)}" aria-label="Play">${E.play}<span>Play</span></button>
    <button type="button" class="pill ghost" data-say="${u(e)}" data-slow="1" aria-label="Play slowly">${E.slow}<span>Slow</span></button>
  </div>`}function R(e){const t=h.ensureDaily();return`<div class="daily-steps" aria-label="Today’s lesson progress">
    ${[{key:"warmDone",id:"warm",label:"Warm-up"},{key:"newDone",id:"new",label:"New"},{key:"convoDone",id:"convo",label:"Chat"},{key:"listenDone",id:"listen",label:"Listen"}].map((n,a)=>{const o=t[n.key],r=e===n.id;return`<span class="ds ${o?"done":""} ${r?"now":""}">${o?E.check:a+1}<em>${n.label}</em></span>`}).join("")}
  </div>`}function Bt(e){return e>=80?{cls:"great",label:"すごい！ Great"}:be(e)?{cls:"close",label:"Close, nice"}:{cls:"again",label:"Let’s try again"}}function ze(e,t){const s=Bt(e);return`<div class="score ${s.cls}"><span class="score-num">${e}%</span><span>${s.label}</span></div><p class="heard">Heard: <span class="jp">${u(t)}</span></p>`}function le(e,t,s){if(Z()){e.innerHTML=`<button type="button" class="mic" data-mic>${E.mic}<span>Tap and say it</span></button><div class="result" data-result></div>`;const n=e.querySelector("[data-mic]"),a=e.querySelector("[data-result]");n.addEventListener("click",async()=>{n.classList.add("listening");const o=n.querySelector("span");o&&(o.textContent="Listening…");try{ye();const r=await ie();if(!r.length){a.innerHTML='<p class="muted">I didn’t catch that. Try again a little closer to the mic.</p>';return}const i=ce(r,t);a.innerHTML=ze(i.score,i.heard),i.score>=80&&M(a.querySelector(".score")),s==null||s(be(i.score))}catch(r){const i=r instanceof Error?r.message:"",m=/not-allowed|service-not-allowed/.test(i);a.innerHTML=`<p class="muted">${m?"Microphone access is blocked. You can rate yourself instead.":"Speech check isn’t working right now. Rate yourself instead."}</p>`,Ee(e,s,!0)}finally{n.classList.remove("listening"),o&&(o.textContent="Tap and say it")}})}else Ee(e,s,!1)}function Ee(e,t,s=!1){const n=`<p class="muted small">Say it out loud, then be honest:</p>
    <div class="rate-row"><button type="button" class="btn ghost" data-rate="0">Again</button><button type="button" class="btn soft" data-rate="1">Got it</button></div>`;s?e.insertAdjacentHTML("beforeend",n):e.innerHTML=n,e.querySelectorAll("[data-rate]").forEach(a=>{a.addEventListener("click",()=>{e.querySelectorAll("[data-rate]").forEach(o=>o.classList.remove("chosen")),a.classList.add("chosen"),a.dataset.rate==="1"&&a.classList.add("bounce"),t==null||t(a.dataset.rate==="1")})})}function Mt(e,t,s,n){var m,l;let a=!1,o=null;const r=()=>{var d,p;a||(a=!0,s(),(d=e.querySelector("[data-show-answer]"))==null||d.remove(),(p=e.querySelector(".warm-memory-hint"))==null||p.remove(),i())},i=()=>{if(e.querySelector(".rate-row"))return;const d=o!==null&&!be(o);e.insertAdjacentHTML("beforeend",`<p class="muted small warm-rate-hint">${d?"Under 55% counts as a miss. Tap Again to continue.":"Be honest — how did you do?"}</p>
      <div class="rate-row">
        <button type="button" class="btn ghost" data-rate="0">Again</button>
        <button type="button" class="btn soft" data-rate="1" ${d?"disabled":""}>Got it</button>
      </div>`),e.querySelectorAll("[data-rate]").forEach(p=>{p.addEventListener("click",()=>{if(p.disabled)return;e.querySelectorAll("[data-rate]").forEach(c=>c.classList.remove("chosen")),p.classList.add("chosen");const v=p.dataset.rate==="1",y=d?!1:v;v&&p.classList.add("bounce"),n(y)})})};if(Z()){e.innerHTML=`<button type="button" class="mic" data-mic>${E.mic}<span>Tap and say it</span></button>
      <button type="button" class="btn ghost wide" data-show-answer>Show answer</button>
      <div class="result" data-result></div>`;const d=e.querySelector("[data-mic]"),p=e.querySelector("[data-result]");(m=e.querySelector("[data-show-answer]"))==null||m.addEventListener("click",()=>r()),d.addEventListener("click",async()=>{var y;d.classList.add("listening");const v=d.querySelector("span");v&&(v.textContent="Listening…");try{ye();const c=await ie();if(!c.length){p.innerHTML='<p class="muted">I didn’t catch that. Try again a little closer to the mic.</p>';return}const f=ce(c,t.filter(Boolean));o=f.score,p.innerHTML=ze(f.score,f.heard),f.score>=80&&M(p.querySelector(".score")),r()}catch(c){const f=c instanceof Error?c.message:"",g=/not-allowed|service-not-allowed/.test(f);p.innerHTML=`<p class="muted">${g?"Microphone access is blocked. Show the answer and rate yourself.":"Speech check isn’t working right now. Show the answer and rate yourself."}</p>`,e.querySelector("[data-show-answer]")||(e.insertAdjacentHTML("afterbegin",'<button type="button" class="btn ghost wide" data-show-answer>Show answer</button>'),(y=e.querySelector("[data-show-answer]"))==null||y.addEventListener("click",()=>r()))}finally{d.classList.remove("listening"),v&&(v.textContent="Tap and say it")}})}else e.innerHTML=`<p class="muted small warm-memory-hint">Say it out loud from memory, then check:</p>
      <button type="button" class="btn soft wide" data-show-answer>Show answer</button>`,(l=e.querySelector("[data-show-answer]"))==null||l.addEventListener("click",()=>r())}function W(e,t={}){e&&z(e,t).then(s=>{s||N("Turn up volume / check silent mode")})}function Oe(e){return[e.jp,e.kana].filter(t=>!!t)}function Dt(){if(h.ensureDaily().warmDone)return I("#/today/new");D("Warm-up","#/");const t=h.dueIds().map(a=>w.byId.get(a)).filter(a=>!!a).slice(0,8);if(!t.length){h.setDaily({warmDone:!0}),j(`<div class="done-card">${x("wave","done-mascot")}${R("warm")}
      <p class="jp big-jp" lang="ja">まだ大丈夫！</p>
      <p>Nothing is due for review yet — first day magic.</p>
      <a class="btn primary wide" id="warm-next" href="#/today/new">New phrases</a></div>`);return}let s=0;const n=()=>{if(s>=t.length){h.setDaily({warmDone:!0}),j(`<div class="done-card">${x("cheer","done-mascot")}${R("warm")}
        <p class="jp big-jp" lang="ja">おつかれ！</p>
        <p>Warm-up done — ${t.length} phrase${t.length>1?"s":""} refreshed.</p>
        <a class="btn primary wide" href="#/today/new">New phrases</a></div>`),M(document.querySelector(".done-mascot"));return}const{phrase:a,id:o}=t[s],r=h.box(o)>=3,i=ee(a),m=[...a.jp].length,l=m>18?"xlong":m>12?"long":"",d=j(`
      ${R("warm")}
      <div class="quiz-top"><span>Review ${s+1} of ${t.length}</span><div class="bar small"><span style="width:${s/t.length*100}%"></span></div></div>
      <article class="card phrase-card warm-card" id="phrase-card">
        <span class="card-deco">${$.bow}</span>
        <p class="prompt warm-ask"><span class="eyebrow">Recall</span> How do you say this?</p>
        <div class="phrase-en warm-en">${u(a.en)}</div>
        <div class="warm-answer hidden" id="warm-answer">
          <div class="phrase big ${l}">
            <div class="jp phrase-jp" lang="ja">${u(a.jp)}</div>
            ${i?`<div class="jp phrase-kana" lang="ja">${u(i)}</div>`:""}
            <div class="phrase-romaji-wrap">${te(a.romaji,"phrase-romaji",r)}</div>
          </div>
          <div id="warm-audio">${se(a.jp)}</div>
        </div>
        <div class="practice" id="practice"></div>
      </article>
      <button type="button" class="btn primary wide" id="warm-next" disabled>Next</button>`);let p=!1;const v=d.querySelector("#warm-next");Mt(d.querySelector("#practice"),Oe(a),()=>{var y;(y=document.getElementById("warm-answer"))==null||y.classList.remove("hidden"),z(a.jp)},y=>{h.grade(o,y),p=!0,v.disabled=!1}),v.addEventListener("click",()=>{p&&(s+=1,n())})};n()}function Tt(){var o;const e=h.ensureDaily();if(e.newDone)return I("#/today/convo");D("New phrases","#/");const t=h.setting("dailyNew")||3,s=e.newIds&&e.newIds.length?e.newIds.map(r=>w.byId.get(r)).filter(r=>!!r):jt(t);if(!s.length){h.setDaily({newDone:!0,newIds:[]}),j(`<div class="done-card">${x("cheer","done-mascot")}${R("new")}
      <p class="jp big-jp" lang="ja">全部おぼえた！</p>
      <p>You’ve unlocked every phrase. Free practice keeps the conversation going.</p>
      <a class="btn primary wide" href="#/today/convo">Mini conversation</a></div>`);return}(o=e.newIds)!=null&&o.length||h.setDaily({newIds:s.map(r=>r.id)});let n=0;const a=()=>{var l;if(n>=s.length){const d=X(w);let p=h.state.curriculum.value.unlocked;for(const v of s){const y=d.findIndex(c=>c.id===v.id);y>=0&&(p=Math.max(p,y+1))}h.setUnlocked(p),h.setDaily({newDone:!0}),j(`<div class="done-card">${x("cheer","done-mascot")}${R("new")}
        <p class="jp big-jp" lang="ja">新しいことば！</p>
        <p>${s.length} new phrase${s.length>1?"s":""} unlocked.</p>
        <a class="btn primary wide" href="#/today/convo">Mini conversation</a></div>`),M(document.querySelector(".done-mascot"));return}const r=s[n],i=r.phrase;h.markSeen(r.id);const m=j(`
      ${R("new")}
      <div class="quiz-top"><span>New ${n+1} of ${s.length}</span><div class="bar small"><span style="width:${n/s.length*100}%"></span></div></div>
      <article class="card phrase-card" id="phrase-card">
        <span class="card-deco">${$.heart}</span>
        ${G(i,{known:!1})}
        ${se(i.jp)}
        ${i.note?`<p class="note">${u(i.note)}</p>`:""}
        ${i.grammar?`<details class="grammar"><summary>${$.star} Grammar bite</summary><p>${u(i.grammar)}</p></details>`:""}
        <div class="practice" id="practice"></div>
      </article>
      <button type="button" class="btn primary wide" id="new-next">Next</button>`);le(m.querySelector("#practice"),Oe(i),d=>h.grade(r.id,d)),(l=m.querySelector("#new-next"))==null||l.addEventListener("click",()=>{n+=1,a()}),window.setTimeout(()=>void z(i.jp),250)};a()}function qt(){const e=h.ensureDaily();if(e.convoDone)return I("#/today/listen");D("Mini conversation","#/");const t=(e.newIds||[]).map(c=>w.byId.get(c)).find(c=>!!c),s=(t==null?void 0:t.unit)||w.units[0],n=s.roleplay.lines.slice(0,6),a=Ce();let o=0,r=0,i=0;const m=j(`
    ${R("convo")}
    <section class="rp-head">
      <p class="eyebrow">${$.heart} Mini conversation</p>
      <h1>${u(s.roleplay.title)}</h1>
      <p class="lede">${u(s.roleplay.setting)} Today’s phrases are mixed in.</p>
    </section>
    <div class="chat" id="chat"></div>
    <div class="reply" id="reply"></div>`),l=m.querySelector("#chat"),d=m.querySelector("#reply"),p=(c,f)=>{const g=document.createElement("div");g.className=`bubble ${f}`;const b=ee(c);g.innerHTML=`${f==="them"?`<div class="who">${u(c.name||"")}</div>`:'<div class="who">You</div>'}
      <div class="jp bubble-jp" lang="ja">${u(c.jp)}</div>
      ${b?`<div class="jp bubble-kana" lang="ja">${u(b)}</div>`:""}
      <div>${te(c.romaji,"bubble-romaji",!1)}</div>
      <div class="bubble-en">${u(c.en)}</div>
      <div class="bubble-audio">
        <button type="button" class="mini" data-say="${u(c.jp||"")}" aria-label="Play">${E.play}</button>
        <button type="button" class="mini" data-say="${u(c.jp||"")}" data-slow="1" aria-label="Play slowly">${E.slow}</button>
      </div>`,l.appendChild(g),g.scrollIntoView({block:"end"})},v=()=>{h.setDaily({convoDone:!0}),d.innerHTML=`<div class="done-card">${x("cheer","done-mascot")}
      <p class="jp big-jp" lang="ja">いい会話！</p>
      <p>${i} of ${r} replies on point.</p>
      <a class="btn primary wide" href="#/today/listen">Quick listen</a></div>`,M(d.querySelector(".done-mascot"))},y=()=>{var f;if(!Ne(a))return;if(o>=n.length)return v();const c=n[o++];if(c.speaker==="them")p(c,"them"),d.innerHTML="",W(c.jp,{fast:!!c.fast}),window.setTimeout(y,650);else{const g=H(c.options||[]),b=(f=c.options)==null?void 0:f[0];if(!b)return y();d.innerHTML=`<p class="prompt">${u(c.prompt)}</p>
        <div class="options">${g.map((k,A)=>`<button type="button" class="option" data-i="${A}"><span class="jp" lang="ja">${u(k.jp)}</span><span class="opt-romaji">${u(k.romaji||"")}</span></button>`).join("")}</div>`,d.querySelectorAll(".option").forEach(k=>{k.addEventListener("click",()=>{const A=g[Number(k.dataset.i)];r+=1,A.jp===b.jp&&(i+=1),d.querySelectorAll(".option").forEach(S=>{S.disabled=!0;const P=g[Number(S.dataset.i)];P.jp===b.jp?S.classList.add("right"):P===A&&S.classList.add("wrong")}),p(b,"you"),W(b.jp),window.setTimeout(y,700)})})}};y()}function It(){if(h.ensureDaily().listenDone)return I("#/today/done");D("Quick listen","#/");const t=Ct(4);if(!t.length)return h.setDaily({listenDone:!0,done:!0}),h.touchDay(),I("#/today/done");let s=0;const n=()=>{if(s>=t.length)return h.setDaily({listenDone:!0,done:!0}),h.touchDay(),I("#/today/done");const a=t[s],o=H(a.meanings.map((i,m)=>({m:i,ok:m===0}))),r=j(`
      ${R("listen")}
      <div class="quiz-top"><span>Listen ${s+1} of ${t.length}</span><div class="bar small"><span style="width:${s/t.length*100}%"></span></div></div>
      <article class="card listen-card" id="listen-card">
        <p class="q-label">${E.ear} Listen. No text yet!</p>
        <div class="listen-play">
          <button type="button" class="big-play" data-say="${u(a.jp)}" aria-label="Play at natural speed">${E.play}</button>
          <button type="button" class="pill ghost" data-say="${u(a.jp)}" data-slow="1">${E.slow}<span>Slow</span></button>
        </div>
        <div class="listen-text hidden" id="listen-text">${G(a,{big:!1})}</div>
      </article>
      <div id="lstage">
        <p class="prompt"><span class="eyebrow">Meaning</span> What did you hear?</p>
        <div class="options" id="mopts">${o.map((i,m)=>`<button type="button" class="option" data-i="${m}"><span>${u(i.m)}</span></button>`).join("")}</div>
      </div>`);window.setTimeout(()=>void z(a.jp),350),r.querySelectorAll("#mopts .option").forEach(i=>{i.addEventListener("click",()=>{var y;const m=o[Number(i.dataset.i)];r.querySelectorAll("#mopts .option").forEach(c=>{c.disabled=!0;const f=o[Number(c.dataset.i)];f.ok?c.classList.add("right"):f===m&&c.classList.add("wrong")});const l=document.getElementById("lstage"),d=H(a.reply.options.slice()),p=a.reply.options[0];l.innerHTML=`
          <p class="prompt"><span class="eyebrow">Reply out loud</span> ${u(a.reply.prompt)}</p>
          <div class="options" id="ropts">${d.map((c,f)=>`<button type="button" class="option" data-i="${f}"><span class="jp" lang="ja">${u(c.jp)}</span><span class="opt-romaji">${u(c.romaji||"")}</span></button>`).join("")}</div>
          <div class="practice" id="practice"></div>`,(y=document.getElementById("listen-text"))==null||y.classList.remove("hidden");const v=document.getElementById("practice");v&&le(v,[p.jp,p.kana].filter(c=>!!c)),l.querySelectorAll("#ropts .option").forEach(c=>{c.addEventListener("click",()=>{var g;const f=d[Number(c.dataset.i)];l.querySelectorAll("#ropts .option").forEach(b=>{b.disabled=!0;const k=d[Number(b.dataset.i)];k.jp===p.jp?b.classList.add("right"):k===f&&b.classList.add("wrong")}),l.insertAdjacentHTML("beforeend",`<button type="button" class="btn primary wide" id="l-next">${s===t.length-1?"Finish":"Next"}</button>`),W(p.jp),(g=document.getElementById("l-next"))==null||g.addEventListener("click",()=>{s+=1,n()})})})})})};n()}function Ct(e){const t=new Set,s=X(w),n=h.state.curriculum.value.unlocked||0;s.slice(0,Math.max(n,1)).forEach(o=>t.add(o.unit.id)),w.units[0]&&t.add(w.units[0].id);const a=[];for(const o of w.units)!t.has(o.id)||!o.listening||a.push(...o.listening);return H(a).slice(0,Math.min(e,a.length))}function Nt(){const e=h.ensureDaily();e.warmDone&&e.newDone&&e.convoDone&&e.listenDone&&!e.done&&h.setDaily({done:!0}),h.touchDay(),D("今日もおつかれさま","#/");const t=Lt(h.setting("dailyNew")||3),s=t.length?`<ul class="tomorrow-list">${t.map(a=>`<li><span class="jp" lang="ja">${u(a.phrase.jp)}</span> <span class="muted">${u(a.phrase.en)}</span></li>`).join("")}</ul>`:'<p class="muted">More free practice tomorrow — the curriculum is complete.</p>',n=h.needsBackupReminder()?`<aside class="backup-nudge" role="note">
        <span aria-hidden="true">${$.bow}</span>
        <div>
          <strong>Save a backup?</strong>
          <p>It’s been a little while. A backup code keeps your streak safe if you switch phones.</p>
          <a class="btn ghost" href="#/settings">Back up my progress</a>
        </div>
      </aside>`:"";j(`<div class="done-card end-card">
    ${x("cheer","done-mascot")}
    <p class="jp big-jp" lang="ja">おつかれさま！</p>
    <p>Streak: <strong>${h.streak()}</strong> day${h.streak()===1?"":"s"}. Missing a day never punishes you — just come back when you can.</p>
    ${n}
    <div class="tomorrow"><div class="set-title">Coming tomorrow</div>${s}</div>
    <a class="btn primary wide" href="#/">Home</a>
  </div>`),M(document.querySelector(".done-mascot"))}function Ht(){const e=new Date().getHours(),t=e<11?"おはよう":e<18?"こんにちは":"こんばんは",s=e<11?"Good morning":e<18?"Hello":"Good evening";return{html:`<span class="greet-phrase">${t}、</span><span class="greet-name">リズちゃん</span>`,en:s}}function Pt(){const e=new Set(Object.keys(h.state.days)),t=[],s=new Date;s.setHours(12,0,0,0),s.setDate(s.getDate()-27);const n=U();for(let a=0;a<28;a++){const o=U(s);t.push(`<span class="hm-cell ${e.has(o)?"on":""} ${o===n?"today":""}" title="${o}"></span>`),s.setDate(s.getDate()+1)}return`<div class="heatmap" aria-label="Practice days">${t.join("")}</div>`}function zt(){const{finished:e,done:t}=ve(),s=h.streak();return e?s>=3?`Streak ${s} — you’re on a roll.`:"今日もおつかれさま. Come back tomorrow.":t===0?"A cozy ten minutes. Missing a day is fine — we just pick up again.":`${t} of 4 parts done. Keep going when you’re ready.`}function Ot(e,t){const s=C(e);return`<a class="unit-card ${s.done?"done":""}" href="#/unit/${e.id}">
    <span class="unit-num">${s.done?E.check:t+1}</span>
    <div class="unit-body">
      <div class="unit-title">${u(e.title)}</div>
      <div class="jp unit-jp" lang="ja">${u(e.jpTitle)}</div>
      <div class="bar small"><span style="width:${Math.round(s.steps/4*100)}%"></span></div>
    </div>
  </a>`}function Rt(){const e=document.getElementById("topbar");e&&(e.classList.add("hidden"),e.innerHTML="");const t=w.units.reduce((d,p)=>d+C(p).seen,0),s=h.dueIds().filter(d=>w.byId.has(d)).length,n=Ht(),{finished:a,done:o}=ve(),r=a?"#/today/done":Pe(),i=a?"Lesson complete":o?"Continue today’s lesson":"Today’s lesson",m=a?"Peek at free practice, or come back tomorrow":"Warm-up · new phrases · chat · listen",l=h.needsBackupReminder()?`<aside class="backup-nudge home-nudge" role="note">
          <span aria-hidden="true">${$.bow}</span>
          <div>
            <strong>Save a backup?</strong>
            <p>A backup code keeps your streak safe if you switch phones. About once a week is plenty.</p>
            <a class="btn ghost" href="#/settings">Back up my progress</a>
          </div>
        </aside>`:"";j(`
    <section class="hero">
      <a class="iconbtn hero-gear" href="#/settings" aria-label="Settings">${E.gear}</a>
      <div class="hero-row">
        <div class="hero-text">
          <p class="eyebrow">${$.heart} for リズちゃん</p>
          <h1 class="jp hero-jp" lang="ja">${n.html}</h1>
          <p class="hero-en">${n.en}, Rizu-chan. ${u(zt())}</p>
        </div>
        ${x(a?"cheer":"wave","hero-mascot")}
      </div>
      <div class="stats">
        <div class="stat"><span class="stat-num">${h.streak()}</span><span class="stat-label">day streak</span></div>
        <div class="stat"><span class="stat-num">${t}</span><span class="stat-label">phrases</span></div>
        <div class="stat"><span class="stat-num">${s}</span><span class="stat-label">due review</span></div>
      </div>
      ${Pt()}
      <a class="btn primary wide cta daily-cta ${a?"done":""}" href="${r}" id="start-cta">
        <span class="cta-main">${i}</span>
        <span class="cta-sub">${m}</span>
      </a>
      ${l}
    </section>
    <details class="free-practice" id="free-practice">
      <summary>
        <span class="track-icon">${$.star}</span>
        <div>
          <div class="unit-title">Free practice</div>
          <div class="unit-sub">Open any unit’s phrases, role-play, listening, or quiz</div>
        </div>
      </summary>
      ${w.tracks.map(d=>{const p=V(w,d.id),v=p.filter(y=>C(y).done).length;return`<section class="track track-${d.id}" id="track-${d.id}">
            <div class="track-head">
              <span class="track-icon">${d.id==="family"?$.heart:$.star}</span>
              <div>
                <h2 class="track-title">${u(d.title)} <span class="jp track-jp" lang="ja">${u(d.jpTitle)}</span></h2>
                <p class="track-blurb">${u(d.blurb)}</p>
              </div>
              <span class="tag">${v}/${p.length}</span>
            </div>
            <div class="units">${p.map(Ot).join("")}</div>
          </section>`}).join("")}
      <a class="review-card-home ${s?"has-due":""}" href="#/review" id="review-cta">
        <span class="track-icon">${$.bow}</span>
        <div><div class="unit-title">Review bank</div><div class="unit-sub">${s?`${s} phrase${s>1?"s":""} ready`:"Leitner spaced review"}</div></div>
        <span class="tag ${s?"hot":""}">${s}</span>
      </a>
    </details>
    <footer class="foot">${$.skull}<span>がんばって、リズちゃん</span>${$.skull}</footer>`)}function Ut(){D("Review","#/");const e=h.dueIds().filter(i=>w.byId.has(i)),t=()=>`<div class="boxes" aria-label="Leitner boxes">${[1,2,3,4,5].map(m=>Object.keys(h.state.srs).filter(l=>w.byId.has(l)&&h.state.srs[l].value.box===m).length).map((m,l)=>`<div class="box"><span class="box-n">${m}</span><span class="box-l">Box ${l+1}</span></div>`).join("")}</div>`;if(!e.length){const i=Object.keys(h.state.srs).filter(l=>w.byId.has(l)).length,m=He();j(`<div class="done-card">
      ${x(i?"cheer":"wave","done-mascot")}
      <p class="jp big-jp" lang="ja">${i?"ばっちり！":"まだです"}</p>
      <p>${i?"Nothing to review right now. Come back tomorrow.":"Learn a few phrases first and they’ll show up here."}</p>
      ${t()}
      <p class="muted small">Phrases move up a box when you get them, and come back less often: same day, then 1, 3, 7, and 16 days.</p>
      <a class="btn primary" href="#/unit/${m.id}">Learn phrases</a></div>`);return}const s=e.slice(0,20),n=new Set;let a=0,o=0;const r=()=>{var c;if(a>=s.length){j(`<div class="done-card">${x("cheer","done-mascot")}<p class="jp big-jp" lang="ja">おつかれさま！</p>
        <p>You reviewed ${s.length-n.size} card${s.length-n.size===1?"":"s"} and got ${o} on the first try.</p>
        ${t()}
        <a class="btn primary" href="#/">Home</a></div>`),M(document.querySelector(".done-mascot"));return}const i=s[a],m=w.byId.get(i);if(!m){a+=1,r();return}const{phrase:l,unit:d}=m,p=h.state.srs[i].value.box,v=j(`
      <div class="quiz-top"><span>${a+1} of ${s.length} · Box ${p}</span><div class="bar small"><span style="width:${a/s.length*100}%"></span></div></div>
      <article class="card review-card">
        <p class="q-label">Say it in Japanese</p>
        <p class="q-main">${u(l.en)}</p>
        <p class="muted small">from “${u(d.title)}”</p>
        <div id="answer" class="answer hidden">${G(l,{big:!1,known:h.box(i)>=3})}${se(l.jp,"center")}</div>
      </article>
      <div id="rv-actions">
        <div id="rv-speak" class="practice"></div>
        <button type="button" class="btn primary wide" id="reveal">Show answer</button>
      </div>`),y=v.querySelector("#rv-speak");Z()?le(y,[l.jp,l.kana].filter(f=>!!f)):y.remove(),(c=v.querySelector("#reveal"))==null||c.addEventListener("click",()=>{var g,b,k;(g=document.getElementById("answer"))==null||g.classList.remove("hidden"),z(l.jp);const f=document.getElementById("rv-actions");f.innerHTML=`<div class="rate-row">
        <button type="button" class="btn ghost" id="again">Again</button>
        <button type="button" class="btn soft" id="gotit">Got it</button>
      </div>`,(b=document.getElementById("again"))==null||b.addEventListener("click",()=>{h.grade(i,!1),n.has(i)||(n.add(i),s.push(i)),a+=1,r()}),(k=document.getElementById("gotit"))==null||k.addEventListener("click",A=>{n.has(i)||(h.grade(i,!0),o+=1),M(A.currentTarget),window.setTimeout(()=>{a+=1,r()},280)})})};r()}function Ft(){const e=w.units[1]||w.units[0];return(e==null?void 0:e.phrases[1])||(e==null?void 0:e.phrases[0])}function Q(){var a,o;D("Settings","#/");const e=h.setting("showKana"),t=h.setting("romaji"),s=h.setting("dailyNew"),n=Ft();j(`
    <article class="card settings">
      <div class="set-block">
        <div class="set-title">New phrases per day</div>
        <div class="set-sub">How many brand-new phrases today’s lesson unlocks.</div>
        <div class="seg" role="radiogroup" aria-label="Daily new phrases">
          ${[3,5,7].map(r=>`<button type="button" role="radio" aria-checked="${s===r}" class="seg-btn ${s===r?"on":""}" data-dn="${r}">${r}</button>`).join("")}
        </div>
      </div>
      <label class="switch-row">
        <div>
          <div class="set-title">Hiragana reading</div>
          <div class="set-sub">Show the kana under phrases with kanji, like <span class="jp" lang="ja">お母さん</span> → <span class="jp" lang="ja">おかあさん</span>.</div>
        </div>
        <input type="checkbox" id="set-kana" ${e?"checked":""}><span class="switch" aria-hidden="true"></span>
      </label>
      <div class="set-block">
        <div class="set-title">Romaji</div>
        <div class="set-sub">Fade hides romaji (tap to peek) once a phrase is in review box 3 or higher.</div>
        <div class="seg" role="radiogroup" aria-label="Romaji">
          ${[["show","Show"],["fade","Fade"],["hide","Hide"]].map(([r,i])=>`<button type="button" role="radio" aria-checked="${t===r}" class="seg-btn ${t===r?"on":""}" data-rm="${r}">${i}</button>`).join("")}
        </div>
      </div>
      ${n?`<div class="set-preview">${G(n,{big:!1,known:h.box(`${(w.units[1]||w.units[0]).id}:${n.jp}`)>=3})}</div>`:""}
    </article>
    <article class="card settings backup-card" id="backup-section">
      <div class="backup-deco" aria-hidden="true">${$.bow}${$.skull}${$.bow}</div>
      <div class="set-title">Back up my progress ${$.heart}</div>
      <div class="set-sub">Progress is saved on this phone. Make a backup code now and then, or before switching phones. About once a week is a good rhythm.</div>
      <div class="set-block">
        <div class="set-title">Export</div>
        <div class="set-sub">A compact code with your streak, phrases, review boxes, and settings.</div>
        <textarea class="backup-code" id="backup-export" readonly rows="4" aria-label="Backup code" placeholder="Tap “Make backup code”…"></textarea>
        <div class="backup-actions">
          <button type="button" class="btn primary" id="backup-make">Make backup code</button>
          <button type="button" class="btn ghost" id="backup-copy" disabled>Copy code</button>
          <button type="button" class="btn ghost" id="backup-share" hidden>Share</button>
        </div>
      </div>
      <div class="set-block">
        <div class="set-title">Restore</div>
        <div class="set-sub">Paste a code from another phone. Older codes that start with EJP1. work too.</div>
        <textarea class="backup-code" id="backup-import" rows="4" aria-label="Paste backup code" placeholder="Paste EJP1.… code here"></textarea>
        <p class="backup-err" id="backup-err" hidden role="alert"></p>
        <button type="button" class="btn primary" id="backup-restore">Restore</button>
      </div>
      <div class="backup-cheer" id="backup-cheer" hidden>
        ${x("cheer","backup-cheer-mascot")}
        <p class="jp" lang="ja">やった！</p>
        <p>Progress restored on this phone.</p>
      </div>
    </article>
    <article class="card settings">
      <div class="set-title">Progress</div>
      <div class="set-sub">Saved on this device. Missing a day never wipes your streak — you just resume.</div>
      <button type="button" class="btn ghost" id="reset">Reset progress</button>
    </article>`),(a=document.getElementById("set-kana"))==null||a.addEventListener("change",r=>{h.setting("showKana",r.target.checked),Q()}),document.querySelectorAll("[data-rm]").forEach(r=>{r.addEventListener("click",()=>{const i=r.dataset.rm;(i==="show"||i==="fade"||i==="hide")&&(h.setting("romaji",i),Q())})}),document.querySelectorAll("[data-dn]").forEach(r=>{r.addEventListener("click",()=>{const i=Number(r.dataset.dn);(i===3||i===5||i===7)&&(h.setting("dailyNew",i),Q())})}),(o=document.getElementById("reset"))==null||o.addEventListener("click",()=>{confirm("Reset all progress on this device?")&&(h.reset(),N("Progress reset"),I("#/"))}),Wt()}function Wt(){var m,l;const e=document.getElementById("backup-export"),t=document.getElementById("backup-import"),s=document.getElementById("backup-err"),n=document.getElementById("backup-copy"),a=document.getElementById("backup-share"),o=document.getElementById("backup-cheer"),r=d=>{s.hidden=!d,s.textContent=d};(m=document.getElementById("backup-make"))==null||m.addEventListener("click",async()=>{try{h.markBackup(),e.value=await h.exportBackup(),n.disabled=!1,N("Backup code ready")}catch{N("Couldn’t make a backup code")}});const i=async()=>{var v;const d=e.value.trim();if(!d)return;let p=!1;try{(v=navigator.clipboard)!=null&&v.writeText&&(await navigator.clipboard.writeText(d),p=!0)}catch{p=!1}if(!p){e.focus(),e.select();try{p=document.execCommand("copy")}catch{p=!1}}p?(h.markBackup(),N("Copied!")):N("Couldn’t copy — long-press to select")};n.addEventListener("click",()=>void i()),navigator.share&&(a.hidden=!1,a.addEventListener("click",async()=>{if(!e.value.trim())try{e.value=await h.exportBackup(),n.disabled=!1}catch{N("Couldn’t make a backup code");return}try{await navigator.share({title:"にほんご backup",text:e.value.trim()}),h.markBackup()}catch(d){if(d instanceof DOMException&&d.name==="AbortError")return;N("Share didn’t work — try Copy instead")}})),(l=document.getElementById("backup-restore"))==null||l.addEventListener("click",async()=>{r("");const d=t.value.trim();if(!d){r("Paste a backup code first.");return}try{await Ie(d)}catch(p){r(p instanceof Error?p.message:"Couldn’t restore that code.");return}if(confirm("This will replace progress on this device. Continue?"))try{await h.importBackup(d),o.hidden=!1,M(o.querySelector(".backup-cheer-mascot")||o),N("Progress restored!"),window.setTimeout(()=>Q(),900)}catch(p){r(p instanceof Error?p.message:"Couldn’t restore that code.")}})}function Gt(e){var t;return((t=w.tracks.find(s=>s.id===e.track))==null?void 0:t.title)||"Lesson"}function oe(e,t,s=""){return`<div class="feedback ${e?"good":"bad"}">
    ${x(e?"cheer":"think","fb-mascot")}
    <div class="fb-body"><p class="fb-title"><strong>${t}</strong></p>${s}</div>
  </div>`}function Re(e,t){return t||!C(e).done?"":`<div class="complete-banner">${$.star}<span>Unit complete: ${u(e.title)}</span>${$.star}</div>`}function Yt(e){D(u(Gt(e)),"#/");const t=C(e),s=(n,a,o,r,i)=>`<a class="step" href="${o}"><span class="step-num ${a?"ok":""}">${a?E.check:n}</span><div><div class="step-title">${r}</div><div class="step-sub">${i}</div></div></a>`;j(`
    <section class="unit-hero">
      <p class="eyebrow jp" lang="ja">${u(e.jpTitle)}</p>
      <h1>${u(e.title)}</h1>
      <p class="lede">${u(e.summary)}</p>
      ${t.done?`<p class="tag ok">${$.star} Unit complete</p>`:""}
    </section>
    <div class="steps">
      ${s(1,t.seen===t.total,`#/unit/${e.id}/cards/0`,"Phrases",`${t.seen} of ${t.total} learned · listen and say each one`)}
      ${s(2,t.listenDone,`#/unit/${e.id}/listen`,"Listening drill",`${e.listening.length} lines at natural speed, no text`)}
      ${s(3,t.roleplayDone,`#/unit/${e.id}/roleplay`,"Role-play",u(e.roleplay.title))}
      ${s(4,t.quizBest>=70,`#/unit/${e.id}/quiz`,"Quick quiz",t.quizBest?`Best score ${t.quizBest}%`:"6 questions · 70% to pass")}
    </div>`)}function Kt(e,t){const s=Math.max(0,Math.min(e.phrases.length-1,t||0)),n=e.phrases[s],a=K(e.id,n.jp),o=fe(e,n.jp);h.markSeen(a),D(u(e.title),`#/unit/${e.id}`);const r=s===e.phrases.length-1,i=j(`
    <div class="progress-dots" aria-label="Card ${s+1} of ${e.phrases.length}">
      ${e.phrases.map((m,l)=>`<span class="${l<s?"past":l===s?"now":""}"></span>`).join("")}
    </div>
    <article class="card phrase-card" id="phrase-card">
      <span class="card-deco">${$.bow}</span>
      ${G(n,{known:o})}
      ${se(n.jp)}
      ${n.note?`<p class="note">${u(n.note)}</p>`:""}
      ${n.grammar?`<details class="grammar"><summary>${$.star} Grammar bite</summary><p>${u(n.grammar)}</p></details>`:""}
      <div class="practice" id="practice"></div>
    </article>
    <div class="nav-row">
      <a class="btn ghost" href="#/unit/${e.id}/cards/${s-1}" ${s===0?'aria-disabled="true" tabindex="-1"':""}>Back</a>
      <a class="btn primary" id="next" href="${r?`#/unit/${e.id}/listen`:`#/unit/${e.id}/cards/${s+1}`}">${r?"On to listening":"Next"}</a>
    </div>`);le(i.querySelector("#practice"),[n.jp,n.kana].filter(m=>!!m),m=>{m||h.grade(a,!1)}),window.setTimeout(()=>void z(n.jp),250)}function Ue(e){D("Listening",`#/unit/${e.id}`);const t=e.listening,s=C(e).done;let n=0,a=0;const o=()=>{if(n>=t.length)return i();const m=t[n],l=H(m.meanings.map((p,v)=>({m:p,ok:v===0}))),d=j(`
      <div class="quiz-top"><span>Line ${n+1} of ${t.length}</span><div class="bar small"><span style="width:${n/t.length*100}%"></span></div></div>
      <article class="card listen-card" id="listen-card">
        <p class="q-label">${E.ear} Listen. No text yet!</p>
        <div class="listen-play">
          <button type="button" class="big-play" data-say="${u(m.jp)}" aria-label="Play at natural speed">${E.play}</button>
          <button type="button" class="pill ghost" data-say="${u(m.jp)}" data-slow="1">${E.slow}<span>Slow</span></button>
        </div>
        <div class="listen-text hidden" id="listen-text">
          ${G(m,{big:!1,known:s})}
          ${m.note?`<p class="note">${u(m.note)}</p>`:""}
        </div>
      </article>
      <div id="lstage">
        <p class="prompt"><span class="eyebrow">Step 1</span> What does it mean?</p>
        <div class="options" id="mopts">${l.map((p,v)=>`<button type="button" class="option" data-i="${v}"><span>${u(p.m)}</span></button>`).join("")}</div>
      </div>`);window.setTimeout(()=>void z(m.jp),350),d.querySelectorAll("#mopts .option").forEach(p=>{p.addEventListener("click",()=>{var c;const v=l[Number(p.dataset.i)];v.ok&&(a+=1),d.querySelectorAll("#mopts .option").forEach(f=>{f.disabled=!0;const g=l[Number(f.dataset.i)];g.ok?f.classList.add("right"):g===v&&f.classList.add("wrong")}),document.getElementById("lstage").insertAdjacentHTML("beforeend",oe(v.ok,v.ok?"そうそう！ You understood it.":"Close! It means:",`<p>${u(m.en)}</p>`)+'<button type="button" class="btn primary wide" id="to-reply">Now reply</button>'),(c=document.getElementById("to-reply"))==null||c.addEventListener("click",()=>r(m))})})},r=m=>{var y;const l=H(m.reply.options),d=m.reply.options[0],p=document.getElementById("lstage");p.innerHTML=`
      <p class="prompt"><span class="eyebrow">Step 2</span> ${u(m.reply.prompt)}</p>
      <div class="options" id="ropts">${l.map((c,f)=>`<button type="button" class="option" data-i="${f}"><span class="jp" lang="ja">${u(c.jp)}</span>${ge(c,s)}</button>`).join("")}</div>
      ${Z()?`<button type="button" class="mic small" id="l-mic">${E.mic}<span>Or say your reply</span></button><div class="result" id="l-result"></div>`:""}`;const v=c=>{var b,k;const f=c===d;p.querySelectorAll("#ropts .option").forEach(A=>{A.disabled=!0;const L=l[Number(A.dataset.i)];L===d?A.classList.add("right"):L===c&&A.classList.add("wrong")});const g=document.getElementById("l-mic");g&&(g.disabled=!0),(b=document.getElementById("listen-text"))==null||b.classList.remove("hidden"),p.insertAdjacentHTML("beforeend",oe(f,f?"Perfect reply!":"A natural reply is:",`${f?"":`<p class="jp" lang="ja">${u(d.jp)}</p>`}<p class="muted">${u(d.en)}</p>`)+`<button type="button" class="btn primary wide" id="l-next">${n===t.length-1?"Finish":"Next line"}</button>`),W(d.jp),(k=document.getElementById("l-next"))==null||k.addEventListener("click",()=>{n+=1,o()})};p.querySelectorAll("#ropts .option").forEach(c=>{c.addEventListener("click",()=>v(l[Number(c.dataset.i)]))}),(y=document.getElementById("l-mic"))==null||y.addEventListener("click",async()=>{const c=document.getElementById("l-mic"),f=document.getElementById("l-result");c.classList.add("listening");try{const g=await ie();let b=null;for(const k of l){const A=ce(g,[k.jp,k.kana].filter(L=>!!L));(!b||A.score>b.score)&&(b={...A,o:k})}if(!g.length||!b||b.score<45){f.innerHTML=`<p class="muted">Heard “${u(g[0]||"…")}”. Try again or tap an answer.</p>`;return}f.innerHTML=`<p class="muted">Heard “<span class="jp">${u(b.heard)}</span>” (${b.score}% match)</p>`,v(b.o)}catch{f.innerHTML='<p class="muted">Mic isn’t available. Tap an answer instead.</p>'}finally{c.classList.remove("listening")}})},i=()=>{var m;h.setUnit(e.id,{listenDone:!0}),j(`<div class="done-card" id="done-card">
      ${x("cheer","done-mascot")}
      <p class="jp big-jp" lang="ja">きけた！</p>
      <p>You understood ${a} of ${t.length} lines at natural speed.</p>
      <div class="nav-row">
        <button type="button" class="btn ghost" id="l-again">Again</button>
        <a class="btn primary" href="#/unit/${e.id}/roleplay">Role-play</a>
      </div></div>`),M(document.querySelector(".done-mascot")),(m=document.getElementById("l-again"))==null||m.addEventListener("click",()=>Ue(e))};o()}function Fe(e){D("Role-play",`#/unit/${e.id}`);const t=e.roleplay,s=C(e).done,n=s,a=Ce();let o=0,r=0,i=0;const m=j(`
    <section class="rp-head">
      <p class="eyebrow">${$.heart} Role-play</p>
      <h1>${u(t.title)}</h1>
      <p class="lede">${u(t.setting)}</p>
    </section>
    <div class="chat" id="chat"></div>
    <div class="reply" id="reply"></div>`),l=m.querySelector("#chat"),d=m.querySelector("#reply"),p=(c,f,g="")=>{const b=document.createElement("div");b.className=`bubble ${f} ${g}`;const k=ee(c);b.innerHTML=`${f==="them"?`<div class="who">${u(c.name||"")}</div>`:'<div class="who">You</div>'}
      <div class="jp bubble-jp" lang="ja">${u(c.jp)}</div>
      ${k?`<div class="jp bubble-kana" lang="ja">${u(k)}</div>`:""}
      <div>${te(c.romaji,"bubble-romaji",s)}</div>
      <div class="bubble-en">${u(c.en)}</div>
      ${c.note&&f==="them"?`<div class="bubble-note">${u(c.note)}</div>`:""}
      <div class="bubble-audio">
        <button type="button" class="mini" data-say="${u(c.jp||"")}" ${c.fast?'data-fast="1"':""} aria-label="Play">${E.play}</button>
        <button type="button" class="mini" data-say="${u(c.jp||"")}" data-slow="1" aria-label="Play slowly">${E.slow}</button>
      </div>`,l.appendChild(b),b.scrollIntoView({block:"end"})},v=()=>{var c;h.setUnit(e.id,{roleplayDone:!0}),d.innerHTML=`<div class="done-card">
      ${x("cheer","done-mascot")}
      ${Re(e,n)}
      <p class="jp big-jp" lang="ja">おつかれさま！</p>
      <p>You chose the natural reply ${r} of ${i} times.</p>
      <div class="nav-row">
        <button type="button" class="btn ghost" id="rp-again">Play again</button>
        <a class="btn primary" href="#/unit/${e.id}/quiz">Take the quiz</a>
      </div></div>`,M(d.querySelector(".done-mascot")),(c=document.getElementById("rp-again"))==null||c.addEventListener("click",()=>Fe(e))},y=()=>{var k,A;if(!Ne(a))return;if(o>=t.lines.length)return v();const c=t.lines[o++];if(c.speaker==="them"){p(c,"them"),d.innerHTML="",W(c.jp,{fast:!!c.fast}),window.setTimeout(y,700);return}i+=1;const f=(k=c.options)==null?void 0:k[0],g=H(c.options||[]);if(!f)return y();d.innerHTML=`
      <p class="prompt"><span class="eyebrow">Your turn</span> ${u(c.prompt)}</p>
      <div class="options">
        ${g.map((L,S)=>`<button type="button" class="option" data-i="${S}"><span class="jp" lang="ja">${u(L.jp)}</span>${ge(L,s)}</button>`).join("")}
      </div>
      ${Z()?`<button type="button" class="mic small" id="rp-mic">${E.mic}<span>Or say your reply</span></button><div class="result" id="rp-result"></div>`:""}`;const b=L=>{var T;const S=L.jp===f.jp;S&&(r+=1),d.querySelectorAll(".option").forEach(O=>{O.disabled=!0;const J=g[Number(O.dataset.i)];J.jp===f.jp?O.classList.add("right"):J===L&&O.classList.add("wrong")});const P=document.getElementById("rp-mic");P&&(P.disabled=!0),d.insertAdjacentHTML("beforeend",oe(S,S?"そうです！ That’s it.":"Not quite. The natural reply is:",`${S?"":`<p class="jp" lang="ja">${u(f.jp)}</p>`}<p class="muted">${u(f.en)}</p>${c.note?`<p class="note">${u(c.note)}</p>`:""}`)+'<button type="button" class="btn primary wide" id="rp-next">Continue</button>'),W(f.jp),(T=document.getElementById("rp-next"))==null||T.addEventListener("click",()=>{p(f,"you",S?"":"corrected"),d.innerHTML="",window.setTimeout(y,300)})};d.querySelectorAll(".option").forEach(L=>{L.addEventListener("click",()=>b(g[Number(L.dataset.i)]))}),(A=document.getElementById("rp-mic"))==null||A.addEventListener("click",async()=>{const L=document.getElementById("rp-mic"),S=document.getElementById("rp-result");L.classList.add("listening");try{const P=await ie();let T=null;for(const O of g){const J=ce(P,[O.jp,O.kana].filter(Ge=>!!Ge));(!T||J.score>T.score)&&(T={...J,o:O})}if(!P.length||!T||T.score<45){S.innerHTML=`<p class="muted">Heard “${u(P[0]||"…")}”. Try again or tap an answer.</p>`;return}S.innerHTML=`<p class="muted">Heard “<span class="jp">${u(T.heard)}</span>” (${T.score}% match)</p>`,b(T.o)}catch{S.innerHTML='<p class="muted">Mic isn’t available. Tap an answer instead.</p>'}finally{L.classList.remove("listening")}})};y()}function We(e){D("Quick quiz",`#/unit/${e.id}`);const t=C(e).done,s=H(e.phrases).slice(0,Math.min(6,e.phrases.length)),n=["en2jp","jp2en","listen"],a=s.map((l,d)=>{const p=n[d%n.length],v=H(e.phrases.filter(y=>y!==l)).slice(0,3);return{type:p,p:l,all:H([l,...v])}});let o=0,r=0;const i=()=>{if(o>=a.length)return m();const l=a[o],d=fe(e,l.p.jp),p=ee(l.p),v=l.type==="en2jp"?`<p class="q-label">How do you say…</p><p class="q-main">${u(l.p.en)}</p>`:l.type==="jp2en"?`<p class="q-label">What does this mean?</p><p class="q-main jp" lang="ja">${u(l.p.jp)}</p>${p?`<p class="q-kana jp" lang="ja">${u(p)}</p>`:""}<p class="q-sub">${te(l.p.romaji,"q-romaji",d)}</p>`:`<p class="q-label">${E.ear} Listen. What did you hear?</p>${se(l.p.jp,"center")}`,y=j(`
      <div class="quiz-top"><span>Question ${o+1} of ${a.length}</span><div class="bar small"><span style="width:${o/a.length*100}%"></span></div></div>
      <article class="card quiz-card">${v}</article>
      <div class="options" id="opts">
        ${l.all.map((c,f)=>`<button type="button" class="option" data-i="${f}">${l.type==="en2jp"?`<span class="jp" lang="ja">${u(c.jp)}</span>${ge(c,fe(e,c.jp))}`:`<span>${u(c.en)}</span>`}</button>`).join("")}
      </div>
      <div id="qfb"></div>`);l.type==="listen"&&window.setTimeout(()=>void z(l.p.jp),300),y.querySelectorAll("#opts .option").forEach(c=>{c.addEventListener("click",()=>{var A;const f=l.all[Number(c.dataset.i)],g=f===l.p;g&&(r+=1);const b=K(e.id,l.p.jp);h.markSeen(b),g||h.grade(b,!1),y.querySelectorAll("#opts .option").forEach(L=>{L.disabled=!0;const S=l.all[Number(L.dataset.i)];S===l.p?L.classList.add("right"):S===f&&L.classList.add("wrong")});const k=document.getElementById("qfb");k.innerHTML=oe(g,g?"せいかい！ Correct!":"Not this time. Here it is:",G(l.p,{big:!1,known:d}))+`<button type="button" class="btn primary wide" id="qnext">${o===a.length-1?"See results":"Next"}</button>`,l.type!=="listen"&&W(l.p.jp),(A=document.getElementById("qnext"))==null||A.addEventListener("click",()=>{o+=1,i()})})})},m=()=>{var f;const l=Math.round(r/a.length*100),d=h.unit(e.id).quizBest;h.setUnit(e.id,{quizBest:Math.max(d,l)});const p=l>=70,v=C(e),y=He(e.id);j(`<div class="done-card">
      ${x(p?"cheer":"think","done-mascot")}
      ${Re(e,t)}
      <p class="jp big-jp" lang="ja">${p?"よくできました！":"もう一回！"}</p>
      <p class="score-big">${r} / ${a.length}</p>
      <p class="muted">${p?v.done?"Missed phrases were sent back to your review queue.":"Quiz passed. Finish the other steps to complete the unit.":"Score 70% or more to pass. Missed phrases were sent back to your review queue."}</p>
      <div class="nav-row">
        <button type="button" class="btn ghost" id="qagain">Try again</button>
        <a class="btn primary" href="${p?v.done?`#/unit/${y.id}`:`#/unit/${e.id}`:`#/unit/${e.id}/cards/0`}">${p?v.done?"Next unit":"Back to unit":"Review the cards"}</a>
      </div></div>`);const c=document.querySelector(".done-mascot");p&&M(c),(f=document.getElementById("qagain"))==null||f.addEventListener("click",()=>We(e))};i()}function pe(){ye(),Ke(),bt();const e=(location.hash.replace(/^#\/?/,"")||"").split("/").filter(Boolean);try{if(!e.length)Rt();else if(e[0]==="today")e[1]?e[1]==="warm"?Dt():e[1]==="new"?Tt():e[1]==="convo"?qt():e[1]==="listen"?It():e[1]==="done"?Nt():I("#/today"):I(Pe());else if(e[0]==="unit"){const t=w.units.find(s=>s.id===e[1]);if(!t)return I("#/");e[2]==="cards"?Kt(t,Number.parseInt(e[3]||"0",10)):e[2]==="listen"?Ue(t):e[2]==="roleplay"?Fe(t):e[2]==="quiz"?We(t):Yt(t)}else e[0]==="review"?Ut():e[0]==="settings"?Q():I("#/")}catch(t){console.error(t),j('<p class="muted">Something went wrong. <a href="#/">Go home</a></p>')}}function Jt(){document.addEventListener("click",e=>{const t=e.target;if(!t)return;const s=t.closest("[data-reveal]");if(s){e.preventDefault();const a=document.createElement("span");a.className=s.dataset.cls||"",a.textContent=s.dataset.reveal||"",s.replaceWith(a);return}const n=t.closest("[data-say]");n&&(Ae(),n.classList.add("playing"),z(n.dataset.say||"",{slow:!!n.dataset.slow,fast:!!n.dataset.fast}).then(a=>{n.classList.remove("playing"),a||N("Turn up volume / check silent mode")}))})}async function _t(){Jt(),Qe(pe);try{yt(await _e())}catch{j('<p class="muted">Couldn’t load lessons. Serve this folder instead of opening the file directly.</p>');return}kt(),h.ensureDaily(),window.addEventListener("hashchange",pe),pe(),Ze()}_t();
