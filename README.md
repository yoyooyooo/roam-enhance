enhance roam research

## install

```js
const old = document.getElementById("roam-enhance");
old && old.remove();
const s = document.createElement("script");
s.src = "https://roam-enhance.vercel.app/main.js";
s.id = "roam-enhance";
s.async = true;
s.type = "text/javascript";
document.getElementsByTagName("head")[0].appendChild(s);
```
