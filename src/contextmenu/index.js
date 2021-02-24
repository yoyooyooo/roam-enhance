import { retry } from "../utils/common";
import { getMenu } from "./menu";
import { mergeMenu } from "./utils";

let mouseX;
let mouseY;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

const observer = new MutationObserver((mutationsList, observer) => {
  const isContextMenu = !!mutationsList.find(
    (m) =>
      m.type === "childList" &&
      (m.target.className === "bp3-context-menu" ||
        m.target.className === "bp3-context-menu-popover-target")
  );
  if (isContextMenu) {
    // 关闭右键菜单
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
    // 打开右键菜单
    if (portalMutation) {
      const currentTargets = document.elementsFromPoint(mouseX, mouseY);
      const [menu, onClickArgs] = getMenu(currentTargets[1]);
      menu && mergeMenu(portalMutation.target.querySelector("ul.bp3-menu"), menu, onClickArgs);
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
