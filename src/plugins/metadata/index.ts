import { runPlugin } from "../../utils/common";
import "./index.css";
import { getMetadataMenu } from "./metadata";

runPlugin("metadata", () => {
  window.roamEnhance.contextMenu.registerMenu.add(async (menu, clickArea, onClickArgs) => {
    const metaDataMenu = await getMetadataMenu();
    metaDataMenu && menu.unshift(metaDataMenu);
  });
});
