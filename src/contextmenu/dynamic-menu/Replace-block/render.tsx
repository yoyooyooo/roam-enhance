import { getSingleDOM } from "@/utils/dom";
import { Box } from "@material-ui/core";
import React, { useState, useMemo } from "react";
import ReactDOM from "react-dom";
import { animated as a, useTransition } from "react-spring";
import { useDebounce } from "react-use";
import styled from "styled-components";

const Wrap = styled(a.div)`
  width: 350px;
  height: 50px;
  background: rgb(250, 188, 188);
  border-radius: 4px;
  border-left: 4px solid rgb(255 134 134);
  position: fixed;
  right: 20px;
  top: 10px;
  display: flex;
  padding: 4px 0px;
`;

const Input = styled.input`
  border: none;
  background: rgb(255, 228, 228);
  height: 100%;
  width: 200px;
  &::placeholder {
    color: #ccc;
    padding-left: 4px;
  }
`;

const Close = styled.span`
  color: #888;
  position: absolute;
  top: 5px;
  right: 5px;
  width: 15px;
  height: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const Svg = styled.svg<{ active?: boolean }>`
  cursor: pointer;
  padding: 2px;
  fill: ${(p) => (p.active ? "hsl(0, 0%, 15%)" : "hsl(0, 0%, 55%)")};
