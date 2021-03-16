import "./contextmenu";
import roamEnhance from "./globals";
import { loadPlugins } from "./globals/loader";
import "./index.css";

if (!window.yoyo) {
  window.roamEnhance = { ...roamEnhance, ...(window.roamEnhance || {}) };
  window.roamEnhance.dependencyMap = {
    metadata: ["react", "react-dom"],
    video: ["arrive"],
    "link-favicon": ["arrive"]
  };
  window.roamEnhance.loaded = new Set<string>();
  window.roamEnhance._plugins = {};
  window.roamEnhance.contextMenu = {};
  window.roamEnhance.contextMenu.registerMenu = new Set();

  const host = (window.roamEnhance.host = (document.currentScript as HTMLScriptElement).src.replace(
    "main.js",
    ""
  ));

  loadPlugins(window.roamEnhance?.plugins, host);
  // previous window.roamEnhance
  window.yoyo = window.roamEnhance;
} else {
  window.roamEnhance = { ...window.yoyo, ...roamEnhance, ...(window.roamEnhance || {}) };
  // load diff plugin
  const set = new Set<string>(window.roamEnhance?.plugins || []);
  window.roamEnhance.loaded.forEach((pluginName) => set.delete(pluginName));
  set.size && loadPlugins([...set]);
}
