import { runPlugin } from "@/utils/common";

type route = {
  oldURL?: string;
  url: string;
  offsetTop?: number;
};

runPlugin("save-scroll-position", ({ ctx }) => {
  class Route {
    routes: route[] = [];

    offset = 0; // 路由偏移量，负数为返回，0 为当前是最新路由
    toRunAfterRendered: Function[] = [];

    constructor() {
      this.init();
      this.listenPageRendered();
      this.listenPageChange();
    }

    savePosition(route: route) {
      route.offsetTop = document.querySelector(".rm-article-wrapper").scrollTop;
    }

    resetPosition(route: route) {
      this.toRunAfterRendered.push(() => {
        document.querySelector(".rm-article-wrapper").scrollTop = route.offsetTop;
      });
    }

    goToTop() {
      //   this.toRunAfterRendered.push(() => {
      //     document.querySelector(".rm-article-wrapper").scrollTop = 0;
      //   });
    }

    init() {
      this.offset = 0;
      this.routes = [
        {
          url: location.href
        }
      ];
    }

    clearToRunAfterRendered() {
      console.log("clearToRunAfterRendered", this.toRunAfterRendered);
      while (this.toRunAfterRendered.length) {
        this.toRunAfterRendered.pop()();
      }
    }

    // 页面先跳转再渲染，有些内容多的页面会有一定的延迟，重置滚动位置需要在渲染结束后执行
    listenPageRendered() {
      document.arrive(".roam-article", (el) => {
        this.clearToRunAfterRendered(); // change page
      });
      const observer = new MutationObserver((mutationsList, observer) => {
        if (mutationsList.find((a) => (a.target as HTMLElement).className === "roam-article")) {
          // change zoom
          this.clearToRunAfterRendered();
        }
      });

      observer.observe(document.body, {
        attributes: false,
        childList: true,
        subtree: true
      });
    }

    listenPageChange() {
      window.addEventListener("hashchange", (e) => {
        const currentRoute = this.routes[this.routes.length - 1 + this.offset];
        if (currentRoute) {
          this.savePosition(currentRoute);
          const prevRoute = this.routes[this.routes.length - 1 + this.offset - 1];
          if (prevRoute) {
            if (prevRoute.url === e.newURL) {
              // go back
              this.resetPosition(prevRoute);
              this.offset--;
            } else {
              const newRoute = {
                url: e.newURL,
                offsetTop: document.querySelector(".rm-article-wrapper")?.scrollTop || 0
              };

              const nextRoute = this.routes[this.routes.length - 1 + this.offset + 1];

              if (nextRoute && this.offset < 0) {
                if (nextRoute.url !== e.newURL) {
                  this.goToTop();
                  // jump to new URL
                  this.routes = [...this.routes.slice(0, this.offset), newRoute];
                  this.offset = 0;
                } else {
                  this.resetPosition(prevRoute);
                  // go forward
                  this.offset++;
                }
              } else {
                this.goToTop();
                // last to new URL
                this.routes.push(newRoute);
                this.offset = 0;
              }
            }
          } else {
            this.routes.push({ url: e.newURL });
          }
        }

        if (this.routes.length > 10) {
          this.routes = this.routes.slice(-10);
        }
      });
    }
  }

  ctx.route = new Route();
});
