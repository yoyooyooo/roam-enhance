import React from "react";
import { message, notification, Button } from "antd";
import { runDynamicMenu } from "@/utils/common";

const yoyo = window.roamEnhance;

// 用户配置的名字，可以是一组 menu 的集合，下面registerMenuCommand的是真正的 <%menu:%>
runDynamicMenu("Pull zhihu article", ({ ctx }) => {
  window.roamEnhance.contextMenu.registerMenuCommand("block", {
    "Pull zhihu article": {
      text: "拉取知乎文章",
      key: "Pull zhihu article",
      help: `<b>拉取知乎文章</b><br/>适用范围：Block`,
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
            await run(+delay);
          } else {
            showNotification(0);
            await run();
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
              const res = await window.fetch(`API_URL/pagetitle?url=${url}`).then((a) => a.json());
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
  });
});
