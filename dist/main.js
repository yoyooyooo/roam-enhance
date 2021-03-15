!function(){"use strict";const e=e=>e.match(/((?<=#?\[\[)(.*?)(?=\]\]))|((?<=#)\w+)/g)||[],t=(e,t)=>{for(;e.length>0;){const t=e.shift();try{return"function"==typeof t?t():t}catch(e){}}return t},n=e=>t([()=>e.match(/(?<=-).{9}$(?=[^-]*$)/)[0],()=>(e.match(/uuid[^uuid]*(?=(uuid[^uuid]*){0}$)/)||e.match(/uuid.*$/))[0],()=>e.slice(-9)],""),o=e=>{if(!e||!e.length)return[];const t={};return e.forEach((e=>t[e]=e)),Object.keys(t)},r=()=>{const e=[...document.querySelectorAll(".roam-block-container.block-highlight-blue")].map((e=>n(e.querySelector(".rm-block__input").id)));return[...new Set(e)]};var i=Object.freeze({__proto__:null,extractTags:e,removeTags:e=>e.replace(/(#\[\[(.*?)\]\])|(#\w+)/g,"").trim(),patchBlockChildren:async(e,t,n={})=>{let{skipTop:o=!0,depth:r=1/0}=n;const i=await window.roam42.common.getBlockInfoByUID(e,!0);let a=!1;const c=(e,n,r=!0)=>{if(a||!e)return!1;e.forEach((e=>{const i=Array.isArray(e)?e[0]:e;i.children&&n>0&&c(i.children,n-1,!1),o&&r||!1===t(i)&&(a=!0)}))};c(i,r)},getValueInOrderIfError:t,getBlockUidFromId:n,unique:o,getSelectBlockUids:r,flattenBlocks:function e(t,n){return t.flatMap((t=>[...t.children&&e(t.children,n)||[],...!1===(null==n?void 0:n(t))?[]:[t]]))}}),a="object"==typeof global&&global&&global.Object===Object&&global,c="object"==typeof self&&self&&self.Object===Object&&self,l=a||c||Function("return this")(),s=l.Symbol,u=Object.prototype,d=u.hasOwnProperty,m=u.toString,p=s?s.toStringTag:void 0;var h=Object.prototype.toString;var g=s?s.toStringTag:void 0;function w(e){return null==e?void 0===e?"[object Undefined]":"[object Null]":g&&g in Object(e)?function(e){var t=d.call(e,p),n=e[p];try{e[p]=void 0;var o=!0}catch(e){}var r=m.call(e);return o&&(t?e[p]=n:delete e[p]),r}(e):function(e){return h.call(e)}(e)}function f(e){var t=typeof e;return null!=e&&("object"==t||"function"==t)}function y(e){if(!f(e))return!1;var t=w(e);return"[object Function]"==t||"[object GeneratorFunction]"==t||"[object AsyncFunction]"==t||"[object Proxy]"==t}var v,k=l["__core-js_shared__"],b=(v=/[^.]+$/.exec(k&&k.keys&&k.keys.IE_PROTO||""))?"Symbol(src)_1."+v:"";var _=Function.prototype.toString;var B=/^\[object .+?Constructor\]$/,C=Function.prototype,x=Object.prototype,T=C.toString,E=x.hasOwnProperty,z=RegExp("^"+T.call(E).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");function U(e){return!(!f(e)||(t=e,b&&b in t))&&(y(e)?z:B).test(function(e){if(null!=e){try{return _.call(e)}catch(e){}try{return e+""}catch(e){}}return""}(e));var t}function O(e,t){var n=function(e,t){return null==e?void 0:e[t]}(e,t);return U(n)?n:void 0}var $=O(Object,"create");var S=Object.prototype.hasOwnProperty;var j=Object.prototype.hasOwnProperty;function I(e){var t=-1,n=null==e?0:e.length;for(this.clear();++t<n;){var o=e[t];this.set(o[0],o[1])}}function P(e,t){for(var n,o,r=e.length;r--;)if((n=e[r][0])===(o=t)||n!=n&&o!=o)return r;return-1}I.prototype.clear=function(){this.__data__=$?$(null):{},this.size=0},I.prototype.delete=function(e){var t=this.has(e)&&delete this.__data__[e];return this.size-=t?1:0,t},I.prototype.get=function(e){var t=this.__data__;if($){var n=t[e];return"__lodash_hash_undefined__"===n?void 0:n}return S.call(t,e)?t[e]:void 0},I.prototype.has=function(e){var t=this.__data__;return $?void 0!==t[e]:j.call(t,e)},I.prototype.set=function(e,t){var n=this.__data__;return this.size+=this.has(e)?0:1,n[e]=$&&void 0===t?"__lodash_hash_undefined__":t,this};var N=Array.prototype.splice;function D(e){var t=-1,n=null==e?0:e.length;for(this.clear();++t<n;){var o=e[t];this.set(o[0],o[1])}}D.prototype.clear=function(){this.__data__=[],this.size=0},D.prototype.delete=function(e){var t=this.__data__,n=P(t,e);return!(n<0)&&(n==t.length-1?t.pop():N.call(t,n,1),--this.size,!0)},D.prototype.get=function(e){var t=this.__data__,n=P(t,e);return n<0?void 0:t[n][1]},D.prototype.has=function(e){return P(this.__data__,e)>-1},D.prototype.set=function(e,t){var n=this.__data__,o=P(n,e);return o<0?(++this.size,n.push([e,t])):n[o][1]=t,this};var M=O(l,"Map");function L(e,t){var n,o,r=e.__data__;return("string"==(o=typeof(n=t))||"number"==o||"symbol"==o||"boolean"==o?"__proto__"!==n:null===n)?r["string"==typeof t?"string":"hash"]:r.map}function A(e){var t=-1,n=null==e?0:e.length;for(this.clear();++t<n;){var o=e[t];this.set(o[0],o[1])}}A.prototype.clear=function(){this.size=0,this.__data__={hash:new I,map:new(M||D),string:new I}},A.prototype.delete=function(e){var t=L(this,e).delete(e);return this.size-=t?1:0,t},A.prototype.get=function(e){return L(this,e).get(e)},A.prototype.has=function(e){return L(this,e).has(e)},A.prototype.set=function(e,t){var n=L(this,e),o=n.size;return n.set(e,t),this.size+=n.size==o?0:1,this};function q(e){var t=-1,n=null==e?0:e.length;for(this.__data__=new A;++t<n;)this.add(e[t])}function R(e){return e!=e}function F(e,t){return!!(null==e?0:e.length)&&function(e,t,n){return t==t?function(e,t,n){for(var o=n-1,r=e.length;++o<r;)if(e[o]===t)return o;return-1}(e,t,n):function(e,t,n,o){for(var r=e.length,i=n+(o?1:-1);o?i--:++i<r;)if(t(e[i],i,e))return i;return-1}(e,R,n)}(e,t,0)>-1}function K(e,t,n){for(var o=-1,r=null==e?0:e.length;++o<r;)if(n(t,e[o]))return!0;return!1}function H(e,t){return e.has(t)}q.prototype.add=q.prototype.push=function(e){return this.__data__.set(e,"__lodash_hash_undefined__"),this},q.prototype.has=function(e){return this.__data__.has(e)};function Y(e,t,n,o){var r,i=-1,a=F,c=!0,l=e.length,s=[],u=t.length;if(!l)return s;n&&(t=function(e,t){for(var n=-1,o=null==e?0:e.length,r=Array(o);++n<o;)r[n]=t(e[n],n,e);return r}(t,(r=n,function(e){return r(e)}))),o?(a=K,c=!1):t.length>=200&&(a=H,c=!1,t=new q(t));e:for(;++i<l;){var d=e[i],m=null==n?d:n(d);if(d=o||0!==d?d:0,c&&m==m){for(var p=u;p--;)if(t[p]===m)continue e;s.push(d)}else a(t,m,o)||s.push(d)}return s}function G(e,t){for(var n=-1,o=t.length,r=e.length;++n<o;)e[r+n]=t[n];return e}function J(e){return null!=e&&"object"==typeof e}function V(e){return J(e)&&"[object Arguments]"==w(e)}var W=Object.prototype,X=W.hasOwnProperty,Q=W.propertyIsEnumerable,Z=V(function(){return arguments}())?V:function(e){return J(e)&&X.call(e,"callee")&&!Q.call(e,"callee")},ee=Array.isArray,te=s?s.isConcatSpreadable:void 0;function ne(e){return ee(e)||Z(e)||!!(te&&e&&e[te])}function oe(e,t,n,o,r){var i=-1,a=e.length;for(n||(n=ne),r||(r=[]);++i<a;){var c=e[i];t>0&&n(c)?t>1?oe(c,t-1,n,o,r):G(r,c):o||(r[r.length]=c)}return r}function re(e){return e}function ie(e,t,n){switch(n.length){case 0:return e.call(t);case 1:return e.call(t,n[0]);case 2:return e.call(t,n[0],n[1]);case 3:return e.call(t,n[0],n[1],n[2])}return e.apply(t,n)}var ae=Math.max;var ce=function(){try{var e=O(Object,"defineProperty");return e({},"",{}),e}catch(e){}}(),le=ce?function(e,t){return ce(e,"toString",{configurable:!0,enumerable:!1,value:(n=t,function(){return n}),writable:!0});var n}:re,se=Date.now;var ue,de,me,pe=(ue=le,de=0,me=0,function(){var e=se(),t=16-(e-me);if(me=e,t>0){if(++de>=800)return arguments[0]}else de=0;return ue.apply(void 0,arguments)});function he(e){return J(e)&&function(e){return null!=e&&function(e){return"number"==typeof e&&e>-1&&e%1==0&&e<=9007199254740991}(e.length)&&!y(e)}(e)}var ge=function(e,t){return pe(function(e,t,n){return t=ae(void 0===t?e.length-1:t,0),function(){for(var o=arguments,r=-1,i=ae(o.length-t,0),a=Array(i);++r<i;)a[r]=o[t+r];r=-1;for(var c=Array(t+1);++r<t;)c[r]=o[r];return c[t]=n(a),ie(e,this,c)}}(e,t,re),e+"")}((function(e,t){return he(e)?Y(e,oe(t,1,he,!0)):[]}));function we(e,t){if("function"!=typeof e||null!=t&&"function"!=typeof t)throw new TypeError("Expected a function");var n=function(){var o=arguments,r=t?t.apply(this,o):o[0],i=n.cache;if(i.has(r))return i.get(r);var a=e.apply(this,o);return n.cache=i.set(r,a)||i,a};return n.cache=new(we.Cache||A),n}we.Cache=A;var fe=Object.freeze({__proto__:null,testIfRoamDateAndConvert:e=>{try{return window.roam42.dateProcessing.testIfRoamDateAndConvert(e)}catch{return!1}}});const ye=async(e,t=0,n,o=(e=>e))=>{n.forEach((async(n,r)=>{await window.roam42.common.createBlock(e,r+t,`${o(n)}`)}))},ve=async(e,t,n={})=>{const{textKey:o="text",childrenKey:r="children",shouldOrder:i=!1,startOrder:a=0,afterCreateBlock:c,renderItem:l=(e=>e)}=n;let s=!1;await async function e(t,n,a){const u=i?n.sort(((e,t)=>e.order-t.order)):n;for(let n=0;n<u.length;n++){if(!t)return;const i=u[n],d=l(i[o],i);if(d){const o=await window.roam42.common.createBlock(t,a+n,d);(s||!1===(null==c?void 0:c(i,o)))&&(s=!0),i[r]&&e(o,i[r],a)}}}(e,t,a)},ke=()=>{let e=null,t=null;try{e=document.querySelector("textarea.rm-block-input").id}catch(t){e=document.activeElement.id}return e||(console.log("id 都获取不到"),window.roam42.help.displayMessage("id 都获取不到",2e3)),t=n(e),console.log("getCurrentBlockUid",{res:t,id:e}),!t&&window.roam42.help.displayMessage("获取不到当前 block uid",2e3),t},be=(e=document.activeElement)=>{try{return e.closest(".rm-block-children").closest(".roam-block-container")}catch(e){return console.log("getParentBlockNode error",e),null}},_e=async(e=document.activeElement)=>{try{return(await window.roam42.common.getDirectBlockParentUid(ke())).parentUID}catch(e){return console.log(e),window.roam42.help.displayMessage("getParentBlockUid 执行出错",2e3),null}},Be=e=>{try{return e.querySelector(".rm-block-children .roam-block-container:last-child").querySelector(".rm-block-main .rm-block__input").id.slice(-9)}catch(e){return console.log("getLastChildUid error",e),null}},Ce=async(e=ke(),t=!1)=>{const n=await window.roam42.common.getBlockInfoByUID(e,t);try{return n[0][0]}catch(e){console.log(n),window.roam42.help.displayMessage("getCurrentBlockInfo 执行出错",2e3)}},xe=async(e,t={})=>{const{isAsync:n=!1,deleteCurrentBlock:o=!1}=t,r=document.activeElement.value;n&&(document.activeElement.value+="fetching...");try{const t=ke(),n=await e({currentBlockContent:r,currentBlockUid:t});return o&&window.roam42.common.deleteBlock(t),document.activeElement.value=r,!o&&window.roam42.common.updateBlock(ke(),r),n}catch(e){console.log("outputBlocks error",e),roam42.help.displayMessage("outputBlocks 执行出错",2e3)}};function Te(e,t={}){return new Promise((n=>{window.iziToast.question({timeout:1e4,close:!1,overlay:!0,displayMode:1,id:"question",zindex:999,title:e,position:"topCenter",buttons:[[`<button><b>${"zh-CN"===navigator.language?"是":"YES"}</b></button>`,function(e,t){e.hide({transitionOut:"fadeOut"},t,"true")},!0],[`<button>${"zh-CN"===navigator.language?" 否":"NO"}</button>`,function(e,t){e.hide({transitionOut:"fadeOut"},t,"false")},!1]],onClosing:function(e,t,o){n("timeout"!==o&&JSON.parse(o))},...t})}))}var Ee={common:Object.freeze({__proto__:null,batchCreateBlocks:ye,deepCreateBlock:ve,copyTemplateBlock:async(e,t,n={})=>{const{startOrder:o=0,afterCreateBlock:r,renderItem:i,childrenKey:a,textKey:c}=n;if("string"==typeof t){const n=await window.roam42.common.getBlockInfoByUID(t,!0);n&&ve(e,n[0][0].children,{shouldOrder:!0,startOrder:o,textKey:c||"string",childrenKey:a||"children",afterCreateBlock:r,renderItem:i})}else ve(e,t,{textKey:c||"text",childrenKey:a||"children",shouldOrder:!0,startOrder:o,afterCreateBlock:r,renderItem:i})},getCurrentPageTitle:(e=document.activeElement)=>t([()=>e.closest(".rm-ref-page-view").querySelector(".rm-ref-page-view-title").innerText,()=>e.closest(".roam-log-page").querySelector(".rm-title-display").innerText,()=>e.closest(".roam-article").querySelector(".rm-title-display").innerText,()=>e.closest(".roam-article").querySelector(".rm-zoom-item").innerText,()=>e.closest(".rm-sidebar-outline").querySelector(".rm-title-display").innerText,()=>e.closest(".rm-sidebar-outline").querySelector(".rm-zoom-item").innerText],"404"),getCurrentBlockUid:ke,deleteCurrentBlock:async(e=ke())=>{e&&await window.roam42.common.deleteBlock(e)},getParentBlockNode:be,getParentBlockUid:_e,getLastChildUidByNode:Be,getLastChildUidByUid:async(e=_e())=>{try{return(await window.roam42.common.getBlockInfoByUID(e,!0))[0][0].children.sort(((e,t)=>e.sort-t.sort)).slice(-1)[0].uid}catch(e){return console.log("getLastChildUid error",e),null}},getLastBilingBlockUid:async()=>{try{return Be(be())}catch(e){return console.log("getLastBilingBlockUid error",e),null}},getCurrentBlockInfo:Ce,outputBlocks:xe,updateCurrentBlock:async(e,t={})=>{const{isAsync:n=!1}=t,o=document.activeElement.value;n&&(document.activeElement.value+="fetching...");try{const t=ke(),n="function"==typeof e?await e({currentBlockContent:o,currentBlockUid:t}):e;return document.activeElement.value=n,window.roam42.common.updateBlock(t,n),n}catch(e){console.log("updateCurrentBlock error",e),window.roam42.help.displayMessage("updateCurrentBlock 执行出错",2e3)}},outputListIntoOne:async({title:e,output:t,parentBlockUid:n,order:o,sleep:r=50,renderItem:i=(e=>e),customOutput:a})=>{if((null==t?void 0:t.length)>0){o=o||(await Ce()).order||99999;const r=n||await _e(),c=await window.roam42.common.createBlock(r,o,e);return a?a(c,o):await ye(c,o,t,i),c}console.log("outputListIntoOne","output 为空")},outputBlocksRightHere:async(e,t={})=>{const{isAsync:n=!1,deleteCurrentBlock:o=!1,renderItem:r=(e=>e),toChild:i=!1}=t;await xe((async({currentBlockUid:t})=>{const n=i?t:await _e(),o=i?99999:(await Ce(t)).order+1;let a="function"==typeof e?await e({currentBlockUid:t}):e;Array.isArray(a)?await ye(n,o,a,r):await window.roam42.common.createBlock(n,o,r(a))}),{isAsync:n,deleteCurrentBlock:!i&&o})},getTags:async t=>{try{const n=(await window.roam42.common.getBlocksReferringToThisPage(t)||[]).reduce(((e,n)=>[...e,n[0],...n[0].children&&new RegExp(String.raw`((^\[\[${t}\]\]$|)|(${t}\:\:))`).test(n[0].string)?n[0].children:[]]),[]).reduce(((t,n)=>[...t,...e(n.string)]),[]);return n.length||window.roam42.help.displayMessage(`getOptions: ${t}获取不到索引`,2e3),o(n)}catch(e){console.log("getTags error",e),window.roam42.help.displayMessage("getTags 执行出错",2e3)}}}),utils:i,dateProcessing:fe,help:Object.freeze({__proto__:null,confirm:Te,prompt:function(e,t={}){return new Promise((n=>{let o;window.iziToast.info({timeout:2e4,overlay:!0,displayMode:1,id:"inputs",zindex:999,title:e,position:"topCenter",drag:!1,inputs:[['<input type="text">',"keyup",function(e,t,n,r){o=n.value},!0]],buttons:[["<button><b>YES</b></button>",function(e,t){e.hide({transitionOut:"fadeOut"},t,o)},!1],["<button>NO</button>",function(e,t){e.hide({transitionOut:"fadeOut"},t,"")},!1]],onClosing:function(e,t,o){n("timeout"!==o&&o||"")},...t})}))}}),loader:Object.freeze({__proto__:null,registerPlugin:function(e,{ctx:t}){window.roamEnhance._plugins[e]={ctx:t}}})};const ze=async(e,t,n,o,r)=>{var i,a;const{currentUid:c,selectUids:l,target:s,pageTitle:u}=o,d=t.string.match(/^\`\`\`javascript\n([\s\S]*)\`\`\`$/);if(d){const n=d[1],o=Object.getPrototypeOf((async function(){})).constructor;try{const a=await new o("$ctx","$currentUid","$selectUids","$target","$pageTitle",n)(r,c,l,s,u);return(null===(i=t.children)||void 0===i?void 0:i.length)||a?await window.roam42.common.createBlock(e,t.order,`${a||""}`):void 0}catch(e){return console.log(e),void window.iziToast.info({position:"topCenter",title:"zh-CN"===navigator.language?"执行错误":"task error"})}}const m=t.string.match(/<%\s*menu:\s*(.*)\s*%>/);if(!m)return await window.roam42.common.createBlock(e,t.order,await window.roam42.smartBlocks.proccessBlockWithSmartness(t.string));{const e=n[m[1]];e?null===(a=e.onClick)||void 0===a||a.call(e,o):window.iziToast.error({title:"zh-CN"===navigator.language?`不存在 menu: ${m[1]}`:`no menu named${m[1]} found`,position:"topCenter",timeout:3e3})}};let Ue=[{text:"All children's highlight",key:"Extract All children's highlight",onClick:async({currentUid:e})=>{let t=[];await Ee.utils.patchBlockChildren(e,(e=>{const n=e.string.match(/\^\^([\s\S]*?)\^\^/g);n&&t.push(...n)})),await navigator.clipboard.writeText(t.join("\n")),t.length>0?window.iziToast.success({title:"zh-CN"===navigator.language?"提取高亮成功，已复制到剪切板":"Extract successfully, Copied to clipboard!"}):window.iziToast.info({position:"topCenter",title:"zh-CN"===navigator.language?"提取不到高亮内容":"Can't extract anything"})}}],Oe=[...Ue,{text:"Delete",key:"Delete",children:[{text:"Delete block and its references",key:"Delete block and its references",onClick:async({currentUid:e,selectUids:t})=>{await Te("zh-CN"===navigator.language?"确定删除当前所选 block 及其所有块引用":"Sure to delete the current block and its all references??")&&[e,...t].forEach((async e=>{const t=await window.roam42.common.getBlocksReferringToThisBlockRef(e);t.length>0&&t.forEach((async e=>window.roam42.common.deleteBlock(e[0].uid))),window.roam42.common.deleteBlock(e)}))}},{text:"Delete current block and embed block's refers",key:"Delete current block and embed block's refers",onClick:async({currentUid:e})=>{try{const t=(await Ee.common.getCurrentBlockInfo(e)).string.match(/\{\{\[\[embed\]\]\:\s+\(\(\(\((.*?)\)\)\)\)\}\}/);if(t){const e=t[1],n=await window.roam42.common.getBlocksReferringToThisBlockRef(e);n.length>0&&await Te(`该 block 包含有 embed，embed 原 block有${n.length}个块引用，是否一起删除`)&&(n.forEach((async e=>window.roam42.common.deleteBlock(e[0].uid))),window.roam42.common.deleteBlock(e),window.roam42.help.displayMessage(`删除${n.length}个引用`,2e3),window.iziToast.info({position:"topCenter",title:"zh-CN"===navigator.language?`删除${n.length}个引用`:`delete${n.length} references`}))}window.roam42.common.deleteBlock(e)}catch(e){console.log(e),window.iziToast.error({title:"zh-CN"===navigator.language?"删除出错":"Delete failed"})}}}]},{text:"Format",key:"Format",children:[{text:"Remove tags",key:"Remove tags",onClick:async({currentUid:e,selectUids:t})=>{[e,...t].forEach((async e=>{const t=await Ee.common.getCurrentBlockInfo(e);await window.roam42.common.updateBlock(e,Ee.utils.removeTags(t.string))}))}},{text:"Split block",key:"Split block",onClick:async({currentUid:e})=>{const t=await window.roam42.common.getBlockInfoByUID(e),{parentUID:n}=await window.roam42.common.getDirectBlockParentUid(e),o=t[0][0].string.split("\n");window.roam42.common.deleteBlock(t[0][0].uid),await window.roam42.common.batchCreateBlocks(n,t[0][0].order,o)}},{text:"Merge blocks",key:"Merge blocks",onClick:async({currentUid:e,selectUids:t})=>{if(t.length<2)return;const n=await Promise.all(t.map((async e=>(window.roam42.common.deleteBlock(e),(await window.roam42.common.getBlockInfoByUID(e))[0][0].string)))),{order:o,parentUID:r}=await window.roam42.common.getDirectBlockParentUid(e);window.roam42.common.createBlock(r,o+1,n.join("\n"))}}]},{text:"Format child blocks",key:"Format child blocks",children:[{text:"Embed to text",key:"Child embed to text",onClick:async({currentUid:e})=>{await Ee.utils.patchBlockChildren(e,(async e=>{const t=e.string.match(/\{\{\[\[embed\]\]\:\s+\(\(\(\((.*?)\)\)\)\)\}\}/),n=t&&t[1];if(n){const t=await window.roam42.common.getBlockInfoByUID(n);window.roam42.common.updateBlock(e.uid,t[0][0].string)}}))}},{text:"Remove tags",key:"Child blocks remove tags",onClick:async({currentUid:e})=>{Ee.utils.patchBlockChildren(e,(e=>{const t=Ee.utils.removeTags(e.string);t!==e.string&&window.roam42.common.updateBlock(e.uid,t)}))}},{text:"Merge blocks",key:"Merge child blocks",onClick:async({currentUid:e})=>{const t=+window.prompt("zh-CN"===navigator.language?"每多少行为一组进行合并？":"How many lines into one?");if(t){const n=window.prompt("zh-CN"===navigator.language?" 前缀？":"prefix?"),o=(await window.roam42.common.getBlockInfoByUID(e,!0))[0][0].children.sort(((e,t)=>e.order-t.order));let r="",i=0;for(let a=0;a<o.length;a++){const c=o[a];window.roam42.common.deleteBlock(c.uid),r+=`${r?"\n":""}${c.string}`,(a>t-2&&(a+1)%t==0||a===o.length-1)&&(window.roam42.common.createBlock(e,i++,`${n}${r}`),r="")}}}}]},{text:"Cloze",key:"Cloze",children:[{text:"Expand all",key:"Expand all cloze",onClick:async({target:e})=>{e.closest(".roam-block-container").querySelectorAll(".rm-block-children .rm-paren > .rm-spacer").forEach((e=>e.click()))}},{text:"Collapse all",key:"Collapse all cloze",onClick:async({target:e})=>{e.closest(".roam-block-container").querySelectorAll(".rm-block-children .rm-paren__paren").forEach((e=>e.click()))}}]}],$e=[...Ue,{text:"Clear current block/page",key:"Clear current block/page",onClick:async({currentUid:e})=>{if(await Ee.help.confirm("zh-CN"===navigator.language?"确定清空当前页/Block吗？":"Are you sure to clear the current block/page?")){(await window.roam42.common.getBlockInfoByUID(e,!0))[0][0].children.forEach((e=>{window.roam42.common.deleteBlock(e.uid)}))}}},{text:"Delete all refering blocks",key:"Delete all refering blocks",onClick:async({pageTitle:e})=>{const t=await window.roam42.common.getBlocksReferringToThisPage(e);t.length?await Te("zh-CN"===navigator.language?`当前页面有${t.length}个引用，是否全部删除？`:`Current page has ${t.length} references, remove all?`)&&t.forEach((async e=>window.roam42.common.deleteBlock(e[0].uid))):window.iziToast.info({title:"zh-CN"===navigator.language?"该页面没有引用":"This page has no reference",position:"topCenter",timeout:2e3})}},{text:"Extract currentPage's refers",key:"Extract currentPage's refers",onClick:async({pageTitle:e})=>{const t=await window.roam42.common.getBlocksReferringToThisPage(e);if(!t.length)return void window.iziToast.info({position:"topCenter",title:"zh-CN"===navigator.language?"提取不到东西":"Can't extract anything"});function n(e,t=2){return`${e.string}\n              ${e.children?e.children.map((e=>"    ".repeat(t)+n(e,t+1))).join("\n"):""}`}const o=t.reduce(((e,t)=>(e[t[0].uid]=t,e)),{}),r=(await window.roam42.common.getPageNamesFromBlockUidList(t.map((e=>e[0].uid)))).sort(((e,t)=>+new Date(e[1].uid)&&+new Date(t[1].uid)&&+new Date(e[1].uid)>+new Date(t[1].uid)?1:-1)).reduce(((e,t,n)=>{const o=t[1].uid;return e[o]=[...e[o]||[],{...t[0],title:t[1].title}],e}),{}),i=Object.keys(r).map((e=>`${r[e][0].title}\n          ${r[e].map((e=>{const t=e.uid;return"    "+n(o[t][0])})).join("\n")}`)).join("\n");await navigator.clipboard.writeText(i),window.iziToast.info({position:"topCenter",title:"zh-CN"===navigator.language?"提取成功，已复制到剪切板":"Extract successfullly, Copied to clipboard!"})}}],Se=[{text:"Focus on page",key:"Focus on page",onClick:async({pageTitle:e})=>{await window.roam42.common.navigateUiTo(e)}},...Ue,...$e];const je=we((e=>{const t={},n=e=>{e.forEach((e=>{e.children?n(e.children):t[e.key]=e}))};return n(e),t}));async function Ie(e,t){return e&&e.length?await Promise.all(e.map((async e=>{var n;if(!(null===(n=e.children)||void 0===n?void 0:n.length))return{text:e.string,onClick:()=>{window.iziToast.info({title:"zh-CN"===navigator.language?"该菜单没有配置执行任务":"This menu has no configuration",position:"topCenter",timeout:2e3})}};const o=e.string.match(/\{\{(.*)\}\}/);return o?{text:o[1],onClick:async n=>{await async function(e,t,n){const{currentUid:o,pageTitle:r}=n;let i;o?i=o:r&&(i=await window.roam42.common.getPageUidByTitle(r));const a=async(e,o)=>{for(const r of o.sort(((e,t)=>e.order-t.order))){const o=await ze(e,r,t,n,c);r.children&&a(o||e,r.children)}};let c={};await a(i,e),c={}}(e.children.sort(((e,t)=>e.order-t.order)),t,n)}}:{text:e.string,children:await Ie(e.children,t)}}))):[]}async function Pe(e,t,n){const o=e.find((e=>e.string.includes(t)));if(o){const e=o&&o.children.sort(((e,t)=>e.order-t.order))||[];return await Ie(e,je(n))}return n}const Ne={},De=(e,t="")=>e.map((e=>e.children&&e.children.length?`<li class="bp3-submenu">\n                        <span class="bp3-popover-wrapper">\n                            <span class="bp3-popover-target">\n                                <a class="bp3-menu-item" tabindex="0" data-key="${t+e.text}">\n                                    <div class="bp3-text-overflow-ellipsis bp3-fill">${e.text}</div>\n                                    <span icon="caret-right" class="bp3-icon bp3-icon-caret-right">\n                                        <svg data-icon="caret-right" width="16" height="16" viewBox="0 0 16 16">\n                                            <desc>caret-right</desc><path d="M11 8c0-.15-.07-.28-.17-.37l-4-3.5A.495.495 0 006 4.5v7a.495.495 0 00.83.37l4-3.5c.1-.09.17-.22.17-.37z" fill-rule="evenodd">\n                                            </path>\n                                        </svg>\n                                    </span>\n                                </a>\n                            </span>\n                            <div class="bp3-overlay bp3-overlay-inline">\n                                <div class="bp3-transition-container bp3-popover-appear-done bp3-popover-enter-done" style="position: absolute; will-change: transform; top: 0px; left: 100%; /*transform: translate3d(183px, 0px, 0px);*/">\n                                    <div class="bp3-popover bp3-minimal bp3-submenu" style="transform-origin: left center;">\n                                        <div class="bp3-popover-content">\n                                            <ul class="bp3-menu">\n                                                ${De(e.children,t+(e.key||e.text))}\n                                            </ul>\n                                        </div>\n                                    </div>\n                                </div>\n                            </div>\n                        </span>\n                    </li>`:(Ne[t+(e.key||e.text)]=e.onClick,`<li>\n                        <a class="bp3-menu-item bp3-popover-dismiss" data-key="${t+(e.key||e.text)}">\n                            <div class="bp3-text-overflow-ellipsis bp3-fill">${e.text}</div>\n                        </a>\n                    </li>`))).join("");let Me,Le;document.addEventListener("mousedown",(e=>{Me=e.clientX,Le=e.clientY}));new MutationObserver((async(e,t)=>{if(!!e.find((e=>"childList"===e.type&&("bp3-context-menu"===e.target.className||"bp3-context-menu-popover-target"===e.target.className)))){let t=e.find((e=>"childList"===e.type&&e.addedNodes.length>0&&"bp3-portal"===e.target.className));if(t){const e=document.elementsFromPoint(Me,Le),o={};let i=null;o.target=e[1];const a=e.find((e=>e.classList.contains("rm-block-main")));a&&(o.currentUid=n(a.querySelector(".rm-block__input").id),i="block");const c=e.find((e=>e.classList.contains("rm-title-display")));c&&(o.pageTitle=c.innerText,o.currentUid=await window.roam42.common.getPageUidByTitle(o.pageTitle),i=e.find((e=>e.classList.contains("sidebar-content")))?"pageTitle_sidebar":"pageTitle");const l=await async function(e,t,n){const o=await window.roam42.common.getPageUidByTitle("roam/enhance/menu");let r,i;if(o){const e=await window.roam42.common.getBlockInfoByUID(o,!0);e&&(r=e[0][0].children.sort(((e,t)=>e.order-t.order)))}if(r)return"block"===t?await Pe(r,"BlockMenu",Oe):("pageTitle"===t?i=await Pe(r,"PageTitleMenu",$e):"pageTitle_sidebar"===t&&(i=await Pe(r,"PageTitleMenu_Sidebar",Se)),"roam/enhance/menu"===n.pageTitle&&i.push({text:"Pull all build-in menu",onClick:async()=>{const e=await window.roam42.common.getPageUidByTitle("roam/enhance/menu"),t=e=>e.map((e=>e.children?{...e,children:t(e.children)}:{...e,text:`{{${e.text}}}`,children:[{text:`<%menu:${e.key}%>`}]}));ve(e,[{text:"**BlockMenu**",children:t(Oe)},{text:"**PageTitleMenu**",children:t($e)},{text:"**PageTitleMenu_Sidebar**",children:t(Se)}])}},{text:"Pull unused build-in menu",onClick:async({currentUid:e})=>{const t=[];await Ee.utils.patchBlockChildren(e,(e=>{const n=e.string.match(/<%\s*menu:\s*(.*)\s*%>/);n&&t.push(n[1])}));const n=Object.keys({...je(Oe),...je($e),...je(Se)}),o=ge(n,t).map((e=>`<%menu:${e}%>`));o.length?await Ee.common.batchCreateBlocks(e,0,o):window.iziToast.info({position:"topCenter",title:"zh-CN"===navigator.language?"当前没有未使用的内置菜单":"No unused build-in menu found"})}}),await Promise.all([...window.roamEnhance.contextMenu.registerMenu].map((async e=>{await e(i,t,n)}))),i)}(0,i,o);o.selectUids=r(),l&&function(e,t,n){const o=document.createElement("template");o.innerHTML=De(t),[...o.content.childNodes].forEach((e=>{e.addEventListener("click",(async e=>{const t=e.target;if(t.classList.contains("bp3-menu-item")||t.classList.contains("bp3-fill")&&t.classList.contains("bp3-text-overflow-ellipsis")){const o=Ne[t.closest(".bp3-menu-item").dataset.key];if(o)try{await o(n)}catch(e){console.log(e),window.iziToast.error({title:"操作失败",position:"topCenter",timeout:3e3})}}})),[...e.querySelectorAll(".bp3-popover-wrapper")].forEach((e=>{e.addEventListener("mouseenter",(async e=>{const t=e.target;t.parentNode.classList.contains("bp3-submenu")&&(t.querySelector(".bp3-popover-target").classList.add("bp3-popover-open"),t.querySelector(".bp3-overlay").classList.add("bp3-overlay-open"))})),e.addEventListener("mouseleave",(async e=>{const t=e.target;t.parentNode.classList.contains("bp3-submenu")&&(t.querySelector(".bp3-popover-target").classList.remove("bp3-popover-open"),t.querySelector(".bp3-overlay").classList.remove("bp3-overlay-open"))}))}))}));const r=document.createElement("li");r.className="bp3-menu-divider",o.content.childNodes[o.content.childNodes.length-1].after(r),e.prepend(o.content)}(t.target.querySelector("ul.bp3-menu"),l,o)}}})).observe(document.body,{attributes:!1,childList:!0,subtree:!0});var Ae,qe,Re;function Fe(e,t,n=!0){const o=document.getElementById(t);o&&o.remove();const r=document.createElement("script");r.src=e,t&&(r.id=t),r.async=n,r.type="text/javascript",document.getElementsByTagName("head")[0].appendChild(r)}if(function(e,t){void 0===t&&(t={});var n=t.insertAt;if(e&&"undefined"!=typeof document){var o=document.head||document.getElementsByTagName("head")[0],r=document.createElement("style");r.type="text/css","top"===n&&o.firstChild?o.insertBefore(r,o.firstChild):o.appendChild(r),r.styleSheet?r.styleSheet.cssText=e:r.appendChild(document.createTextNode(e))}}(".bp3-submenu .bp3-overlay:not(.bp3-overlay-open) {\n  display: none;\n}\n.bp3-submenu > .bp3-popover-wrapper {\n  position: relative;\n}\n.iziToast > .iziToast-body .iziToast-buttons {\n  float: none;\n  text-align: center;\n  margin-left: -28px;\n}\n.iziToast > .iziToast-body .iziToast-icon {\n  top: 20px;\n}\n.iziToast-buttons .iziToast-buttons-child {\n  top: 6px;\n}\n"),!(null===(Ae=window.roamEnhance)||void 0===Ae?void 0:Ae.loaded)){const e={metadata:["react","react-dom"],video:["arrive"]};window.roamEnhance=Object.assign(window.roamEnhance||{},Ee),window.roamEnhance._plugins={},(window.roamEnhance.contextMenu={}).registerMenu=new Set;const t=window.roamEnhance.host=document.currentScript.src.replace("main.js","");if(null===(Re=null===(qe=window.roamEnhance)||void 0===qe?void 0:qe.plugins)||void 0===Re?void 0:Re.length){window.roamEnhance.plugins.reduce(((t,n)=>{var o;return null===(o=e[n])||void 0===o||o.forEach((e=>t.add(e))),t}),new Set).forEach((e=>{Fe(`${t}libs/${e}.js`,e,!1)})),window.roamEnhance.plugins.forEach((e=>{Fe(`${t}plugins/${e}.js`,e,!1)}))}window.roamEnhance.loaded=!0,window.yoyo=window.roamEnhance}}();
