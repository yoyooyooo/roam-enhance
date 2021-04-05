!function(){"use strict";const e=e=>e.match(/((?<=#?\[\[)(.*?)(?=\]\]))|((?<=#)[-\.\w\d]+)/g)||[],t=(e,t)=>{for(;e.length>0;){const t=e.shift();try{return"function"==typeof t?t():t}catch(e){}}return t},n=e=>t([()=>e.match(/(?<=-).{9}$(?=[^-]*$)/)[0],()=>(e.match(/uuid[^uuid]*(?=(uuid[^uuid]*){0}$)/)||e.match(/uuid.*$/))[0],()=>e.slice(-9)],""),o=e=>{if(!e||!e.length)return[];const t={};return e.forEach((e=>t[e]=e)),Object.keys(t)},r=()=>{const e=[...document.querySelectorAll(".roam-block-container.block-highlight-blue")].map((e=>n(e.querySelector(".rm-block__input").id)));return[...new Set(e)]};var a=Object.freeze({__proto__:null,extractTags:e,removeTags:e=>e.replace(/(#\[\[(.*?)\]\])|(#[-\.\w\d]+)/g,"").trim(),patchBlockChildren:async(e,t,n={})=>{let{skipTop:o=!0,depth:r=1/0}=n;const a=await window.roam42.common.getBlockInfoByUID(e,!0);let i=!1;const c=(e,n,r=!0)=>{if(i||!e)return!1;e.forEach((e=>{const a=Array.isArray(e)?e[0]:e;a.children&&n>0&&c(a.children,n-1,!1),o&&r||!1===t(a)&&(i=!0)}))};c(a,r)},patchBlockChildrenSync:async(e,t,n={})=>{let{skipTop:o=!0,depth:r=1/0}=n;const a=await window.roam42.common.getBlockInfoByUID(e,!0);let i=!1;const c=async(e,n,r=!0)=>{if(i||!e)return!1;for(let a=0;a<e.length;a++){const l=e[a],s=Array.isArray(l)?l[0]:l;s.children&&n>0&&await c(s.children,n-1,!1),o&&r||!1===await t(s)&&(i=!0)}};await c(a,r)},getValueInOrderIfError:t,getBlockUidFromId:n,unique:o,getSelectBlockUids:r,flattenBlocks:function e(t,n){return t.flatMap((t=>[...t.children&&e(t.children,n)||[],...!1===(null==n?void 0:n(t))?[]:[t]]))},parseText:function(e){const t=e.replace(/`(.*?)`/g,"<code>$1</code>");return t!==e?t:e.replace(/\*\*(.+?)\*\*/g,'<span class="rm-bold"><span>$1</span></span>').replace(/\^\^(.+?)\^\^/g,'<span class="rm-highlight"><span>$1</span></span>').replace(/\~\~(.+?)\~\~/g,'<del class="rm-strikethrough"><span>$1</span></del>').replace(/\_\_(.+?)\_\_/g,'<em class="rm-italics"><span>$1</span></em>').replace(/\[(.*?)\]\((.*)\)/g,((e,t,n)=>{let o="block";return/\(\(.{9}\)\)/.test(n)?o="block":/\[\[.*\]\]/.test(n)?o="page":/http.*/.test(n)&&(o="external"),`<span class="rm-alias rm-alias--${o}">${t}</span>`})).replace(/(?<=^|[^#])\[\[(.+?)\]\]/g,'<span class="rm-page-ref rm-page-ref--link">$1</span>').replace(/#\[\[(.*?)\]\]|#([-\.\w\d]+)/g,((e,t,n)=>`<span class="rm-page-ref rm-page-ref--tag">#${t||n}</span>`))}}),i="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},c="object"==typeof i&&i&&i.Object===Object&&i,l="object"==typeof self&&self&&self.Object===Object&&self,s=c||l||Function("return this")(),d=s.Symbol,u=Object.prototype,m=u.hasOwnProperty,p=u.toString,h=d?d.toStringTag:void 0;var w=function(e){var t=m.call(e,h),n=e[h];try{e[h]=void 0;var o=!0}catch(e){}var r=p.call(e);return o&&(t?e[h]=n:delete e[h]),r},g=Object.prototype.toString;var y=function(e){return g.call(e)},f=d?d.toStringTag:void 0;var b=function(e){return null==e?void 0===e?"[object Undefined]":"[object Null]":f&&f in Object(e)?w(e):y(e)};var v=function(e){var t=typeof e;return null!=e&&("object"==t||"function"==t)};var k,B=function(e){if(!v(e))return!1;var t=b(e);return"[object Function]"==t||"[object GeneratorFunction]"==t||"[object AsyncFunction]"==t||"[object Proxy]"==t},_=s["__core-js_shared__"],C=(k=/[^.]+$/.exec(_&&_.keys&&_.keys.IE_PROTO||""))?"Symbol(src)_1."+k:"";var x=function(e){return!!C&&C in e},E=Function.prototype.toString;var T=function(e){if(null!=e){try{return E.call(e)}catch(e){}try{return e+""}catch(e){}}return""},$=/^\[object .+?Constructor\]$/,z=Function.prototype,U=Object.prototype,S=z.toString,M=U.hasOwnProperty,O=RegExp("^"+S.call(M).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");var j=function(e){return!(!v(e)||x(e))&&(B(e)?O:$).test(T(e))};var I=function(e,t){return null==e?void 0:e[t]};var A=function(e,t){var n=I(e,t);return j(n)?n:void 0},P=A(Object,"create");var N=function(){this.__data__=P?P(null):{},this.size=0};var D=function(e){var t=this.has(e)&&delete this.__data__[e];return this.size-=t?1:0,t},L=Object.prototype.hasOwnProperty;var q=function(e){var t=this.__data__;if(P){var n=t[e];return"__lodash_hash_undefined__"===n?void 0:n}return L.call(t,e)?t[e]:void 0},F=Object.prototype.hasOwnProperty;var R=function(e){var t=this.__data__;return P?void 0!==t[e]:F.call(t,e)};var W=function(e,t){var n=this.__data__;return this.size+=this.has(e)?0:1,n[e]=P&&void 0===t?"__lodash_hash_undefined__":t,this};function K(e){var t=-1,n=null==e?0:e.length;for(this.clear();++t<n;){var o=e[t];this.set(o[0],o[1])}}K.prototype.clear=N,K.prototype.delete=D,K.prototype.get=q,K.prototype.has=R,K.prototype.set=W;var H=K;var Y=function(){this.__data__=[],this.size=0};var V=function(e,t){return e===t||e!=e&&t!=t};var G=function(e,t){for(var n=e.length;n--;)if(V(e[n][0],t))return n;return-1},J=Array.prototype.splice;var X=function(e){var t=this.__data__,n=G(t,e);return!(n<0)&&(n==t.length-1?t.pop():J.call(t,n,1),--this.size,!0)};var Q=function(e){var t=this.__data__,n=G(t,e);return n<0?void 0:t[n][1]};var Z=function(e){return G(this.__data__,e)>-1};var ee=function(e,t){var n=this.__data__,o=G(n,e);return o<0?(++this.size,n.push([e,t])):n[o][1]=t,this};function te(e){var t=-1,n=null==e?0:e.length;for(this.clear();++t<n;){var o=e[t];this.set(o[0],o[1])}}te.prototype.clear=Y,te.prototype.delete=X,te.prototype.get=Q,te.prototype.has=Z,te.prototype.set=ee;var ne=te,oe=A(s,"Map");var re=function(){this.size=0,this.__data__={hash:new H,map:new(oe||ne),string:new H}};var ae=function(e){var t=typeof e;return"string"==t||"number"==t||"symbol"==t||"boolean"==t?"__proto__"!==e:null===e};var ie=function(e,t){var n=e.__data__;return ae(t)?n["string"==typeof t?"string":"hash"]:n.map};var ce=function(e){var t=ie(this,e).delete(e);return this.size-=t?1:0,t};var le=function(e){return ie(this,e).get(e)};var se=function(e){return ie(this,e).has(e)};var de=function(e,t){var n=ie(this,e),o=n.size;return n.set(e,t),this.size+=n.size==o?0:1,this};function ue(e){var t=-1,n=null==e?0:e.length;for(this.clear();++t<n;){var o=e[t];this.set(o[0],o[1])}}ue.prototype.clear=re,ue.prototype.delete=ce,ue.prototype.get=le,ue.prototype.has=se,ue.prototype.set=de;var me=ue;var pe=function(e){return this.__data__.set(e,"__lodash_hash_undefined__"),this};var he=function(e){return this.__data__.has(e)};function we(e){var t=-1,n=null==e?0:e.length;for(this.__data__=new me;++t<n;)this.add(e[t])}we.prototype.add=we.prototype.push=pe,we.prototype.has=he;var ge=we;var ye=function(e,t,n,o){for(var r=e.length,a=n+(o?1:-1);o?a--:++a<r;)if(t(e[a],a,e))return a;return-1};var fe=function(e){return e!=e};var be=function(e,t,n){for(var o=n-1,r=e.length;++o<r;)if(e[o]===t)return o;return-1};var ve=function(e,t,n){return t==t?be(e,t,n):ye(e,fe,n)};var ke=function(e,t){return!!(null==e?0:e.length)&&ve(e,t,0)>-1};var Be=function(e,t,n){for(var o=-1,r=null==e?0:e.length;++o<r;)if(n(t,e[o]))return!0;return!1};var _e=function(e,t){for(var n=-1,o=null==e?0:e.length,r=Array(o);++n<o;)r[n]=t(e[n],n,e);return r};var Ce=function(e){return function(t){return e(t)}};var xe=function(e,t){return e.has(t)};var Ee=function(e,t,n,o){var r=-1,a=ke,i=!0,c=e.length,l=[],s=t.length;if(!c)return l;n&&(t=_e(t,Ce(n))),o?(a=Be,i=!1):t.length>=200&&(a=xe,i=!1,t=new ge(t));e:for(;++r<c;){var d=e[r],u=null==n?d:n(d);if(d=o||0!==d?d:0,i&&u==u){for(var m=s;m--;)if(t[m]===u)continue e;l.push(d)}else a(t,u,o)||l.push(d)}return l};var Te=function(e,t){for(var n=-1,o=t.length,r=e.length;++n<o;)e[r+n]=t[n];return e};var $e=function(e){return null!=e&&"object"==typeof e};var ze=function(e){return $e(e)&&"[object Arguments]"==b(e)},Ue=Object.prototype,Se=Ue.hasOwnProperty,Me=Ue.propertyIsEnumerable,Oe=ze(function(){return arguments}())?ze:function(e){return $e(e)&&Se.call(e,"callee")&&!Me.call(e,"callee")},je=Array.isArray,Ie=d?d.isConcatSpreadable:void 0;var Ae=function(e){return je(e)||Oe(e)||!!(Ie&&e&&e[Ie])};var Pe=function e(t,n,o,r,a){var i=-1,c=t.length;for(o||(o=Ae),a||(a=[]);++i<c;){var l=t[i];n>0&&o(l)?n>1?e(l,n-1,o,r,a):Te(a,l):r||(a[a.length]=l)}return a};var Ne=function(e){return e};var De=function(e,t,n){switch(n.length){case 0:return e.call(t);case 1:return e.call(t,n[0]);case 2:return e.call(t,n[0],n[1]);case 3:return e.call(t,n[0],n[1],n[2])}return e.apply(t,n)},Le=Math.max;var qe=function(e,t,n){return t=Le(void 0===t?e.length-1:t,0),function(){for(var o=arguments,r=-1,a=Le(o.length-t,0),i=Array(a);++r<a;)i[r]=o[t+r];r=-1;for(var c=Array(t+1);++r<t;)c[r]=o[r];return c[t]=n(i),De(e,this,c)}};var Fe=function(e){return function(){return e}},Re=function(){try{var e=A(Object,"defineProperty");return e({},"",{}),e}catch(e){}}(),We=Re?function(e,t){return Re(e,"toString",{configurable:!0,enumerable:!1,value:Fe(t),writable:!0})}:Ne,Ke=Date.now;var He=function(e){var t=0,n=0;return function(){var o=Ke(),r=16-(o-n);if(n=o,r>0){if(++t>=800)return arguments[0]}else t=0;return e.apply(void 0,arguments)}}(We);var Ye=function(e){return"number"==typeof e&&e>-1&&e%1==0&&e<=9007199254740991};var Ve=function(e){return null!=e&&Ye(e.length)&&!B(e)};var Ge=function(e){return $e(e)&&Ve(e)},Je=function(e,t){return He(qe(e,t,Ne),e+"")}((function(e,t){return Ge(e)?Ee(e,Pe(t,1,Ge,!0)):[]}));function Xe(e,t){if("function"!=typeof e||null!=t&&"function"!=typeof t)throw new TypeError("Expected a function");var n=function(){var o=arguments,r=t?t.apply(this,o):o[0],a=n.cache;if(a.has(r))return a.get(r);var i=e.apply(this,o);return n.cache=a.set(r,i)||a,i};return n.cache=new(Xe.Cache||me),n}Xe.Cache=me;var Qe=Xe;var Ze=Object.freeze({__proto__:null,testIfRoamDateAndConvert:e=>{try{return window.roam42.dateProcessing.testIfRoamDateAndConvert(e)}catch{return!1}}});const et=async e=>{const t=await window.roam42.common.getBlockInfoByUID(e);await window.roam42.common.updateBlock(e,t[0][0].string,!1)},tt=async(e,t=0,n,o=(e=>e))=>{const r=[];for(let a=0;a<n.length;a++){const i=n[a];r.push(await window.roam42.common.createBlock(e,t+a,`${o(i)}`))}return r},nt=async(e,t=0,n,o={})=>{const{renderItem:r=(e=>e),sync:a=!0,afterCreateBlock:i,delay:c,maxCount:l=290,isCancel:s}=o,d=async(t,n,o=1)=>{for(let u=0;u<n.length&&!(null==s?void 0:s());u++){const s=n[u];if(a){const n=await window.roam42.common.createBlock(e,u+t,`${r(s)}`);c&&await window.roam42.common.sleep(c),await(null==i?void 0:i(s,n,u+t+1))}else window.roam42.common.createBlock(e,u+t,`${r(s)}`),null==i||i(s);if(l&&u>l){window.iziToast.info({title:"插入太多，休息 1 分钟",timeout:7e4}),await window.roam42.common.sleep(61e3),await d(t+u+1,n.slice(u+1),o+1);break}}};await d(t,n)},ot=async(e,t,n={})=>{const{textKey:o="text",childrenKey:r="children",shouldOrder:a=!1,startOrder:i=0,afterCreateBlock:c,renderItem:l=(e=>e)}=n;let s=!1;await async function e(t,n,i){const d=a?n.sort(((e,t)=>e.order-t.order)):n;for(let n=0;n<d.length;n++){if(!t)return;const a=d[n],u=l(a[o],a);if(u){const o=await window.roam42.common.createBlock(t,i+n,u);(s||!1===(null==c?void 0:c(a,o)))&&(s=!0),a[r]&&e(o,a[r],i)}}}(e,t,i)},rt=()=>{let e=null,t=null;try{e=document.querySelector("textarea.rm-block-input").id}catch(t){e=document.activeElement.id}return e||(console.log("id 都获取不到"),window.roam42.help.displayMessage("id 都获取不到",2e3)),t=n(e),console.log("getCurrentBlockUid",{res:t,id:e}),!t&&window.roam42.help.displayMessage("获取不到当前 block uid",2e3),t},at=(e=document.activeElement)=>{try{return e.closest(".rm-block-children").closest(".roam-block-container")}catch(e){return console.log("getParentBlockNode error",e),null}},it=async()=>{try{return(await window.roam42.common.getDirectBlockParentUid(rt())).parentUID}catch(e){return console.log(e),window.roam42.help.displayMessage("getParentBlockUid 执行出错",2e3),null}},ct=e=>{try{return e.querySelector(".rm-block-children .roam-block-container:last-child").querySelector(".rm-block-main .rm-block__input").id.slice(-9)}catch(e){return console.log("getLastChildUid error",e),null}},lt=async(e=rt(),t=!1)=>{const n=await window.roam42.common.getBlockInfoByUID(e,t);try{return n[0][0]}catch(e){console.log(n),window.roam42.help.displayMessage("getCurrentBlockInfo 执行出错",2e3)}},st=async(e,t={})=>{const{isAsync:n=!1,deleteCurrentBlock:o=!1}=t,r=document.activeElement.value;n&&(document.activeElement.value+="fetching...");try{const t=rt(),n=await e({currentBlockContent:r,currentBlockUid:t});return o&&window.roam42.common.deleteBlock(t),document.activeElement.value=r,!o&&window.roam42.common.updateBlock(rt(),r),n}catch(e){console.log("outputBlocks error",e),roam42.help.displayMessage("outputBlocks 执行出错",2e3)}};function dt(e,t={}){return new Promise((n=>{window.iziToast.question({timeout:1e4,close:!1,overlay:!0,displayMode:1,id:"question",zindex:999,title:e,position:"topCenter",buttons:[[`<button><b>${"zh-CN"===navigator.language?"是":"YES"}</b></button>`,function(e,t){e.hide({transitionOut:"fadeOut"},t,"true")},!0],[`<button>${"zh-CN"===navigator.language?" 否":"NO"}</button>`,function(e,t){e.hide({transitionOut:"fadeOut"},t,"false")},!1]],onClosing:function(e,t,o){n("timeout"!==o&&JSON.parse(o))},...t})}))}function ut(e,t={}){const{id:n="",name:o="",async:r=!0}=t,a=document.getElementById(n);a&&a.remove();const i=document.createElement("script");i.src=e,n&&(i.id=n),i.async=r,i.type="text/javascript",o&&(i.onload=()=>{window.roamEnhance.loaded.add(o)}),document.getElementsByTagName("head")[0].appendChild(i)}function mt(e,t){var n;if(void 0===t&&(t=(null===(n=null===window||void 0===window?void 0:window.roamEnhance)||void 0===n?void 0:n.host)||"/"),null==e?void 0:e.length){e.reduce(((e,t)=>{var n;const o=Array.isArray(t)?t[0]:t;return null===(n=window.roamEnhance.dependencyMap.plugin[o])||void 0===n||n.forEach((t=>e.add(t))),e}),new Set).forEach((e=>{!window.roamEnhance.loaded.has(e)&&ut(`${t}libs/${e}.js`,{id:`roamEnhance-lib-${e}`,name:e,async:!1})})),e.forEach((e=>{let n,o;Array.isArray(e)?(n=e[0],e[1]&&(o=e[1])):n=e,window.roamEnhance._plugins[n]||(window.roamEnhance._plugins[n]={}),o&&(window.roamEnhance._plugins[n].options=o),!window.roamEnhance.loaded.has(n)&&ut(`${t}plugins/${n}.js`,{id:`roamEnhance-plugin-${n}`,name:n,async:!1})}))}}function pt(e,t){var n;if(void 0===t&&(t=(null===(n=null===window||void 0===window?void 0:window.roamEnhance)||void 0===n?void 0:n.host)||"/"),null==e?void 0:e.length){e.reduce(((e,t)=>{var n;const o=Array.isArray(t)?t[0]:t;return null===(n=window.roamEnhance.dependencyMap.dynamicMenu[o])||void 0===n||n.forEach((t=>e.add(t))),e}),new Set).forEach((e=>{!window.roamEnhance.loaded.has(e)&&ut(`${t}libs/${e}.js`,{id:`roamEnhance-lib-${e}`,name:e,async:!1})})),e.forEach((e=>{let n,o;Array.isArray(e)?(n=e[0],e[1]&&(o=e[1])):n=e,window.roamEnhance._dynamicMenu[n]||(window.roamEnhance._dynamicMenu[n]={}),console.log("qqq",{options:o,name:n}),o&&(window.roamEnhance._dynamicMenu[n].options=o),!window.roamEnhance.contextMenu.dynamicMenu.loaded.has(n)&&ut(`${t}dynamicMenu/${n.replace(/\s/g,"-")}.js`,{id:`roamEnhance-menu-${n}`,name:n,async:!1})}))}}var ht={common:Object.freeze({__proto__:null,collapseBlock:et,batchCreateBlocks:tt,batchCreateBlocksSync:nt,createBlocksByMarkdown:async(e,t,n={})=>{const{delay:o,maxCount:r,isCancel:a,afterCreateBlock:i,sync:c,renderItem:l=(e=>e)}=n;const s=async(e,t)=>{await nt(e,0,function(e){const t=[];let n=[],o="";for(let r=0;r<e.length;r++){const a=e[r];if(!o){const e=a.match(/(#+)\s/);e&&(o=e[1])}o&&a.startsWith(o+" ")?(n.length&&(n[0].startsWith("#")?t.push(n):t.push(...n)),n=[a]):n.push(a),r===e.length-1&&n.length&&t.push(n)}return 1===t.length?t[0]:t}(t),{sync:c,isCancel:a,delay:o,maxCount:r,renderItem:e=>l(Array.isArray(e)?e[0]:e),afterCreateBlock:async(e,t,n)=>{await(null==i?void 0:i(e,t,n)),Array.isArray(e)&&(await et(t),await s(t,e.slice(1)))}})};await s(e,t)},deepCreateBlock:ot,copyTemplateBlock:async(e,t,n={})=>{const{startOrder:o=0,afterCreateBlock:r,renderItem:a,childrenKey:i,textKey:c}=n;if("string"==typeof t){const n=await window.roam42.common.getBlockInfoByUID(t,!0);n&&ot(e,n[0][0].children,{shouldOrder:!0,startOrder:o,textKey:c||"string",childrenKey:i||"children",afterCreateBlock:r,renderItem:a})}else ot(e,t,{textKey:c||"text",childrenKey:i||"children",shouldOrder:!0,startOrder:o,afterCreateBlock:r,renderItem:a})},getCurrentPageTitle:(e=document.activeElement)=>t([()=>e.closest(".rm-ref-page-view").querySelector(".rm-ref-page-view-title").innerText,()=>e.closest(".roam-log-page").querySelector(".rm-title-display").innerText,()=>e.closest(".roam-article").querySelector(".rm-title-display").innerText,()=>e.closest(".roam-article").querySelector(".rm-zoom-item").innerText,()=>e.closest(".rm-sidebar-outline").querySelector(".rm-title-display").innerText,()=>e.closest(".rm-sidebar-outline").querySelector(".rm-zoom-item").innerText],"404"),getCurrentBlockUid:rt,deleteCurrentBlock:async(e=rt())=>{e&&await window.roam42.common.deleteBlock(e)},getParentBlockNode:at,getParentBlockUid:it,getLastChildUidByNode:ct,getLastChildUidByUid:async(e=it())=>{try{return(await window.roam42.common.getBlockInfoByUID(e,!0))[0][0].children.sort(((e,t)=>e.sort-t.sort)).slice(-1)[0].uid}catch(e){return console.log("getLastChildUid error",e),null}},getLastBilingBlockUid:async()=>{try{return ct(at())}catch(e){return console.log("getLastBilingBlockUid error",e),null}},getCurrentBlockInfo:lt,outputBlocks:st,updateCurrentBlock:async(e,t={})=>{const{isAsync:n=!1}=t,o=document.activeElement.value;n&&(document.activeElement.value+="fetching...");try{const t=rt(),n="function"==typeof e?await e({currentBlockContent:o,currentBlockUid:t}):e;return document.activeElement.value=n,window.roam42.common.updateBlock(t,n),n}catch(e){console.log("updateCurrentBlock error",e),window.roam42.help.displayMessage("updateCurrentBlock 执行出错",2e3)}},outputListIntoOne:async({title:e,output:t,parentBlockUid:n,order:o,sleep:r=50,renderItem:a=(e=>e),customOutput:i})=>{if((null==t?void 0:t.length)>0){o=o||(await lt()).order||99999;const r=n||await it(),c=await window.roam42.common.createBlock(r,o,e);return i?i(c,o):await tt(c,o,t,a),c}console.log("outputListIntoOne","output 为空")},outputBlocksRightHere:async(e,t={})=>{const{isAsync:n=!1,deleteCurrentBlock:o=!1,renderItem:r=(e=>e),toChild:a=!1}=t;await st((async({currentBlockUid:t})=>{const n=a?t:await it(),o=a?99999:(await lt(t)).order+1;let i="function"==typeof e?await e({currentBlockUid:t}):e;Array.isArray(i)?await tt(n,o,i,r):await window.roam42.common.createBlock(n,o,r(i))}),{isAsync:n,deleteCurrentBlock:!a&&o})},getTags:async t=>{try{const n=(await window.roam42.common.getBlocksReferringToThisPage(t)||[]).reduce(((e,n)=>[...e,n[0],...n[0].children&&new RegExp(String.raw`((^\[\[${t}\]\]$|)|(${t}\:\:))`).test(n[0].string)?n[0].children:[]]),[]).reduce(((t,n)=>[...t,...e(n.string)]),[]);return n.length||window.roam42.help.displayMessage(`getOptions: ${t}获取不到索引`,2e3),o(n)}catch(e){console.log("getTags error",e),window.roam42.help.displayMessage("getTags 执行出错",2e3)}}}),utils:a,dateProcessing:Ze,help:Object.freeze({__proto__:null,confirm:dt,prompt:function(e,t={}){return new Promise((n=>{const{defaultValue:o}=t;let r=`${o}`;window.iziToast.info({timeout:2e4,overlay:!0,displayMode:1,id:"inputs",zindex:999,title:e,position:"topCenter",drag:!1,inputs:[[`<input type="text" value="${o}">`,"keyup",function(e,t,n,o){r=n.value},!0]],buttons:[["<button><b>YES</b></button>",function(e,t){e.hide({transitionOut:"fadeOut"},t,r)},!1],["<button>NO</button>",function(e,t){e.hide({transitionOut:"fadeOut"},t,"")},!1]],onClosing:function(e,t,o){n("timeout"!==o&&o||"")},...t})}))}}),loader:Object.freeze({__proto__:null,addScript:ut,registerPlugin:function(e,{ctx:t}){window.roamEnhance._plugins[e]={ctx:t}},loadPlugins:mt,loadDynamicMenus:pt})};const wt=["Pull zhihu article"],gt=async(e,t,n,o,r)=>{var a,i,c;const{currentUid:l,selectUids:s,target:d,pageTitle:u}=o,m=t.string.match(/^\`\`\`javascript\n([\s\S]*)\`\`\`$/);if(m){const n=m[1],o=Object.getPrototypeOf((async function(){})).constructor;try{const i=await new o("$ctx","$currentUid","$selectUids","$target","$pageTitle",n)(r,l,s,d,u);return(null===(a=t.children)||void 0===a?void 0:a.length)||i?await window.roam42.common.createBlock(e,t.order,`${i||""}`):void 0}catch(e){return console.log(e),void window.iziToast.info({position:"topCenter",title:"zh-CN"===navigator.language?"菜单执行错误":" menu task error"})}}const p=null===(i=t.string.match(/<%\s*menu:\s*(.*)\s*%>/))||void 0===i?void 0:i[1];if(p){const e=n[p];if(e)try{null===(c=e.onClick)||void 0===c||c.call(e,o)}catch(e){return console.log(e),void window.iziToast.info({position:"topCenter",title:"zh-CN"===navigator.language?"菜单执行错误":"menu task error"})}else{const e=wt.includes(p)?'<br/>该 menu 已移至动态菜单，请配置后使用<br/>\n        <a target="_blank" href="https://roamresearch.com/#/app/roam-enhance/page/gOWzh6_E7">查看文档</a>':"";window.iziToast.error({title:"zh-CN"===navigator.language?`不存在 menu: ${p}${e}`:`no menu named${p} found`,position:"topCenter",timeout:e?1e4:3e3})}return}const h=[],w=await window.roam42.smartBlocks.proccessBlockWithSmartness(t.string);if(window.roam42.smartBlocks.activeWorkflow.arrayToWrite.length){if(window.roam42.smartBlocks.activeWorkflow.arrayToWrite.length>0){const n=await Promise.all(window.roam42.smartBlocks.activeWorkflow.arrayToWrite.flatMap((async e=>{let t=e.text;return 1==e.reprocess&&(t=await window.roam42.smartBlocks.proccessBlockWithSmartness(t)),t.includes(window.roam42.smartBlocks.exclusionBlockSymbol)||t.includes(window.roam42.smartBlocks.replaceFirstBlock)?[]:[t]})));h.push(...await ht.common.batchCreateBlocks(e,t.order,n)),window.roam42.smartBlocks.activeWorkflow.arrayToWrite=[]}}if(w.includes(window.roam42.smartBlocks.exclusionBlockSymbol)||w.includes(window.roam42.smartBlocks.replaceFirstBlock)||h.push(await window.roam42.common.createBlock(e,t.order,w)),h.length)return h[h.length-1]};let yt=[{text:"Clear current block/page's children",key:"Clear current block/page's children",help:"<b>清空当前 block/page 的所有子内容</b><br/>适用范围：通用",onClick:async({currentUid:e})=>{if(await ht.help.confirm("zh-CN"===navigator.language?"确定清空当前页/Block的所有子内容吗？":"Are you sure to clear the current block/page?")){(await window.roam42.common.getBlockInfoByUID(e,!0))[0][0].children.forEach((e=>{window.roam42.common.deleteBlock(e.uid)}))}}},{text:"All children's highlight",key:"Extract All children's highlight",help:"<b>清空当前 block/page 的所有子内容</b><br/>适用范围：通用",onClick:async({currentUid:e})=>{let t=[];await ht.utils.patchBlockChildren(e,(e=>{const n=e.string.match(/\^\^([\s\S]*?)\^\^/g);n&&t.push(...n)})),await navigator.clipboard.writeText(t.join("\n")),t.length>0?window.iziToast.success({title:"zh-CN"===navigator.language?"提取高亮成功，已复制到剪切板":"Extract successfully, Copied to clipboard!"}):window.iziToast.info({position:"topCenter",title:"zh-CN"===navigator.language?"提取不到高亮内容":"Can't extract anything"})}},{text:"Apply markdown heading to child blocks",key:"Apply markdown heading to child blocks",help:"<b>把的以#开头的子 block 转化为对应的标题</b><br/>适用范围：通用",onClick:async({currentUid:e})=>{ht.utils.patchBlockChildrenSync(e,(async e=>{const t=e.string.match(/^(#+)\s/);if(!t)return;const n=document.querySelector(`.rm-block__input[id*="${e.uid}"]`);n&&(await window.roam42.common.updateBlock(e.uid,e.string.replace(/^(#+\s)/,""),e.open),await window.roam42.common.sleep(50),window.roam42.common.simulateMouseClick(n),await window.roam42.common.sleep(50),await window.roam42KeyboardLib.changeHeading(t[1].length))}))}}],ft=[...yt,{text:"Delete",key:"Delete",children:[{text:"Delete block and its references",key:"Delete block and its references",help:"<b>删除 block 及其引用</b><br/>适用范围：Block",onClick:async({currentUid:e,selectUids:t})=>{await dt("zh-CN"===navigator.language?"确定删除当前所选 block 及其所有块引用":"Sure to delete the current block and its all references??")&&[e,...t].forEach((async e=>{const t=await window.roam42.common.getBlocksReferringToThisBlockRef(e);t.length>0&&t.forEach((async e=>window.roam42.common.deleteBlock(e[0].uid))),window.roam42.common.deleteBlock(e)}))}},{text:"Delete current block and embed block's refers",key:"Delete current block and embed block's refers",help:"<b>删除 block 及其 embed 的引用</b><br/>适用范围：Block",onClick:async({currentUid:e})=>{try{const t=(await ht.common.getCurrentBlockInfo(e)).string.match(/\{\{\[\[embed\]\]\:\s+\(\(\(\((.*?)\)\)\)\)\}\}/);if(t){const e=t[1],n=await window.roam42.common.getBlocksReferringToThisBlockRef(e);n.length>0&&await dt(`该 block 包含有 embed，embed 原 block有${n.length}个块引用，是否一起删除`)&&(n.forEach((async e=>window.roam42.common.deleteBlock(e[0].uid))),window.roam42.common.deleteBlock(e),window.roam42.help.displayMessage(`删除${n.length}个引用`,2e3),window.iziToast.info({position:"topCenter",title:"zh-CN"===navigator.language?`删除${n.length}个引用`:`delete${n.length} references`}))}window.roam42.common.deleteBlock(e)}catch(e){console.log(e),window.iziToast.error({title:"zh-CN"===navigator.language?"删除出错":"Delete failed"})}}}]},{text:"Format",key:"Format",children:[{text:"Remove tags",key:"Remove tags",help:"<b>删除 block 内的标签(以#开头)</b><br/>适用范围：Block",onClick:async({currentUid:e,selectUids:t})=>{[e,...t].forEach((async e=>{const t=await ht.common.getCurrentBlockInfo(e);await window.roam42.common.updateBlock(e,ht.utils.removeTags(t.string))}))}},{text:"Split block",key:"Split block",help:"<b>以换行为分割拆分当前 block</b><br/>适用范围：Block",onClick:async({currentUid:e})=>{const t=await window.roam42.common.getBlockInfoByUID(e),{parentUID:n}=await window.roam42.common.getDirectBlockParentUid(e),o=t[0][0].string.split("\n");window.roam42.common.deleteBlock(t[0][0].uid),await window.roam42.common.batchCreateBlocks(n,t[0][0].order,o)}},{text:"Merge blocks",key:"Merge blocks",help:"<b>合并多个 block 为 一个</b><br/>先多选 block 再右键执行<br/>适用范围：Block",onClick:async({currentUid:e,selectUids:t})=>{if(t.length<2)return;const n=await Promise.all(t.map((async e=>(window.roam42.common.deleteBlock(e),(await window.roam42.common.getBlockInfoByUID(e))[0][0].string)))),{order:o,parentUID:r}=await window.roam42.common.getDirectBlockParentUid(e);window.roam42.common.createBlock(r,o+1,n.join("\n"))}}]},{text:"Format child blocks",key:"Format child blocks",children:[{text:"Embed to text",key:"Child embed to text",help:"<b>所有子 embed 转化为纯文本</b><br/>适用范围：Block",onClick:async({currentUid:e})=>{await ht.utils.patchBlockChildren(e,(async e=>{const t=e.string.match(/\{\{\[\[embed\]\]\:\s+\(\(\(\((.*?)\)\)\)\)\}\}/),n=t&&t[1];if(n){const t=await window.roam42.common.getBlockInfoByUID(n);window.roam42.common.updateBlock(e.uid,t[0][0].string,!!e.open)}}))}},{text:"Remove tags",key:"Child blocks remove tags",help:"<b>所有子 block 删除标签(以#开头)</b><br/>适用范围：Block",onClick:async({currentUid:e})=>{ht.utils.patchBlockChildren(e,(e=>{const t=ht.utils.removeTags(e.string);t!==e.string&&window.roam42.common.updateBlock(e.uid,t)}))}},{text:"Merge blocks",key:"Merge child blocks",help:"<b>合并所有子 block 为一个</b><br/>适用范围：Block",onClick:async({currentUid:e})=>{const t=+window.prompt("zh-CN"===navigator.language?"每多少行为一组进行合并？":"How many lines into one?");if(t){const n=window.prompt("zh-CN"===navigator.language?" 前缀？":"prefix?"),o=(await window.roam42.common.getBlockInfoByUID(e,!0))[0][0].children.sort(((e,t)=>e.order-t.order));let r="",a=0;for(let i=0;i<o.length;i++){const c=o[i];window.roam42.common.deleteBlock(c.uid),r+=`${r?"\n":""}${c.string}`,(i>t-2&&(i+1)%t==0||i===o.length-1)&&(window.roam42.common.createBlock(e,a++,`${n}${r}`),r="")}}}}]},{text:"Cloze",key:"Cloze",children:[{text:"Expand all",key:"Expand all cloze",help:"<b>展开所有填空<br>((xxx))</b><br/>适用范围：Block",onClick:async({target:e})=>{e.closest(".roam-block-container").querySelectorAll(".rm-block-children .rm-paren > .rm-spacer").forEach((e=>e.click()))}},{text:"Collapse all",key:"Collapse all cloze",help:"<b>收缩所有填空</b><br/>((xxx))<br/>适用范围：Block",onClick:async({target:e})=>{e.closest(".roam-block-container").querySelectorAll(".rm-block-children .rm-paren__paren").forEach((e=>e.click()))}}]}],bt=[...yt,{text:"Delete all refering blocks",key:"Delete all refering blocks",help:"<b>删除当前页面的所有引用</b><br/>适用范围：页面标题",onClick:async({pageTitle:e})=>{const t=await window.roam42.common.getBlocksReferringToThisPage(e);t.length?await dt("zh-CN"===navigator.language?`当前页面有${t.length}个引用，是否全部删除？`:`Current page has ${t.length} references, remove all?`)&&t.forEach((async e=>window.roam42.common.deleteBlock(e[0].uid))):window.iziToast.info({title:"zh-CN"===navigator.language?"该页面没有引用":"This page has no reference",position:"topCenter",timeout:2e3})}},{text:"Extract currentPage's refers",key:"Extract currentPage's refers",help:"<b>提取当前页面的所有引用，复制到剪切板</b>适合提取在 daily notes 记录的加了相同双链的内容，进入该双链执行本菜单任务，会得到以日期为一级标题的文本<br/>适用范围：页面标题",onClick:async({pageTitle:e})=>{const t=await window.roam42.common.getBlocksReferringToThisPage(e);if(!t.length)return void window.iziToast.info({position:"topCenter",title:"zh-CN"===navigator.language?"提取不到东西":"Can't extract anything"});function n(e,t=2){return`${e.string}\n              ${e.children?e.children.map((e=>"    ".repeat(t)+n(e,t+1))).join("\n"):""}`}const o=t.reduce(((e,t)=>(e[t[0].uid]=t,e)),{}),r=(await window.roam42.common.getPageNamesFromBlockUidList(t.map((e=>e[0].uid)))).sort(((e,t)=>+new Date(e[1].uid)&&+new Date(t[1].uid)&&+new Date(e[1].uid)>+new Date(t[1].uid)?1:-1)).reduce(((e,t,n)=>{const o=t[1].uid;return e[o]=[...e[o]||[],{...t[0],title:t[1].title}],e}),{}),a=Object.keys(r).map((e=>`${r[e][0].title}\n          ${r[e].map((e=>{const t=e.uid;return"    "+n(o[t][0])})).join("\n")}`)).join("\n");await navigator.clipboard.writeText(a),window.iziToast.info({position:"topCenter",title:"zh-CN"===navigator.language?"提取成功，已复制到剪切板":"Extract successfullly, Copied to clipboard!"})}}],vt=[{text:"Focus on page",key:"Focus on page",help:"<b>聚焦到该页面(左侧打开)</b><br/>适用范围：侧边栏内的页面标题",onClick:async({pageTitle:e})=>{await window.roam42.common.navigateUiTo(e)}},...yt,...bt];const kt=Qe((e=>{const t={},n=e=>{e.forEach((e=>{e.children?n(e.children):t[e.key]=e}))};return n(e),t})),Bt=(e,t)=>{let n;switch(e){case"block":n=kt(ft);break;case"pageTitle":n=kt(bt);break;case"pageTitle_sidebar":n=kt(vt)}Object.keys(t).forEach((e=>{n[e]&&console.warn(`[menu]: ${e} 已存在，将覆盖 menu`)})),kt.cache.set(ft,{...n,...t})};async function _t(e,t){return e&&e.length?await Promise.all(e.map((async e=>{var n;if(!(null===(n=e.children)||void 0===n?void 0:n.length))return{text:e.string,onClick:()=>{window.iziToast.info({title:"zh-CN"===navigator.language?"该菜单没有配置执行任务":"This menu has no configuration",position:"topCenter",timeout:2e3})}};const o=e.string.match(/\{\{(.*)\}\}/);return o?{text:o[1],onClick:async n=>{await async function(e,t,n){const{currentUid:o,pageTitle:r}=n;let a;o?a=o:r&&(a=await window.roam42.common.getPageUidByTitle(r));let i={};const c=async(e,o)=>{for(const r of o.sort(((e,t)=>e.order-t.order))){const o=await gt(e,r,t,n,i);r.children&&c(o||e,r.children)}};await c(a,e),i={}}(e.children.sort(((e,t)=>e.order-t.order)),t,n)}}:{text:e.string,children:await _t(e.children,t)}}))):[]}async function Ct(e,t,n){const o=e.find((e=>e.string.includes(t)));if(o){const e=o&&o.children.sort(((e,t)=>e.order-t.order))||[];return await _t(e,kt(n))}return n}!function(e,t="",n=10){let o=0;!async function e(r){var a,i;try{await r()}catch(c){console.log(`[${t}] error`,{e:c}),o<n?setTimeout((()=>(o++,e(r))),2e3):(console.log(`[${t}] error 超出次数加载失败，停止重试`),null===(i=null===(a=window.roam42)||void 0===a?void 0:a.help)||void 0===i||i.displayMessage(`${t}加载失败`,2e3))}}(e)}((()=>{const e={...kt(ft),...kt(bt),...kt(vt)};window.roam42.smartBlocks.customCommands.push(...Object.keys(e).map((t=>({key:`<roamEnhance's menu:${t}>`,icon:"gear",processor:"static",value:`<menu:${t}>`,..."zh-CN"===navigator.language&&e[t].help?{help:e[t].help}:{}}))))}),"register menu into smartBlock");const xt={},Et=(e,t="")=>e.map((e=>e.children&&e.children.length?`<li class="bp3-submenu">\n                        <span class="bp3-popover-wrapper">\n                            <span class="bp3-popover-target">\n                                <a class="bp3-menu-item" tabindex="0" data-key="${t+e.text}">\n                                    <div class="bp3-text-overflow-ellipsis bp3-fill">${e.text}</div>\n                                    <span icon="caret-right" class="bp3-icon bp3-icon-caret-right">\n                                        <svg data-icon="caret-right" width="16" height="16" viewBox="0 0 16 16">\n                                            <desc>caret-right</desc><path d="M11 8c0-.15-.07-.28-.17-.37l-4-3.5A.495.495 0 006 4.5v7a.495.495 0 00.83.37l4-3.5c.1-.09.17-.22.17-.37z" fill-rule="evenodd">\n                                            </path>\n                                        </svg>\n                                    </span>\n                                </a>\n                            </span>\n                            <div class="bp3-overlay bp3-overlay-inline">\n                                <div class="bp3-transition-container bp3-popover-appear-done bp3-popover-enter-done" style="position: absolute; will-change: transform; top: 0px; left: 100%; /*transform: translate3d(183px, 0px, 0px);*/">\n                                    <div class="bp3-popover bp3-minimal bp3-submenu" style="transform-origin: left center;">\n                                        <div class="bp3-popover-content">\n                                            <ul class="bp3-menu">\n                                                ${Et(e.children,t+(e.key||e.text))}\n                                            </ul>\n                                        </div>\n                                    </div>\n                                </div>\n                            </div>\n                        </span>\n                    </li>`:(xt[t+(e.key||e.text)]=e.onClick,`<li>\n                        <a class="bp3-menu-item bp3-popover-dismiss" data-key="${t+(e.key||e.text)}">\n                            <div class="bp3-text-overflow-ellipsis bp3-fill">${e.text}</div>\n                        </a>\n                    </li>`))).join("");var Tt,$t,zt,Ut;if(function(e,t){void 0===t&&(t={});var n=t.insertAt;if(e&&"undefined"!=typeof document){var o=document.head||document.getElementsByTagName("head")[0],r=document.createElement("style");r.type="text/css","top"===n&&o.firstChild?o.insertBefore(r,o.firstChild):o.appendChild(r),r.styleSheet?r.styleSheet.cssText=e:r.appendChild(document.createTextNode(e))}}(".bp3-submenu .bp3-overlay:not(.bp3-overlay-open) {\n  display: none;\n}\n.bp3-submenu > .bp3-popover-wrapper {\n  position: relative;\n}\n.iziToast > .iziToast-body .iziToast-buttons {\n  float: none;\n  text-align: center;\n  margin-left: -28px;\n}\n.iziToast > .iziToast-body .iziToast-icon {\n  top: 20px;\n}\n.iziToast-buttons .iziToast-buttons-child {\n  top: 6px;\n}\n"),window.yoyo)window.roamEnhance={...window.yoyo,...ht,...window.roamEnhance||{}},mt(null===(zt=window.roamEnhance)||void 0===zt?void 0:zt.plugins),pt(null===(Ut=window.roamEnhance)||void 0===Ut?void 0:Ut.dynamicMenu);else{window.roamEnhance={...ht,...window.roamEnhance},window.roamEnhance.dependencyMap={plugin:{metadata:["react","react-dom"],video:["arrive"],"link-favicon":["arrive"],"filter-button":["arrive"],"table-of-content":["arrive"]},dynamicMenu:{"pull-zhihu":["react","react-dom"]}},window.roamEnhance.loaded=new Set,window.roamEnhance._plugins={},window.roamEnhance._dynamicMenu={},window.roamEnhance.contextMenu={menus:{commonMenu:yt,blockMenu:ft,pageTitleMenu:bt,pageTitleMenu_Sidebar:vt},onClickArgs:{},registerMenu:new Set,registerMenuCommand:Bt,dynamicMenu:{loaded:new Set}},window.roamEnhance.contextMenu.registerMenu=new Set;const e=window.roamEnhance.host=document.currentScript.src.replace("main.js","");ut(`${e}libs/react.js`,{id:"roamEnhance-lib-react",name:"react",async:!1}),ut(`${e}libs/react-dom.js`,{id:"roamEnhance-lib-react-dom",name:"react-dom",async:!1}),mt(null===(Tt=window.roamEnhance)||void 0===Tt?void 0:Tt.plugins),pt(null===($t=window.roamEnhance)||void 0===$t?void 0:$t.dynamicMenu),function(){let e,t;document.addEventListener("mousedown",(n=>{2===n.button&&(e=n.clientX,t=n.clientY)})),new MutationObserver((async(o,a)=>{if(o.find((e=>"childList"===e.type&&("bp3-context-menu"===e.target.className||"bp3-context-menu-popover-target"===e.target.className)))){o.find((e=>"childList"===e.type&&e.removedNodes.length>0&&"bp3-portal"===e.target.className))&&(window.roamEnhance.contextMenu.onClickArgs={});let a=o.find((e=>"childList"===e.type&&e.addedNodes.length>0&&"bp3-portal"===e.target.className));if(a){window.roamEnhance.contextMenu.onClickArgs={};const o=document.elementsFromPoint(e,t),i={};let c=null;i.target=o[1];const l=o.find((e=>e.classList.contains("rm-block-main")));l&&(i.currentUid=n(l.querySelector(".rm-block__input").id),c="block");const s=o.find((e=>e.classList.contains("rm-title-display")));s&&(i.pageTitle=s.innerText,i.currentUid=await window.roam42.common.getPageUidByTitle(i.pageTitle),c=o.find((e=>e.classList.contains("sidebar-content")))?"pageTitle_sidebar":"pageTitle");const d=await async function(e,t,n){const o=await window.roam42.common.getPageUidByTitle("roam/enhance/menu");let r;if(o){const e=await window.roam42.common.getBlockInfoByUID(o,!0);e&&(r=e[0][0].children.sort(((e,t)=>e.order-t.order)))}if(!r)return;let a=[];return"block"===t?a=await Ct(r,"BlockMenu",ft):"pageTitle"===t?a=await Ct(r,"PageTitleMenu",bt):"pageTitle_sidebar"===t&&(a=await Ct(r,"PageTitleMenu_Sidebar",vt)),"roam/enhance/menu"===n.pageTitle&&a.push({text:"Pull all build-in menu",onClick:async()=>{const e=await window.roam42.common.getPageUidByTitle("roam/enhance/menu"),t=e=>e.map((e=>e.children?{...e,children:t(e.children)}:{...e,text:`{{${e.text}}}`,children:[{text:`<%menu:${e.key}%>`}]}));ot(e,[{text:"**BlockMenu**",children:t(ft)},{text:"**PageTitleMenu**",children:t(bt)},{text:"**PageTitleMenu_Sidebar**",children:t(vt)}])}},{text:"Pull unused build-in menu",onClick:async({currentUid:e})=>{const t=[];await ht.utils.patchBlockChildren(e,(e=>{const n=e.string.match(/<%\s*menu:\s*(.*)\s*%>/);n&&t.push(n[1])}));const n=Object.keys({...kt(ft),...kt(bt),...kt(vt)}),o=Je(n,t).map((e=>`<%menu:${e}%>`));o.length?await ht.common.batchCreateBlocks(e,0,o):window.iziToast.info({position:"topCenter",title:"zh-CN"===navigator.language?"当前没有未使用的内置菜单":"No unused build-in menu found"})}}),await Promise.all([...window.roamEnhance.contextMenu.registerMenu].map((async e=>{await e(a,t,n)}))),a}(0,c,i);i.selectUids=r(),window.roamEnhance.contextMenu.onClickArgs=i,d&&function(e,t,n){const o=document.createElement("template");o.innerHTML=Et(t),[...o.content.childNodes].forEach((e=>{e.addEventListener("click",(async e=>{const t=e.target;if(t.classList.contains("bp3-menu-item")||t.classList.contains("bp3-fill")&&t.classList.contains("bp3-text-overflow-ellipsis")){const o=xt[t.closest(".bp3-menu-item").dataset.key];if(o)try{await o(n)}catch(e){console.log(e),window.iziToast.error({title:"操作失败",position:"topCenter",timeout:3e3})}}})),[...e.querySelectorAll(".bp3-popover-wrapper")].forEach((e=>{e.addEventListener("mouseenter",(async e=>{const t=e.target;t.parentNode.classList.contains("bp3-submenu")&&(t.querySelector(".bp3-popover-target").classList.add("bp3-popover-open"),t.querySelector(".bp3-overlay").classList.add("bp3-overlay-open"))})),e.addEventListener("mouseleave",(async e=>{const t=e.target;t.parentNode.classList.contains("bp3-submenu")&&(t.querySelector(".bp3-popover-target").classList.remove("bp3-popover-open"),t.querySelector(".bp3-overlay").classList.remove("bp3-overlay-open"))}))}))}));const r=document.createElement("li");r.className="bp3-menu-divider",o.content.childNodes[o.content.childNodes.length-1].after(r),e.prepend(o.content)}(a.target.querySelector("ul.bp3-menu"),d,i)}}})).observe(document.body,{attributes:!1,childList:!0,subtree:!0})}(),window.yoyo=window.roamEnhance}}();
