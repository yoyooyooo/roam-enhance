import { getMetadataMenu } from "./metadata";
import "./index.css";

window.roamEnhance.loader.registerPlugin("metadata", {
  ctx: { getMetadataMenu }
});
