import yoyo from "./globals";
import "./contextmenu";
import { addStyle } from "./utils/common";

// @ts-ignore
if (typeof window.yoyo == "undefined") {
  // @ts-ignore
  window.yoyo = yoyo;

  addStyle(
    `
    .bp3-submenu .bp3-overlay:not(.bp3-overlay-open) {
      display: none;
    }
    .bp3-submenu > .bp3-popover-wrapper {
      position: relative;
    }
    .iziToast > .iziToast-body .iziToast-buttons {
      float: none;
      text-align: center;
      margin-left: -28px;
    }
    .iziToast > .iziToast-body .iziToast-icon {
      top: 20px;
    }
    .iziToast-buttons .iziToast-buttons-child {
      top: 6px;
    }
  `,
    "roam-enhance"
  );
}
