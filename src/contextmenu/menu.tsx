import { confirm, prompt, getBlockUidFromId } from "../utils/common";
import { deepCreateBlock } from "../globals/common";
import yoyo from "../globals";
import { runTasksByBlocks } from "./task";
import { Menu, ClickArgs, ClickArea } from "./types";
import { render } from "../components/metadata";
import { getSingleDOM } from "../utils/dom";
import difference from "lodash-es/difference";

export let blockMenu: Menu[] = [
  {
    text: "Delete",
    key: "Delete",
    children: [
      {
        text: "Delete block and its references",
        key: "Delete block and its references",
        onClick: async ({ currentUid, selectUids }) => {
          if (
            await confirm(
              navigator.language === "zh-CN"
                ? `确定删除当前所选 block 及其所有块引用`
                : `Sure to delete the current block and its all references??`
            )
          ) {
            [currentUid, ...selectUids].forEach(async (uid) => {
              const refers = await window.roam42.common.getBlocksReferringToThisBlockRef(uid);
              if (refers.length > 0) {
                refers.forEach(async (a) => window.roam42.common.deleteBlock(a[0].uid));
              }
              window.roam42.common.deleteBlock(uid);
            });
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
              const refers = await window.roam42.common.getBlocksReferringToThisBlockRef(originUid);
              if (
                refers.length > 0 &&
                (await confirm(
                  `该 block 包含有 embed，embed 原 block有${refers.length}个块引用，是否一起删除`
                ))
              ) {
                refers.forEach(async (a) => window.roam42.common.deleteBlock(a[0].uid));
                window.roam42.common.deleteBlock(originUid);
                window.roam42.help.displayMessage(`删除${refers.length}个引用`, 2000);
              }
            }
            window.roam42.common.deleteBlock(currentUid);
          } catch (e) {
            console.log(e);
            window.roam42.help.displayMessage("删除出错", 2000);
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
            await window.roam42.common.updateBlock(uid, yoyo.utils.removeTags(a.string));
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
              const originInfo = await window.roam42.common.getBlockInfoByUID(originUid);
              window.roam42.common.updateBlock(a.uid, originInfo[0][0].string);
            }
          });
        }
      },
      {
        text: "Remove tags",
        key: "Child blocks remove tags",
        onClick: async ({ currentUid }) => {
          yoyo.utils.patchBlockChildren(currentUid, (a) => {
            window.roam42.common.updateBlock(a.uid, yoyo.utils.removeTags(a.string));
          });
        }
      },
      {
        text: "Merge blocks",
        key: "Merge child blocks",
        onClick: async ({ currentUid }) => {
          const count = +window.prompt(
            navigator.language === "zh-CN" ? "每多少行为一组进行合并？" : "How many lines into one?"
          );
          if (count) {
            const prefix = window.prompt(navigator.language === "zh-CN" ? " 前缀？" : "prefix?");
            const currentBlockInfo = await window.roam42.common.getBlockInfoByUID(currentUid, true);

            const childBlocks = currentBlockInfo[0][0].children.sort((a, b) => a.order - b.order);
            let temp = "";
            let bundleIndex = 0;

            for (let i = 0; i < childBlocks.length; i++) {
              const a = childBlocks[i];
              window.roam42.common.deleteBlock(a.uid);
              temp += `${!!temp ? "\n" : ""}${a.string}`;
              if ((i > count - 2 && (i + 1) % count === 0) || i === childBlocks.length - 1) {
                window.roam42.common.createBlock(currentUid, bundleIndex++, `${prefix}${temp}`);
                temp = "";
              }
            }
          }
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
            window.roam42.help.displayMessage("提取高亮成功，已复制到剪切板", 2000);
          } else {
            window.roam42.help.displayMessage("提取不到高亮内容", 2000);
          }
        }
      }
    ]
  }
];

