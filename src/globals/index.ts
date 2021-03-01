import * as utils from "./utils";
import * as dateProcessing from "./dateProcessing";
import * as common from "./common";

const yoyo = { common, utils, dateProcessing };
// Object.keys(common).forEach((key) => (yoyo[key] = common[key]));

// @ts-ignore
if (typeof window.yoyo == "undefined") {
  // @ts-ignore
  window.yoyo = yoyo;
}

export default yoyo;
