import { getBlockUidFromId, getSelectBlockUids } from "../globals/utils";
import { getMenu } from "./menu";
import { ClickArea } from "./types";
import { mergeMenuToDOM } from "./utils";

export function enhanceContextMenu() {
  let mouseX: number;
  let mouseY: number;

  document.addEventListener("mousedown", (e) => {
    if (e.button === 2) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }
  });

  const observer = new MutationObserver(async (mutationsList, observer) => {
    const isContextMenu = !!mutationsList.find(
      (m) =>
        m.type === "childList" &&
        ((m.target as HTMLElement).className === "bp3-context-menu" ||
          (m.target as HTMLElement).className === "bp3-context-menu-popover-target")
    );
    if (isContextMenu) {
      // close right click menu
      // if (
      //   mutationsList.find(
      //     (m) =>
      //       m.type === "childList" && m.removedNodes.length > 0 && m.target.className === "bp3-portal"
      //   )
      // ) {
      //   console.log("关闭");
      // }
      let portalMutation = mutationsList.find(
        (m) =>
          m.type === "childList" &&
          m.addedNodes.length > 0 &&
          (m.target as HTMLElement).className === "bp3-portal"
      );
      // open right click menu
      if (portalMutation) {
        const path = document.elementsFromPoint(mouseX, mouseY);
        const onClickArgs = {} as any;
        let clickArea: ClickArea = null;
        onClickArgs.target = path[1]; // the closest element over mouse, path[0] is overlay
        // click on block
        const rmBlockMainDOM = path.find((a) => a.classList.contains("rm-block-main"));
        if (rmBlockMainDOM) {
          onClickArgs.currentUid = getBlockUidFromId(
            rmBlockMainDOM.querySelector(".rm-block__input").id
          );
          clickArea = "block";
        }
        // click on page title
        const pageTitleDOM = path.find((a) =>
          a.classList.contains("rm-title-display")
        ) as HTMLElement;
        if (pageTitleDOM) {
          onClickArgs.pageTitle = pageTitleDOM.innerText;
          onClickArgs.currentUid = await window.roam42.common.getPageUidByTitle(
            onClickArgs.pageTitle
          );
          if (path.find((a) => a.classList.contains("sidebar-content"))) {
            clickArea = "pageTitle_sidebar";
          } else {
            clickArea = "pageTitle";
          }
        }

        const menu = await getMenu(path, clickArea, onClickArgs);
        onClickArgs.selectUids = getSelectBlockUids();
        menu &&
          mergeMenuToDOM(
            (portalMutation.target as HTMLElement).querySelector("ul.bp3-menu"),
            menu,
            onClickArgs
          );
      }
    }
  });

  observer.observe(document.body, {
    attributes: false,
    childList: true,
    subtree: true
  });
}
