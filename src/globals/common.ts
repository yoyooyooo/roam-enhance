// @ts-nocheck
import * as utils from "./utils";

export const batchCreateBlocks = async (
  parent_uid: string,
  starting_block_order: number = 0,
  string_array_to_insert: string[],
  renderItem: (x: any) => string = (x) => x
) => {
  string_array_to_insert.forEach(async (item, counter) => {
    await window.roam42.common.createBlock(
      parent_uid,
      counter + starting_block_order,
      `${renderItem(item)}`
    );
  });
};

interface Menu {
  text: string;
  children: Menu[];
}
export const deepCreateBlock: (
  parentUid: string,
  array: Menu[],
  options?: {
    textKey?: string;
    childrenKey?: string;
    shouldOrder?: boolean;
    startOrder?: number;
  }
) => void = async (parentUid, array, options = {}) => {
  const {
    textKey = "text",
    childrenKey = "children",
    shouldOrder = false,
    startOrder = 0
  } = options;
  async function loop(parentUid: string, menu: Menu[], startOrder: number) {
    // @ts-ignore
    const list = shouldOrder ? menu.sort((a, b) => a.order - b.order) : menu;
    for (let i = 0; i < list.length; i++) {
      if (!parentUid) return;
      const a = list[i];
      const uid = await window.roam42.common.createBlock(parentUid, startOrder + i, a[textKey]);
      if (a[childrenKey]) {
        loop(uid, a[childrenKey], startOrder); // child sync is not necessary
      }
    }
  }
  await loop(parentUid, array, startOrder);
};

// copy template block and its'children to one block's child
export const copyTemplateBlock = async (
  parentUid: string,
  templateUidOrBlocks: string | Roam.Block[],
  startOrder = 0
) => {
  if (typeof templateUidOrBlocks === "string") {
    const info = await window.roam42.common.getBlockInfoByUID(templateUidOrBlocks);
    if (info) {
      deepCreateBlock(parentUid, info[0] as any, {
        textKey: "string",
        shouldOrder: true,
        startOrder
      });
    }
  } else {
    deepCreateBlock(parentUid, templateUidOrBlocks as any, {
      textKey: "string",
      shouldOrder: true,
      startOrder
    });
  }
};

// 当前页面标题，如果是聚焦模式，取第一个面包屑
export const getCurrentPageTitle = () =>
  utils.getValueInOrderIfError(
    [
      // 引用区看引用页面的标题
      () =>
        document.activeElement.closest(".rm-ref-page-view").querySelector(".rm-ref-page-view-title")
          .innerText,
      // daily note
      () =>
        document.activeElement.closest(".roam-log-page").querySelector(".rm-title-display")
          .innerText,
      // 特定页面
      () =>
        document.activeElement.closest(".roam-article").querySelector(".rm-title-display")
          .innerText,
      // 聚焦模式看面包屑
      () =>
        document.activeElement.closest(".roam-article").querySelector(".rm-zoom-item").innerText,
      // 侧边栏标题
      () =>
        document.activeElement.closest(".rm-sidebar-outline").querySelector(".rm-title-display")
          .innerText,
      // 侧边栏面包屑
      () =>
        document.activeElement.closest(".rm-sidebar-outline").querySelector(".rm-zoom-item")
          .innerText
    ],
    "xxx"
  );

export const getCurrentBlockUid = () => {
  let id = null;
  let res = null;

  try {
    id = document.querySelector("textarea.rm-block-input").id;
  } catch (e) {
    id = document.activeElement.id;
  }
  if (!id) {
    console.log("id 都获取不到");
    window.roam42.help.displayMessage("id 都获取不到", 2000);
  }

  res = utils.getBlockUidFromId(id);

  console.log("getCurrentBlockUid", { res, id });
  !res && window.roam42.help.displayMessage("获取不到当前 block uid", 2000);
  return res;
};

export const deleteCurrentBlock = async (uid = getCurrentBlockUid()) => {
  if (uid) {
    await window.roam42.common.deleteBlock(uid);
  }
};

export const getParentBlockNode = (dom = document.activeElement) => {
  try {
    return dom.closest(".rm-block-children").closest(".roam-block-container");
  } catch (e) {
    console.log("getParentBlockNode error", e);
    return null;
  }
};
export const getParentBlockUid = async (dom = document.activeElement) => {
  try {
    return (await window.roam42.common.getDirectBlockParentUid(getCurrentBlockUid())).parentUID;
  } catch (e) {
    console.log(e);
    window.roam42.help.displayMessage("getParentBlockUid 执行出错", 2000);
    return null;
  }
};
// 当前 block 的最后一个子 block 的 uid
export const getLastChildUidByNode = (containerNode) => {
  try {
    return containerNode
      .querySelector(".rm-block-children .roam-block-container:last-child")
      .querySelector(".rm-block-main .rm-block__input")
      .id.slice(-9);
  } catch (e) {
    console.log("getLastChildUid error", e);
    return null;
  }
};
export const getLastChildUidByUid = async (parentBlockUid = getParentBlockUid()) => {
  try {
    const childrenContent = await window.roam42.common.getBlockInfoByUID(parentBlockUid, true);
    return childrenContent[0][0].children.sort((a, b) => a.sort - b.sort).slice(-1)[0].uid;
  } catch (e) {
    console.log("getLastChildUid error", e);
    return null;
  }
};
// 需要 focus，当前 block 的最后一个相邻兄弟节点的 uid
export const getLastBilingBlockUid = async () => {
  try {
    return getLastChildUidByNode(getParentBlockNode());
  } catch (e) {
    console.log("getLastBilingBlockUid error", e);
    return null;
  }
};
// 当前 block 信息，主要获取 order 用，为了能在当前位置插入 block
export const getCurrentBlockInfo = async (
  currentBlockUid = getCurrentBlockUid(),
  withChild = false
) => {
  const currentBlockInfo = await window.roam42.common.getBlockInfoByUID(currentBlockUid, withChild);
  try {
    return currentBlockInfo[0][0];
  } catch (e) {
    console.log(currentBlockInfo);
    window.roam42.help.displayMessage("getCurrentBlockInfo 执行出错", 2000);
  }
};

