(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))n(a);new MutationObserver(a=>{for(const o of a)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&n(i)}).observe(document,{childList:!0,subtree:!0});function s(a){const o={};return a.integrity&&(o.integrity=a.integrity),a.referrerPolicy&&(o.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?o.credentials="include":a.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(a){if(a.ep)return;a.ep=!0;const o=s(a);fetch(a.href,o)}})();const Ye="data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA=";let ge=!1;const oe=new Audio;oe.preload="auto";oe.setAttribute("playsinline","");oe.setAttribute("webkit-playsinline","");const le=new Audio;function Ee(){if(!ge){ge=!0;try{le.muted=!0,le.src=Ye;const e=le.play();e&&typeof e.catch=="function"&&e.catch(()=>{})}catch{}}}function se(){Ee(),document.removeEventListener("pointerdown",se,!0),document.removeEventListener("touchstart",se,!0)}document.addEventListener("pointerdown",se,!0);document.addEventListener("touchstart",se,!0);function z(e,t={}){return Promise.resolve(!1)}function fe(){try{oe.pause()}catch{}}function Se(){const e=window;return e.SpeechRecognition||e.webkitSpeechRecognition||null}function V(){return!!Se()}let Y=null;function ie(){const e=Se();if(!e)return Promise.reject(new Error("unsupported"));if(Y)try{Y.abort()}catch{}return new Promise((t,s)=>{const n=new e;Y=n,n.lang="ja-JP",n.interimResults=!1,n.maxAlternatives=5;let a=!1;n.onresult=o=>{a=!0;const i=[];for(let r=0;r<o.results.length;r++){const m=o.results[r];for(let d=0;d<m.length;d++)i.push(m[d].transcript)}t(i)},n.onerror=o=>{a||(a=!0,s(new Error(o.error||"error")))},n.onend=()=>{Y=null,a||(a=!0,t([]))};try{n.start()}catch(o){s(o instanceof Error?o:new Error("error"))}})}function Ke(){if(Y)try{Y.stop()}catch{}}function K(e,t){return`${e}:${t}`}function _e(e){const t=new Map;for(const s of e.units)for(const n of s.phrases){const a=K(s.id,n.jp);t.set(a,{id:a,phrase:n,unit:s})}return{tracks:e.tracks,units:e.units,byId:t}}async function Je(){const e=await fetch(new URL("data/speak.json",document.baseURI));if(!e.ok)throw new Error("Could not load lessons");return _e(await e.json())}function Qe(e,t){return e.units.filter(s=>s.track===t)}const Ve=["f-meet","g-trains","g-help","f-holiday","f-family","g-food","f-home","g-shopping","f-dinner","g-konbini","f-chat","f-gifts","f-calls"];function Ae(e){const t=new Map(e.units.map(n=>[n.id,n])),s=[];for(const n of Ve){const a=t.get(n);a&&s.push(a)}for(const n of e.units)s.includes(n)||s.push(n);return s}function Z(e){const t=[];for(const s of Ae(e))for(const n of s.phrases){const a=K(s.id,n.jp),o=e.byId.get(a);o&&t.push(o)}return t}function Ze(e,t,s){return e.filter(n=>!t[n.id]).slice(0,s)}let xe=e=>{location.hash=e};function Xe(e){xe=e}function I(e){location.hash===e?xe(e):location.hash=e}function et(e,t){return e&&t}let we=!1;function tt(){if(!("serviceWorker"in navigator))return;const e=()=>{navigator.serviceWorker.register("./sw.js",{scope:"./",updateViaCache:"none"}).then(t=>{const s=document.getElementById("update-banner"),n=document.getElementById("update-apply"),a=()=>{et(!!navigator.serviceWorker.controller,!!t.waiting)&&s&&(s.hidden=!1)};a(),t.addEventListener("updatefound",()=>{const o=t.installing;o==null||o.addEventListener("statechange",()=>{o.state==="installed"&&a()})}),n==null||n.addEventListener("click",()=>{var o;(o=t.waiting)==null||o.postMessage({type:"SKIP_WAITING"}),we=!0}),navigator.serviceWorker.addEventListener("controllerchange",()=>{we&&window.location.reload()}),document.addEventListener("visibilitychange",()=>{document.visibilityState==="visible"&&t.update().catch(()=>{})}),window.setInterval(()=>t.update().catch(()=>{}),3600*1e3)}).catch(()=>{})};document.readyState==="complete"?e():window.addEventListener("load",e)}const de="rizu-jp-v2",st="eliz-jp-v1",$e=864e5,nt={1:0,2:1,3:3,4:7,5:16},Be={showKana:!0,romaji:"show",dailyNew:3};function pe(){return{quizBest:0,roleplayDone:!1,listenDone:!1}}function J(e=Date.now()){return{version:2,revision:0,updatedAt:e,seen:{},srs:{},units:{},days:{},read:{},settings:{value:{...Be},updatedAt:e},curriculum:{value:{unlocked:0},updatedAt:e},daily:{value:null,updatedAt:e},lastBackupAt:0}}function U(e=new Date){const t=s=>String(s).padStart(2,"0");return`${e.getFullYear()}-${t(e.getMonth()+1)}-${t(e.getDate())}`}function ke(e,t){const[s,n,a]=e.split("-").map(Number),o=new Date(s,(n||1)-1,a||1);return o.setDate(o.getDate()+t),U(o)}function at(e,t=U()){const s=new Set(e);let n=t;s.has(n)||(n=ke(n,-1));let a=0;for(;s.has(n);)a++,n=ke(n,-1);return a}function B(e){return e&&typeof e=="object"&&!Array.isArray(e)?e:{}}function q(e,t){return typeof e=="number"&&Number.isFinite(e)?e:t}function De(e){const t=B(e),s=t.dailyNew===5||t.dailyNew===7?t.dailyNew:3,n=t.romaji==="fade"||t.romaji==="hide"?t.romaji:"show";return{showKana:t.showKana!==!1,romaji:n,dailyNew:s}}function Me(e){const t=B(e);if(typeof t.date!="string")return null;const s=Array.isArray(t.newIds)?t.newIds.filter(n=>typeof n=="string"):[];return{date:t.date,warmDone:!!t.warmDone,newIds:s,newDone:!!t.newDone,convoDone:!!t.convoDone,listenDone:!!t.listenDone,done:!!t.done}}function ot(e){const t=B(e);return{box:t.box===2||t.box===3||t.box===4||t.box===5?t.box:1,due:q(t.due,0)}}function it(e){const t=B(e);return{quizBest:q(t.quizBest,0),roleplayDone:!!t.roleplayDone,listenDone:!!t.listenDone}}function Te(e,t=Date.now()){var v;const s=B(e),n=J(t),a=q(s.lastBackupAt,0),o=B(s.seen);for(const[y,c]of Object.entries(o)){const f=q(c,a||t);n.seen[y]={value:f,updatedAt:f}}const i=B(s.srs);for(const[y,c]of Object.entries(i)){const f=((v=n.seen[y])==null?void 0:v.updatedAt)??(a||t);n.srs[y]={value:ot(c),updatedAt:f}}const r=B(s.units);for(const[y,c]of Object.entries(r))n.units[y]={value:it(c),updatedAt:a||t};const m=B(s.read);for(const[y,c]of Object.entries(m))c&&(n.read[y]={value:!0,updatedAt:a||t});if(Array.isArray(s.days))for(const y of s.days){if(typeof y!="string"||!/^\d{4}-\d{2}-\d{2}$/.test(y))continue;const c=Date.parse(`${y}T12:00:00`);n.days[y]={value:!0,updatedAt:Number.isFinite(c)?c:t}}const d=De(s.settings??Be);n.settings={value:d,updatedAt:a||t};const l=B(s.curriculum),p=typeof l.unlocked=="number"?l.unlocked:Object.keys(n.seen).length;return n.curriculum={value:{unlocked:Math.max(0,p)},updatedAt:a||t},n.daily={value:Me(s.daily),updatedAt:a||t},n.lastBackupAt=a,n.updatedAt=t,n}function rt(e){const t=B(e);return t.version===2&&!!t.settings&&!!t.curriculum&&typeof t.seen=="object"}function qe(e,t=Date.now()){var o,i,r,m,d,l,p;if(!rt(e))return null;const s=J(t),n=e,a=De((o=n.settings)==null?void 0:o.value);return{...s,...n,version:2,revision:q(n.revision,0),updatedAt:q(n.updatedAt,t),seen:n.seen&&typeof n.seen=="object"?n.seen:{},srs:n.srs&&typeof n.srs=="object"?n.srs:{},units:n.units&&typeof n.units=="object"?n.units:{},days:n.days&&typeof n.days=="object"?n.days:{},read:n.read&&typeof n.read=="object"?n.read:{},settings:{value:a,updatedAt:q((i=n.settings)==null?void 0:i.updatedAt,t)},curriculum:{value:{unlocked:Math.max(0,q((m=(r=n.curriculum)==null?void 0:r.value)==null?void 0:m.unlocked,0))},updatedAt:q((d=n.curriculum)==null?void 0:d.updatedAt,t)},daily:{value:Me((l=n.daily)==null?void 0:l.value),updatedAt:q((p=n.daily)==null?void 0:p.updatedAt,t)},lastBackupAt:q(n.lastBackupAt,0)}}function ct(e){const t={};for(const[o,i]of Object.entries(e.seen))t[o]=i.value;const s={};for(const[o,i]of Object.entries(e.srs))s[o]={box:i.value.box,due:i.value.due};const n={};for(const[o,i]of Object.entries(e.units))n[o]={...pe(),...i.value};const a={};for(const[o,i]of Object.entries(e.read))i.value&&(a[o]=!0);return{seen:t,srs:s,units:n,read:a,days:Object.keys(e.days).sort(),settings:e.settings.value,curriculum:{unlocked:e.curriculum.value.unlocked},daily:e.daily.value,lastBackupAt:e.lastBackupAt}}function lt(e){const t=B(e);return["seen","srs","units","read","days","settings","curriculum","daily"].some(s=>s in t)}const he="EJP1.",dt=new TextEncoder,ut=new TextDecoder;function pt(e){let t="";for(let s=0;s<e.length;s++)t+=String.fromCharCode(e[s]);return btoa(t).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}function ht(e){const t=e.length%4===0?"":"=".repeat(4-e.length%4),s=atob(e.replace(/-/g,"+").replace(/_/g,"/")+t),n=new Uint8Array(s.length);for(let a=0;a<s.length;a++)n[a]=s.charCodeAt(a);return n}async function mt(e){if(typeof CompressionStream=="function")try{const s=new CompressionStream("deflate"),n=new Blob([e]).stream().pipeThrough(s),a=new Uint8Array(await new Response(n).arrayBuffer()),o=new Uint8Array(1+a.length);return o[0]=1,o.set(a,1),o}catch{}const t=new Uint8Array(1+e.length);return t[0]=0,t.set(e,1),t}async function ft(e){if(!e.length)throw new Error("empty");const t=e[0],s=e.subarray(1);if(t===0)return s;if(t===1){if(typeof DecompressionStream!="function")throw new Error("This browser can’t read compressed backups");const n=new DecompressionStream("deflate"),a=new Blob([s]).stream().pipeThrough(n);return new Uint8Array(await new Response(a).arrayBuffer())}throw new Error("Unknown backup format")}async function yt(e){const t={version:2,state:e,...ct(e)},s=await mt(dt.encode(JSON.stringify(t)));return he+pt(s)}async function Ie(e,t=Date.now()){const s=String(e||"").trim().replace(/\s+/g,"");if(!s.startsWith(he))throw new Error("That doesn’t look like a backup code. It should start with EJP1.");let n;try{n=await ft(ht(s.slice(he.length)))}catch{throw new Error("Couldn’t read that code. Double-check you copied the whole thing.")}let a;try{a=JSON.parse(ut.decode(n))}catch{throw new Error("That code isn’t valid. Try copying it again.")}const o=a&&typeof a=="object"?a:null;if((o==null?void 0:o.version)===2&&o.state){const i=qe(o.state,t);if(i)return i}if(!lt(a))throw new Error("That code doesn’t have progress data in it.");return Te(a,t)}function vt(e){return{load(){try{const t=e.getItem(de);if(t){const s=qe(JSON.parse(t));if(s)return s}}catch{}try{const t=e.getItem(st);if(!t)return null;const s=Te(JSON.parse(t));return e.setItem(de,JSON.stringify(s)),s}catch{return null}},save(t){e.setItem(de,JSON.stringify(t))}}}function bt(e,t=Date.now){let s=e.load()??J(t());const n=()=>{s.revision+=1,s.updatedAt=t(),e.save(s)},a={get state(){return s},load(){s=e.load()??J(t())},replace(o){s=o,n()},touchDay(){const o=U(new Date(t()));if(s.days[o])return;s.days[o]={value:!0,updatedAt:t()};const i=Object.keys(s.days).sort();if(i.length>400)for(const r of i.slice(0,i.length-400))delete s.days[r];n()},streak(){return at(Object.keys(s.days),U(new Date(t())))},markSeen(o){a.touchDay();let i=!1;if(!s.seen[o]){const r=t();s.seen[o]={value:r,updatedAt:r},i=!0}if(!s.srs[o]){const r=t();s.srs[o]={value:{box:1,due:r},updatedAt:r},i=!0}i&&n()},grade(o,i){var l;a.touchDay();const r=((l=s.srs[o])==null?void 0:l.value)??{box:1},m=i?Math.min(5,r.box+1):1,d=t();s.srs[o]={value:{box:m,due:d+nt[m]*$e},updatedAt:d},s.seen[o]||(s.seen[o]={value:d,updatedAt:d}),n()},box(o){var i;return((i=s.srs[o])==null?void 0:i.value.box)??0},dueIds(o=t()){return Object.keys(s.srs).filter(i=>s.srs[i].value.due<=o).sort((i,r)=>s.srs[i].value.box-s.srs[r].value.box||s.srs[i].value.due-s.srs[r].value.due)},unit(o){var i;return((i=s.units[o])==null?void 0:i.value)??pe()},setUnit(o,i){var m;a.touchDay();const r=((m=s.units[o])==null?void 0:m.value)??pe();s.units[o]={value:{...r,...i},updatedAt:t()},n()},setting(o,i){return i===void 0?s.settings.value[o]:(s.settings={value:{...s.settings.value,[o]:i},updatedAt:t()},n(),i)},ensureDaily(){const o=U(new Date(t())),i=s.daily.value;if(i&&i.date===o)return i;const r={date:o,warmDone:!1,newIds:[],newDone:!1,convoDone:!1,listenDone:!1,done:!1};return s.daily={value:r,updatedAt:t()},n(),r},setDaily(o){const i=a.ensureDaily(),r={...i,...o,date:i.date};return s.daily={value:r,updatedAt:t()},n(),r},setUnlocked(o){const i=s.curriculum.value.unlocked,r=Math.max(i,Math.max(0,o));r!==i&&(s.curriculum={value:{unlocked:r},updatedAt:t()},n())},reset(){const o=s.settings;s=J(t()),s.settings=o,n()},markBackup(){s.lastBackupAt=t(),n()},needsBackupReminder(o=7){return s.lastBackupAt?t()-s.lastBackupAt>=o*$e:Object.keys(s.seen).length>0},exportBackup(){return yt(s)},async importBackup(o){const i=await Ie(o,t());return i.lastBackupAt=t(),s=i,n(),s}};return a}const h=bt(vt(localStorage));let k;function gt(e){k=e}const E={play:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/></svg>',slow:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',mic:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',check:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',gear:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3.2" fill="none" stroke="currentColor" stroke-width="1.9"/><path d="M12 2.8v2.6M12 18.6v2.6M2.8 12h2.6M18.6 12h2.6M5.5 5.5l1.8 1.8M16.7 16.7l1.8 1.8M5.5 18.5l1.8-1.8M16.7 7.3l1.8-1.8" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>',ear:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 9.5a5 5 0 0 1 10 0c0 3-3 3.6-3 6.5a2.5 2.5 0 0 1-4.6 1.3" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/><path d="M10 10a2 2 0 0 1 4 0" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>'},w={skull:'<svg class="deco" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3c-4.6 0-8 3.1-8 7.3 0 2.4 1.2 4.3 3 5.4V19a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-3.3c1.8-1.1 3-3 3-5.4C20 6.1 16.6 3 12 3z" fill="currentColor"/><circle cx="9" cy="11" r="1.7" fill="#1b1522"/><circle cx="15" cy="11" r="1.7" fill="#1b1522"/><path d="M9.2 16.2h1.3v1.4H9.2zm2.15 0h1.3v1.4h-1.3zm2.15 0h1.3v1.4h-1.3z" fill="#1b1522"/></svg>',heart:'<svg class="deco" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.2s-7.2-4.4-7.2-9.6A4 4 0 0 1 12 8.2a4 4 0 0 1 7.2 2.4c0 5.2-7.2 9.6-7.2 9.6z" fill="currentColor"/></svg>',star:'<svg class="deco" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.2 14.4 8.4l5.7.7-4.2 3.9 1.1 5.6L12 16.1 6.9 18.6 8 13 3.8 9.1l5.8-.7z" fill="currentColor"/></svg>',bow:'<svg class="deco" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 12 4.2 7.6c-1.2-.6-2 .2-2 1.3v6.2c0 1.1.8 1.9 2 1.3zM12 12l7.8-4.4c1.2-.6 2 .2 2 1.3v6.2c0 1.1-.8 1.9-2 1.3z" fill="currentColor"/><rect x="10.2" y="10" width="3.6" height="4" rx="1.2" fill="currentColor"/></svg>'},wt={wave:"./img/mascot-wave.png",cheer:"./img/mascot-cheer.png",think:"./img/mascot-think.png"};function x(e,t=""){return`<img class="mascot mascot-${e} ${t}" src="${wt[e]}" alt="" width="120" height="120">`}let ne=0,je=0;function $t(){return ne+=1,ne}function Ce(){return ne}function Ne(e){return e===ne}function kt(){const e=document.getElementById("app");if(!e)throw new Error("missing app");return e}function j(e){const t=kt();return t.innerHTML=e,window.scrollTo(0,0),t}function N(e){const t=document.getElementById("toast");t&&(t.textContent=e,t.classList.add("show"),window.clearTimeout(je),je=window.setTimeout(()=>t.classList.remove("show"),2200))}function M(e,t){const s=document.getElementById("topbar");if(s){if(!t){s.classList.add("hidden"),s.innerHTML="";return}s.classList.remove("hidden"),s.innerHTML=`<a class="iconbtn" href="${t}" aria-label="Back"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 5.5 8 12l6.5 6.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></a><div class="topbar-title">${e}</div><span class="streak-mini" title="Day streak">${w.star}${h.streak()}日</span>`}}function jt(e){if(!e||matchMedia("(prefers-reduced-motion: reduce)").matches)return;const t=e.getBoundingClientRect(),s=document.createElement("div");s.className="sparkles",s.style.left=`${t.left+t.width/2}px`,s.style.top=`${t.top+Math.min(t.height/2,80)}px`;const n=[w.star,w.heart,w.star,w.bow];for(let a=0;a<8;a++){const o=document.createElement("span"),i=a/8*Math.PI*2,r=46+Math.random()*36;o.style.setProperty("--dx",`${Math.cos(i)*r}px`),o.style.setProperty("--dy",`${Math.sin(i)*r}px`),o.className=`spark c${a%3}`,o.innerHTML=n[a%n.length],s.appendChild(o)}document.body.appendChild(s),window.setTimeout(()=>s.remove(),900)}function D(e){e==null||e.classList.add("bounce"),jt(e)}function C(e){const t=e.phrases.filter(o=>h.state.seen[K(e.id,o.jp)]).length,s=h.unit(e.id),a=[t===e.phrases.length,s.listenDone,s.roleplayDone,s.quizBest>=70].filter(Boolean).length;return{seen:t,total:e.phrases.length,...s,done:a===4,steps:a}}function Lt(){return Ae(k)}function He(e){const t=Lt(),s=e?Math.max(0,t.findIndex(n=>n.id===e)+1):0;for(let n=s;n<t.length;n++)if(!C(t[n]).done)return t[n];for(const n of t)if(!C(n).done)return n;return t[0]}function Et(){const e=Z(k);let t=0;for(;t<e.length&&h.state.seen[e[t].id];)t++;h.setUnlocked(t)}function St(e){return Ze(Z(k),h.state.seen,e)}function At(e){const t=Z(k),s=new Set(h.ensureDaily().newIds||[]);return t.filter(a=>!h.state.seen[a.id]&&!s.has(a.id)).slice(0,Math.min(3,e))}function ye(){const e=h.ensureDaily(),s=[e.warmDone,e.newDone,e.convoDone,e.listenDone].filter(Boolean).length;return{d:e,done:s,total:4,finished:!!e.done||s===4}}function Pe(){const{d:e,finished:t}=ye();return t&&e.done?"#/today/done":e.warmDone?e.newDone?e.convoDone?e.listenDone?"#/today/done":"#/today/listen":"#/today/convo":"#/today/new":"#/today/warm"}function me(e,t){return h.box(K(e.id,t))>=3}const xt=55,Bt=e=>e.replace(/[\u30a1-\u30f6]/g,t=>String.fromCharCode(t.charCodeAt(0)-96));function F(e){return Bt((e||"").normalize("NFKC").toLowerCase()).replace(/[\s、。！？!?,.・「」『』（）()〜~ー-]/g,"")}function Dt(e,t){const s=e.length,n=t.length;if(!s)return n;if(!n)return s;let a=Array.from({length:n+1},(o,i)=>i);for(let o=1;o<=s;o++){const i=[o];for(let r=1;r<=n;r++)i[r]=Math.min(a[r]+1,i[r-1]+1,a[r-1]+(e[o-1]===t[r-1]?0:1));a=i}return a[n]}function Mt(e,t){return e=F(e),t=F(t),!e||!t?0:1-Dt(e,t)/Math.max(e.length,t.length)}function re(e,t){let s=0,n=e[0]||"";for(const a of e)for(const o of t){let i=Mt(a,o);F(a).includes(F(o))&&F(o).length>=2&&(i=Math.max(i,.95)),i>s&&(s=i,n=a)}return{score:Math.round(s*100),heard:n}}function ve(e){return e>=xt}function u(e){return String(e??"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}function H(e){const t=e.slice();for(let s=t.length-1;s>0;s--){const n=Math.floor(Math.random()*(s+1));[t[s],t[n]]=[t[n],t[s]]}return t}function X(e){return!h.setting("showKana")||!e.kana||!e.jp?"":F(e.kana)!==F(e.jp)?e.kana:""}function ee(e,t,s){if(!e)return"";const n=h.setting("romaji");return n==="hide"?"":n==="fade"&&s?`<button type="button" class="romaji-peek ${t}" data-reveal="${u(e)}" data-cls="${t}">tap for romaji</button>`:`<span class="${t}">${u(e)}</span>`}function be(e,t){const s=h.setting("romaji");return!e.romaji||s==="hide"||s==="fade"&&t?"":`<span class="opt-romaji">${u(e.romaji)}</span>`}function G(e,t={}){const s=t.big!==!1,n=t.showEn!==!1,a=X(e),o=[...e.jp||""].length,i=o>18?"xlong":o>12?"long":"",r=e.speaker?`<p class="phrase-who ${e.speaker==="Dad"?"dad":e.speaker==="Mom"?"mom":"rizu"}">${u(e.speaker)}</p>`:"";return`<div class="phrase ${s?"big":""} ${i}">
    ${r}
    <div class="jp phrase-jp" lang="ja">${u(e.jp)}</div>
    ${a?`<div class="jp phrase-kana" lang="ja">${u(a)}</div>`:""}
    <div class="phrase-romaji-wrap">${ee(e.romaji,"phrase-romaji",!!t.known)}</div>
    ${n?`<div class="phrase-en">${u(e.en)}</div>`:""}
  </div>`}function te(e,t=""){return`<div class="audio-row ${t}">
    <button type="button" class="pill" data-say="${u(e)}" aria-label="Play">${E.play}<span>Play</span></button>
    <button type="button" class="pill ghost" data-say="${u(e)}" data-slow="1" aria-label="Play slowly">${E.slow}<span>Slow</span></button>
  </div>`}function R(e){const t=h.ensureDaily();return`<div class="daily-steps" aria-label="Today’s lesson progress">
    ${[{key:"warmDone",id:"warm",label:"Warm-up"},{key:"newDone",id:"new",label:"New"},{key:"convoDone",id:"convo",label:"Chat"},{key:"listenDone",id:"listen",label:"Listen"}].map((n,a)=>{const o=t[n.key],i=e===n.id;return`<span class="ds ${o?"done":""} ${i?"now":""}">${o?E.check:a+1}<em>${n.label}</em></span>`}).join("")}
  </div>`}function Tt(e){return e>=80?{cls:"great",label:"すごい！ Great"}:ve(e)?{cls:"close",label:"Close, nice"}:{cls:"again",label:"Let’s try again"}}function ze(e,t){const s=Tt(e);return`<div class="score ${s.cls}"><span class="score-num">${e}%</span><span>${s.label}</span></div><p class="heard">Heard: <span class="jp">${u(t)}</span></p>`}function ce(e,t,s){if(V()){e.innerHTML=`<button type="button" class="mic" data-mic>${E.mic}<span>Tap and say it</span></button><div class="result" data-result></div>`;const n=e.querySelector("[data-mic]"),a=e.querySelector("[data-result]");n.addEventListener("click",async()=>{n.classList.add("listening");const o=n.querySelector("span");o&&(o.textContent="Listening…");try{fe();const i=await ie();if(!i.length){a.innerHTML='<p class="muted">I didn’t catch that. Try again a little closer to the mic.</p>';return}const r=re(i,t);a.innerHTML=ze(r.score,r.heard),r.score>=80&&D(a.querySelector(".score")),s==null||s(ve(r.score))}catch(i){const r=i instanceof Error?i.message:"",m=/not-allowed|service-not-allowed/.test(r);a.innerHTML=`<p class="muted">${m?"Microphone access is blocked. You can rate yourself instead.":"Speech check isn’t working right now. Rate yourself instead."}</p>`,Le(e,s,!0)}finally{n.classList.remove("listening"),o&&(o.textContent="Tap and say it")}})}else Le(e,s,!1)}function Le(e,t,s=!1){const n=`<p class="muted small">Say it out loud, then be honest:</p>
    <div class="rate-row"><button type="button" class="btn ghost" data-rate="0">Again</button><button type="button" class="btn soft" data-rate="1">Got it</button></div>`;s?e.insertAdjacentHTML("beforeend",n):e.innerHTML=n,e.querySelectorAll("[data-rate]").forEach(a=>{a.addEventListener("click",()=>{e.querySelectorAll("[data-rate]").forEach(o=>o.classList.remove("chosen")),a.classList.add("chosen"),a.dataset.rate==="1"&&a.classList.add("bounce"),t==null||t(a.dataset.rate==="1")})})}function qt(e,t,s,n){var m,d;let a=!1,o=null;const i=()=>{var l,p;a||(a=!0,s(),(l=e.querySelector("[data-show-answer]"))==null||l.remove(),(p=e.querySelector(".warm-memory-hint"))==null||p.remove(),r())},r=()=>{if(e.querySelector(".rate-row"))return;const l=o!==null&&!ve(o);e.insertAdjacentHTML("beforeend",`<p class="muted small warm-rate-hint">${l?"Under 55% counts as a miss. Tap Again to continue.":"Be honest — how did you do?"}</p>
      <div class="rate-row">
        <button type="button" class="btn ghost" data-rate="0">Again</button>
        <button type="button" class="btn soft" data-rate="1" ${l?"disabled":""}>Got it</button>
      </div>`),e.querySelectorAll("[data-rate]").forEach(p=>{p.addEventListener("click",()=>{if(p.disabled)return;e.querySelectorAll("[data-rate]").forEach(c=>c.classList.remove("chosen")),p.classList.add("chosen");const v=p.dataset.rate==="1",y=l?!1:v;v&&p.classList.add("bounce"),n(y)})})};if(V()){e.innerHTML=`<button type="button" class="mic" data-mic>${E.mic}<span>Tap and say it</span></button>
      <button type="button" class="btn ghost wide" data-show-answer>Show answer</button>
      <div class="result" data-result></div>`;const l=e.querySelector("[data-mic]"),p=e.querySelector("[data-result]");(m=e.querySelector("[data-show-answer]"))==null||m.addEventListener("click",()=>i()),l.addEventListener("click",async()=>{var y;l.classList.add("listening");const v=l.querySelector("span");v&&(v.textContent="Listening…");try{fe();const c=await ie();if(!c.length){p.innerHTML='<p class="muted">I didn’t catch that. Try again a little closer to the mic.</p>';return}const f=re(c,t.filter(Boolean));o=f.score,p.innerHTML=ze(f.score,f.heard),f.score>=80&&D(p.querySelector(".score")),i()}catch(c){const f=c instanceof Error?c.message:"",g=/not-allowed|service-not-allowed/.test(f);p.innerHTML=`<p class="muted">${g?"Microphone access is blocked. Show the answer and rate yourself.":"Speech check isn’t working right now. Show the answer and rate yourself."}</p>`,e.querySelector("[data-show-answer]")||(e.insertAdjacentHTML("afterbegin",'<button type="button" class="btn ghost wide" data-show-answer>Show answer</button>'),(y=e.querySelector("[data-show-answer]"))==null||y.addEventListener("click",()=>i()))}finally{l.classList.remove("listening"),v&&(v.textContent="Tap and say it")}})}else e.innerHTML=`<p class="muted small warm-memory-hint">Say it out loud from memory, then check:</p>
      <button type="button" class="btn soft wide" data-show-answer>Show answer</button>`,(d=e.querySelector("[data-show-answer]"))==null||d.addEventListener("click",()=>i())}function W(e,t={}){e&&z(e,t).then(s=>{s||N("Turn up volume / check silent mode")})}function Oe(e){return[e.jp,e.kana].filter(t=>!!t)}function It(){if(h.ensureDaily().warmDone)return I("#/today/new");M("Warm-up","#/");const t=h.dueIds().map(a=>k.byId.get(a)).filter(a=>!!a).slice(0,8);if(!t.length){h.setDaily({warmDone:!0}),j(`<div class="done-card">${x("wave","done-mascot")}${R("warm")}
      <p class="jp big-jp" lang="ja">まだ大丈夫！</p>
      <p>Nothing is due for review yet — first day magic.</p>
      <a class="btn primary wide" id="warm-next" href="#/today/new">New phrases</a></div>`);return}let s=0;const n=()=>{if(s>=t.length){h.setDaily({warmDone:!0}),j(`<div class="done-card">${x("cheer","done-mascot")}${R("warm")}
        <p class="jp big-jp" lang="ja">おつかれ！</p>
        <p>Warm-up done — ${t.length} phrase${t.length>1?"s":""} refreshed.</p>
        <a class="btn primary wide" href="#/today/new">New phrases</a></div>`),D(document.querySelector(".done-mascot"));return}const{phrase:a,id:o}=t[s],i=h.box(o)>=3,r=X(a),m=[...a.jp].length,d=m>18?"xlong":m>12?"long":"",l=j(`
      ${R("warm")}
      <div class="quiz-top"><span>Review ${s+1} of ${t.length}</span><div class="bar small"><span style="width:${s/t.length*100}%"></span></div></div>
      <article class="card phrase-card warm-card" id="phrase-card">
        <span class="card-deco">${w.bow}</span>
        <p class="prompt warm-ask"><span class="eyebrow">Recall</span> How do you say this?</p>
        <div class="phrase-en warm-en">${u(a.en)}</div>
        <div class="warm-answer hidden" id="warm-answer">
          <div class="phrase big ${d}">
            <div class="jp phrase-jp" lang="ja">${u(a.jp)}</div>
            ${r?`<div class="jp phrase-kana" lang="ja">${u(r)}</div>`:""}
            <div class="phrase-romaji-wrap">${ee(a.romaji,"phrase-romaji",i)}</div>
          </div>
          <div id="warm-audio">${te(a.jp)}</div>
        </div>
        <div class="practice" id="practice"></div>
      </article>
      <button type="button" class="btn primary wide" id="warm-next" disabled>Next</button>`);let p=!1;const v=l.querySelector("#warm-next");qt(l.querySelector("#practice"),Oe(a),()=>{var y;(y=document.getElementById("warm-answer"))==null||y.classList.remove("hidden"),z(a.jp)},y=>{h.grade(o,y),p=!0,v.disabled=!1}),v.addEventListener("click",()=>{p&&(s+=1,n())})};n()}function Ct(){var o;const e=h.ensureDaily();if(e.newDone)return I("#/today/convo");M("New phrases","#/");const t=h.setting("dailyNew")||3,s=e.newIds&&e.newIds.length?e.newIds.map(i=>k.byId.get(i)).filter(i=>!!i):St(t);if(!s.length){h.setDaily({newDone:!0,newIds:[]}),j(`<div class="done-card">${x("cheer","done-mascot")}${R("new")}
      <p class="jp big-jp" lang="ja">全部おぼえた！</p>
      <p>You’ve unlocked every phrase. Free practice keeps the conversation going.</p>
      <a class="btn primary wide" href="#/today/convo">Mini conversation</a></div>`);return}(o=e.newIds)!=null&&o.length||h.setDaily({newIds:s.map(i=>i.id)});let n=0;const a=()=>{var d;if(n>=s.length){const l=Z(k);let p=h.state.curriculum.value.unlocked;for(const v of s){const y=l.findIndex(c=>c.id===v.id);y>=0&&(p=Math.max(p,y+1))}h.setUnlocked(p),h.setDaily({newDone:!0}),j(`<div class="done-card">${x("cheer","done-mascot")}${R("new")}
        <p class="jp big-jp" lang="ja">新しいことば！</p>
        <p>${s.length} new phrase${s.length>1?"s":""} unlocked.</p>
        <a class="btn primary wide" href="#/today/convo">Mini conversation</a></div>`),D(document.querySelector(".done-mascot"));return}const i=s[n],r=i.phrase;h.markSeen(i.id);const m=j(`
      ${R("new")}
      <div class="quiz-top"><span>New ${n+1} of ${s.length}</span><div class="bar small"><span style="width:${n/s.length*100}%"></span></div></div>
      <article class="card phrase-card" id="phrase-card">
        <span class="card-deco">${w.heart}</span>
        ${G(r,{known:!1})}
        ${te(r.jp)}
        ${r.note?`<p class="note">${u(r.note)}</p>`:""}
        ${r.grammar?`<details class="grammar"><summary>${w.star} Grammar bite</summary><p>${u(r.grammar)}</p></details>`:""}
        <div class="practice" id="practice"></div>
      </article>
      <button type="button" class="btn primary wide" id="new-next">Next</button>`);ce(m.querySelector("#practice"),Oe(r),l=>h.grade(i.id,l)),(d=m.querySelector("#new-next"))==null||d.addEventListener("click",()=>{n+=1,a()}),window.setTimeout(()=>void z(r.jp),250)};a()}function Nt(){const e=h.ensureDaily();if(e.convoDone)return I("#/today/listen");M("Mini conversation","#/");const t=(e.newIds||[]).map(c=>k.byId.get(c)).find(c=>!!c),s=(t==null?void 0:t.unit)||k.units[0],n=s.roleplay.lines.slice(0,6),a=Ce();let o=0,i=0,r=0;const m=j(`
    ${R("convo")}
    <section class="rp-head">
      <p class="eyebrow">${w.heart} Mini conversation</p>
      <h1>${u(s.roleplay.title)}</h1>
      <p class="lede">${u(s.roleplay.setting)} Today’s phrases are mixed in.</p>
    </section>
    <div class="chat" id="chat"></div>
    <div class="reply" id="reply"></div>`),d=m.querySelector("#chat"),l=m.querySelector("#reply"),p=(c,f)=>{const g=document.createElement("div");g.className=`bubble ${f}`;const b=X(c);g.innerHTML=`${f==="them"?`<div class="who">${u(c.name||"")}</div>`:'<div class="who">You</div>'}
      <div class="jp bubble-jp" lang="ja">${u(c.jp)}</div>
      ${b?`<div class="jp bubble-kana" lang="ja">${u(b)}</div>`:""}
      <div>${ee(c.romaji,"bubble-romaji",!1)}</div>
      <div class="bubble-en">${u(c.en)}</div>
      <div class="bubble-audio">
        <button type="button" class="mini" data-say="${u(c.jp||"")}" aria-label="Play">${E.play}</button>
        <button type="button" class="mini" data-say="${u(c.jp||"")}" data-slow="1" aria-label="Play slowly">${E.slow}</button>
      </div>`,d.appendChild(g),g.scrollIntoView({block:"end"})},v=()=>{h.setDaily({convoDone:!0}),l.innerHTML=`<div class="done-card">${x("cheer","done-mascot")}
      <p class="jp big-jp" lang="ja">いい会話！</p>
      <p>${r} of ${i} replies on point.</p>
      <a class="btn primary wide" href="#/today/listen">Quick listen</a></div>`,D(l.querySelector(".done-mascot"))},y=()=>{var f;if(!Ne(a))return;if(o>=n.length)return v();const c=n[o++];if(c.speaker==="them")p(c,"them"),l.innerHTML="",W(c.jp,{fast:!!c.fast}),window.setTimeout(y,650);else{const g=H(c.options||[]),b=(f=c.options)==null?void 0:f[0];if(!b)return y();l.innerHTML=`<p class="prompt">${u(c.prompt)}</p>
        <div class="options">${g.map(($,S)=>`<button type="button" class="option" data-i="${S}"><span class="jp" lang="ja">${u($.jp)}</span><span class="opt-romaji">${u($.romaji||"")}</span></button>`).join("")}</div>`,l.querySelectorAll(".option").forEach($=>{$.addEventListener("click",()=>{const S=g[Number($.dataset.i)];i+=1,S.jp===b.jp&&(r+=1),l.querySelectorAll(".option").forEach(A=>{A.disabled=!0;const P=g[Number(A.dataset.i)];P.jp===b.jp?A.classList.add("right"):P===S&&A.classList.add("wrong")}),p(b,"you"),W(b.jp),window.setTimeout(y,700)})})}};y()}function Ht(){if(h.ensureDaily().listenDone)return I("#/today/done");M("Quick listen","#/");const t=Pt(4);if(!t.length)return h.setDaily({listenDone:!0,done:!0}),h.touchDay(),I("#/today/done");let s=0;const n=()=>{if(s>=t.length)return h.setDaily({listenDone:!0,done:!0}),h.touchDay(),I("#/today/done");const a=t[s],o=H(a.meanings.map((r,m)=>({m:r,ok:m===0}))),i=j(`
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
        <div class="options" id="mopts">${o.map((r,m)=>`<button type="button" class="option" data-i="${m}"><span>${u(r.m)}</span></button>`).join("")}</div>
      </div>`);window.setTimeout(()=>void z(a.jp),350),i.querySelectorAll("#mopts .option").forEach(r=>{r.addEventListener("click",()=>{var y;const m=o[Number(r.dataset.i)];i.querySelectorAll("#mopts .option").forEach(c=>{c.disabled=!0;const f=o[Number(c.dataset.i)];f.ok?c.classList.add("right"):f===m&&c.classList.add("wrong")});const d=document.getElementById("lstage"),l=H(a.reply.options.slice()),p=a.reply.options[0];d.innerHTML=`
          <p class="prompt"><span class="eyebrow">Reply out loud</span> ${u(a.reply.prompt)}</p>
          <div class="options" id="ropts">${l.map((c,f)=>`<button type="button" class="option" data-i="${f}"><span class="jp" lang="ja">${u(c.jp)}</span><span class="opt-romaji">${u(c.romaji||"")}</span></button>`).join("")}</div>
          <div class="practice" id="practice"></div>`,(y=document.getElementById("listen-text"))==null||y.classList.remove("hidden");const v=document.getElementById("practice");v&&ce(v,[p.jp,p.kana].filter(c=>!!c)),d.querySelectorAll("#ropts .option").forEach(c=>{c.addEventListener("click",()=>{var g;const f=l[Number(c.dataset.i)];d.querySelectorAll("#ropts .option").forEach(b=>{b.disabled=!0;const $=l[Number(b.dataset.i)];$.jp===p.jp?b.classList.add("right"):$===f&&b.classList.add("wrong")}),d.insertAdjacentHTML("beforeend",`<button type="button" class="btn primary wide" id="l-next">${s===t.length-1?"Finish":"Next"}</button>`),W(p.jp),(g=document.getElementById("l-next"))==null||g.addEventListener("click",()=>{s+=1,n()})})})})})};n()}function Pt(e){const t=Z(k),s=new Set;t[0]&&s.add(t[0].unit.id);for(const o of t)h.state.seen[o.id]&&s.add(o.unit.id);const n=t.find(o=>!h.state.seen[o.id]);n&&s.add(n.unit.id);const a=[];for(const o of k.units)!s.has(o.id)||!o.listening||a.push(...o.listening);return H(a).slice(0,Math.min(e,a.length))}function zt(){const e=h.ensureDaily();e.warmDone&&e.newDone&&e.convoDone&&e.listenDone&&!e.done&&h.setDaily({done:!0}),h.touchDay(),M("今日もおつかれさま","#/");const t=At(h.setting("dailyNew")||3),s=t.length?`<ul class="tomorrow-list">${t.map(a=>`<li><span class="jp" lang="ja">${u(a.phrase.jp)}</span> <span class="muted">${u(a.phrase.en)}</span></li>`).join("")}</ul>`:'<p class="muted">More free practice tomorrow — the curriculum is complete.</p>',n=h.needsBackupReminder()?`<aside class="backup-nudge" role="note">
        <span aria-hidden="true">${w.bow}</span>
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
  </div>`),D(document.querySelector(".done-mascot"))}function Ot(){const e=new Date().getHours(),t=e<11?"おはよう":e<18?"こんにちは":"こんばんは",s=e<11?"Good morning":e<18?"Hello":"Good evening";return{html:`<span class="greet-phrase">${t}、</span><span class="greet-name">リズちゃん</span>`,en:s}}function Rt(){const e=new Set(Object.keys(h.state.days)),t=[],s=new Date;s.setHours(12,0,0,0),s.setDate(s.getDate()-27);const n=U();for(let a=0;a<28;a++){const o=U(s);t.push(`<span class="hm-cell ${e.has(o)?"on":""} ${o===n?"today":""}" title="${o}"></span>`),s.setDate(s.getDate()+1)}return`<div class="heatmap" aria-label="Practice days">${t.join("")}</div>`}function Ut(){const{finished:e,done:t}=ye(),s=h.streak();return e?s>=3?`Streak ${s} — you’re on a roll.`:"今日もおつかれさま. Come back tomorrow.":t===0?"A cozy ten minutes. Missing a day is fine — we just pick up again.":`${t} of 4 parts done. Keep going when you’re ready.`}function Ft(e,t){const s=C(e);return`<a class="unit-card ${s.done?"done":""}" href="#/unit/${e.id}">
    <span class="unit-num">${s.done?E.check:t+1}</span>
    <div class="unit-body">
      <div class="unit-title">${u(e.title)}</div>
      <div class="jp unit-jp" lang="ja">${u(e.jpTitle)}</div>
      <div class="bar small"><span style="width:${Math.round(s.steps/4*100)}%"></span></div>
    </div>
  </a>`}function Wt(){const e=document.getElementById("topbar");e&&(e.classList.add("hidden"),e.innerHTML="");const t=k.units.reduce((l,p)=>l+C(p).seen,0),s=h.dueIds().filter(l=>k.byId.has(l)).length,n=Ot(),{finished:a,done:o}=ye(),i=a?"#/today/done":Pe(),r=a?"Lesson complete":o?"Continue today’s lesson":"Today’s lesson",m=a?"Peek at free practice, or come back tomorrow":"Warm-up · new phrases · chat · listen",d=h.needsBackupReminder()?`<aside class="backup-nudge home-nudge" role="note">
          <span aria-hidden="true">${w.bow}</span>
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
          <p class="eyebrow">${w.heart} for リズちゃん</p>
          <h1 class="jp hero-jp" lang="ja">${n.html}</h1>
          <p class="hero-en">${n.en}, Rizu-chan. ${u(Ut())}</p>
        </div>
        ${x(a?"cheer":"wave","hero-mascot")}
      </div>
      <div class="stats">
        <div class="stat"><span class="stat-num">${h.streak()}</span><span class="stat-label">day streak</span></div>
        <div class="stat"><span class="stat-num">${t}</span><span class="stat-label">phrases</span></div>
        <div class="stat"><span class="stat-num">${s}</span><span class="stat-label">due review</span></div>
      </div>
      ${Rt()}
      <a class="btn primary wide cta daily-cta ${a?"done":""}" href="${i}" id="start-cta">
        <span class="cta-main">${r}</span>
        <span class="cta-sub">${m}</span>
      </a>
      ${d}
    </section>
    <details class="free-practice" id="free-practice">
      <summary>
        <span class="track-icon">${w.star}</span>
        <div>
          <div class="unit-title">Free practice</div>
          <div class="unit-sub">Open any unit’s phrases, role-play, listening, or quiz</div>
        </div>
      </summary>
      ${k.tracks.map(l=>{const p=Qe(k,l.id),v=p.filter(y=>C(y).done).length;return`<section class="track track-${l.id}" id="track-${l.id}">
            <div class="track-head">
              <span class="track-icon">${l.id==="family"?w.heart:w.star}</span>
              <div>
                <h2 class="track-title">${u(l.title)} <span class="jp track-jp" lang="ja">${u(l.jpTitle)}</span></h2>
                <p class="track-blurb">${u(l.blurb)}</p>
              </div>
              <span class="tag">${v}/${p.length}</span>
            </div>
            <div class="units">${p.map(Ft).join("")}</div>
          </section>`}).join("")}
      <a class="review-card-home ${s?"has-due":""}" href="#/review" id="review-cta">
        <span class="track-icon">${w.bow}</span>
        <div><div class="unit-title">Review bank</div><div class="unit-sub">${s?`${s} phrase${s>1?"s":""} ready`:"Leitner spaced review"}</div></div>
        <span class="tag ${s?"hot":""}">${s}</span>
      </a>
    </details>
    <footer class="foot">${w.skull}<span>がんばって、リズちゃん</span>${w.skull}</footer>`)}function Gt(){M("Review","#/");const e=h.dueIds().filter(r=>k.byId.has(r)),t=()=>`<div class="boxes" aria-label="Leitner boxes">${[1,2,3,4,5].map(m=>Object.keys(h.state.srs).filter(d=>k.byId.has(d)&&h.state.srs[d].value.box===m).length).map((m,d)=>`<div class="box"><span class="box-n">${m}</span><span class="box-l">Box ${d+1}</span></div>`).join("")}</div>`;if(!e.length){const r=Object.keys(h.state.srs).filter(d=>k.byId.has(d)).length,m=He();j(`<div class="done-card">
      ${x(r?"cheer":"wave","done-mascot")}
      <p class="jp big-jp" lang="ja">${r?"ばっちり！":"まだです"}</p>
      <p>${r?"Nothing to review right now. Come back tomorrow.":"Learn a few phrases first and they’ll show up here."}</p>
      ${t()}
      <p class="muted small">Phrases move up a box when you get them, and come back less often: same day, then 1, 3, 7, and 16 days.</p>
      <a class="btn primary" href="#/unit/${m.id}">Learn phrases</a></div>`);return}const s=e.slice(0,20),n=new Set;let a=0,o=0;const i=()=>{var c;if(a>=s.length){j(`<div class="done-card">${x("cheer","done-mascot")}<p class="jp big-jp" lang="ja">おつかれさま！</p>
        <p>You reviewed ${s.length-n.size} card${s.length-n.size===1?"":"s"} and got ${o} on the first try.</p>
        ${t()}
        <a class="btn primary" href="#/">Home</a></div>`),D(document.querySelector(".done-mascot"));return}const r=s[a],m=k.byId.get(r);if(!m){a+=1,i();return}const{phrase:d,unit:l}=m,p=h.state.srs[r].value.box,v=j(`
      <div class="quiz-top"><span>${a+1} of ${s.length} · Box ${p}</span><div class="bar small"><span style="width:${a/s.length*100}%"></span></div></div>
      <article class="card review-card">
        <p class="q-label">Say it in Japanese</p>
        <p class="q-main">${u(d.en)}</p>
        <p class="muted small">from “${u(l.title)}”</p>
        <div id="answer" class="answer hidden">${G(d,{big:!1,known:h.box(r)>=3})}${te(d.jp,"center")}</div>
      </article>
      <div id="rv-actions">
        <div id="rv-speak" class="practice"></div>
        <button type="button" class="btn primary wide" id="reveal">Show answer</button>
      </div>`),y=v.querySelector("#rv-speak");V()?ce(y,[d.jp,d.kana].filter(f=>!!f)):y.remove(),(c=v.querySelector("#reveal"))==null||c.addEventListener("click",()=>{var g,b,$;(g=document.getElementById("answer"))==null||g.classList.remove("hidden"),z(d.jp);const f=document.getElementById("rv-actions");f.innerHTML=`<div class="rate-row">
        <button type="button" class="btn ghost" id="again">Again</button>
        <button type="button" class="btn soft" id="gotit">Got it</button>
      </div>`,(b=document.getElementById("again"))==null||b.addEventListener("click",()=>{h.grade(r,!1),n.has(r)||(n.add(r),s.push(r)),a+=1,i()}),($=document.getElementById("gotit"))==null||$.addEventListener("click",S=>{n.has(r)||(h.grade(r,!0),o+=1),D(S.currentTarget),window.setTimeout(()=>{a+=1,i()},280)})})};i()}function Yt(){const e=k.units[1]||k.units[0];return(e==null?void 0:e.phrases[1])||(e==null?void 0:e.phrases[0])}function Q(){var a,o;M("Settings","#/");const e=h.setting("showKana"),t=h.setting("romaji"),s=h.setting("dailyNew"),n=Yt();j(`
    <article class="card settings">
      <div class="set-block">
        <div class="set-title">New phrases per day</div>
        <div class="set-sub">How many brand-new phrases today’s lesson unlocks.</div>
        <div class="seg" role="radiogroup" aria-label="Daily new phrases">
          ${[3,5,7].map(i=>`<button type="button" role="radio" aria-checked="${s===i}" class="seg-btn ${s===i?"on":""}" data-dn="${i}">${i}</button>`).join("")}
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
          ${[["show","Show"],["fade","Fade"],["hide","Hide"]].map(([i,r])=>`<button type="button" role="radio" aria-checked="${t===i}" class="seg-btn ${t===i?"on":""}" data-rm="${i}">${r}</button>`).join("")}
        </div>
      </div>
      ${n?`<div class="set-preview">${G(n,{big:!1,known:h.box(`${(k.units[1]||k.units[0]).id}:${n.jp}`)>=3})}</div>`:""}
    </article>
    <article class="card settings backup-card" id="backup-section">
      <div class="backup-deco" aria-hidden="true">${w.bow}${w.skull}${w.bow}</div>
      <div class="set-title">Back up my progress ${w.heart}</div>
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
    </article>`),(a=document.getElementById("set-kana"))==null||a.addEventListener("change",i=>{h.setting("showKana",i.target.checked),Q()}),document.querySelectorAll("[data-rm]").forEach(i=>{i.addEventListener("click",()=>{const r=i.dataset.rm;(r==="show"||r==="fade"||r==="hide")&&(h.setting("romaji",r),Q())})}),document.querySelectorAll("[data-dn]").forEach(i=>{i.addEventListener("click",()=>{const r=Number(i.dataset.dn);(r===3||r===5||r===7)&&(h.setting("dailyNew",r),Q())})}),(o=document.getElementById("reset"))==null||o.addEventListener("click",()=>{confirm("Reset all progress on this device?")&&(h.reset(),N("Progress reset"),I("#/"))}),Kt()}function Kt(){var m,d;const e=document.getElementById("backup-export"),t=document.getElementById("backup-import"),s=document.getElementById("backup-err"),n=document.getElementById("backup-copy"),a=document.getElementById("backup-share"),o=document.getElementById("backup-cheer"),i=l=>{s.hidden=!l,s.textContent=l};(m=document.getElementById("backup-make"))==null||m.addEventListener("click",async()=>{try{h.markBackup(),e.value=await h.exportBackup(),n.disabled=!1,N("Backup code ready")}catch{N("Couldn’t make a backup code")}});const r=async()=>{var v;const l=e.value.trim();if(!l)return;let p=!1;try{(v=navigator.clipboard)!=null&&v.writeText&&(await navigator.clipboard.writeText(l),p=!0)}catch{p=!1}if(!p){e.focus(),e.select();try{p=document.execCommand("copy")}catch{p=!1}}p?(h.markBackup(),N("Copied!")):N("Couldn’t copy — long-press to select")};n.addEventListener("click",()=>void r()),navigator.share&&(a.hidden=!1,a.addEventListener("click",async()=>{if(!e.value.trim())try{e.value=await h.exportBackup(),n.disabled=!1}catch{N("Couldn’t make a backup code");return}try{await navigator.share({title:"にほんご backup",text:e.value.trim()}),h.markBackup()}catch(l){if(l instanceof DOMException&&l.name==="AbortError")return;N("Share didn’t work — try Copy instead")}})),(d=document.getElementById("backup-restore"))==null||d.addEventListener("click",async()=>{i("");const l=t.value.trim();if(!l){i("Paste a backup code first.");return}try{await Ie(l)}catch(p){i(p instanceof Error?p.message:"Couldn’t restore that code.");return}if(confirm("This will replace progress on this device. Continue?"))try{await h.importBackup(l),o.hidden=!1,D(o.querySelector(".backup-cheer-mascot")||o),N("Progress restored!"),window.setTimeout(()=>Q(),900)}catch(p){i(p instanceof Error?p.message:"Couldn’t restore that code.")}})}function _t(e){var t;return((t=k.tracks.find(s=>s.id===e.track))==null?void 0:t.title)||"Lesson"}function ae(e,t,s=""){return`<div class="feedback ${e?"good":"bad"}">
    ${x(e?"cheer":"think","fb-mascot")}
    <div class="fb-body"><p class="fb-title"><strong>${t}</strong></p>${s}</div>
  </div>`}function Re(e,t){return t||!C(e).done?"":`<div class="complete-banner">${w.star}<span>Unit complete: ${u(e.title)}</span>${w.star}</div>`}function Jt(e){M(u(_t(e)),"#/");const t=C(e),s=(n,a,o,i,r)=>`<a class="step" href="${o}"><span class="step-num ${a?"ok":""}">${a?E.check:n}</span><div><div class="step-title">${i}</div><div class="step-sub">${r}</div></div></a>`;j(`
    <section class="unit-hero">
      <p class="eyebrow jp" lang="ja">${u(e.jpTitle)}</p>
      <h1>${u(e.title)}</h1>
      <p class="lede">${u(e.summary)}</p>
      ${t.done?`<p class="tag ok">${w.star} Unit complete</p>`:""}
    </section>
    <div class="steps">
      ${s(1,t.seen===t.total,`#/unit/${e.id}/cards/0`,"Phrases",`${t.seen} of ${t.total} learned · listen and say each one`)}
      ${s(2,t.listenDone,`#/unit/${e.id}/listen`,"Listening drill",`${e.listening.length} lines at natural speed, no text`)}
      ${s(3,t.roleplayDone,`#/unit/${e.id}/roleplay`,"Role-play",u(e.roleplay.title))}
      ${s(4,t.quizBest>=70,`#/unit/${e.id}/quiz`,"Quick quiz",t.quizBest?`Best score ${t.quizBest}%`:"6 questions · 70% to pass")}
    </div>`)}function Qt(e,t){const s=Math.max(0,Math.min(e.phrases.length-1,t||0)),n=e.phrases[s],a=K(e.id,n.jp),o=me(e,n.jp);h.markSeen(a),M(u(e.title),`#/unit/${e.id}`);const i=s===e.phrases.length-1,r=j(`
    <div class="progress-dots" aria-label="Card ${s+1} of ${e.phrases.length}">
      ${e.phrases.map((m,d)=>`<span class="${d<s?"past":d===s?"now":""}"></span>`).join("")}
    </div>
    <article class="card phrase-card" id="phrase-card">
      <span class="card-deco">${w.bow}</span>
      ${G(n,{known:o})}
      ${te(n.jp)}
      ${n.note?`<p class="note">${u(n.note)}</p>`:""}
      ${n.grammar?`<details class="grammar"><summary>${w.star} Grammar bite</summary><p>${u(n.grammar)}</p></details>`:""}
      <div class="practice" id="practice"></div>
    </article>
    <div class="nav-row">
      <a class="btn ghost" href="#/unit/${e.id}/cards/${s-1}" ${s===0?'aria-disabled="true" tabindex="-1"':""}>Back</a>
      <a class="btn primary" id="next" href="${i?`#/unit/${e.id}/listen`:`#/unit/${e.id}/cards/${s+1}`}">${i?"On to listening":"Next"}</a>
    </div>`);ce(r.querySelector("#practice"),[n.jp,n.kana].filter(m=>!!m),m=>{m||h.grade(a,!1)}),window.setTimeout(()=>void z(n.jp),250)}function Ue(e){M("Listening",`#/unit/${e.id}`);const t=e.listening,s=C(e).done;let n=0,a=0;const o=()=>{if(n>=t.length)return r();const m=t[n],d=H(m.meanings.map((p,v)=>({m:p,ok:v===0}))),l=j(`
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
        <div class="options" id="mopts">${d.map((p,v)=>`<button type="button" class="option" data-i="${v}"><span>${u(p.m)}</span></button>`).join("")}</div>
      </div>`);window.setTimeout(()=>void z(m.jp),350),l.querySelectorAll("#mopts .option").forEach(p=>{p.addEventListener("click",()=>{var c;const v=d[Number(p.dataset.i)];v.ok&&(a+=1),l.querySelectorAll("#mopts .option").forEach(f=>{f.disabled=!0;const g=d[Number(f.dataset.i)];g.ok?f.classList.add("right"):g===v&&f.classList.add("wrong")}),document.getElementById("lstage").insertAdjacentHTML("beforeend",ae(v.ok,v.ok?"そうそう！ You understood it.":"Close! It means:",`<p>${u(m.en)}</p>`)+'<button type="button" class="btn primary wide" id="to-reply">Now reply</button>'),(c=document.getElementById("to-reply"))==null||c.addEventListener("click",()=>i(m))})})},i=m=>{var y;const d=H(m.reply.options),l=m.reply.options[0],p=document.getElementById("lstage");p.innerHTML=`
      <p class="prompt"><span class="eyebrow">Step 2</span> ${u(m.reply.prompt)}</p>
      <div class="options" id="ropts">${d.map((c,f)=>`<button type="button" class="option" data-i="${f}"><span class="jp" lang="ja">${u(c.jp)}</span>${be(c,s)}</button>`).join("")}</div>
      ${V()?`<button type="button" class="mic small" id="l-mic">${E.mic}<span>Or say your reply</span></button><div class="result" id="l-result"></div>`:""}`;const v=c=>{var b,$;const f=c===l;p.querySelectorAll("#ropts .option").forEach(S=>{S.disabled=!0;const L=d[Number(S.dataset.i)];L===l?S.classList.add("right"):L===c&&S.classList.add("wrong")});const g=document.getElementById("l-mic");g&&(g.disabled=!0),(b=document.getElementById("listen-text"))==null||b.classList.remove("hidden"),p.insertAdjacentHTML("beforeend",ae(f,f?"Perfect reply!":"A natural reply is:",`${f?"":`<p class="jp" lang="ja">${u(l.jp)}</p>`}<p class="muted">${u(l.en)}</p>`)+`<button type="button" class="btn primary wide" id="l-next">${n===t.length-1?"Finish":"Next line"}</button>`),W(l.jp),($=document.getElementById("l-next"))==null||$.addEventListener("click",()=>{n+=1,o()})};p.querySelectorAll("#ropts .option").forEach(c=>{c.addEventListener("click",()=>v(d[Number(c.dataset.i)]))}),(y=document.getElementById("l-mic"))==null||y.addEventListener("click",async()=>{const c=document.getElementById("l-mic"),f=document.getElementById("l-result");c.classList.add("listening");try{const g=await ie();let b=null;for(const $ of d){const S=re(g,[$.jp,$.kana].filter(L=>!!L));(!b||S.score>b.score)&&(b={...S,o:$})}if(!g.length||!b||b.score<45){f.innerHTML=`<p class="muted">Heard “${u(g[0]||"…")}”. Try again or tap an answer.</p>`;return}f.innerHTML=`<p class="muted">Heard “<span class="jp">${u(b.heard)}</span>” (${b.score}% match)</p>`,v(b.o)}catch{f.innerHTML='<p class="muted">Mic isn’t available. Tap an answer instead.</p>'}finally{c.classList.remove("listening")}})},r=()=>{var m;h.setUnit(e.id,{listenDone:!0}),j(`<div class="done-card" id="done-card">
      ${x("cheer","done-mascot")}
      <p class="jp big-jp" lang="ja">きけた！</p>
      <p>You understood ${a} of ${t.length} lines at natural speed.</p>
      <div class="nav-row">
        <button type="button" class="btn ghost" id="l-again">Again</button>
        <a class="btn primary" href="#/unit/${e.id}/roleplay">Role-play</a>
      </div></div>`),D(document.querySelector(".done-mascot")),(m=document.getElementById("l-again"))==null||m.addEventListener("click",()=>Ue(e))};o()}function Fe(e){M("Role-play",`#/unit/${e.id}`);const t=e.roleplay,s=C(e).done,n=s,a=Ce();let o=0,i=0,r=0;const m=j(`
    <section class="rp-head">
      <p class="eyebrow">${w.heart} Role-play</p>
      <h1>${u(t.title)}</h1>
      <p class="lede">${u(t.setting)}</p>
    </section>
    <div class="chat" id="chat"></div>
    <div class="reply" id="reply"></div>`),d=m.querySelector("#chat"),l=m.querySelector("#reply"),p=(c,f,g="")=>{const b=document.createElement("div");b.className=`bubble ${f} ${g}`;const $=X(c);b.innerHTML=`${f==="them"?`<div class="who">${u(c.name||"")}</div>`:'<div class="who">You</div>'}
      <div class="jp bubble-jp" lang="ja">${u(c.jp)}</div>
      ${$?`<div class="jp bubble-kana" lang="ja">${u($)}</div>`:""}
      <div>${ee(c.romaji,"bubble-romaji",s)}</div>
      <div class="bubble-en">${u(c.en)}</div>
      ${c.note&&f==="them"?`<div class="bubble-note">${u(c.note)}</div>`:""}
      <div class="bubble-audio">
        <button type="button" class="mini" data-say="${u(c.jp||"")}" ${c.fast?'data-fast="1"':""} aria-label="Play">${E.play}</button>
        <button type="button" class="mini" data-say="${u(c.jp||"")}" data-slow="1" aria-label="Play slowly">${E.slow}</button>
      </div>`,d.appendChild(b),b.scrollIntoView({block:"end"})},v=()=>{var c;h.setUnit(e.id,{roleplayDone:!0}),l.innerHTML=`<div class="done-card">
      ${x("cheer","done-mascot")}
      ${Re(e,n)}
      <p class="jp big-jp" lang="ja">おつかれさま！</p>
      <p>You chose the natural reply ${i} of ${r} times.</p>
      <div class="nav-row">
        <button type="button" class="btn ghost" id="rp-again">Play again</button>
        <a class="btn primary" href="#/unit/${e.id}/quiz">Take the quiz</a>
      </div></div>`,D(l.querySelector(".done-mascot")),(c=document.getElementById("rp-again"))==null||c.addEventListener("click",()=>Fe(e))},y=()=>{var $,S;if(!Ne(a))return;if(o>=t.lines.length)return v();const c=t.lines[o++];if(c.speaker==="them"){p(c,"them"),l.innerHTML="",W(c.jp,{fast:!!c.fast}),window.setTimeout(y,700);return}r+=1;const f=($=c.options)==null?void 0:$[0],g=H(c.options||[]);if(!f)return y();l.innerHTML=`
      <p class="prompt"><span class="eyebrow">Your turn</span> ${u(c.prompt)}</p>
      <div class="options">
        ${g.map((L,A)=>`<button type="button" class="option" data-i="${A}"><span class="jp" lang="ja">${u(L.jp)}</span>${be(L,s)}</button>`).join("")}
      </div>
      ${V()?`<button type="button" class="mic small" id="rp-mic">${E.mic}<span>Or say your reply</span></button><div class="result" id="rp-result"></div>`:""}`;const b=L=>{var T;const A=L.jp===f.jp;A&&(i+=1),l.querySelectorAll(".option").forEach(O=>{O.disabled=!0;const _=g[Number(O.dataset.i)];_.jp===f.jp?O.classList.add("right"):_===L&&O.classList.add("wrong")});const P=document.getElementById("rp-mic");P&&(P.disabled=!0),l.insertAdjacentHTML("beforeend",ae(A,A?"そうです！ That’s it.":"Not quite. The natural reply is:",`${A?"":`<p class="jp" lang="ja">${u(f.jp)}</p>`}<p class="muted">${u(f.en)}</p>${c.note?`<p class="note">${u(c.note)}</p>`:""}`)+'<button type="button" class="btn primary wide" id="rp-next">Continue</button>'),W(f.jp),(T=document.getElementById("rp-next"))==null||T.addEventListener("click",()=>{p(f,"you",A?"":"corrected"),l.innerHTML="",window.setTimeout(y,300)})};l.querySelectorAll(".option").forEach(L=>{L.addEventListener("click",()=>b(g[Number(L.dataset.i)]))}),(S=document.getElementById("rp-mic"))==null||S.addEventListener("click",async()=>{const L=document.getElementById("rp-mic"),A=document.getElementById("rp-result");L.classList.add("listening");try{const P=await ie();let T=null;for(const O of g){const _=re(P,[O.jp,O.kana].filter(Ge=>!!Ge));(!T||_.score>T.score)&&(T={..._,o:O})}if(!P.length||!T||T.score<45){A.innerHTML=`<p class="muted">Heard “${u(P[0]||"…")}”. Try again or tap an answer.</p>`;return}A.innerHTML=`<p class="muted">Heard “<span class="jp">${u(T.heard)}</span>” (${T.score}% match)</p>`,b(T.o)}catch{A.innerHTML='<p class="muted">Mic isn’t available. Tap an answer instead.</p>'}finally{L.classList.remove("listening")}})};y()}function We(e){M("Quick quiz",`#/unit/${e.id}`);const t=C(e).done,s=H(e.phrases).slice(0,Math.min(6,e.phrases.length)),n=["en2jp","jp2en","listen"],a=s.map((d,l)=>{const p=n[l%n.length],v=H(e.phrases.filter(y=>y!==d)).slice(0,3);return{type:p,p:d,all:H([d,...v])}});let o=0,i=0;const r=()=>{if(o>=a.length)return m();const d=a[o],l=me(e,d.p.jp),p=X(d.p),v=d.type==="en2jp"?`<p class="q-label">How do you say…</p><p class="q-main">${u(d.p.en)}</p>`:d.type==="jp2en"?`<p class="q-label">What does this mean?</p><p class="q-main jp" lang="ja">${u(d.p.jp)}</p>${p?`<p class="q-kana jp" lang="ja">${u(p)}</p>`:""}<p class="q-sub">${ee(d.p.romaji,"q-romaji",l)}</p>`:`<p class="q-label">${E.ear} Listen. What did you hear?</p>${te(d.p.jp,"center")}`,y=j(`
      <div class="quiz-top"><span>Question ${o+1} of ${a.length}</span><div class="bar small"><span style="width:${o/a.length*100}%"></span></div></div>
      <article class="card quiz-card">${v}</article>
      <div class="options" id="opts">
        ${d.all.map((c,f)=>`<button type="button" class="option" data-i="${f}">${d.type==="en2jp"?`<span class="jp" lang="ja">${u(c.jp)}</span>${be(c,me(e,c.jp))}`:`<span>${u(c.en)}</span>`}</button>`).join("")}
      </div>
      <div id="qfb"></div>`);d.type==="listen"&&window.setTimeout(()=>void z(d.p.jp),300),y.querySelectorAll("#opts .option").forEach(c=>{c.addEventListener("click",()=>{var S;const f=d.all[Number(c.dataset.i)],g=f===d.p;g&&(i+=1);const b=K(e.id,d.p.jp);h.markSeen(b),g||h.grade(b,!1),y.querySelectorAll("#opts .option").forEach(L=>{L.disabled=!0;const A=d.all[Number(L.dataset.i)];A===d.p?L.classList.add("right"):A===f&&L.classList.add("wrong")});const $=document.getElementById("qfb");$.innerHTML=ae(g,g?"せいかい！ Correct!":"Not this time. Here it is:",G(d.p,{big:!1,known:l}))+`<button type="button" class="btn primary wide" id="qnext">${o===a.length-1?"See results":"Next"}</button>`,d.type!=="listen"&&W(d.p.jp),(S=document.getElementById("qnext"))==null||S.addEventListener("click",()=>{o+=1,r()})})})},m=()=>{var f;const d=Math.round(i/a.length*100),l=h.unit(e.id).quizBest;h.setUnit(e.id,{quizBest:Math.max(l,d)});const p=d>=70,v=C(e),y=He(e.id);j(`<div class="done-card">
      ${x(p?"cheer":"think","done-mascot")}
      ${Re(e,t)}
      <p class="jp big-jp" lang="ja">${p?"よくできました！":"もう一回！"}</p>
      <p class="score-big">${i} / ${a.length}</p>
      <p class="muted">${p?v.done?"Missed phrases were sent back to your review queue.":"Quiz passed. Finish the other steps to complete the unit.":"Score 70% or more to pass. Missed phrases were sent back to your review queue."}</p>
      <div class="nav-row">
        <button type="button" class="btn ghost" id="qagain">Try again</button>
        <a class="btn primary" href="${p?v.done?`#/unit/${y.id}`:`#/unit/${e.id}`:`#/unit/${e.id}/cards/0`}">${p?v.done?"Next unit":"Back to unit":"Review the cards"}</a>
      </div></div>`);const c=document.querySelector(".done-mascot");p&&D(c),(f=document.getElementById("qagain"))==null||f.addEventListener("click",()=>We(e))};r()}function ue(){fe(),Ke(),$t();const e=(location.hash.replace(/^#\/?/,"")||"").split("/").filter(Boolean);try{if(!e.length)Wt();else if(e[0]==="today")e[1]?e[1]==="warm"?It():e[1]==="new"?Ct():e[1]==="convo"?Nt():e[1]==="listen"?Ht():e[1]==="done"?zt():I("#/today"):I(Pe());else if(e[0]==="unit"){const t=k.units.find(s=>s.id===e[1]);if(!t)return I("#/");e[2]==="cards"?Qt(t,Number.parseInt(e[3]||"0",10)):e[2]==="listen"?Ue(t):e[2]==="roleplay"?Fe(t):e[2]==="quiz"?We(t):Jt(t)}else e[0]==="review"?Gt():e[0]==="settings"?Q():I("#/")}catch(t){console.error(t),j('<p class="muted">Something went wrong. <a href="#/">Go home</a></p>')}}function Vt(){document.addEventListener("click",e=>{const t=e.target;if(!t)return;const s=t.closest("[data-reveal]");if(s){e.preventDefault();const a=document.createElement("span");a.className=s.dataset.cls||"",a.textContent=s.dataset.reveal||"",s.replaceWith(a);return}const n=t.closest("[data-say]");n&&(Ee(),n.classList.add("playing"),z(n.dataset.say||"",{slow:!!n.dataset.slow,fast:!!n.dataset.fast}).then(a=>{n.classList.remove("playing"),a||N("Turn up volume / check silent mode")}))})}async function Zt(){Vt(),Xe(ue);try{gt(await Je())}catch{j('<p class="muted">Couldn’t load lessons. Serve this folder instead of opening the file directly.</p>');return}Et(),h.ensureDaily(),window.addEventListener("hashchange",ue),ue(),tt()}Zt();
