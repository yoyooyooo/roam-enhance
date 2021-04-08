import { enhanceContextMenu } from "./contextmenu";
import {
  registerMenuCommand,
  commonMenu,
  blockMenu,
  pageTitleMenu,
  pageTitleMenu_Sidebar
} from "./contextmenu/menu";
import roamEnhance from "./globals";
import { addScript, loadPlugins, loadDynamicMenus } from "./globals/loader";
import "./index.css";

if (!window.yoyo) {
  window.roamEnhance = { ...roamEnhance, ...window.roamEnhance };
  window.roamEnhance.dependencyMap = {
    plugin: {
      metadata: ["react", "react-dom"],
      video: ["arrive"],
      "link-favicon": ["arrive"],
      "filter-button": ["arrive"],
      "table-of-content": ["arrive"]
    },
    dynamicMenu: {
      "Pull zhihu article": ["react", "react-dom"],
      "Show highlight": ["react", "react-dom"]
    }
  };
  window.roamEnhance.loaded = new Set<string>();
  window.roamEnhance._plugins = {};
  window.roamEnhance._dynamicMenu = {};
  window.roamEnhance.contextMenu = {
    menus: { commonMenu, blockMenu, pageTitleMenu, pageTitleMenu_Sidebar },
    onClickArgs: {},
    registerMenu: new Set(),
    registerMenuCommand,
    dynamicMenu: {
      loaded: new Set()
    }
  };
  window.roamEnhance.contextMenu.registerMenu = new Set();

  const host = (window.roamEnhance.host = (document.currentScript as HTMLScriptElement).src.replace(
    "main.js",
    ""
  ));

  // addScript(`${host}libs/react.js`, { id: `roamEnhance-lib-react`, name: "react", async: false });
  // addScript(`${host}libs/react-dom.js`, {
  //   id: `roamEnhance-lib-react-dom`,
  //   name: "react-dom",
  //   async: false
  // });

  loadPlugins(window.roamEnhance?.plugins);
  loadDynamicMenus(window.roamEnhance?.dynamicMenu);
  // previous window.roamEnhance

  enhanceContextMenu();
  window.yoyo = window.roamEnhance;
} else {
  window.roamEnhance = { ...window.yoyo, ...roamEnhance, ...(window.roamEnhance || {}) };
  // load diff plugin
  loadPlugins(window.roamEnhance?.plugins);
  loadDynamicMenus(window.roamEnhance?.dynamicMenu);
}
