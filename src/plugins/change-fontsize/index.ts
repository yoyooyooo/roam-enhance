import { retry } from "../../utils/common";
import "./index.css";

retry(() => {
  ((id) => {
    let fontSize = +getComputedStyle(document.documentElement)
      .getPropertyValue("font-size")
      .match(/\d+/)[0];
    document.body.style.fontSize = `clamp(10px, var(--font-size, "${fontSize}px"), 25px)`;
    function changeFontSize(isAdd: boolean, widthStep = 20) {
      document.documentElement.style.setProperty(
        "--font-size",
        `${isAdd ? ++fontSize : --fontSize}px`
      );
    }

    let button = document.getElementById(id);
    button && button.remove();

    const template = document.createElement("div");
    template.id = id;
    template.innerHTML = `<span class="chang-font-button bp3-button bp3-minimal bp3-icon-font pointer bp3-small">-</span><span id="${id}" class="chang-font-button bp3-button bp3-minimal bp3-icon-font pointer bp3-small">+</span>`;
    (template.childNodes[0] as HTMLElement).onclick = () => {
      changeFontSize(false);
    };
    (template.childNodes[1] as HTMLElement).onclick = () => {
      changeFontSize(true);
    };

    const topbar = document.querySelector(".rm-topbar");
    const dot = document.querySelector(".rm-topbar .bp3-popover-wrapper");
    topbar.insertBefore(template, dot);
  })("change-font");
}, "change-font");
