!function(){"use strict";!function(e,t){void 0===t&&(t={});var n=t.insertAt;if(e&&"undefined"!=typeof document){var o=document.head||document.getElementsByTagName("head")[0],i=document.createElement("style");i.type="text/css","top"===n&&o.firstChild?o.insertBefore(i,o.firstChild):o.appendChild(i),i.styleSheet?i.styleSheet.cssText=e:i.appendChild(document.createTextNode(e))}}(".chang-font-button::before {\n  margin: 0;\n  font-size: 13px !important;\n}\n\n.chang-font-button {\n  display: inline-flex;\n  align-items: center;\n  vertical-align: text-top;\n}\n"),function(e,t=""){let n=0;function o(e){var i;try{e()}catch(e){console.log("error",e),n<5&&setTimeout((()=>o(++n)),3e3),n>5&&(null===(i=window.roam42)||void 0===i||i.help.displayMessage(`${t}加载失败`,2e3))}}setTimeout((()=>o(e)),3e3)}((()=>{(e=>{let t=+getComputedStyle(document.documentElement).getPropertyValue("font-size").match(/\d+/)[0];function n(e,n=20){document.documentElement.style.setProperty("--font-size",(e?++t:--t)+"px")}document.body.style.fontSize=`clamp(10px, var(--font-size, "${t}px"), 25px)`;let o=document.getElementById(e);o&&o.remove();const i=document.createElement("div");i.id=e,i.innerHTML=`<span class="chang-font-button bp3-button bp3-minimal bp3-icon-font pointer bp3-small">-</span><span id="${e}" class="chang-font-button bp3-button bp3-minimal bp3-icon-font pointer bp3-small">+</span>`,i.childNodes[0].onclick=()=>{n(!1)},i.childNodes[1].onclick=()=>{n(!0)};const c=document.querySelector(".rm-topbar"),l=document.querySelector(".rm-topbar .bp3-popover-wrapper");c.insertBefore(i,l)})("change-font")}),"change-font")}();
