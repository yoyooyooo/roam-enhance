export const processBlock = async (parentUid: string, block: Roam.Block, menuMap, onClickArgs) => {
  const { currentUid, selectUids, target, pageTitle } = onClickArgs;
  const js = block.string.match(/^\`\`\`javascript\n([\s\S]*)\`\`\`$/);
  if (js) {
    const code = js[1];
    const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
    try {
      const result = await new AsyncFunction(
        "$currentUid",
        "$selectUids",
        "$target",
        "$pageTitle",
        code
      )(currentUid, selectUids, target, pageTitle);
      // nooutput
      return await window.roam42.common.createBlock(parentUid, block.order, `${result}`);
    } catch (e) {
      console.log(e);
    }
  }

  const internalMenu = block.string.match(/<%\s*menu:\s*(.*)\s*%>/);
  if (internalMenu) {
    const menu = menuMap[internalMenu[1]];
    if (menu) {
      menu.onClick && menu.onClick(onClickArgs);
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

  return await window.roam42.common.createBlock(
    parentUid,
    block.order,
    await window.roam42.smartBlocks.proccessBlockWithSmartness(block.string)
  );
};

export async function runTasksByBlocks(blocks, menuMap, onClickArgs) {
  const { currentUid, selectUids, target, pageTitle } = onClickArgs;
  let finalUid;
  if (currentUid) {
    finalUid = currentUid;
  } else if (pageTitle) {
    finalUid = await window.roam42.common.getPageUidByTitle(pageTitle);
  }

  const runTasks = async (parentUid, blocks) => {
    for (const block of blocks.sort((a, b) => a.order - b.order)) {
      const uid = await processBlock(parentUid, block, menuMap, onClickArgs);
      if (block.children) {
        runTasks(uid || parentUid, block.children); // child sync is not necessary
      }
    }
  };

  await runTasks(finalUid, blocks);
}
