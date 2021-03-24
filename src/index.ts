import "./contextmenu";
import roamEnhance from "./globals";
import { loadPlugins, addScript } from "./globals/loader";
import "./index.css";

if (!window.yoyo) {
  window.roamEnhance = { ...roamEnhance, ...window.roamEnhance };
  window.roamEnhance.dependencyMap = {
    metadata: ["react", "react-dom"],
    video: ["arrive"],
    "link-favicon": ["arrive"],
    "filter-button": ["arrive"]
  };
  window.roamEnhance.loaded = new Set<string>();
  window.roamEnhance._plugins = {};
  window.roamEnhance.contextMenu = {};
  window.roamEnhance.contextMenu.registerMenu = new Set();

  const host = window.roamEnhance.host = (document.currentScript as HTMLScriptElement).src.replace(
    "main.js",
    ""
  );

  addScript(`${host}libs/react.js`, { id: `roamEnhance-lib-react`, name: 'react', async: false });
  addScript(`${host}libs/react-dom.js`, { id: `roamEnhance-lib-react-dom`, name: 'react-dom', async: false });

  loadPlugins(window.roamEnhance?.plugins);
  // previous window.roamEnhance
  window.yoyo = window.roamEnhance;
} else {
  window.roamEnhance = { ...window.yoyo, ...roamEnhance, ...(window.roamEnhance || {}) };
  // load diff plugin
  loadPlugins(window.roamEnhance?.plugins);
}
