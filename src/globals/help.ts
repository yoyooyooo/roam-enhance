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
      position: "topCenter",
      buttons: [
        [
          `<button><b>${navigator.language === "zh-CN" ? "是" : "YES"}</b></button>`,
          function (instance, toast) {
            instance.hide({ transitionOut: "fadeOut" }, toast, "true");
          },
          true
        ],
        [
          `<button>${navigator.language === "zh-CN" ? " 否" : "NO"}</button>`,
          function (instance, toast) {
            instance.hide({ transitionOut: "fadeOut" }, toast, "false");
          },
          false
        ]
      ],
      onClosing: function (instance, toast, closedBy) {
        resolve(closedBy === "timeout" ? false : JSON.parse(closedBy));
      },
      ...options
    });
  });
}

export function prompt(
  message: string,
  options: { defaultValue?: string | number } = {}
): Promise<string> {
  return new Promise((resolve) => {
    const { defaultValue } = options;
    let res: string = `${defaultValue}`;
    window.iziToast.info({
      timeout: 20000,
      overlay: true,
      displayMode: 1,
      id: "inputs",
      zindex: 999,
      title: message,
      position: "topCenter",
      drag: false,
      inputs: [
        [
          `<input type="text" value="${defaultValue}">`,
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
      },
      ...options
    });
  });
}
