import { runPlugin } from "../../utils/common";
import "./index.css";
import { getMetadataMenu } from "./metadata";

runPlugin("metadata", () => {
  window.roamEnhance.contextMenu.registerMenu.add(async (menu, clickArea, onClickArgs) => {
    if (clickArea === "pageTitle" || clickArea === "pageTitle_sidebar") {
      const metaDataMenu = await getMetadataMenu();
      metaDataMenu && menu.unshift(metaDataMenu);
    }
  });
});
