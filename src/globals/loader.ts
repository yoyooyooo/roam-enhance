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

export function loadPlugins(plugins: string[], host: string = window?.roamEnhance?.host || "/") {
  if (plugins?.length) {
    const dependencies = plugins.reduce((memo, pluginName) => {
      window.roamEnhance.dependencyMap[pluginName]?.forEach((a) => memo.add(a));
      return memo;
    }, new Set<string>());

    dependencies.forEach((name) => {
      !window.roamEnhance.loaded.has(name) &&
        addScript(`${host}libs/${name}.js`, { id: `roamEnhance-lib-${name}`, name, async: false });
    });

    plugins.forEach((name) => {
      !window.roamEnhance.loaded.has(name) &&
        addScript(`${host}plugins/${name}.js`, {
          id: `roamEnhance-plugin-${name}`,
          name,
          async: false
        });
    });
  }
}
