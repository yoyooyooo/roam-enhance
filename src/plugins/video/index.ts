import { retry } from "../../utils/common";

const videoMap = new Map<RegExp, (...args: any[]) => string>().set(
  /https\:\/\/www\.bilibili\.com\/video\/([^\s]*)/,
  (m, id) =>
    `//player.bilibili.com/player.html?bvid=${id}&amp;page=1&amp;high_quality=1&amp;as_wide=1&amp;allowfullscreen=true`
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

// @ts-ignore
window.roamEnhance.__resetVideoBlock = async function (el: HTMLButtonElement) {
  const { string, uid } = await getClosestBlockInfo(el);
  await window.roam42.common.updateBlock(
    uid,
    string.replace(/\{\{videoo\:\s*(.*)\}\}/, (m, url) => url)
  );
};

function getVideoHTML(src: string) {
  return `<div class="rm-iframe__spacing-wrapper rm-video-player__spacing-wrapper"><div class="rm-iframe__container rm-video-player__container hoverparent"><div class="hoveronly"><button onclick="window.roamEnhance.__resetVideoBlock(this);" style="position: absolute; right: 25px; top: 0; z-index: 10;" class="bp3-button bp3-small bp3-icon-standard bp3-icon-reset bp3-minimal rm-iframe__edit-btn rm-video-player__edit-btn" content=""></button></div><iframe class="rm-video-player" style="width: 100%; height: 100%; pointer-events: auto;" src="${src}" frameborder="no" allowfullscreen="" sandbox="allow-top-navigation-by-user-activation allow-same-origin allow-forms allow-scripts allow-popups"></iframe></div></div>`;
}

retry(() => {
  document.arrive(
    ".roam-app div.rm-block__input button",
    { existing: true },
    async function (el: HTMLButtonElement) {
      if (el.innerText === "videoo") {
        const { string } = await getClosestBlockInfo(el);
        const url = string.match(/\{\{videoo\:\s*(.*)\}\}/)[1];
        const [videoPlayUrl] = getVideoUrl(url);
        el.outerHTML = getVideoHTML(videoPlayUrl);
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
            const { string, uid } = await getClosestBlockInfo(target);
            target.parentNode.removeChild(target);
            window.roam42.common.updateBlock(
              uid,
              string.replace(regex, (m) => `{{videoo: ${m}}}`)
            );
          };

          el.before(template.content.firstChild);
        }
      }
    }
  );
}, "video");
