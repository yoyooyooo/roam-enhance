!function(){"use strict";var n,o;n="link-favicon",o=()=>{document.arrive(".roam-app div.rm-block__input a",{existing:!0},(n=>{n.hostname&&n.hostname!==document.location.hostname&&("*"==n.innerText?(n.style.background=`url(https://www.google.com/s2/favicons?sz=16&domain=${n.hostname}) right center no-repeat`,n.style.paddingRight="18px"):(n.style.background=`url(https://www.google.com/s2/favicons?sz=16&domain=${n.hostname}) left center no-repeat`,n.style.paddingLeft="20px"))}))},window.roamEnhance.loaded.add(n),function(n,o=""){let e=0;!async function n(a){var t;try{await a()}catch(i){console.log("[name] error",i),e<5&&setTimeout((()=>(e++,n(a))),2e3),e>5&&(null===(t=window.roam42)||void 0===t||t.help.displayMessage(`${o}加载失败`,2e3))}}(n)}((async()=>{await o({ctx:window.roamEnhance._plugins[n],name:n,options:window.roamEnhance._plugins[n].options||{}})}),n)}();
