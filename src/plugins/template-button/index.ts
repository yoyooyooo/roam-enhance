const observer = new MutationObserver((mutationsList, observer) => {
  for (let mutation of mutationsList) {
    if (mutation.type === "childList") {
      const buttons = document.querySelectorAll("button");
      [...buttons].forEach((a) => {
        a.setAttribute("content", a.innerText);
      });
    }
  }
});

observer.observe(document.body, {
  attributes: false,
  childList: true,
  subtree: true
});

(async () => {
  const pageUid = await window.roam42.common.getPageUidByTitle("roam/enhance/template-button");

  const info = await window.roam42.common.getBlockInfoByUID(pageUid, true);
  let buttonBlocks = info[0][0].children;

  window.roamEnhance.contextMenu.registerMenu.add((menu, clickArea, onClickArgs) => {
    if (onClickArgs.pageTitle === "roam/enhance/template-button") {
      menu.unshift({
        text: navigator.language === "zh-CN" ? "刷新配置" : "refresh configure",
        onClick: async () => {
          const info = await window.roam42.common.getBlockInfoByUID(pageUid, true);
          buttonBlocks = info[0][0].children;
        }
      });
    }
  });

  document.addEventListener("click", async (e) => {
    const target = e.target as HTMLElement;
    if (target.tagName !== "BUTTON" || target.className !== "bp3-button bp3-small dont-focus-block")
      return;

    let currentUid: string;
    try {
      currentUid = window.yoyo.utils.getBlockUidFromId(target.closest(".rm-block__input").id);
    } catch (e) {
      console.log(e);
      window.roam42.help.displayMessage("找不到 uid", 2000);
      return;
    }
    if (!currentUid) return;

    buttonBlocks?.forEach(async (a) => {
      if (target.innerText.trim() === a.string.trim()) {
        const firstChildString = a.children?.[0].string;
        const js = firstChildString.match(/^\`\`\`javascript\n([\s\S]*)\`\`\`$/);
        if (js) {
          const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
          try {
            await new AsyncFunction("$currentUid", js[1])(currentUid);
          } catch (e) {
            console.log(e);
            window.iziToast.info({
              position: "topCenter",
              title: navigator.language === "zh-CN" ? "执行错误" : "task error"
            });
          }
        }
      }
    });
  });
})();
