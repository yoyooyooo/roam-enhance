import { retry } from "../utils/common";
import { getSelectBlockUids } from "../globals/utils";
import { getMenu, initMenu } from "./menu";
import { mergeMenuToDOM } from "./utils";

let mouseX;
let mouseY;

document.addEventListener("mousedown", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

const observer = new MutationObserver(async (mutationsList, observer) => {
  const isContextMenu = !!mutationsList.find(
    (m) =>
      m.type === "childList" &&
      (m.target.className === "bp3-context-menu" ||
        m.target.className === "bp3-context-menu-popover-target")
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
        m.type === "childList" && m.addedNodes.length > 0 && m.target.className === "bp3-portal"
    );
    // open right click menu
    if (portalMutation) {
      console.time();
      await initMenu();
      console.timeEnd();
      const path = document.elementsFromPoint(mouseX, mouseY);
      const [menu, onClickArgs] = getMenu(path);
      const selectUids = getSelectBlockUids();
      menu &&
        mergeMenuToDOM(portalMutation.target.querySelector("ul.bp3-menu"), menu, {
          ...onClickArgs,
          selectUids
        });
    }
  }
});

retry(() => {
  initMenu();
});

retry(() => {
  observer.observe(document.body, {
    attributes: false,
    childList: true,
    subtree: true
  });
});
