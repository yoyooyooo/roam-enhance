export const addStyle = (content: string, id: string) => {
  const old = document.getElementById(id);
  old && old.remove();
  const css = document.createElement("style");
  css.textContent = content;
  id && (css.id = id);
  document.getElementsByTagName("head")[0].appendChild(css);
  return css;
};

export function retry(fn: any, name = "") {
  let n = 0;
  async function _retry(fn: any) {
    try {
      await fn();
    } catch (e) {
      console.log("[name] error", e);
      n < 5 && setTimeout(() => _retry(++n), 2000);
      n > 5 && window.roam42?.help.displayMessage(`${name}加载失败`, 2000);
    }
  }

  _retry(fn);
}

export function runPlugin<T = any>(name: string, fn: (options: { ctx: T; name: string }) => void) {
  window.roamEnhance._plugins[name] = {};
  window.roamEnhance.loaded.add(name);
  retry(async () => {
    await fn({ ctx: window.roamEnhance._plugins[name], name });
  }, name);
}
