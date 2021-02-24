import { blockMenu, pageTitleMenu } from "./menu";
import { debounce, retry, getBlockUidFromId } from "../utils/common";
import { mergeMenu, onClickMap } from "./utils";

let open = false;
let currentUid;
let currentTarget;
let pageTitle;

// 监听点击右键之前的元素，暂时靠鼠标移动获取
document.addEventListener("mousemove", (e) => {
  if (open) return;
  debounce(
    () =>
      requestAnimationFrame(() => {
        if (
          e.target.classList.contains("rm-bullet__inner") ||
          e.target.classList.contains("rm-bullet") ||
          e.target.classList.contains("rm-caret") ||
          e.target.classList.contains("block-expand")
        ) {
          currentTarget = e.target;
          currentUid = getBlockUidFromId(
            e.target.closest(".rm-block-main").querySelector(".rm-block__input").id
          );
          return;
        }
        if (
          e.target.className === "rm-title-display" ||
          e.target.parentNode.className === "rm-title-display"
        ) {
          currentTarget = e.target;
          pageTitle = e.target.closest(".rm-title-display").innerText;
        }
      }),
    100
  )();
});

const observer = new MutationObserver((mutationsList, observer) => {
  const isContextMenu = !!mutationsList.find(
    (m) => m.type === "childList" && m.target.className === "bp3-context-menu"
  );
  if (isContextMenu) {
    // 关闭右键菜单
    if (
      mutationsList.find(
        (m) =>
          m.type === "childList" && m.removedNodes.length > 0 && m.target.className === "bp3-portal"
      )
    ) {
      console.log("关闭");
      open = false;
      currentUid = null;
      pageTitle = null;
      return;
    }
    let portalMutation = mutationsList.find(
      (m) =>
        m.type === "childList" && m.addedNodes.length > 0 && m.target.className === "bp3-portal"
    );
    // 打开右键菜单
    if (portalMutation) {
      console.log("打开", { uid: currentUid, pageTitle });
      open = true;
      if (!(currentUid || pageTitle)) {
        // roam42.help.displayMessage(`不是小圆点和标题`, 2000);
        return;
      }
      mergeMenu(
        portalMutation.target.querySelector("ul.bp3-menu"),
        currentUid ? blockMenu : pageTitleMenu,
        { currentUid, pageTitle, currentTarget }
      );
    }
  }
});

retry(() => {
  observer.observe(document.body, {
    attributes: false,
    childList: true,
    subtree: true
  });
});
