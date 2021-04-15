import { runDynamicMenu } from "@/utils/common";
import { render } from "./render";

runDynamicMenu("Replace block", ({ name, ctx }) => {
  const menuMap = {
    [name]: {
      text: "替换 Block 文本",
      key: name,
      help: `<b>替换 block 文本</b><br/>适用范围：通用`,
      onClick: async ({ currentUid }) => {
        render(name, { currentUid });
      }
    } as Menu
  };

  window.roamEnhance.contextMenu.registerMenuCommand("block", menuMap);
  window.roamEnhance.contextMenu.registerMenuCommand("pageTitle", menuMap);
  window.roamEnhance.contextMenu.registerMenuCommand("pageTitle_sidebar", menuMap);
});
