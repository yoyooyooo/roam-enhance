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
  options?: { skipTop?: boolean; depth?: number }
) => Promise<void> = async (uid, fn, options = {}) => {
  let { skipTop = true, depth = Infinity } = options;
  const blocks = await window.roam42.common.getBlockInfoByUID(uid, true);
  let complete = false;
  const loop = (blocks: [[Roam.Block]] | Roam.Block[], depth: number, top = true) => {
    if (complete || !blocks) return false;
    blocks.forEach((a: Roam.Block | Roam.Block[]) => {
      const block = Array.isArray(a) ? a[0] : a;
      if (block.children && depth > 0) {
        loop(block.children, depth - 1, false);
      }
      if (skipTop ? !top : true) {
        if (fn(block) === false) {
          complete = true;
        }
      }
    });
  };
  loop(blocks, depth);
};

// 递归遍历子block
export const patchBlockChildrenSync: (
  uid: string,
  fn: Function,
  options?: { skipTop?: boolean; depth?: number }
) => Promise<void> = async (uid, fn, options = {}) => {
  let { skipTop = true, depth = Infinity } = options;
  const blocks = await window.roam42.common.getBlockInfoByUID(uid, true);
  let complete = false;
  const loop = async (blocks: [[Roam.Block]] | Roam.Block[], depth: number, top = true) => {
    if (complete || !blocks) return false;
    for (let i = 0; i < blocks.length; i++) {
      const a = blocks[i];
      const block = Array.isArray(a) ? a[0] : a;
      if (block.children && depth > 0) {
        await loop(block.children, depth - 1, false);
      }
      if (skipTop ? !top : true) {
        if ((await fn(block)) === false) {
          complete = true;
        }
      }
    }
  };
  await loop(blocks, depth);
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

export function flattenBlocks(block: Roam.Block[], filter?: (block: Roam.Block) => boolean) {
  return block.flatMap((a) => [
    ...((a.children && flattenBlocks(a.children, filter)) || []),
    ...(filter?.(a) === false ? [] : [a])
  ]);
}
