!function(){"use strict";var n,a;n="filter-button",a=()=>{document.arrive(".roam-app span.bp3-icon.bp3-icon-filter",{existing:!0},(n=>{"rgb(168, 42, 42)"===n.style.color?n.classList.add("filtering"):n.classList.remove("filtering")}))},window.roamEnhance._plugins[n]={},window.roamEnhance.loaded.add(n),function(n,a=""){let i=0;!async function n(e){var o;try{await e()}catch(e){console.log("[name] error",e),i<5&&setTimeout((()=>n(++i)),2e3),i>5&&(null===(o=window.roam42)||void 0===o||o.help.displayMessage(`${a}加载失败`,2e3))}}(n)}((async()=>{await a({ctx:window.roamEnhance._plugins[n],name:n})}),n)}();
