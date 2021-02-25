import "./index.css";
import "./globals";
import "./contextmenu";

const css = document.createElement("link");
css.rel = "stylesheet";
css.herf = "https://roam-enhance.vercel.app/main.css";
document.getElementsByTagName("head")[0].appendChild(css);
