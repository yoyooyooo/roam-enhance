!function(){"use strict";!function(e,n){void 0===n&&(n={});var t=n.insertAt;if(e&&"undefined"!=typeof document){var o=document.head||document.getElementsByTagName("head")[0],i=document.createElement("style");i.type="text/css","top"===t&&o.firstChild?o.insertBefore(i,o.firstChild):o.appendChild(i),i.styleSheet?i.styleSheet.cssText=e:i.appendChild(document.createTextNode(e))}}(".chang-font-button::before {\n  margin: 0;\n  font-size: 13px !important;\n}\n\n.chang-font-button {\n  display: inline-flex;\n  align-items: center;\n  vertical-align: text-top;\n}\n"),function(e,n,t={}){const{maxCount:o=5}=t;window.roamEnhance.loaded.add(e),function(e,n="",t=10){let o=0;!async function e(i){var a;try{await i()}catch(c){console.log(`[${n}] error`,{e:c}),o<t?setTimeout((()=>(o++,e(i))),2e3):(console.log(`[${n}] error 超出次数加载失败，停止重试`),null===(a=window.roam42)||void 0===a||a.help.displayMessage(`${n}加载失败`,2e3))}}(e)}((async()=>{await n({ctx:window.roamEnhance._plugins[e],name:e,options:window.roamEnhance._plugins[e].options||{}})}),e,o)}("change-fontsize",(()=>{(e=>{let n=+getComputedStyle(document.documentElement).getPropertyValue("font-size").match(/\d+/)[0];function t(e,t=20){document.documentElement.style.setProperty("--font-size",(e?++n:--n)+"px")}document.body.style.fontSize=`clamp(10px, var(--font-size, "${n}px"), 25px)`;let o=document.getElementById(e);o&&o.remove();const i=document.createElement("div");i.id=e,i.innerHTML=`<span class="chang-font-button bp3-button bp3-minimal bp3-icon-font pointer bp3-small">-</span><span id="${e}" class="chang-font-button bp3-button bp3-minimal bp3-icon-font pointer bp3-small">+</span>`,i.childNodes[0].onclick=()=>{t(!1)},i.childNodes[1].onclick=()=>{t(!0)};const a=document.querySelector(".rm-topbar"),c=document.querySelector(".rm-topbar .bp3-popover-wrapper");a.insertBefore(i,c)})("change-font")}))}();
