import { runPlugin } from "../../utils/common";
import "./index.css";

runPlugin("video", ({ ctx, name }) => {
  const videoMap = new Map<RegExp, (...args: any[]) => string>()
    .set(
      /https\:\/\/www\.bilibili\.com\/video\/([^(\s\)\})]*)/,
      (m, id) =>
        `https://player.bilibili.com/player.html?bvid=${id}&page=1&high_quality=1&as_wide=1&allowfullscreen=true`
    )
    .set(
      /https\:\/\/www\.ixigua\.com\/([^(\s\)\})]*)/,
      (m, id) => `https://www.ixigua.com/iframe/${id}?autoplay=0&amp;startTime=0`
    )
    .set(
      /https\:\/\/v\.youku\.com\/v_show\/id_([^(\s\)\})]*)\.html/,
      (m, id) => `https://player.youku.com/embed/${id}`
    )
    .set(
      /https\:\/\/v\.qq\.com\/x\/page\/([^(\s\)\})]*).html/,
      (m, id) => `https://v.qq.com/txp/iframe/player.html?vid=${id}`
    );

  function getVideoUrl(string: string): [string, RegExp] | [] {
    const r = [...videoMap.keys()].find((r) => r.test(string));
    if (r) {
      const m = string.match(r);
      return [videoMap.get(r)(...m), r];
    }
    return [];
  }

  async function getClosestBlockInfo(el: HTMLElement) {
    const id = el.closest("div.rm-block__input").id;
    const uid = window.roamEnhance.utils.getBlockUidFromId(id);
    const info = await window.roam42.common.getBlockInfoByUID(uid);
    return info[0][0];
  }

  ctx.resetVideoBlock = async function (el: HTMLButtonElement) {
    // 当前 block 的第几个按钮(视频对应的)
    const currentIndex = [
      ...el.closest("div.rm-block__input").querySelectorAll(".bp3-icon-reset")
    ]?.indexOf(el);
    const { string, uid } = await getClosestBlockInfo(el);
    let i = 0;
    const _string = string.replace(/\{\{videoo\:\s*(.*?)\}\}/g, (m, url) => {
      const res = currentIndex === i ? url : m;
      i++;
      return res;
    });
    el.closest("div.rm-block__input")
      .querySelectorAll(".bp3-icon-video")
      .forEach((a) => a.remove());
    await window.roam42.common.updateBlock(uid, _string);
  };

  ctx.focusBlock = (el) => {
    window.roam42.common.simulateMouseClick(el.closest("div.rm-block__input"));
  };

  function getVideoHTML(src: string) {
    return `<div class="rm-iframe__spacing-wrapper rm-video-player__spacing-wrapper"><div class="rm-iframe__container rm-video-player__container hoverparent"><div class="hoveronly"><button onclick="window.roamEnhance._plugins['${name}'].focusBlock(this)" class="bp3-button bp3-small bp3-icon-standard bp3-icon-edit bp3-minimal rm-iframe__edit-btn rm-video-player__edit-btn" content=""></button><button onclick="window.roamEnhance._plugins['${name}'].resetVideoBlock(this);" style="position: absolute; right: 25px; top: 0; z-index: 10;" class="bp3-button bp3-small bp3-icon-standard bp3-icon-reset bp3-minimal rm-iframe__edit-btn rm-video-player__edit-btn" content=""></button></div><iframe class="rm-video-player" style="width: 100%; height: 100%; pointer-events: auto;" src="${src}" frameborder="no" allowfullscreen="" sandbox="allow-top-navigation-by-user-activation allow-same-origin allow-forms allow-scripts allow-popups"></iframe></div></div>`;
  }

  document.arrive(
    ".roam-app div.rm-block__input button",
    { existing: true },
    async function (el: HTMLButtonElement) {
      if (el.innerText === "videoo") {
        const currentIndex = [...el.closest("div.rm-block__input").querySelectorAll("button")]
          ?.filter((a) => a.innerText === "videoo")
          .indexOf(el);
        const { string } = await getClosestBlockInfo(el);
        const url = string.match(/\{\{videoo\:\s*(.*?)\}\}/g)?.[currentIndex];
        if (url) {
          const [videoPlayUrl] = getVideoUrl(url);
          el.outerHTML = getVideoHTML(videoPlayUrl);
        }
      }
    }
  );

  document.arrive(
    ".roam-app div.rm-block__input a",
    { existing: true },
    async function (el: HTMLLinkElement) {
      if (el.href) {
        const [_, regex] = getVideoUrl(el.href);
        if (regex) {
          const template = document.createElement("template");
          template.innerHTML = `<span class="bp3-button bp3-minimal bp3-icon-video bp3-small dont-focus-block" tabindex="0"></span>`;

          (template.content.firstChild as HTMLElement).onclick = async function (e: MouseEvent) {
            const target = e.target as HTMLElement;
            // 当前 block 的第几个按钮(链接对应的)
            const currentIndex = [
              ...target.closest("div.rm-block__input").querySelectorAll(".bp3-icon-video")
            ]?.indexOf(target);
            const { string, uid } = await getClosestBlockInfo(target);
            const linkRegex = new RegExp(
              `(?<!(\\{\\{videoo\\:\\s*))\\[([^(\\[\\])]*?)\\]\\((${regex
                .toString()
                .slice(1, -1)})\\)`,
              "g"
            );
            let i = 0;
            let _string = string.replace(linkRegex, (m) => {
              return currentIndex === i++ ? `{{videoo: ${m}}}` : m;
            });
            if (_string !== string) {
              // target.parentNode.removeChild(target);
              target
                .closest("div.rm-block__input")
                .querySelectorAll(".bp3-icon-video")
                .forEach((a) => a.remove());
              window.roam42.common.updateBlock(uid, _string);
            } else {
              i = 0;
              _string = string.replace(
                new RegExp(`(?<!(\\{\\{videoo\\:\\s*))(${regex.toString().slice(1, -1)})`, "g"),
                (m) => {
                  return currentIndex === i++ ? `{{videoo: ${m}}}` : m;
                }
              );
              if (_string !== string) {
                // target.parentNode.removeChild(target);
                target
                  .closest("div.rm-block__input")
                  .querySelectorAll(".bp3-icon-video")
                  .forEach((a) => a.remove());
                window.roam42.common.updateBlock(uid, _string);
              }
            }
          };

          el.before(template.content.firstChild);
        }
      }
    }
  );
});
