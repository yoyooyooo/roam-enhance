import { confirm, getBlockUidFromId } from "../utils/common";

export const blockMenu = [
  {
    text: "Delete",
    children: [
      {
        text: "Delete current block",
        onClick: async ({ currentUid }) => {
          const refers = await roam42.common.getBlocksReferringToThisBlockRef(currentUid);
          if (refers.length > 0) {
            if (
              await confirm(
                `该 block 有${refers.length}个块引用，是否删除当前 block 及其所有块引用`
              )
            ) {
              refers.forEach(async (a) => roam42.common.deleteBlock(a[0].uid));
              roam42.common.deleteBlock(currentUid);
              roam42.help.displayMessage(`删除${refers.length}个引用`, 2000);
            }
          } else {
            roam42.common.deleteBlock(currentUid);
          }
        }
      },
      {
        text: "Delete current block and embed block's refers",
        onClick: async ({ currentUid }) => {
          try {
            const info = await yoyo.getCurrentBlockInfo(currentUid);
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
    children: [
      {
        text: "remove tags",
        onClick: async ({ currentUid }) => {
          const a = await yoyo.getCurrentBlockInfo(currentUid);
          await roam42.common.updateBlock(currentUid, yoyo.utils.removeTags(a.string));
        }
      }
    ]
  },
  {
    text: "Cloze",
    children: [
      {
        text: "Expand all",
        onClick: async ({ target }) => {
          target
            .closest(".roam-block-container")
            .querySelectorAll(".rm-block-children .rm-paren > .rm-spacer")
            .forEach((a) => a.click());
        }
      },
      {
        text: "Collapse all",
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
    text: "Child Blocks",
    children: [
      {
        text: "Embed to text",
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
        onClick: async ({ currentUid }) => {
          yoyo.utils.patchBlockChildren(currentUid, async (a) => {
            await roam42.common.updateBlock(a.uid, yoyo.utils.removeTags(a.string));
          });
        }
      }
    ]
  },
  {
    text: "Extract",
    children: [
      {
        text: "All children's highlight",
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

export const pageTitleMenu = [
  {
    text: "Delete all refering blocks",
    onClick: async ({ pageTitle }) => {
      const refers = await roam42.common.getBlocksReferringToThisPage(pageTitle);
      if (refers.length && (await confirm(`当前页面有${refers.length}个引用，是否全部删除？`))) {
        refers.forEach(async (a) => roam42.common.deleteBlock(a[0].uid));
      }
    }
  },
  {
    text: "Extract currentPage's refers",
    onClick: async ({ pageTitle }) => {
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

      const refers = await roam42.common.getBlocksReferringToThisPage(pageTitle);

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

export function getMenu(target) {
  if (
    target.classList.contains("rm-bullet__inner") ||
    target.classList.contains("rm-bullet") ||
    target.classList.contains("rm-caret") ||
    target.classList.contains("block-expand")
  ) {
    const currentUid = getBlockUidFromId(
      target.closest(".rm-block-main").querySelector(".rm-block__input").id
    );
    return [blockMenu, { currentUid, target }];
  }
  if (
    target.className === "rm-title-display" ||
    target.parentNode.className === "rm-title-display"
  ) {
    const pageTitle = target.closest(".rm-title-display").innerText;
    return [pageTitleMenu, { pageTitle, target }];
  }

  return [null, null];
}
