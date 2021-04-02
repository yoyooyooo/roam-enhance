import { Menu, ClickArgs } from "./types";

export const processBlock = async (
  parentUid: string,
  block: Roam.Block,
  menuMap: Record<string, Menu>,
  onClickArgs: ClickArgs,
  $ctx: any
) => {
  const { currentUid, selectUids, target, pageTitle } = onClickArgs;
  const js = block.string.match(/^\`\`\`javascript\n([\s\S]*)\`\`\`$/);
  if (js) {
    const code = js[1];
    const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
    try {
      const result = await new AsyncFunction(
        "$ctx",
        "$currentUid",
        "$selectUids",
        "$target",
        "$pageTitle",
        code
      )($ctx, currentUid, selectUids, target, pageTitle);
      if (block.children?.length || result) {
        return await window.roam42.common.createBlock(parentUid, block.order, `${result || ""}`);
      }
      return;
    } catch (e) {
      console.log(e);
      window.iziToast.info({
        position: "topCenter",
        title: navigator.language === "zh-CN" ? "菜单执行错误" : " menu task error"
      });
      return;
    }
  }

  const internalMenu = block.string.match(/<%\s*menu:\s*(.*)\s*%>/);
  if (internalMenu) {
    const menu = menuMap[internalMenu[1]];
    if (menu) {
      try {
        menu.onClick?.(onClickArgs);
      } catch (e) {
        console.log(e);
        window.iziToast.info({
          position: "topCenter",
          title: navigator.language === "zh-CN" ? "菜单执行错误" : "menu task error"
        });
        return;
      }
    } else {
      window.iziToast.error({
        title:
          navigator.language === "zh-CN"
            ? `不存在 menu: ${internalMenu[1]}`
            : `no menu named${internalMenu[1]} found`,
        position: "topCenter",
        timeout: 3000
      });
    }
    return;
  }

  const finalString = await window.roam42.smartBlocks.proccessBlockWithSmartness(block.string);
  if (!!window.roam42.smartBlocks.activeWorkflow.arrayToWrite.length) {
    let countOfblocksToInsert = window.roam42.smartBlocks.activeWorkflow.arrayToWrite.length;
    if (countOfblocksToInsert > 0) {
      const strings = await Promise.all(
        window.roam42.smartBlocks.activeWorkflow.arrayToWrite.flatMap(async (sb) => {
          let textToInsert = sb.text;
          if (sb.reprocess == true)
            textToInsert = await window.roam42.smartBlocks.proccessBlockWithSmartness(textToInsert);
          return textToInsert.includes(window.roam42.smartBlocks.exclusionBlockSymbol) ||
            textToInsert.includes(window.roam42.smartBlocks.replaceFirstBlock)
            ? []
            : [textToInsert];
        })
      );
      await window.roam42.common.batchCreateBlocks(
        parentUid,
        block.order,
        (strings as unknown) as string[]
      );
      window.roam42.smartBlocks.activeWorkflow.arrayToWrite = [];
    }
  }

  if (
    !(
      finalString.includes(window.roam42.smartBlocks.exclusionBlockSymbol) ||
      finalString.includes(window.roam42.smartBlocks.replaceFirstBlock)
    )
  ) {
    return await window.roam42.common.createBlock(parentUid, block.order, finalString);
  }
};

export async function runTasksByBlocks(blocks, menuMap, onClickArgs) {
  const { currentUid, pageTitle } = onClickArgs;
  let finalUid;
  if (currentUid) {
    finalUid = currentUid;
  } else if (pageTitle) {
    finalUid = await window.roam42.common.getPageUidByTitle(pageTitle);
  }

  const runTasks = async (parentUid, blocks) => {
    for (const block of blocks.sort((a, b) => a.order - b.order)) {
      const uid = await processBlock(parentUid, block, menuMap, onClickArgs, $ctx);
      if (block.children) {
        runTasks(uid || parentUid, block.children); // child sync is not necessary
      }
    }
  };

  let $ctx = {};
  await runTasks(finalUid, blocks);
  $ctx = {};
}
