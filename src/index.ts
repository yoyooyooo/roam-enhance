// @ts-nocheck
import "./contextmenu";
import roamEnhance from "./globals";
import "./index.css";
import { addScript } from "./utils/common";

if (!window.roamEnhance?.loaded) {
  const dependencyMap = {
    metadata: ["react", "react-dom"]
  };

  window.roamEnhance = Object.assign(window.roamEnhance || {}, roamEnhance);
  window.roamEnhance._plugins = {};
  // window.roamEnhance.libs = {};
  (window.roamEnhance.contextMenu = {}).registerMenu = new Set();

  const host = (window.roamEnhance.host = document.currentScript.src.replace("main.js", ""));

  if (window.roamEnhance?.plugins?.length) {
    const dependencies = window.roamEnhance.plugins.reduce((memo, pluginName) => {
      dependencyMap[pluginName]?.forEach((a) => memo.add(a));
      return memo;
    }, new Set<string>());

    dependencies.forEach((name) => {
      addScript(`${host}libs/${name}.js`, name, false);
    });

    window.roamEnhance.plugins.forEach((pluginName) => {
      addScript(`${host}plugins/${pluginName}.js`, pluginName, false);
    });
  }

  window.roamEnhance.loaded = true;
  window.yoyo = window.roamEnhance;
}
