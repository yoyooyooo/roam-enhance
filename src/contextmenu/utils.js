export const onClickMap = {};

export const getMenuHTML = (menu, parentText = "") => {
  return menu
    .map((a) => {
      if (a.children && a.children.length) {
        return `<li class="bp3-submenu">
                        <span class="bp3-popover-wrapper">
                            <span class="bp3-popover-target">
                                <a class="bp3-menu-item" tabindex="0" data-key="${
                                  parentText + a.text
                                }">
                                    <div class="bp3-text-overflow-ellipsis bp3-fill">${a.text}</div>
                                    <span icon="caret-right" class="bp3-icon bp3-icon-caret-right">
                                        <svg data-icon="caret-right" width="16" height="16" viewBox="0 0 16 16">
                                            <desc>caret-right</desc><path d="M11 8c0-.15-.07-.28-.17-.37l-4-3.5A.495.495 0 006 4.5v7a.495.495 0 00.83.37l4-3.5c.1-.09.17-.22.17-.37z" fill-rule="evenodd">
                                            </path>
                                        </svg>
                                    </span>
                                </a>
                            </span>
                            <div class="bp3-overlay bp3-overlay-inline">
                                <div class="bp3-transition-container bp3-popover-appear-done bp3-popover-enter-done" style="position: absolute; will-change: transform; top: 0px; left: 100%; /*transform: translate3d(183px, 0px, 0px);*/">
                                    <div class="bp3-popover bp3-minimal bp3-submenu" style="transform-origin: left center;">
                                        <div class="bp3-popover-content">
                                            <ul class="bp3-menu">
                                                ${getMenuHTML(a.children, parentText + a.text)}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </span>
                    </li>`;
      } else {
        onClickMap[parentText + a.text] = a.onClick;
        return `<li>
                        <a class="bp3-menu-item bp3-popover-dismiss" data-key="${
                          parentText + a.text
                        }">
                            <div class="bp3-text-overflow-ellipsis bp3-fill">${a.text}</div>
                        </a>
                    </li>`;
      }
    })
    .join("");
};

export function mergeMenuToDOM(menuDOM, menu, onClickArgs) {
  const addItem = document.createElement("template");
  addItem.innerHTML = getMenuHTML(menu);
  [...addItem.content.childNodes].forEach((a) => {
    a.addEventListener("click", async (e) => {
      if (
        e.target.classList.contains("bp3-menu-item") ||
        (e.target.classList.contains("bp3-fill") &&
          e.target.classList.contains("bp3-text-overflow-ellipsis"))
      ) {
        const onClick = onClickMap[e.target.closest(".bp3-menu-item").dataset.key];
        if (onClick) {
          try {
            await onClick(onClickArgs);
          } catch (e) {
            console.log(e);
            iziToast.error({
              title: "操作失败",
              position: "topCenter",
              timeout: 3000
            });
          }
        }
      }
    });
    [...a.querySelectorAll(".bp3-popover-wrapper")].forEach((a) => {
      a.addEventListener("mouseenter", async (e) => {
        if (e.target.parentNode.classList.contains("bp3-submenu")) {
          e.target.querySelector(".bp3-popover-target").classList.add("bp3-popover-open");
          e.target.querySelector(".bp3-overlay").classList.add("bp3-overlay-open");
        }
      });
      a.addEventListener("mouseleave", async (e) => {
        if (e.target.parentNode.classList.contains("bp3-submenu")) {
          e.target.querySelector(".bp3-popover-target").classList.remove("bp3-popover-open");
          e.target.querySelector(".bp3-overlay").classList.remove("bp3-overlay-open");
        }
      });
    });
  });
  const divider = document.createElement("li");
  divider.className = "bp3-menu-divider";
  addItem.content.childNodes[addItem.content.childNodes.length - 1].after(divider);
  menuDOM.prepend(addItem.content);
}
