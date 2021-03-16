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
  function _retry(fn: any) {
    try {
      fn();
    } catch (e) {
      console.log("error", e);
      n < 5 && setTimeout(() => _retry(++n), 3000);
      n > 5 && window.roam42?.help.displayMessage(`${name}加载失败`, 2000);
    }
  }

  setTimeout(() => _retry(fn), 3000);
}

export function runPlugin(name: string, fn: () => void) {
  window.roamEnhance.loaded.add(name);
  retry(fn, name);
}
