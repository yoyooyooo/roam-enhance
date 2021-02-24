import * as utils from "./utils";
import * as dateProcessing from "./dateProcessing";
import * as common from "./common";

const yoyo = {};
Object.keys(common).forEach((key) => (yoyo[key] = common[key]));

yoyo.utils = utils;
yoyo.dateProcessing = dateProcessing;

if (typeof window.yoyo == "undefined") {
  window.yoyo = yoyo;
}

export default yoyo;
