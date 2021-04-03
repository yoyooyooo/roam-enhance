export function addScript(
  src: string,
  options: { id?: string; name?: string; async?: boolean } = {}
) {
  const { id = "", name = "", async = true } = options;
  const old = document.getElementById(id);
  old && old.remove();
  const s = document.createElement("script");
  s.src = src;
  id && (s.id = id);
  s.async = async;
  s.type = "text/javascript";
  if (name) {
    s.onload = () => {
      window.roamEnhance.loaded.add(name);
    };
  }
  document.getElementsByTagName("head")[0].appendChild(s);
}

export function registerPlugin(name: string, { ctx }: { ctx: any }) {
  window.roamEnhance._plugins[name] = {
    ctx
  };
}

export function loadPlugins(
  plugins: Array<string | string[]>,
  host: string = window?.roamEnhance?.host || "/"
) {
  if (plugins?.length) {
    const dependencies = plugins.reduce((memo, p) => {
      const pluginName = Array.isArray(p) ? p[0] : p;
      window.roamEnhance.dependencyMap.plugin[pluginName]?.forEach((a) => memo.add(a));
      return memo;
    }, new Set<string>());

    dependencies.forEach((name) => {
      !window.roamEnhance.loaded.has(name) &&
        addScript(`${host}libs/${name}.js`, { id: `roamEnhance-lib-${name}`, name, async: false });
    });

    plugins.forEach((p) => {
      let pluginName: string;
      let options: any;
      if (Array.isArray(p)) {
        pluginName = p[0];
        p[1] && (options = p[1]);
      } else {
        pluginName = p;
      }
      if (!window.roamEnhance._plugins[pluginName]) {
        window.roamEnhance._plugins[pluginName] = {};
      }
      options && (window.roamEnhance._plugins[pluginName].options = options);

      !window.roamEnhance.loaded.has(pluginName) &&
        addScript(`${host}plugins/${pluginName}.js`, {
          id: `roamEnhance-plugin-${pluginName}`,
          name: pluginName,
          async: false
        });
    });
  }
}

export function loadDynamicMenus(
  menus: Array<string | string[]>,
  host: string = window?.roamEnhance?.host || "/"
) {
  if (menus?.length) {
    const dependencies = menus.reduce((memo, p) => {
      const name = Array.isArray(p) ? p[0] : p;
      window.roamEnhance.dependencyMap.dynamicMenu[name]?.forEach((a) => memo.add(a));
      return memo;
    }, new Set<string>());

    dependencies.forEach((name) => {
      !window.roamEnhance.loaded.has(name) &&
        addScript(`${host}libs/${name}.js`, { id: `roamEnhance-lib-${name}`, name, async: false });
    });

    menus.forEach((p) => {
      let name: string;
      let options: any;
      if (Array.isArray(p)) {
        name = p[0];
        p[1] && (options = p[1]);
      } else {
        name = p;
      }
      if (!window.roamEnhance._dynamicMenu[name]) {
        window.roamEnhance._dynamicMenu[name] = {};
      }
      console.log("qqq", { options, name });

      options && (window.roamEnhance._dynamicMenu[name].options = options);

      !window.roamEnhance.contextMenu.dynamicMenu.loaded.has(name) &&
        addScript(`${host}dynamicMenu/${name.replace(/\s/g, "-")}.js`, {
          id: `roamEnhance-menu-${name}`,
          name: name,
          async: false
        });
    });
  }
}
