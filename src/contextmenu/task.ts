import { Menu, ClickArgs } from "./types";
import yoyo from "@/globals/";

const menuMovedToDynamic = ["Pull zhihu article"];

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

  const internalMenu = block.string.match(/<%\s*menu:\s*(.*)\s*%>/)?.[1];
  if (internalMenu) {
    const menu = menuMap[internalMenu];
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
      const extraMsg = menuMovedToDynamic.includes(internalMenu)
        ? `<br/>该 menu 已移至动态菜单，请配置后使用<br/>
        <a target="_blank" href="https://roamresearch.com/#/app/roam-enhance/page/gOWzh6_E7">查看文档</a>`
        : "";
      window.iziToast.error({
        title:
          navigator.language === "zh-CN"
            ? `不存在 menu: ${internalMenu}${extraMsg}`
            : `no menu named${internalMenu} found`,
        position: "topCenter",
        timeout: extraMsg ? 10000 : 3000
      });
    }
    return;
  }

  const uids = [];
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
      uids.push(
        ...(await yoyo.common.batchCreateBlocks(
          parentUid,
          block.order,
          (strings as unknown) as string[]
        ))
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
    uids.push(await window.roam42.common.createBlock(parentUid, block.order, finalString));
  }
  if (uids.length) {
    return uids[uids.length - 1];
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

  let $ctx = {};
  const runTasks = async (parentUid, blocks) => {
    for (const block of blocks.sort((a, b) => a.order - b.order)) {
      const uid = await processBlock(parentUid, block, menuMap, onClickArgs, $ctx);
      if (block.children) {
        runTasks(uid || parentUid, block.children); // child sync is not necessary
      }
    }
  };
  await runTasks(finalUid, blocks);
  $ctx = {};
}
