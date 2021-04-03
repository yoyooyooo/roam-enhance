export const addStyle = (content: string, id: string) => {
  const old = document.getElementById(id);
  old && old.remove();
  const css = document.createElement("style");
  css.textContent = content;
  id && (css.id = id);
  document.getElementsByTagName("head")[0].appendChild(css);
  return css;
};

export function retry(fn: Function, name = "", maxCount = 10) {
  let n = 0;
  async function _retry(fn: Function) {
    try {
      await fn();
    } catch (e) {
      console.log(`[${name}] error`, { e });
      if (n < maxCount) {
        setTimeout(() => (n++, _retry(fn)), 2000);
      } else {
        console.log(`[${name}] error 超出次数加载失败，停止重试`);
        window.roam42?.help?.displayMessage(`${name}加载失败`, 2000);
      }
    }
  }

  _retry(fn);
}

export function runPlugin<T = any>(
  name: string,
  fn: (options: { ctx: T; name: string; options: any }) => void,
  options: { maxCount?: number } = {}
) {
  const { maxCount = 5 } = options;

  window.roamEnhance.loaded.add(name);
  retry(
    async () => {
      await fn({
        ctx: window.roamEnhance._plugins[name],
        name,
        options: window.roamEnhance._plugins[name].options || {}
      });
    },
    name,
    maxCount
  );
}

export function runDynamicMenu<T = any>(
  name: string,
  fn: (options: { ctx: T; name: string; options: any }) => void,
  options: { maxCount?: number } = {}
) {
  const { maxCount = 5 } = options;

  window.roamEnhance.contextMenu.dynamicMenu.loaded.add(name);
  retry(
    async () => {
      fn({
        ctx: window.roamEnhance._dynamicMenu[name],
        name,
        options: window.roamEnhance._dynamicMenu[name].options || {}
      });
    },
    name,
    maxCount
  );
}
