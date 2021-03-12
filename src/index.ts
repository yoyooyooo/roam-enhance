// @ts-nocheck
import "./contextmenu";
import roamEnhance from "./globals";
import "./index.css";
import { addScript } from "./utils/common";

if (!window.roamEnhance?.loaded) {
  window.roamEnhance = Object.assign(window.roamEnhance, roamEnhance);
  const host = (window.roamEnhance.host = document.currentScript.src.replace("main.js", ""));
  window.roamEnhance._plugins = {};
  if (window.roamEnhance?.plugins.length) {
    window.roamEnhance.plugins.forEach((pluginName) => {
      addScript(`${host}plugins/${pluginName}.js`, pluginName);
    });
  }

  window.roamEnhance.loaded = true;
  window.yoyo = window.roamEnhance;
}