export let pageTitleMenu: Menu[] = [
  {
    text: "0000",
    key: "0000",
    onClick: () => {
      // render(getSingleDOM("metadata"), { open: true });
    }
  },
  {
    text: "Delete all refering blocks",
    key: "Delete all refering blocks",
    onClick: async ({ pageTitle }) => {
      const refers = await window.roam42.common.getBlocksReferringToThisPage(pageTitle);
      if (refers.length) {
        if (await confirm(`当前页面有${refers.length}个引用，是否全部删除？`)) {
          refers.forEach(async (a) => window.roam42.common.deleteBlock(a[0].uid));
        }
      } else {
        window.iziToast.info({
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
      const refers = await window.roam42.common.getBlocksReferringToThisPage(pageTitle);
      if (!refers.length) {
        window.roam42.help.displayMessage("提取不到东西", 2000);
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

      const pageNames = await window.roam42.common.getPageNamesFromBlockUidList(
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
      window.roam42.help.displayMessage("提取成功，已复制到剪切板", 2000);
    }
  }
];

export let pageTitleMenu_Sidebar: Menu[] = [
  {
    text: "Focus on page",
    key: "Focus on page",
    onClick: async ({ pageTitle }) => {
      await window.roam42.common.navigateUiTo(pageTitle);
    }
  },
  ...pageTitleMenu
];

export function flattenMenu(menu) {
  return menu.flatMap((a) => (a.children ? flattenMenu(a.children) : a));
}

export function getMenuMap(menu: Menu[]) {
  const map = {};
  const loop = (menu: Menu[]) => {
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

export async function getMergeMenu(userBlocks: Roam.Block[], menuMap: Record<string, Menu>) {
  if (!userBlocks || !userBlocks.length) return [];
  return await Promise.all(
    userBlocks.map(async (userBlock) => {
      if (!userBlock.children?.length) {
        return {
          text: userBlock.string,
          onClick: () => {
            window.iziToast.info({
              title:
                navigator.language === "zh-CN"
                  ? "该菜单没有配置执行任务"
                  : "This menu has no configuration",
              position: "topCenter",
              timeout: 2000
            });
          }
        };
      }

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

      return {
        text: userBlock.string,
        children: await getMergeMenu(userBlock.children, menuMap)
      };
    })
  );
}

async function getMergeMenuOfPage(
  pageBlocks: Roam.Block[],
  key: "BlockMenu" | "PageTitleMenu" | "PageTitleMenu_Sidebar",
  menu: Menu[]
) {
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

export async function getMenu(path: Element[], clickArea: ClickArea, onClickArgs: ClickArgs) {
  const pageUid = await window.roam42.common.getPageUidByTitle("roam/enhance/menu");

  let blocks: Roam.Block[];
  if (pageUid) {
    const info = await window.roam42.common.getBlockInfoByUID(pageUid, true);
    if (info) {
      blocks = info[0][0].children.sort((a, b) => a.order - b.order);
    }
  }
  if (!blocks) return;

  if (clickArea === "block") {
    return (blockMenu_merge = await getMergeMenuOfPage(blocks, "BlockMenu", blockMenu));
  }

  let menu: Menu[];
  if (clickArea === "pageTitle") {
    menu = pageTitleMenu_merge = await getMergeMenuOfPage(blocks, "PageTitleMenu", pageTitleMenu);
  } else {
    menu = pageTitleMenu_Sidebar_merge = await getMergeMenuOfPage(
      blocks,
      "PageTitleMenu_Sidebar",
      pageTitleMenu_Sidebar
    );
  }
  if (onClickArgs.pageTitle === "roam/enhance/menu") {
    menu.push(
      {
        text: "Pull all build-in menu",
        onClick: async () => {
          const pageUid = await window.roam42.common.getPageUidByTitle("roam/enhance/menu");
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
        text: "Pull unused build-in menu",
        onClick: async ({ currentUid }) => {
          const userMenu = [];
          await yoyo.utils.patchBlockChildren(currentUid, (a) => {
            const m = a.string.match(/<%\s*menu:\s*(.*)\s*%>/);
            m && userMenu.push(m[1]);
          });
          const internalMenu = Object.keys({
            ...getMenuMap(blockMenu),
            ...getMenuMap(pageTitleMenu),
            ...getMenuMap(pageTitleMenu_Sidebar)
          });
          const diff = difference(internalMenu, userMenu).map((a) => `<%${a}%>`);
          if (diff.length) {
            await yoyo.common.batchCreateBlocks(currentUid, 0, diff);
          } else {
            window.iziToast.info({
              title:
                navigator.language === "zh-CN"
                  ? "当前没有未使用的内置菜单"
                  : "No unused build-in menu found"
            });
          }
        }
      }
    );
  }

  return menu;
}
