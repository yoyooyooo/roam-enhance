export function addScript(src: string, id: string) {
  const old = document.getElementById(id);
  old && old.remove();
  const s = document.createElement("script");
  s.src = src;
  id && (s.id = id);
  s.async = true;
  s.type = "text/javascript";
  document.getElementsByTagName("head")[0].appendChild(s);
}

export const addStyle = (content: string) => {
  const css = document.createElement("style");
  css.textContent = content;
  document.getElementsByTagName("head")[0].appendChild(css);
  return css;
};

export function retry(fn: any, name = "") {
  let n = 0;
  function _retry(fn: any) {
    try {
      fn();
    } catch (e) {
      console.log("error", e);
      n < 5 && setTimeout(() => _retry(++n), 3000);
      n > 5 && window.roam42?.help.displayMessage(`${name}加载失败`, 2000);
    }
  }

  setTimeout(() => _retry(fn), 3000);
}

export function confirm(message: string, options = {}) {
  return new Promise((resolve) => {
    window.iziToast.question({
      timeout: 10000,
      close: false,
      overlay: true,
      displayMode: 1,
      id: "question",
      zindex: 999,
      title: message,
      position: "center",
      buttons: [
        [
          "<button><b>YES</b></button>",
          function (instance, toast) {
            instance.hide({ transitionOut: "fadeOut" }, toast, "true");
          },
          true
        ],
        [
          "<button>NO</button>",
          function (instance, toast) {
            instance.hide({ transitionOut: "fadeOut" }, toast, "false");
          },
          false
        ]
      ],
      onClosing: function (instance, toast, closedBy) {
        resolve(closedBy === "timeout" ? false : closedBy);
      },
      ...options
    });
  });
}

export function prompt(message: string, options = {}) {
  return new Promise((resolve) => {
    let res: string;
    window.iziToast.info({
      timeout: 20000,
      overlay: true,
      displayMode: 1,
      id: "inputs",
      zindex: 999,
      title: "Inputs",
      message: "Examples",
      position: "center",
      drag: false,
      inputs: [
        [
          '<input type="text">',
          "keyup",
          function (instance, toast, input, e) {
            res = input.value;
          },
          true
        ]
      ],
      buttons: [
        [
          "<button><b>YES</b></button>",
          function (instance, toast) {
            instance.hide({ transitionOut: "fadeOut" }, toast, res);
          },
          false
        ],
        [
          "<button>NO</button>",
          function (instance, toast) {
            instance.hide({ transitionOut: "fadeOut" }, toast, "");
          },
          false
        ]
      ],
      onClosing: function (instance, toast, closedBy) {
        resolve((closedBy !== "timeout" && closedBy) || "");
      }
    });
  });
}

export function getValueInOrderIfError(fns: Function[], defaultValue: any) {
  while (fns.length > 0) {
    const fn = fns.shift();
    try {
      return typeof fn === "function" ? fn() : fn;
    } catch (e) {}
  }
  return defaultValue;
}

export function getBlockUidFromId(id: string) {
  return getValueInOrderIfError(
    [
      () => id.match(/(?<=-).{9}$(?=[^-]*$)/)[0],
      () => (id.match(/uuid[^uuid]*(?=(uuid[^uuid]*){0}$)/) || id.match(/uuid.*$/))[0],
      () => id.slice(-9)
    ],
    ""
  );
}
