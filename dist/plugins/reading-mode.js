!function(){"use strict";var e,n;e="reading-mode",n=()=>{(e=>{let n=document.getElementById(e);n&&n.remove();const t=document.createElement("template");t.innerHTML='<span id="id" title="当前:编辑模式" class="bp3-button bp3-minimal bp3-icon-edit pointer bp3-small"></span>',t.content.firstChild.onclick=()=>{const t=n.classList;if(t.contains("bp3-icon-edit")){t.remove("bp3-icon-edit"),t.add("bp3-icon-disable"),n.title="当前:阅读模式(禁用编辑)";const o=document.createElement("style");o.id=e+"-css",o.innerText='.rm-block__input{pointer-events: none;}.rm-block-main {cursor: not-allowed;}.bp3-tag,.bp3-small,.bp3-popover-wrapper,.rm-paren,.block__input img {pointer-events: auto;cursor: pointer;}.rm-page-ref[data-tag^="."]{display:none !important;}',document.getElementsByTagName("head")[0].appendChild(o),window.roam42.help.displayMessage("切换至阅读模式",2e3)}else t.add("bp3-icon-edit"),t.remove("bp3-icon-disable"),document.getElementById(e+"-css").remove(),window.roam42.help.displayMessage("切换至编辑模式",2e3)},n=t.content.firstChild;const o=document.querySelector(".rm-topbar"),a=document.querySelector(".rm-topbar .bp3-popover-wrapper");o.insertBefore(n,a)})("reading-mode")},window.roamEnhance._plugins[e]={},window.roamEnhance.loaded.add(e),function(e,n=""){let t=0;!async function e(o){var a;try{await o()}catch(o){console.log("[name] error",o),t<5&&setTimeout((()=>e(++t)),2e3),t>5&&(null===(a=window.roam42)||void 0===a||a.help.displayMessage(`${n}加载失败`,2e3))}}(e)}((async()=>{await n({ctx:window.roamEnhance._plugins[e],name:e})}),e)}();
