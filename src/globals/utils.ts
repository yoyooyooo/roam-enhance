// 提取字符串中的标签
export const extractTags = (str: string) => {
  return str.match(/((?<=#?\[\[)(.*?)(?=\]\]))|((?<=#)\w+)/g) || [];
};

// 移除字符串中的标签,只移除带#的tag，避免匹配到句子中合理的页面引用以及{{[[TODO]]}}
export const removeTags = (str: string) => {
  return str.replace(/(#\[\[(.*?)\]\])|(#\w+)/g, "").trim();
};

// 递归遍历子block
export const patchBlockChildren: (
  uid: string,
  fn: Function,
  options?: { skipTop?: boolean }
) => void = async (uid, fn, options = {}) => {
  const { skipTop = true } = options;
  const blocks = await window.roam42.common.getBlockInfoByUID(uid, true);
  const loop = (blocks: [[Roam.Block]] | Roam.Block[], top = true) => {
    if (!blocks) return false;
    blocks.forEach((a) => {
      const block = Array.isArray(a) ? a[0] : a;
      if (block.children) {
        loop(block.children, false);
      }
      if (skipTop ? !top : true) {
        fn(block);
      }
    });
  };
  loop(blocks);
};

export const getValueInOrderIfError = (fns: Function[], defaultValue?: string) => {
  while (fns.length > 0) {
    const fn = fns.shift();
    try {
      return typeof fn === "function" ? fn() : fn;
    } catch (e) {}
  }
  return defaultValue;
};

export const getBlockUidFromId = (id: string) => {
  return getValueInOrderIfError(
    [
      () => id.match(/(?<=-).{9}$(?=[^-]*$)/)[0],
      () => (id.match(/uuid[^uuid]*(?=(uuid[^uuid]*){0}$)/) || id.match(/uuid.*$/))[0],
      () => id.slice(-9)
    ],
    ""
  );
};

export const unique = (array: string[]) => {
  if (!array || !array.length) return [];
  const temp = {};
  array.forEach((k) => (temp[k] = k));
  return Object.keys(temp);
};

export const getSelectBlockUids = () => {
  const ids = [
    ...document.querySelectorAll(".roam-block-container.block-highlight-blue")
  ].map((a) => getBlockUidFromId(a.querySelector(".rm-block__input").id));

  return [...new Set(ids)];
};