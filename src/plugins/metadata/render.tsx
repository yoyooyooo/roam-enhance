// import "antd/dist/antd.css";
import { Button, Cascader, Input, Modal, Select } from "antd";
import differenceBy from "lodash-es/differenceBy";
import React, { useMemo, useState } from "react";
import ReactDOM from "react-dom";
import { ClickArgs } from "../../contextmenu/types";
import { Setting } from "./metadata";

const { extractTags, flattenBlocks } = window.roamEnhance.utils;

function getOptions(blocks: Roam.Block[]) {
  return (
    blocks
      ?.sort((a, b) => a.order - b.order)
      .map((a) => {
        const tags = extractTags(a.string);
        const s = tags[0] || a.string;
        return {
          label: s,
          value: s,
          isLeaf: true,
          isItem: !!tags.length,
          ...(a.children ? { children: getOptions(a.children) } : {})
        };
      }) || []
  );
}

const Component: React.FC<{
  open?: boolean;
  dom: Element;
  tagBlockList: Roam.Block[];
  clickArgs: ClickArgs;
  menuText: string;
  setting: Setting;
}> = ({ open: open0 = true, dom, tagBlockList, clickArgs, menuText, setting }) => {
  const [open, setOpen] = useState(open0);
  const [tagMap, setTagMap] = useState<Record<string, string | string[]>>({});
  const flattenTagsMap = useMemo(() => {
    const res: Record<string, Roam.Block[]> = {};
    tagBlockList.forEach((a) => {
      if (a.children?.length) {
        res[a.string] = flattenBlocks(a.children);
      }
    });
    return res;
  }, []);

  return (
    <Modal
      width={650}
      visible={open}
      onOk={async () => {
        const list = tagBlockList.flatMap((block) => {
          const key = block.string;
          const tags = tagMap[key];
          return !!tags?.length
            ? `${
                setting.outputToOneBlock && setting.linkedKey
                  ? `[[${key}]]`
                  : !setting.outputToOneBlock && setting.linkedKey
                  ? `${key}:`
                  : key
              }: ${typeof tags === "string" ? tags : tags.map((t) => `#[[${t}]]`).join(" ")}`
            : [];
        });
        if (list.length) {
          const uid = await window.roam42.common.createBlock(
            clickArgs.currentUid,
            0,
            `{{[[${menuText}]]}}`
          );
          if (setting.outputToOneBlock) {
            window.roam42.common.createBlock(uid, 0, list.join("\n"));
          } else {
            window.roam42.common.batchCreateBlocks(uid, 0, list);
          }
          window.roam42.common.createBlock(clickArgs.currentUid, 1, "---");
        }
        setOpen(false);
      }}
      onCancel={() => setOpen(false)}
      afterClose={() => ReactDOM.unmountComponentAtNode(dom) && dom.parentNode?.removeChild(dom)}
      okText={navigator.language === "zh-CN" ? "确定" : "OK"}
      cancelText={navigator.language === "zh-CN" ? "取消" : "Cancel"}
    >
      {tagBlockList.map((block) => {
        const key = block.string.replace("[[", "").replace("]]", "");
        return block.children?.length ? (
          block.children.length === 1 && /<%textarea%>/.test(block.children[0].string) ? (
            <React.Fragment key={key}>
              <h4 style={{ marginTop: 12 }}>{key}</h4>
              <div>
                <Input.TextArea
                  onChange={(e) => {
                    setTagMap((map) => ({
                      ...map,
                      [key]: e.target.value
                    }));
                  }}
                />
              </div>
            </React.Fragment>
          ) : (
            <React.Fragment key={key}>
              <h4 style={{ marginTop: 12 }}>
                {key}
                <Cascader
                  options={getOptions(block.children)}
                  expandTrigger='hover'
                  changeOnSelect
                  onChange={(value, selectedOptions) => {
                    setTagMap((map) => ({
                      ...map,
                      [key]: [
                        ...new Set([
                          ...(map[key] || []),
                          ...(selectedOptions
                            .filter((a) => !!a.isItem)
                            .map((a) => a.value) as string[])
                        ])
                      ]
                    }));
                  }}
                >
                  <Button type='primary' size='small' style={{ marginLeft: 8 }}>
                    {navigator.language === "zh-CN" ? "选择标签" : "Select tags"}
                  </Button>
                </Cascader>
              </h4>

              <div>
                {/* {tagMap[key]?.map((tagText) => (
                <Tag
                  key={tagText}
                  style={{
                    padding: "4px 8px",
                    fontSize: 14,
                    marginBottom: 8
                  }}
                  closable
                  onClose={() =>
                    setTagMap((map) => {
                      const s = new Set([...map[key]]);
                      s.delete(tagText);
                      return { ...map, [key]: [...new Set(s)] };
                    })
                  }
                >
                  {tagText}
                </Tag>
              )) || null} */}
                <Select
                  mode='tags'
                  tokenSeparators={[","]}
                  style={{ width: "100%" }}
                  value={tagMap[key]}
                  onChange={(value) => {
                    setTagMap((map) => {
                      return { ...map, [key]: value };
                    });
                  }}
                >
                  {differenceBy(flattenTagsMap[key], tagMap[key], (a) =>
                    (a?.string || a).replace("[[", "").replace("]]", "")
                  ).map((tag) => {
                    const text = extractTags(tag.string)[0] || tag.string;
                    return (
                      <Select.Option key={text} value={text}>
                        {text}
                      </Select.Option>
                    );
                  })}
                </Select>
              </div>
            </React.Fragment>
          )
        ) : null;
      })}
    </Modal>
  );
};

const Test = () => {
  return <>ttttttt</>;
};

export function render(dom: HTMLElement, { open, tagBlockList, clickArgs, menuText, setting }) {
  // ReactDOM.render(<Test />, clickArgs.target);
  ReactDOM.render(
    <Component
      open={open}
      dom={dom}
      tagBlockList={tagBlockList}
      clickArgs={clickArgs}
      menuText={menuText}
      setting={setting}
    />,
    dom
  );
}
