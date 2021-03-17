import { runPlugin } from "../../utils/common";

runPlugin("reading-mode", () => {
  ((id) => {
    let button = document.getElementById(id) as HTMLElement;
    button && button.remove();

    const template = document.createElement("template");
    template.innerHTML = `<span id="id" title="当前:编辑模式" class="bp3-button bp3-minimal bp3-icon-edit pointer bp3-small"></span>`;
    (template.content.firstChild as HTMLElement).onclick = () => {
      const classList = button.classList;
      if (classList.contains("bp3-icon-edit")) {
        classList.remove("bp3-icon-edit");
        classList.add("bp3-icon-disable");
        button.title = "当前:阅读模式(禁用编辑)";

        const style = document.createElement("style");
        style.id = id + "-css";
        style.innerText =
          '.rm-block__input{pointer-events: none;}.rm-block-main {cursor: not-allowed;}.bp3-tag,.bp3-small,.bp3-popover-wrapper,.rm-paren,.block__input img {pointer-events: auto;cursor: pointer;}.rm-page-ref[data-tag^="."]{display:none !important;}';
        document.getElementsByTagName("head")[0].appendChild(style);

        window.roam42.help.displayMessage("切换至阅读模式", 2000);
      } else {
        classList.add("bp3-icon-edit");
        classList.remove("bp3-icon-disable");
        document.getElementById(id + "-css").remove();

        window.roam42.help.displayMessage("切换至编辑模式", 2000);
      }
    };
    button = template.content.firstChild as HTMLElement;

    const topbar = document.querySelector(".rm-topbar");
    const dot = document.querySelector(".rm-topbar .bp3-popover-wrapper");
    topbar.insertBefore(button, dot);
  })("reading-mode");
});
