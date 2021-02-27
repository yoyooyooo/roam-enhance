import { confirm, getBlockUidFromId } from "../utils/common";
import { deepCreateBlock } from "../globals/common";
import yoyo from "../globals";
import { runTasksByBlocks } from "./task";

export let blockMenu = [
  {
    text: "Delete",
    key: "Delete",
    children: [
      {
        text: "Delete block and it's references",
        key: "Delete block and it's references",
        onClick: async ({ currentUid, selectUids }) => {
          if (selectUids.length > 0) {
            selectUids.forEach((uid) => roam42.common.deleteBlock(uid));
            return;
          }
          const refers = await roam42.common.getBlocksReferringToThisBlockRef(currentUid);
          if (refers.length > 0) {
            if (
              await confirm(
                navigator.language === "zh-CN"
                  ? `该 block 有${refers.length}个块引用，是否删除当前 block 及其所有块引用`
                  : `this block has ${refers.length} references，delete this block and it's all references?`
              )
            ) {
              refers.forEach(async (a) => roam42.common.deleteBlock(a[0].uid));
              roam42.common.deleteBlock(currentUid);
              roam42.help.displayMessage(
                navigator.language === "zh-CN"
                  ? `删除${refers.length}个引用`
                  : `Successfully delete ${refers.length} references`,
                2000
              );
            }
          } else {
            roam42.common.deleteBlock(currentUid);
          }
        }
      },
      {
        text: "Delete current block and embed block's refers",
        key: "Delete current block and embed block's refers",
        onClick: async ({ currentUid }) => {
          try {
            const info = await yoyo.common.getCurrentBlockInfo(currentUid);
            const embed = info.string.match(/\{\{\[\[embed\]\]\:\s+\(\(\(\((.*?)\)\)\)\)\}\}/);
            if (embed) {
              const originUid = embed[1];
              const refers = await roam42.common.getBlocksReferringToThisBlockRef(originUid);
              if (
                refers.length > 0 &&
                (await confirm(
                  `该 block 包含有 embed，embed 原 block有${refers.length}个块引用，是否一起删除`
                ))
              ) {
                refers.forEach(async (a) => roam42.common.deleteBlock(a[0].uid));
                roam42.common.deleteBlock(originUid);
                roam42.help.displayMessage(`删除${refers.length}个引用`, 2000);
              }
            }
            roam42.common.deleteBlock(currentUid);
          } catch (e) {
            console.log(e);
            roam42.help.displayMessage("删除出错", 2000);
          }
        }
      }
    ]
  },
  {
    text: "Format",
    key: "Format",
    children: [
      {
        text: "Remove tags",
        key: "Remove tags",
        onClick: async ({ currentUid, selectUids }) => {
          [currentUid, ...selectUids].forEach(async (uid) => {
            const a = await yoyo.common.getCurrentBlockInfo(uid);
            await roam42.common.updateBlock(uid, yoyo.utils.removeTags(a.string));
          });
        }
      }
    ]
  },
  {
    text: "Format child blocks",
    key: "Format child blocks",
    children: [
      {
        text: "Embed to text",
        key: "Child embed to text",
        onClick: async ({ currentUid }) => {
          await yoyo.utils.patchBlockChildren(currentUid, async (a) => {
            const m = a.string.match(/\{\{\[\[embed\]\]\:\s+\(\(\(\((.*?)\)\)\)\)\}\}/);
            const originUid = m && m[1];
            if (originUid) {
              const originInfo = await roam42.common.getBlockInfoByUID(originUid);
              roam42.common.updateBlock(a.uid, originInfo[0][0].string);
            }
          });
        }
      },
      {
        text: "Remove tags",
        key: "child blocks remove tags",
        onClick: async ({ currentUid }) => {
          yoyo.utils.patchBlockChildren(currentUid, (a) => {
            roam42.common.updateBlock(a.uid, yoyo.utils.removeTags(a.string));
          });
        }
      }
    ]
  },
  {
    text: "Cloze",
    key: "Cloze",
    children: [
      {
        text: "Expand all",
        key: "Expand all cloze",
        onClick: async ({ target }) => {
          target
            .closest(".roam-block-container")
            .querySelectorAll(".rm-block-children .rm-paren > .rm-spacer")
            .forEach((a) => a.click());
        }
      },
      {
        text: "Collapse all",
        key: "Collapse all cloze",
        onClick: async ({ target }) => {
          target
            .closest(".roam-block-container")
            .querySelectorAll(".rm-block-children .rm-paren__paren")
            .forEach((a) => a.click());
        }
      }
    ]
  },
  {
    text: "Extract",
    children: [
      {
        text: "All children's highlight",
        key: "Extract All children's highlight",
        onClick: async ({ currentUid }) => {
          let highlights = [];
          await yoyo.utils.patchBlockChildren(currentUid, (a) => {
            const m = a.string.match(/\^\^([\s\S]*?)\^\^/g);
            m && highlights.push(...m);
          });
          await navigator.clipboard.writeText(highlights.join("\n"));
          if (highlights.length > 0) {
            roam42.help.displayMessage("提取高亮成功，已复制到剪切板", 2000);
          } else {
            roam42.help.displayMessage("提取不到高亮内容", 2000);
          }
        }
      }
    ]
  }
];

