!function(){"use strict";!function(e,t,o={}){const{maxCount:s=5}=o;window.roamEnhance.loaded.add(e),function(e,t="",o=10){let s=0;!async function e(r){var i,n;try{await r()}catch(l){console.log(`[${t}] error`,{e:l}),s<o?setTimeout((()=>(s++,e(r))),2e3):(console.log(`[${t}] error 超出次数加载失败，停止重试`),null===(n=null===(i=window.roam42)||void 0===i?void 0:i.help)||void 0===n||n.displayMessage(`${t}加载失败`,2e3))}}(e)}((async()=>{await t({ctx:window.roamEnhance._plugins[e],name:e,options:window.roamEnhance._plugins[e].options||{}})}),e,s)}("save-scroll-position",(({ctx:e})=>{e.route=new class{constructor(){this.routes=[],this.offset=0,this.toRunAfterRendered=[],this.init(),this.listenPageRendered(),this.listenPageChange()}savePosition(e){e.offsetTop=document.querySelector(".rm-article-wrapper").scrollTop}resetPosition(e){this.toRunAfterRendered.push((()=>{document.querySelector(".rm-article-wrapper").scrollTop=e.offsetTop}))}goToTop(){this.toRunAfterRendered.push((()=>{document.querySelector(".rm-article-wrapper").scrollTop=0}))}init(){this.offset=0,this.routes=[{url:location.href}]}clearToRunAfterRendered(){for(console.log("clearToRunAfterRendered",this.toRunAfterRendered);this.toRunAfterRendered.length;)this.toRunAfterRendered.pop()()}listenPageRendered(){document.arrive(".roam-article",(e=>{this.clearToRunAfterRendered()}));new MutationObserver(((e,t)=>{e.find((e=>"roam-article"===e.target.className))&&this.clearToRunAfterRendered()})).observe(document.body,{attributes:!1,childList:!0,subtree:!0})}listenPageChange(){window.addEventListener("hashchange",(e=>{var t;this.routes.find((t=>t.url===e.newURL))&&console.log("qqq  怎么会有重复",JSON.stringify(this.routes),e);const o=this.routes[this.routes.length-1+this.offset];if(o){this.savePosition(o);const s=this.routes[this.routes.length-1+this.offset-1];if(s)if(s.url===e.newURL)this.resetPosition(s),this.offset--;else{const o={url:e.newURL,offsetTop:(null===(t=document.querySelector(".rm-article-wrapper"))||void 0===t?void 0:t.scrollTop)||0},r=this.routes[this.routes.length-1+this.offset+1];r&&this.offset<0?r.url!==e.newURL?(this.goToTop(),this.routes=[...this.routes.slice(0,this.offset),o],this.offset=0):(this.resetPosition(s),this.offset++):(this.goToTop(),this.routes.push(o))}else this.routes.push({url:e.newURL})}}))}}}))}();