export const processBlock = async (parentUid, block, menuMap, onClickArgs) => {
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
      return await roam42.common.createBlock(parentUid, block.order, `${result}`);
    } catch (e) {
      console.log(e);
    }
  }

  const internalMenu = block.string.match(/<%\s*menu:\s*(.*)\s*%>/);
  if (internalMenu) {
    const menu = menuMap[internalMenu[1]];
    menu.onClick && menu.onClick(onClickArgs);
    return;
  }

  return await roam42.common.createBlock(parentUid, block.order, block.string);
};

export async function runTask(block, onClickArgs, menuMap) {
  const { prevInput, lastInput, currentUid, selectUids, target, pageTitle } = onClickArgs;
  let finalUid;
  if (currentUid) {
    finalUid = currentUid;
  } else if (pageTitle) {
    finalUid = await roam42.common.getPageUidByTitle(pageTitle);
  }

  await processBlock(block, onClickArgs);

  // template block
  //   await yoyo.common.copyTemplateBlock(finalUid, [block], block.order);
  const uid = await roam42.common.createBlock(finalUid, block.order, block.string);
  if (block.children) {
    for (const b of block.children) {
      await runTask(b, onClickArgs, block.order, menuMap);
    }
  }
}

export async function runTasksByBlocks(blocks, menuMap, onClickArgs) {
  const { currentUid, selectUids, target, pageTitle } = onClickArgs;
  let finalUid;
  if (currentUid) {
    finalUid = currentUid;
  } else if (pageTitle) {
    finalUid = await roam42.common.getPageUidByTitle(pageTitle);
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

  //   for (const block of blocks) {
  //     prevInput = await runTask(block, { prevInput, lastInput, ...onClickArgs }, menuMap);
  //     prevInput && (lastInput = prevInput);
  //   }
}