export let pageTitleMenu = [
  {
    text: "Delete all refering blocks",
    key: "Delete all refering blocks",
    onClick: async ({ pageTitle }) => {
      const refers = await roam42.common.getBlocksReferringToThisPage(pageTitle);
      if (refers.length) {
        if (await confirm(`当前页面有${refers.length}个引用，是否全部删除？`)) {
          refers.forEach(async (a) => roam42.common.deleteBlock(a[0].uid));
        }
      } else {
        iziToast.info({
          title: "该页面没有引用",
          position: "topCenter",
          timeout: 2000
        });
      }
    }
  },
  {
    text: "Extract currentPage's refers",
    key: "Extract currentPage's refers",
    onClick: async ({ pageTitle }) => {
      const refers = await roam42.common.getBlocksReferringToThisPage(pageTitle);
      if (!refers.length) {
        roam42.help.displayMessage("提取不到东西", 2000);
        return;
      }
      function getContentWithChildren(item, depth = 2) {
        return `${item.string}
              ${
                item.children
                  ? item.children
                      .map((a) => "    ".repeat(depth) + getContentWithChildren(a, depth + 1))
                      .join("\n")
                  : ""
              }`;
      }

      const refersByUid = refers.reduce((memo, a) => {
        const uid = a[0].uid;
        memo[uid] = a;
        return memo;
      }, {});

      const pageNames = await roam42.common.getPageNamesFromBlockUidList(
        refers.map((a) => a[0].uid)
      );
      const groupByPageUid = pageNames
        .sort((a, b) =>
          !!+new Date(a[1].uid) &&
          !!+new Date(b[1].uid) &&
          +new Date(a[1].uid) > +new Date(b[1].uid)
            ? 1
            : -1
        )
        .reduce((memo, a, i) => {
          const uid = a[1].uid;
          memo[uid] = [...(memo[uid] || []), { ...a[0], title: a[1].title }];
          return memo;
        }, {});

      const res = Object.keys(groupByPageUid)
        .map((uid) => {
          return `${groupByPageUid[uid][0].title}
          ${groupByPageUid[uid]
            .map((a) => {
              const blockUid = a.uid;
              return "    " + getContentWithChildren(refersByUid[blockUid][0]);
            })
            .join("\n")}`;
        })
        .join("\n");
      await navigator.clipboard.writeText(res);
      roam42.help.displayMessage("提取成功，已复制到剪切板", 2000);
    }
  }
];

export let pageTitleMenu_Sidebar = [
  {
    text: "Focus on page",
    key: "Focus on page",
    onClick: async ({ pageTitle }) => {
      await roam42.common.navigateUiTo(pageTitle);
    }
  },
  ...pageTitleMenu
];

export function flattenMenu(menu) {
  return menu.flatMap((a) => (a.children ? flattenMenu(a.children) : a));
}

export function getMenuMap(menu) {
  const map = {};
  const loop = (menu) => {
    menu.forEach((a) => {
      if (a.children) {
        loop(a.children);
      } else {
        map[a.key] = a;
      }
    });
  };
  loop(menu);
  return map;
}