// 处理前后的当前 block 状态，包括异步文案的显示与重置
export const outputBlocks = async (fn, options = {}) => {
  const { isAsync = false, deleteCurrentBlock = false } = options;
  const prevValue = document.activeElement.value;
  isAsync && (document.activeElement.value += "fetching...");
  try {
    const currentBlockUid = getCurrentBlockUid();
    const res = await fn({ currentBlockContent: prevValue, currentBlockUid });
    deleteCurrentBlock && window.roam42.common.deleteBlock(currentBlockUid);
    document.activeElement.value = prevValue;
    !deleteCurrentBlock && window.roam42.common.updateBlock(getCurrentBlockUid(), prevValue);
    return res;
  } catch (e) {
    console.log("outputBlocks error", e);
    roam42.help.displayMessage("outputBlocks 执行出错", 2000);
  }
};
export const updateCurrentBlock = async (fn, options = {}) => {
  const { isAsync = false } = options;
  const prevValue = document.activeElement.value;
  isAsync && (document.activeElement.value += "fetching...");
  try {
    const currentBlockUid = getCurrentBlockUid();
    const res =
      typeof fn === "function" ? await fn({ currentBlockContent: prevValue, currentBlockUid }) : fn;
    document.activeElement.value = res;
    window.roam42.common.updateBlock(currentBlockUid, res);
    return res;
  } catch (e) {
    console.log("updateCurrentBlock error", e);
    window.roam42.help.displayMessage("updateCurrentBlock 执行出错", 2000);
  }
};

export const outputListIntoOne = async ({
  title,
  output,
  parentBlockUid,
  order,
  sleep = 50,
  renderItem = (x) => x,
  customOutput
}) => {
  if (output && output.length > 0) {
    order = order || (await getCurrentBlockInfo()).order || 99999;
    const _parentBlockUid = parentBlockUid || (await getParentBlockUid());
    const uid = await window.roam42.common.createBlock(_parentBlockUid, order, title);
    if (customOutput) {
      customOutput(uid, order);
    } else {
      await batchCreateBlocks(uid, order, output, renderItem);
    }
  } else {
    console.log("outputListIntoOne", "output 为空");
  }
};
// [当前位置/当前位置的子级] 插入 block，传入数组可批量
export const outputBlocksRightHere = async (string0, options = {}) => {
  const {
    isAsync = false,
    deleteCurrentBlock = false,
    renderItem = (x) => x,
    toChild = false // 是否插入到当前 block 的子级
  } = options;
  await outputBlocks(
    async ({ currentBlockUid }) => {
      const uid = toChild ? currentBlockUid : await getParentBlockUid();
      const order = toChild ? 99999 : (await getCurrentBlockInfo(currentBlockUid)).order + 1;
      let string = typeof string0 === "function" ? await string0({ currentBlockUid }) : string0;
      if (Array.isArray(string)) {
        await batchCreateBlocks(uid, order, string, renderItem);
      } else {
        await window.roam42.common.createBlock(uid, order, renderItem(string));
      }
    },
    { isAsync, deleteCurrentBlock: toChild ? false : deleteCurrentBlock }
  );
};

// 收集某个 key 相关的标签列表
export const getTags = async (tagName: string) => {
  try {
    const refers = await window.roam42.common.getBlocksReferringToThisPage(tagName);
    const tags = (refers || [])
      .reduce((memo, r) => {
        // 合并当前行或者直系子层级包含的所有 tag
        return [
          ...memo,
          r[0],
          ...(r[0].children &&
          new RegExp(String.raw`((^\[\[${tagName}\]\]$|)|(${tagName}\:\:))`).test(r[0].string)
            ? r[0].children
            : [])
        ];
      }, [])
      .reduce((memo, a) => {
        return [...memo, ...utils.extractTags(a.string)];
      }, []);
    if (!tags.length) {
      window.roam42.help.displayMessage(`getOptions: ${tagName}获取不到索引`, 2000);
    }
    return utils.unique(tags);
  } catch (e) {
    console.log("getTags error", e);
    window.roam42.help.displayMessage("getTags 执行出错", 2000);
  }
};
