if (typeof window.roam42 == "undefined") {
  window.yoyo = {};
  //======== utils
  yoyo.utils = {};

  // 提取字符串中的标签
  yoyo.utils.extractTags = (str) => {
    return str.match(/((?<=#?\[\[)(.*?)(?=\]\]))|((?<=#)\w+)/g) || [];
  };

  // 移除字符串中的标签,只移除带#的tag，避免匹配到句子中合理的页面引用以及{{[[TODO]]}}
  yoyo.utils.removeTags = (str) => {
    return str.replace(/(#\[\[(.*?)\]\])|(#\w+)/g, "").trim();
  };

  // 递归遍历子block
  yoyo.utils.patchBlockChildren = async (uid, fn, options = {}) => {
    const { skipTop = true } = options;
    const blocks = await roam42.common.getBlockInfoByUID(uid, true);
    const loop = (blocks, top = true) => {
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

  yoyo.utils.getValueInOrderIfError = (fns) => {
    while (fns.length > 0) {
      const fn = fns.shift();
      try {
        return typeof fn === "function" ? fn() : fn;
      } catch (e) {}
    }
  };

  yoyo.utils.getBlockUidFromId = (id) => {
    return yoyo.utils.getValueInOrderIfError(
      [
        () => id.match(/(?<=-).{9}$(?=[^-]*$)/)[0],
        () => (id.match(/uuid[^uuid]*(?=(uuid[^uuid]*){0}$)/) || id.match(/uuid.*$/))[0],
        () => id.slice(-9)
      ],
      ""
    );
  };

  yoyo.utils.unique = (array) => {
    if (!array || !array.length) return [];
    const temp = {};
    array.forEach((k) => (temp[k] = k));
    return Object.keys(temp);
  };

  //========覆盖 roam42
  yoyo.dateProcessing = {};

  yoyo.dateProcessing.testIfRoamDateAndConvert = (dateStr) => {
    try {
      return roam42.dateProcessing.testIfRoamDateAndConvert(dateStr);
    } catch {
      return false;
    }
  };

  //======== roam42
  yoyo.batchCreateBlocks = async (
    parent_uid,
    starting_block_order,
    string_array_to_insert,
    renderItem = (x) => x
  ) => {
    await string_array_to_insert.forEach(async (item, counter) => {
      await roam42.common.createBlock(
        parent_uid,
        counter + starting_block_order,
        `${renderItem(item)}`
      );
    });
  };
  //========
  // 当前页面标题，如果是聚焦模式，取第一个面包屑
  yoyo.getCurrentPageTitle = () =>
    yoyo.utils.getValueInOrderIfError([
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
          .innerText,
      "xxx"
    ]);

  yoyo.getCurrentBlockUid = () => {
    let id = null;
    let res = null;

    try {
      id = document.querySelector("textarea.rm-block-input").id;
    } catch (e) {
      id = document.activeElement.id;
    }
    if (!id) {
      console.log("id 都获取不到");
      roam42.help.displayMessage("id 都获取不到", 2000);
    }

    res = yoyo.utils.getBlockUidFromId(id);

    console.log("getCurrentBlockUid", { res, id });
    !res && roam42.help.displayMessage("获取不到当前 block uid", 2000);
    return res;
  };

  yoyo.triggerChildBlocks = async (uid, renderItem = (x) => x + " ", n = 0) => {
    const info = await roam42.common.getBlockInfoByUID(uid, true);
    const loop = (children) => {
      children.forEach((a) => {
        n++;
        yoyo.updateBlock(a.uid, renderItem(a.string));
        if (a.children) loop(a.children);
      });
    };
    loop(info[0][0].children);
    await roam42.common.sleep(1000);
    roam42.help.displayMessage(`触发${n}个 block 的更新`, 2000);
  };

  yoyo.deleteCurrentBlock = async (uid = yoyo.getCurrentBlockUid()) => {
    if (uid) {
      await roam42.common.deleteBlock(uid);
    }
  };

  yoyo.getParentBlockNode = (dom = document.activeElement) => {
    try {
      return dom.closest(".rm-block-children").closest(".roam-block-container");
    } catch (e) {
      console.log("getParentBlockNode error", e);
      return null;
    }
  };
  yoyo.getParentBlockUid = async (dom = document.activeElement) => {
    try {
      return (await roam42.common.getDirectBlockParentUid(yoyo.getCurrentBlockUid())).parentUID;
    } catch (e) {
      console.log(e);
      roam42.help.displayMessage("getParentBlockUid 执行出错", 2000);
      return null;
    }

    /*
      try {
          return dom
          .closest('.rm-block-children')
          .closest('.roam-block-container')
          .querySelector('.rm-block-main .rm-block__input')
          .id.slice(-9);
      } catch (e) {
          // console.log('getParentBlockUid1 error', e);
          try {
          return await roam42.common.currentPageUID();
          } catch (e) {
          console.log('getParentBlockUid2 error', e);
          return null;
          }
          return null;
      }*/
  };
  // 当前 block 的最后一个子 block 的 uid
  yoyo.getLastChildUidByNode = (containerNode) => {
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
  yoyo.getLastChildUidByUid = async (parentBlockUid = yoyo.getParentBlockUid()) => {
    try {
      const childrenContent = await roam42.common.getBlockInfoByUID(parentBlockUid, true);
      return childrenContent[0][0].children.sort((a, b) => a.sort - b.sort).slice(-1)[0].uid;
    } catch (e) {
      console.log("getLastChildUid error", e);
      return null;
    }
  };
  // 需要 focus，当前 block 的最后一个相邻兄弟节点的 uid
  yoyo.getLastBilingBlockUid = async () => {
    try {
      return yoyo.getLastChildUidByNode(yoyo.getParentBlockNode());
    } catch (e) {
      console.log("getLastBilingBlockUid error", e);
      return null;
    }
  };
  // 当前 block 信息，主要获取 order 用，为了能在当前位置插入 block
  yoyo.getCurrentBlockInfo = async (
    currentBlockUid = yoyo.getCurrentBlockUid(),
    withChild = false
  ) => {
    const currentBlockInfo = await roam42.common.getBlockInfoByUID(currentBlockUid, withChild);
    try {
      return currentBlockInfo[0][0];
    } catch (e) {
      console.log(currentBlockInfo);
      roam42.help.displayMessage("getCurrentBlockInfo 执行出错", 2000);
    }
  };

  // 处理前后的当前 block 状态，包括异步文案的显示与重置
  yoyo.outputBlocks = async (fn, options = {}) => {
    const { isAsync = false, deleteCurrentBlock = false } = options;
    const prevValue = document.activeElement.value;
    isAsync && (document.activeElement.value += "fetching...");
    try {
      const currentBlockUid = yoyo.getCurrentBlockUid();
      const res = await fn({ currentBlockContent: prevValue, currentBlockUid });
      deleteCurrentBlock && roamAlphaAPI.deleteBlock({ block: { uid: currentBlockUid } });
      document.activeElement.value = prevValue;
      !deleteCurrentBlock &&
        roamAlphaAPI.updateBlock({ block: { uid: yoyo.getCurrentBlockUid(), string: prevValue } });
      return res;
    } catch (e) {
      console.log("outputBlocks error", e);
      roam42.help.displayMessage("outputBlocks 执行出错", 2000);
    }
  };
  yoyo.updateCurrentBlock = async (fn, options = {}) => {
    const { isAsync = false } = options;
    const prevValue = document.activeElement.value;
    isAsync && (document.activeElement.value += "fetching...");
    try {
      const currentBlockUid = yoyo.getCurrentBlockUid();
      const res =
        typeof fn === "function"
          ? await fn({ currentBlockContent: prevValue, currentBlockUid })
          : fn;
      document.activeElement.value = res;
      roamAlphaAPI.updateBlock({ block: { uid: currentBlockUid, string: res } });
      return res;
    } catch (e) {
      console.log("updateCurrentBlock error", e);
      roam42.help.displayMessage("updateCurrentBlock 执行出错", 2000);
    }
  };

  yoyo.outputListIntoOne = async ({
    title,
    output,
    parentBlockUid,
    order,
    sleep = 50,
    renderItem = (x) => x,
    customOutput
  }) => {
    if (output && output.length > 0) {
      order = order || (await yoyo.getCurrentBlockInfo()).order || 99999;
      const _parentBlockUid = parentBlockUid || (await yoyo.getParentBlockUid());
      /*roamAlphaAPI.createBlock({
          location: { 'parent-uid': _parentBlockUid, order },
          block: { string: title }
          });
          await roam42.common.sleep(sleep);
          const uid = await yoyo.getLastChildUidByUid(_parentBlockUid);*/
      const uid = await roam42.common.createBlock(_parentBlockUid, order, title);
      if (customOutput) {
        customOutput(uid, order);
      } else {
        await yoyo.batchCreateBlocks(uid, order, output, renderItem);
      }
    } else {
      console.log("outputListIntoOne", "output 为空");
    }
  };
  // [当前位置/当前位置的子级] 插入 block，传入数组可批量
  yoyo.outputBlocksRightHere = async (string0, options = {}) => {
    const {
      isAsync = false,
      deleteCurrentBlock = false,
      renderItem = (x) => x,
      toChild = false // 是否插入到当前 block 的子级
    } = options;
    await yoyo.outputBlocks(
      async ({ currentBlockUid }) => {
        const uid = toChild ? currentBlockUid : await yoyo.getParentBlockUid();
        const order = toChild ? 99999 : (await yoyo.getCurrentBlockInfo(currentBlockUid)).order + 1;
        let string = typeof string0 === "function" ? await string0({ currentBlockUid }) : string0;
        if (Array.isArray(string)) {
          await yoyo.batchCreateBlocks(uid, order, string, renderItem);
        } else {
          await roam42.common.createBlock(uid, order, renderItem(string));
        }
      },
      { isAsync, deleteCurrentBlock: toChild ? false : deleteCurrentBlock }
    );
  };

  // 收集某个 key 相关的标签列表
  yoyo.getTags = async (tagName) => {
    try {
      const refers = await roam42.common.getBlocksReferringToThisPage(tagName);
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
          return [...memo, ...yoyo.utils.extractTags(a.string)];
        }, []);
      if (!tags.length) {
        roam42.help.displayMessage(`getOptions: ${tagName}获取不到索引`, 2000);
      }
      return yoyo.utils.unique(tags);
    } catch (e) {
      console.log("getTags error", e);
      roam42.help.displayMessage("getTags 执行出错", 2000);
    }
  };
}