`;

const ReplaceAllIcon = ({ active, ...props }) => {
  return (
    <svg
      width='16'
      height='16'
      viewBox='0 0 16 16'
      fill={active ? "#000" : "hsl(0, 0%, 55%)"}
      {...props}
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M11.6009 2.67683C11.7474 2.36708 11.9559 2.2122 12.2263 2.2122C12.4742 2.2122 12.6651 2.32987 12.7991 2.56522C12.933 2.80056 13 3.12243 13 3.53082C13 3.97383 12.9218 4.32944 12.7653 4.59766C12.6088 4.86589 12.3997 5 12.138 5C11.9014 5 11.7224 4.87541 11.6009 4.62622H11.5934V4.93511H11V1H11.5934V2.67683H11.6009ZM11.584 3.77742C11.584 3.94873 11.6197 4.09063 11.6911 4.20311C11.7624 4.3156 11.8538 4.37184 11.9653 4.37184C12.1005 4.37184 12.205 4.30002 12.2789 4.15639C12.354 4.01103 12.3915 3.80597 12.3915 3.54121C12.3915 3.32144 12.3571 3.15012 12.2883 3.02726C12.2207 2.90266 12.1236 2.84036 11.9972 2.84036C11.8782 2.84036 11.7793 2.9018 11.7005 3.02466C11.6228 3.14752 11.584 3.30759 11.584 3.50487V3.77742ZM4.11969 7.695L2 5.56781L2.66188 4.90594L3.66781 5.90625V4.39594C3.66695 4.21309 3.70219 4.03187 3.7715 3.86266C3.84082 3.69346 3.94286 3.53961 4.07176 3.40992C4.20066 3.28023 4.3539 3.17727 4.52268 3.10692C4.69146 3.03658 4.87246 3.00024 5.05531 3H7.39906V3.90469H5.05531C4.92856 3.91026 4.8089 3.96476 4.72149 4.05672C4.63408 4.14868 4.58571 4.27094 4.58656 4.39781L4.59406 5.89781L5.54281 4.95375L6.19906 5.61L4.11969 7.695ZM9.3556 4.93017H10V3.22067C10 2.40689 9.68534 2 9.05603 2C8.92098 2 8.77083 2.02421 8.6056 2.07263C8.44181 2.12104 8.3125 2.17691 8.21767 2.24022V2.90503C8.45474 2.70205 8.70474 2.60056 8.96767 2.60056C9.22917 2.60056 9.35991 2.75698 9.35991 3.06983L8.76078 3.17318C8.25359 3.25885 8 3.57914 8 4.13408C8 4.39665 8.06106 4.60708 8.18319 4.76536C8.30675 4.92179 8.47557 5 8.68966 5C8.97989 5 9.19899 4.83985 9.34698 4.51955H9.3556V4.93017ZM9.35991 3.57542V3.76816C9.35991 3.9432 9.31968 4.08845 9.23922 4.20391C9.15876 4.3175 9.0546 4.3743 8.92672 4.3743C8.83477 4.3743 8.76149 4.34264 8.7069 4.27933C8.65374 4.21415 8.62716 4.13128 8.62716 4.03073C8.62716 3.80912 8.73779 3.6797 8.95905 3.64246L9.35991 3.57542ZM7 12.9302H6.3556V12.5196H6.34698C6.19899 12.8399 5.97989 13 5.68966 13C5.47557 13 5.30675 12.9218 5.18319 12.7654C5.06106 12.6071 5 12.3966 5 12.1341C5 11.5791 5.25359 11.2588 5.76078 11.1732L6.35991 11.0698C6.35991 10.757 6.22917 10.6006 5.96767 10.6006C5.70474 10.6006 5.45474 10.702 5.21767 10.905V10.2402C5.3125 10.1769 5.44181 10.121 5.6056 10.0726C5.77083 10.0242 5.92098 10 6.05603 10C6.68534 10 7 10.4069 7 11.2207V12.9302ZM6.35991 11.7682V11.5754L5.95905 11.6425C5.73779 11.6797 5.62716 11.8091 5.62716 12.0307C5.62716 12.1313 5.65374 12.2142 5.7069 12.2793C5.76149 12.3426 5.83477 12.3743 5.92672 12.3743C6.0546 12.3743 6.15876 12.3175 6.23922 12.2039C6.31968 12.0885 6.35991 11.9432 6.35991 11.7682ZM9.26165 13C9.58343 13 9.82955 12.9423 10 12.8268V12.1173C9.81999 12.2551 9.636 12.324 9.44803 12.324C9.23616 12.324 9.06969 12.2523 8.94863 12.1089C8.82756 11.9637 8.76702 11.7644 8.76702 11.5112C8.76702 11.2505 8.82995 11.0466 8.95579 10.8994C9.08323 10.7505 9.25528 10.676 9.47192 10.676C9.66627 10.676 9.84229 10.7449 10 10.8827V10.1341C9.87097 10.0447 9.66229 10 9.37395 10C8.95659 10 8.62286 10.1406 8.37276 10.4218C8.12425 10.7011 8 11.0838 8 11.5698C8 11.9907 8.11629 12.3343 8.34887 12.6006C8.58144 12.8669 8.8857 13 9.26165 13ZM2 9L3 8H12L13 9V14L12 15H3L2 14V9ZM3 9V14H12V9H3ZM6 7L7 6H14L15 7V12L14 13V12V7H7H6Z'
      />
    </svg>
  );
};

const Replace: React.FC<{ name: string; currentUid: string }> = ({ name, currentUid }) => {
  const [open, setOpen] = useState(true);
  const [totalBlocks, setTotalBlocks] = useState(0);
  const [find, setFind] = useState("");
  const [isRegex, setIsRegex] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [replace, setReplace] = useState("");
  const [matchBlocks, setMatchBlocks] = useState<Roam.Block[]>([]);
  const transition = useTransition(open ? [1] : [], {
    from: { y: -100, opacity: 0 },
    enter: { y: 0, opacity: 1 },
    leave: { y: -100, opacity: 0 },
    onDestroyed: () => {
      const dom = document.getElementById(name);
      dom && ReactDOM.unmountComponentAtNode(dom) && dom.parentNode?.removeChild(dom);
    }
  });

  const regex = useMemo(() => {
    const flags = caseSensitive ? `g` : `gi`;
    return isRegex
      ? new RegExp(String.raw`${find}`, flags)
      : new RegExp(
          String.raw`${find.replace(
            /\*|\.|\?|\+|\$|\^|\[|\]|\(|\)|\{|\}|\||\\|\//g,
            (m) => "\\" + m
          )}`,
          flags
        );
  }, [isRegex, caseSensitive, find]);

  useDebounce(
    async () => {
      if (!find) return;
      console.log("qqq", { regex });
      const matchBlocks = [];
      let totalBlocks = 0;
      await window.roamEnhance.utils.patchBlockChildrenSync(
        currentUid,
        (a) => {
          totalBlocks++;
          regex.test(a.string || a.title) && matchBlocks.push(a);
        },
        { skipTop: false }
      );
      totalBlocks && setTotalBlocks(totalBlocks);
      setMatchBlocks(matchBlocks);
      console.log("qqq change", matchBlocks);
    },
    300,
    [find, isRegex, caseSensitive]
  );

  return (
    <>
      {transition((style, item, t, i) => {
        // console.log(style, item, t, i);
        return (
          <Wrap style={style}>
            <Close onClick={() => setOpen(false)}>x</Close>
            <Box display='flex' pl={1} flex={1} flexDirection='column' justifyContent='center'>
              <Box display='flex' flex={1} alignItems='center'>
                <Box position='relative'>
                  <Input
                    placeholder='查找'
                    value={find}
                    onChange={(e) => setFind(e.target.value)}
                    style={{ paddingRight: 50 }}
                  />
                  <Box
                    px={1}
                    top={0}
                    right={0}
                    width={50}
                    height='100%'
                    position='absolute'
                    display='flex'
                    alignItems='center'
                    justifyContent='center'
                  >
                    <Box
                      display='flex'
                      alignItems='center'
                      justifyContent='center'
                      title='区分大小写'
                    >
                      <Svg
                        viewBox='0 0 16 16'
                        width={22}
                        height={22}
                        active={caseSensitive}
                        onClick={() => setCaseSensitive((p) => !p)}
                      >
                        <path
                          fillRule='evenodd'
                          clipRule='evenodd'
                          d='M7.49524 9.052L8.38624 11.402H9.47724L6.23724 3H5.21724L2.00024 11.402H3.09524L3.93324 9.052H7.49524ZM5.81124 4.453L5.85524 4.588L7.17324 8.162H4.25524L5.56224 4.588L5.60624 4.453L5.64424 4.297L5.67624 4.145L5.69724 4.019H5.72024L5.74424 4.145L5.77324 4.297L5.81124 4.453ZM13.7952 10.464V11.4H14.7552V7.498C14.7552 6.779 14.5752 6.226 14.2162 5.837C13.8572 5.448 13.3272 5.254 12.6282 5.254C12.4292 5.254 12.2272 5.273 12.0222 5.31C11.8172 5.347 11.6222 5.394 11.4392 5.451C11.2562 5.508 11.0912 5.569 10.9442 5.636C10.7972 5.703 10.6832 5.765 10.6012 5.824V6.808C10.8672 6.578 11.1672 6.397 11.5052 6.268C11.8432 6.139 12.1942 6.075 12.5572 6.075C12.7452 6.075 12.9152 6.103 13.0702 6.16C13.2252 6.217 13.3572 6.306 13.4662 6.427C13.5752 6.548 13.6592 6.706 13.7182 6.899C13.7772 7.092 13.8062 7.326 13.8062 7.599L11.9952 7.851C11.6512 7.898 11.3552 7.977 11.1072 8.088C10.8592 8.199 10.6542 8.339 10.4922 8.507C10.3302 8.675 10.2102 8.868 10.1322 9.087C10.0542 9.306 10.0152 9.546 10.0152 9.808C10.0152 10.054 10.0572 10.283 10.1392 10.496C10.2212 10.709 10.3422 10.893 10.5022 11.047C10.6622 11.201 10.8622 11.323 11.1002 11.413C11.3382 11.503 11.6132 11.548 11.9262 11.548C12.3282 11.548 12.6862 11.456 13.0012 11.27C13.3162 11.084 13.5732 10.816 13.7722 10.464H13.7952ZM11.6672 8.721C11.8432 8.657 12.0682 8.607 12.3412 8.572L13.8062 8.367V8.976C13.8062 9.222 13.7652 9.451 13.6832 9.664C13.6012 9.877 13.4862 10.063 13.3402 10.221C13.1942 10.379 13.0192 10.503 12.8162 10.593C12.6132 10.683 12.3902 10.728 12.1482 10.728C11.9612 10.728 11.7952 10.703 11.6532 10.652C11.5112 10.601 11.3922 10.53 11.2962 10.441C11.2002 10.352 11.1272 10.247 11.0762 10.125C11.0252 10.003 11.0002 9.873 11.0002 9.732C11.0002 9.568 11.0182 9.421 11.0552 9.292C11.0922 9.163 11.1602 9.051 11.2572 8.958C11.3542 8.865 11.4912 8.785 11.6672 8.721Z'
                        />
                      </Svg>
                    </Box>
                    <Box
                      display='flex'
                      alignItems='center'
                      justifyContent='center'
                      title='使用正则表达式'
                    >
                      <Svg
                        viewBox='0 0 510 510'
                        width={18}
                        height={18}
                        active={isRegex}
                        onClick={() => setIsRegex((p) => !p)}
                      >
                        <path d='M309.677124,349.2086182V230.9143524l-97.4385986,59.7092743l-34.350647-59.8398743l101.6825867-55.6431732l-101.6825867-56.4703445l34.5251465-58.7483673l97.2640991,59.4459915V0.6174708h69.4211121v118.7503891l98.1610413-59.4459915L512,118.6702347l-102.1397705,56.4703445L512,230.7837524l-34.877594,60.111908l-98.0241699-59.981308v118.2942657H309.677124z M145.1727905,438.7961426c0-55.6698914-60.6798172-90.6524658-108.961525-62.8175354c-48.2816963,27.8349609-48.2816849,97.8001099,0.0000191,125.6350708C84.4929886,529.4486084,145.1727905,494.4660339,145.1727905,438.7961426z' />
                      </Svg>
                    </Box>
                  </Box>
                </Box>
                <Box color='#fff' ml={1} fontSize={12}>
                  {matchBlocks.length ? `${totalBlocks} 中的 ${matchBlocks.length}` : `无结果`}
                </Box>
              </Box>
              <Box display='flex' flex={1} mt={"2px"}>
                <Input
                  placeholder='替换'
                  value={replace}
                  onChange={(e) => setReplace(e.target.value)}
                />
                <Box pl={1}>
                  <ReplaceAllIcon
                    active={!!find && !!matchBlocks.length}
                    onClick={() => {
                      if (!!find && !!matchBlocks.length) {
                        matchBlocks.forEach((a) => {
                          const newString = a.string.replace(regex, replace);
                          if (newString !== a.string) {
                            window.roam42.common.updateBlock(a.uid, newString, a.open);
                          }
                        });
                      }
                    }}
                  >
                    替换
                  </ReplaceAllIcon>
                </Box>
              </Box>
            </Box>
            {/* <Box width={80}></Box> */}
          </Wrap>
        );
      })}
    </>
  );
};

export function render(name: string, { currentUid }) {
  ReactDOM.render(<Replace name={name} currentUid={currentUid} />, getSingleDOM(name));
}