// userBlocks: Array<{string:string,uid:string,children:[...]}>
export async function getMergeMenu(userBlocks, menuMap) {
  if (!userBlocks || !userBlocks.length) return [];
  return await Promise.all(
    userBlocks.map(async (userBlock) => {
      if (!userBlock.children || userBlock.children.length === 0)
        return {
          text: userBlock.string,
          onClick: () => {
            iziToast.info({
              title:
                navigator.language === "zh-CN"
                  ? "该菜单没有配置执行任务"
                  : "This menu has no configuration",
              position: "topCenter",
              timeout: 2000
            });
          }
        };

      const m = userBlock.string.match(/\{\{(.*)\}\}/);
      if (m) {
        return {
          text: m[1],
          onClick: async (onClickArgs) => {
            await runTasksByBlocks(
              userBlock.children.sort((a, b) => a.order - b.order),
              menuMap,
              onClickArgs
            );
          }
        };
      }

      if (userBlock.children && userBlock.children.length === 1) {
        const js = userBlock.children[0].string.match(/\`\`\`javascript\n(.*)\`\`\`/);
        if (js) {
          return {
            text: userBlock.string,
            onClick: async () => {
              const info = await roam42.common.getBlockInfoByUID(userBlock.children[0].uid);
              const code = info[0][0].string.match(/\`\`\`javascript\n(.*)\`\`\`/)[1];
              const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
              await new AsyncFunction(code)();
            }
          };
        }
        const internalMenu = userBlock.children[0].string.match(/<%\s*menu:\s*(.*)\s*%>/);
        if (internalMenu) {
          const menu = menuMap[internalMenu[1]];
          return menu || { text: `${userBlock.string} (No template menu found)` };
        }
      }

      return {
        text: userBlock.string,
        children: await getMergeMenu(userBlock.children, menuMap)
      };
    })
  );
}

async function getMergeMenuOfPage(pageBlocks, key, menu) {
  const info = pageBlocks.find((a) => a.string.includes(key));
  if (info) {
    const menuBlocks = (info && info.children.sort((a, b) => a.order - b.order)) || [];
    return await getMergeMenu(menuBlocks, getMenuMap(menu));
  } else {
    return menu;
  }
}

let blockMenu_merge = [...blockMenu];
let pageTitleMenu_merge = [...pageTitleMenu];
let pageTitleMenu_Sidebar_merge = [...pageTitleMenu_Sidebar];

export async function initMenu() {
  const pageUid = await roam42.common.getPageUidByTitle("roam/enhance/menu");
  if (pageUid) {
    const info = await roam42.common.getBlockInfoByUID(pageUid, true);
    if (info) {
      const blocks = info[0][0].children.sort((a, b) => a.order - b.order);

      blockMenu_merge = await getMergeMenuOfPage(blocks, "BlockMenu", blockMenu);
      pageTitleMenu_merge = await getMergeMenuOfPage(blocks, "PageTitleMenu", pageTitleMenu);
      pageTitleMenu_Sidebar_merge = await getMergeMenuOfPage(
        blocks,
        "PageTitleMenu_Sidebar",
        pageTitleMenu_Sidebar
      );
    }
  }
}

export function getMenu(path) {
  const target = path[1]; // the closest element over mouse, path[0] is overlay
  const rmBlockMainDOM = path.find((a) => a.classList.contains("rm-block-main"));
  if (rmBlockMainDOM) {
    const currentUid = getBlockUidFromId(rmBlockMainDOM.querySelector(".rm-block__input").id);
    return [blockMenu_merge, { currentUid, target }];
  }

  const pageTitleDOM = path.find((a) => a.classList.contains("rm-title-display"));
  if (pageTitleDOM) {
    const pageTitle = pageTitleDOM.innerText;
    let menu;
    // menu in sidebar
    if (path.find((a) => a.classList.contains("sidebar-content"))) {
      menu = [...pageTitleMenu_Sidebar_merge];
    } else {
      menu = [...pageTitleMenu_merge];
    }

    if (pageTitle === "roam/enhance/menu") {
      menu.push(
        {
          text: "Pull internal menu",
          onClick: async () => {
            const pageUid = await roam42.common.getPageUidByTitle("roam/enhance/menu");
            const insertTemplateMenu = (menu) => {
              return menu.map((a) => {
                if (a.children) {
                  return { ...a, children: insertTemplateMenu(a.children) };
                } else {
                  return { ...a, text: `{{${a.text}}}`, children: [{ text: `<%menu:${a.key}%>` }] };
                }
              });
            };
            deepCreateBlock(pageUid, [
              { text: "**BlockMenu**", children: insertTemplateMenu(blockMenu) },
              { text: "**PageTitleMenu**", children: insertTemplateMenu(pageTitleMenu) },
              {
                text: "**PageTitleMenu_Sidebar**",
                children: insertTemplateMenu(pageTitleMenu_Sidebar)
              }
            ]);
          }
        },
        {
          text: "Reload Menu",
          onClick: async () => {
            try {
              console.time();
              await initMenu();
              console.timeEnd();
              iziToast.success({
                title: "Reload Menu Success",
                position: "topCenter",
                timeout: 1000
              });
            } catch (e) {
              console.log(e);
              iziToast.error({
                title: "Reload Menu Error",
                position: "topCenter",
                timeout: 1000
              });
            }
          }
        }
      );
    }
    return [menu, { pageTitle, target }];
  }

  return [null, null];
}
