import { Menu, ClickArgs } from "../../contextmenu/types";
import { render } from "./render";
import { getSingleDOM } from "../../utils/dom";

export interface Setting {
  outputToOneBlock?: boolean;
}

function getSetting(setting: Roam.Block[]) {
  const defaultSetting: Setting = {
    outputToOneBlock: true
  };
  setting.forEach((a) => {
    const [key, v] = a.string.trim().split(/\s+/);
    const value = v === "on" ? true : v === "off" ? false : undefined;
    if (value !== undefined) {
      defaultSetting[key] = value;
    }
  });
  return defaultSetting;
}

export async function getMetadataMenu(): Promise<Menu | null> {
  const uid = await window.roam42.common.getPageUidByTitle("roam/enhance/metadata");
  if (uid) {
    const info = await window.roam42.common.getBlockInfoByUID(uid, true);
    const menu = info[0][0].children.find((a) => /^\s*menu\s*$/.test(a.string));
    if (!menu?.children) return;
    const _setting = info[0][0].children.find((a) => /^\s*setting\s*$/.test(a.string));
    const setting = _setting?.children ? getSetting(_setting.children) : {};
    return {
      text: "Metadata",
      children: menu?.children.map((s) => {
        const text = s.string
          .replace("[[", "")
          .replace("]]", "")
          .replace("{{", "")
          .replace("}}", "");
        return {
          text,
          onClick: async (clickArgs: ClickArgs) => {
            try {
              const tagBlockList = await Promise.all(
                s.children
                  .sort((a, b) => a.order - b.order)
                  .map(async (s) => {
                    if (/\(\(.*\)\)/.test(s.string)) {
                      const uid = s.string.match(/\(\((.*)\)\)/)[1];
                      const info = await window.roam42.common.getBlockInfoByUID(uid, true);
                      info[0][0].string = info[0][0].string
                        .replace("[[", "")
                        .replace("]]", "")
                        .replace(/[\:]+$/, "");
                      return info[0][0];
                    } else {
                      s.string = s.string
                        .replace("[[", "")
                        .replace("]]", "")
                        .replace(/[\:]+$/, "");
                      return s;
                    }
                  })
              );
              render(getSingleDOM("metadata"), {
                open: true,
                tagBlockList,
                clickArgs,
                menuText: text,
                setting
              });
            } catch (e) {
              console.log("Metadata error", e);
            }
          }
        };
      })
    };
  }
}
