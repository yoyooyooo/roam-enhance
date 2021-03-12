import "antd/dist/antd.css";
import Button from "antd/es/button";
import Cascader from "antd/es/cascader";
import Select from "antd/es/select";
import Modal from "antd/es/modal/Modal";
import TextArea from "antd/es/input/TextArea";
import React, { useState, useMemo } from "react";
import ReactDOM from "react-dom";
import { ClickArgs } from "../../contextmenu/types";
import { extractTags, flattenBlocks } from "../../globals/utils";

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
}> = ({ open: open0 = true, dom, tagBlockList, clickArgs, menuText }) => {
  const [open, setOpen] = useState(open0);
  const [tagMap, setTagMap] = useState<Record<string, string | string[]>>({});
  const flattenTagsMap = useMemo(() => {
    const res: Record<string, Roam.Block[]> = {};
    tagBlockList.forEach((a) => {
      if (a.children?.length) {
        res[a.string.replace("[[", "").replace("]]", "")] = flattenBlocks(a.children);
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
          const key = block.string.replace("[[", "").replace("]]", "");
          const tags = tagMap[key];
          return !!tags?.length
            ? `${key}: ${typeof tags === "string" ? tags : tags.map((t) => `#[[${t}]]`).join(" ")}`
            : [];
        });
        if (list.length) {
          const uid = await window.roam42.common.createBlock(
            clickArgs.currentUid,
            0,
            `{{[[${menuText}]]}}`
          );
          window.roam42.common.createBlock(uid, 0, list.join("\n"));
          window.roam42.common.createBlock(clickArgs.currentUid, 1, "---");
        }
        setOpen(false);
      }}
      onCancel={() => setOpen(false)}
      afterClose={() => ReactDOM.unmountComponentAtNode(dom) && dom.parentNode?.removeChild(dom)}
      okText='确定'
      cancelText='取消'
    >
      {tagBlockList.map((block) => {
        const key = block.string.replace("[[", "").replace("]]", "");
        return block.children?.length ? (
          block.children.length === 1 && /<%textarea%>/.test(block.children[0].string) ? (
            <React.Fragment key={key}>
              <h4 style={{ marginTop: 12 }}>{key}</h4>
              <div>
                <TextArea
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
                    选择标签
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
                    console.log("onChange", value);
                    setTagMap((map) => {
                      return { ...map, [key]: value };
                    });
                  }}
                >
                  {flattenTagsMap[key].map((tag) => {
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

export function render(dom: HTMLElement, { open, tagBlockList, clickArgs, menuText }) {
  ReactDOM.render(
    <Component
      open={open}
      dom={dom}
      tagBlockList={tagBlockList}
      clickArgs={clickArgs}
      menuText={menuText}
    />,
    dom
  );
}
