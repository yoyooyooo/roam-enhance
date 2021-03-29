import difference from "lodash-es/difference";
import memorize from "lodash-es/memoize";
import yoyo from "@/globals";
import { deepCreateBlock } from "@/globals/common";
import { confirm } from "@/globals/help";
import { runTasksByBlocks } from "./task";
import { ClickArea, ClickArgs, Menu } from "./types";
import { message, notification, Button } from "antd";
import React from "react";

export let commonMenu: Menu[] = [
  {
    text: "Clear current block/page",
    key: "Clear current block/page",
    onClick: async ({ currentUid }) => {
      if (
        await yoyo.help.confirm(
          navigator.language === "zh-CN"
            ? "确定清空当前页/Block吗？"
            : "Are you sure to clear the current block/page?"
        )
      ) {
        const info = await window.roam42.common.getBlockInfoByUID(currentUid, true);
        info[0][0].children.forEach((a) => {
          window.roam42.common.deleteBlock(a.uid);
        });
      }
    }
  },
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
        window.iziToast.success({
          title:
            navigator.language === "zh-CN"
              ? "提取高亮成功，已复制到剪切板"
              : "Extract successfully, Copied to clipboard!"
        });
      } else {
        window.iziToast.info({
          position: "topCenter",
          title: navigator.language === "zh-CN" ? "提取不到高亮内容" : "Can't extract anything"
        });
      }
    }
  },
  {
    text: "Apply markdown heading to child blocks",
    key: "Apply markdown heading to child blocks",
    onClick: async ({ currentUid }) => {
      yoyo.utils.patchBlockChildrenSync(currentUid, async (a) => {
        const m = a.string.match(/^(#+)\s/);
        if (!m) return;
        const div = document.querySelector(`.rm-block__input[id*="${a.uid}"]`);
        if (div) {
          await window.roam42.common.updateBlock(a.uid, a.string.replace(/^(#+\s)/, ""), a.open);
          await window.roam42.common.sleep(50);
          window.roam42.common.simulateMouseClick(div as HTMLElement);
          await window.roam42.common.sleep(50);
          await window.roam42KeyboardLib.changeHeading(m[1].length);
        }
      });
    }
  }
];

export let blockMenu: Menu[] = [
  ...commonMenu,
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
                window.iziToast.info({
                  position: "topCenter",
                  title:
                    navigator.language === "zh-CN"
                      ? `删除${refers.length}个引用`
                      : `delete${refers.length} references`
                });
              }
            }
            window.roam42.common.deleteBlock(currentUid);
          } catch (e) {
            console.log(e);
            window.iziToast.error({
              title: navigator.language === "zh-CN" ? "删除出错" : "Delete failed"
            });
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
      },
      {
        text: "Split block",
        key: "Split block",
        onClick: async ({ currentUid }) => {
          const info = await window.roam42.common.getBlockInfoByUID(currentUid);
          const { parentUID } = await window.roam42.common.getDirectBlockParentUid(currentUid);
          const stringList = info[0][0].string.split("\n");
          window.roam42.common.deleteBlock(info[0][0].uid);
          await window.roam42.common.batchCreateBlocks(parentUID, info[0][0].order, stringList);
        }
      },
      {
        text: "Merge blocks",
        key: "Merge blocks",
        onClick: async ({ currentUid, selectUids }) => {
          if (selectUids.length < 2) return;
          const strings = await Promise.all(
            selectUids.map(async (uid) => {
              window.roam42.common.deleteBlock(uid);
              return (await window.roam42.common.getBlockInfoByUID(uid))[0][0].string;
            })
          );
          const { order, parentUID } = await window.roam42.common.getDirectBlockParentUid(
            currentUid
          );
          window.roam42.common.createBlock(parentUID, order + 1, strings.join("\n"));
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
            const newString = yoyo.utils.removeTags(a.string);
            if (newString !== a.string) {
              window.roam42.common.updateBlock(a.uid, newString);
            }
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
            .forEach((a) => (a as HTMLElement).click());
        }
      },
      {
        text: "Collapse all",
        key: "Collapse all cloze",
        onClick: async ({ target }) => {
          target
            .closest(".roam-block-container")
            .querySelectorAll(".rm-block-children .rm-paren__paren")
            .forEach((a) => (a as HTMLElement).click());
        }
      }
    ]
  },
  {
    text: "Remote",
    children: [
      {
        text: "拉取知乎文章",
        key: "Pull zhihu article",
        onClick: async ({ currentUid }) => {
          const key = "process";
          const pullZhihuArticle = async () => {
            let isCancel = false;
            let finishedCount = 0;
            const showNotification = (n?: number) => {
              notification.open({
                key,
                placement: "bottomRight",
                message: "导入数据中...",
                description: `${n || ++finishedCount}/${list.length}`,
                style: { width: 200 },
                btn: (
                  <Button
                    type='primary'
                    onClick={() => {
                      isCancel = true;
                      notification.close(key);
                    }}
                  >
                    取消
                  </Button>
                )
              });
            };
            const info = await window.roam42.common.getBlockInfoByUID(currentUid);
            const string = info[0][0].string;
            const url = string.match(/http[^(\s\))]*/)?.[0];
            if (!url) {
              window.iziToast.error({ title: "获取不到链接", position: "topCenter" });
              return;
            }

            message.loading({ content: "校验链接中...", key });
            const supports = await window
              .fetch(`API_URL/supports`)
              .then((a) => a.json())
              .catch((e) => {
                window.iziToast.error({ title: "请求失败" });
              });
            const matchRegex = supports.find((a) => new RegExp(a).test(url));
            if (!matchRegex) {
              message.destroy(key);
              window.iziToast.error({ title: "暂不支持该网站" });
              return;
            }

            message.loading({ content: "拉取数据中...", key });
            let list: string[] = await fetch(`API_URL/index?url=${url}&markdownArray=1`)
              .then((a) => a.json())
              .catch((e) => {
                window.iziToast.error({ title: "数据查询失败" });
              });
            if (!list) return;

            const run = async (delay?: number) => {
              const refMap = new Map<string, { string: string; uid: string }>();
              const originRefMap = new Map<string, string>();
              await yoyo.common.collapseBlock(currentUid);
              await yoyo.common.createBlocksByMarkdown(currentUid, list, {
                isCancel: () => isCancel,
                maxCount: 0,
                delay: delay || 0,
                sync: true,
                renderItem: (a) => a.replace(/^\[\^\]\((#ref_\d+)\)/, ""),
                afterCreateBlock: (a, uid) => {
                  showNotification();
                  const item = Array.isArray(a) ? a[0] : a;
                  // 包含引用的 block
                  const refs: string[] | null = item.match(/(?<=\[\d+\]\()#ref_\d+(?=\))/g);
                  if (refs) {
                    refs.forEach((ref) => {
                      refMap.set(ref, { uid: uid, string: a });
                    });
                    return;
                  }
                  // 源引用
                  item.replace(/^\[\^\]\((#ref_\d+)\)/, (m, ref) => {
                    originRefMap.set(ref, uid);
                  });
                }
              });
              [...refMap.keys()].forEach((key) => {
                const { string, uid } = refMap.get(key);
                window.roam42.common.updateBlock(
                  uid,
                  string.replace(/\[(\d+)\]\((#ref_\d+)\)/g, (m, n, ref) => {
                    const uid = originRefMap.get(ref);
                    return uid ? `[(${n})](((${uid})))` : m;
                  })
                );
              });
            };

            if (list.length > 290) {
              message.destroy(key);
              const delay = await yoyo.help.prompt(
                `当前文章过长(${list.length}行)，请设置插入间隔(ms)<br/>插入太频繁会被 roam 限制报错<br/>请尝试合理的时间间隔`,
                { defaultValue: 300 }
              );
              showNotification(0);
              run(+delay);
            } else {
              showNotification(0);
              run();
            }
            message.success({ content: `导入成功`, key, duration: 2 });
            notification.close(key);
          };
          const setMarkdownLink = async () => {
            try {
              const info = await window.roam42.common.getBlockInfoByUID(currentUid);
              const string = info[0][0].string;
              const url = string.trim().match(/^http[^\s]*$/)?.[0];
              if (url) {
                const res = await window
                  .fetch(`API_URL/pagetitle?url=${url}`)
                  .then((a) => a.json());
                const title = res.meta.title;
                window.roam42.common.updateBlock(
                  currentUid,
                  `[${title.replace(/\[/g, "『").replace(/\]/g, "』")}](${url})`,
                  false
                );
              }
            } catch (e) {}
          };
          try {
            await Promise.all([pullZhihuArticle(), setMarkdownLink()]);
          } catch (e) {
            message.error({ content: `导入失败`, key, duration: 2 });
            notification.close(key);
          }
        }
      }
    ]
  }
];

export let pageTitleMenu: Menu[] = [
  ...commonMenu,
  {
    text: "Delete all refering blocks",
    key: "Delete all refering blocks",
    onClick: async ({ pageTitle }) => {
      const refers = await window.roam42.common.getBlocksReferringToThisPage(pageTitle);
      if (refers.length) {
        if (
          await confirm(
            navigator.language === "zh-CN"
              ? `当前页面有${refers.length}个引用，是否全部删除？`
              : `Current page has ${refers.length} references, remove all?`
          )
        ) {
          refers.forEach(async (a) => window.roam42.common.deleteBlock(a[0].uid));
        }
      } else {
        window.iziToast.info({
          title: navigator.language === "zh-CN" ? "该页面没有引用" : "This page has no reference",
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
        window.iziToast.info({
          position: "topCenter",
          title: navigator.language === "zh-CN" ? "提取不到东西" : "Can't extract anything"
        });
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
      window.iziToast.info({
        position: "topCenter",
        title:
          navigator.language === "zh-CN"
            ? "提取成功，已复制到剪切板"
            : "Extract successfullly, Copied to clipboard!"
      });
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
  ...commonMenu,
  ...pageTitleMenu
];

export const getMenuMap = memorize((menu: Menu[]) => {
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
});

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

  let menu: Menu[] = [];

  if (clickArea === "block") {
    return (menu = blockMenu_merge = await getMergeMenuOfPage(blocks, "BlockMenu", blockMenu));
  }

  if (clickArea === "pageTitle") {
    menu = pageTitleMenu_merge = await getMergeMenuOfPage(blocks, "PageTitleMenu", pageTitleMenu);
  } else if (clickArea === "pageTitle_sidebar") {
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
          const diff = difference(internalMenu, userMenu).map((a) => `<%menu:${a}%>`);
          if (diff.length) {
            await yoyo.common.batchCreateBlocks(currentUid, 0, diff);
          } else {
            window.iziToast.info({
              position: "topCenter",
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

  await Promise.all(
    [...window.roamEnhance.contextMenu.registerMenu].map(async (fn) => {
      await fn(menu, clickArea, onClickArgs);
    })
  );

  return menu;
}
