import { getMetadataMenu } from "./metadata";
import "./index.css";

window.roamEnhance.contextMenu.registerMenu.add(async (menu, clickArea, onClickArgs) => {
  const metaDataMenu = await getMetadataMenu();
  metaDataMenu && menu.unshift(metaDataMenu);
});
