export function addScript(src: string, id: string, async = true) {
  const old = document.getElementById(id);
  old && old.remove();
  const s = document.createElement("script");
  s.src = src;
  id && (s.id = id);
  s.async = async;
  s.type = "text/javascript";
  document.getElementsByTagName("head")[0].appendChild(s);
}

export function registerPlugin(name: string, { ctx }: { ctx: any }) {
  window.roamEnhance._plugins[name] = {
    ctx
  };
}

export function loadPlugins(plugins: string[], host: string = window?.roamEnhance?.host || "/") {
  if (plugins?.length) {
    const dependencies = plugins.reduce((memo, pluginName) => {
      window.roamEnhance.dependencyMap[pluginName]?.forEach((a) => memo.add(a));
      return memo;
    }, new Set<string>());

    dependencies.forEach((name) => {
      addScript(`${host}libs/${name}.js`, `roamEnhance-lib-${name}`, false);
    });

    plugins.forEach((pluginName) => {
      addScript(`${host}plugins/${pluginName}.js`, `roamEnhance-plugin-${pluginName}`, false);
    });
  }
}
