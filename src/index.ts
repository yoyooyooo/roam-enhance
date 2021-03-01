import "./index.css";
import "./globals";
import "./contextmenu";
import * as React from "react";

console.log({ React });

const css = document.createElement("link");
css.rel = "stylesheet";
css.type = "text/css";
css.href = "https://roam-enhance.vercel.app/main.css";
document.getElementsByTagName("head")[0].appendChild(css);
