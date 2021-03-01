import "./index.css";
import yoyo from "./globals";
import "./contextmenu";

// @ts-ignore
if (typeof window.yoyo == "undefined") {
  // @ts-ignore
  window.yoyo = yoyo;
  const css = document.createElement("link");
  css.rel = "stylesheet";
  css.type = "text/css";
  css.href = "https://roam-enhance.vercel.app/main.css";
  document.getElementsByTagName("head")[0].appendChild(css);
}
