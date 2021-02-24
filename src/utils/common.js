export function addScript(src, id) {
  const old = document.getElementById(id);
  old && old.remove();
  const s = document.createElement("script");
  s.src = src;
  id && (s.id = id);
  s.async = true;
  s.type = "text/javascript";
  document.getElementsByTagName("head")[0].appendChild(s);
}

export function retry(fn, name = "") {
  let n = 0;
  function _retry(fn) {
    try {
      fn();
    } catch (e) {
      console.log("error", e);
      n < 5 && setTimeout(() => _retry(++n), 3000);
      n > 5 && roam42 && roam42.help.displayMessage(`${name}加载失败`, 2000);
    }
  }

  setTimeout(() => _retry(fn), 3000);
}

export function debounce(fn, delay) {
  let timer = null;
  const that = this;
  return function (...args) {
    if (timer) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(that, args), delay);
    } else {
      timer = setTimeout(() => fn.apply(that, args), delay);
    }
  };
}

export function confirm(message, options = {}) {
  return new Promise((resolve) => {
    iziToast.question({
      timeout: 10000,
      close: false,
      overlay: true,
      displayMode: "once",
      id: "question",
      zindex: 999,
      title: "",
      message,
      position: "center",
      buttons: [
        [
          "<button><b>YES</b></button>",
          function (instance, toast) {
            instance.hide({ transitionOut: "fadeOut" }, toast, true);
          },
          true
        ],
        [
          "<button>NO</button>",
          function (instance, toast) {
            instance.hide({ transitionOut: "fadeOut" }, toast, false);
          }
        ]
      ],
      onClosing: function (instance, toast, closedBy) {
        resolve(closedBy === "timeout" ? false : closedBy);
      },
      onClosed: function (instance, toast, closedBy) {},
      ...message
    });
  });
}

export function getValueInOrderIfError(fns) {
  while (fns.length > 0) {
    const fn = fns.shift();
    try {
      return typeof fn === "function" ? fn() : fn;
    } catch (e) {}
  }
}

export function getBlockUidFromId(id) {
  return getValueInOrderIfError(
    [
      () => id.match(/(?<=-).{9}$(?=[^-]*$)/)[0],
      () => (id.match(/uuid[^uuid]*(?=(uuid[^uuid]*){0}$)/) || id.match(/uuid.*$/))[0],
      () => id.slice(-9)
    ],
    ""
  );
}
