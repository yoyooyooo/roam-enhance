!function(){"use strict";new MutationObserver(((t,e)=>{for(let e of t)if("childList"===e.type){[...document.querySelectorAll("button")].forEach((t=>{t.setAttribute("content",t.innerText)}))}})).observe(document.body,{attributes:!1,childList:!0,subtree:!0}),function(t,e=""){let o=0;function n(t){var i;try{t()}catch(t){console.log("error",t),o<5&&setTimeout((()=>n(++o)),3e3),o>5&&(null===(i=window.roam42)||void 0===i||i.help.displayMessage(`${e}加载失败`,2e3))}}setTimeout((()=>n(t)),3e3)}((async()=>{const t=await window.roam42.common.getPageUidByTitle("roam/enhance/template-button");let e=(await window.roam42.common.getBlockInfoByUID(t,!0))[0][0].children;window.roamEnhance.contextMenu.registerMenu.add(((o,n,i)=>{"roam/enhance/template-button"===i.pageTitle&&o.unshift({text:"zh-CN"===navigator.language?"刷新配置":"refresh configure",onClick:async()=>{const o=await window.roam42.common.getBlockInfoByUID(t,!0);e=o[0][0].children}})})),document.addEventListener("click",(async t=>{const o=t.target;if("BUTTON"!==o.tagName||"bp3-button bp3-small dont-focus-block"!==o.className)return;let n;try{n=window.yoyo.utils.getBlockUidFromId(o.closest(".rm-block__input").id)}catch(t){return console.log(t),void window.roam42.help.displayMessage("找不到 uid",2e3)}n&&(null==e||e.forEach((async t=>{var e;if(o.innerText.trim()===t.string.trim()){const o=(null===(e=t.children)||void 0===e?void 0:e[0].string).match(/^\`\`\`javascript\n([\s\S]*)\`\`\`$/);if(o){const t=Object.getPrototypeOf((async function(){})).constructor;try{await new t("$currentUid",o[1])(n)}catch(t){console.log(t),window.iziToast.info({position:"topCenter",title:"zh-CN"===navigator.language?"执行错误":"task error"})}}}})))}))}),"template-button")}();
