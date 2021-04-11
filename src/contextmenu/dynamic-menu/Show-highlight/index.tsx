import { runDynamicMenu } from "@/utils/common";
import { getSingleDOM } from "@/utils/dom";
import { Drawer } from "antd";
import { debounce } from "lodash";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

runDynamicMenu("Show highlight", ({ ctx, name }) => {
  function render(Component: React.ReactElement) {
    ReactDOM.render(Component, getSingleDOM(name));
  }

  const Component: React.FC<{ block: Roam.Block; highlights: Roam.Block[] }> = ({
    block,
    highlights
  }) => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
      setOpen(true);
    }, []);

    useEffect(() => {
      ctx.showing = open;
    }, [open]);

    return (
      <Drawer
        title={
          <div
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              width: "calc(100% - 50px)"
            }}
            dangerouslySetInnerHTML={{
              __html: block.title || window.roamEnhance.utils.parseText(block.string)
            }}
          />
        }
        mask={false}
        height={400}
        visible={open}
        destroyOnClose
        placement='bottom'
        maskClosable={false}
        onClose={() => setOpen(false)}
        afterVisibleChange={(visible) => {
          if (!visible) {
            const dom = document.getElementById(name);
            ReactDOM.unmountComponentAtNode(dom) && dom.parentNode?.removeChild(dom);
          }
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          {highlights.map((a, i) => {
            return (
              <div
                key={a.uid}
                style={{
                  cursor: "pointer",
                  padding: "8px 0px",
                  userSelect: "none",
                  ...(i !== highlights.length - 1 ? { borderBottom: "1px solid #ddd" } : {})
                }}
                onMouseDown={async (e) => {
                  if (e.button === 0) {
                    if (e.shiftKey) {
                      await window.roamAlphaAPI.ui.rightSidebar.addWindow({
                        window: { "block-uid": a.uid, type: "outline" }
                      });
                    } else {
                      document.location.href = window.roam42.common.baseUrl().href + "/" + a.uid;
                    }
                  }
                }}
              >
                <div dangerouslySetInnerHTML={{ __html: window.yoyo.utils.parseText(a.string) }} />
              </div>
            );
          })}
        </div>
      </Drawer>
    );
  };

  // let currentUid: string;
  // let _currentUid: string;
  const showHighlight = debounce(
    async ({ currentUid }) => {
      // currentUid = ctx.showing ? currentUid : _currentUid;
      if (!currentUid) return;
      let highlights = [];
      await window.yoyo.utils.patchBlockChildren(
        currentUid,
        (a) => {
          const m = (a.title || a.string)?.match(/\^\^([\s\S]*?)\^\^/g);
          m && highlights.push(a);
        },
        { skipTop: false }
      );
      if (highlights.length > 0) {
        const info = await window.roam42.common.getBlockInfoByUID(currentUid);
        console.log({ highlights });
        render(<Component highlights={highlights} block={info[0][0]} />);
      } else {
        window.iziToast.info({
          position: "topCenter",
          title: navigator.language === "zh-CN" ? "提取不到高亮内容" : "Can't extract anything"
        });
      }
    },
    500,
    { leading: true, trailing: true }
  );

  const menuMap = {
    "Show highlight": {
      text: "查看高亮",
      key: "Show highlight",
      help: `<b>查看子级高亮</b><br/>适用范围：Block和 pagetitle`,
      onClick: async ({ currentUid }) => {
        // _currentUid = window.roamEnhance.contextMenu.onClickArgs.currentUid;
        showHighlight({ currentUid });
      }
    }
  };
  // document.leave("textarea.rm-block-input", (e) => {
  //   _currentUid = window.roamEnhance.contextMenu.onClickArgs.currentUid;
  //   showHighlight();
  // });
  window.roamEnhance.contextMenu.registerMenuCommand("block", menuMap);
  window.roamEnhance.contextMenu.registerMenuCommand("pageTitle", menuMap);
  window.roamEnhance.contextMenu.registerMenuCommand("pageTitle_sidebar", menuMap);
});
