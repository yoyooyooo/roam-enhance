import { getMetadataMenu } from "./metadata";
import "./index.css";

window.roamEnhance.contextMenu.registerMenu.add(async (menu, clickArea, onClickArgs) => {
  const metaDataMenu = await getMetadataMenu();
  console.log({ metaDataMenu, menu });
  metaDataMenu && menu.unshift(metaDataMenu);
});
