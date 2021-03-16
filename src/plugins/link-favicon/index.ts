//@ts-nocheck
import { runPlugin } from "../../utils/common";

runPlugin("link-favicon", () => {
  document.arrive(".roam-app div.rm-block__input a", { existing: true }, (a) => {
    if (a.hostname && a.hostname !== document.location.hostname) {
      if (a.innerText == "*") {
        a.style.background = `url(https://www.google.com/s2/favicons?sz=16&domain=${a.hostname}) right center no-repeat`;
        a.style.paddingRight = "18px";
      } else {
        a.style.background = `url(https://www.google.com/s2/favicons?sz=16&domain=${a.hostname}) left center no-repeat`;
        a.style.paddingLeft = "20px";
      }
    }
  });
});
