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
        resolve(closedBy === "timeout" ? false : JSON.parse(closedBy));
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
      title: message,
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
      },
      ...options
    });
  });
}
