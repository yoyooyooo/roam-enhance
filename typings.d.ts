declare const BUILD_VERSION: string;

declare namespace Roam {
  interface Block {
    string?: string; // block
    title?: string; //页面
    uid: string;
    order: number;
    heading: number;
    "view-type": "document" | "bullet" | "numbered";
    open: boolean;
    children: Block[];
  }
}

type Menu = import("./src/contextmenu/types").Menu;
type ClickArea = import("./src/contextmenu/types").ClickArea;
type ClickArgs = import("./src/contextmenu/types").ClickArgs;

type registerMenu = (
  menu: Menu[],
  clickArea: ClickArea,
  onClickArgs: ClickArgs
) => PromiseOrNot<void>;

type registerMenuCommand = (
  clickArea: ClickArea,
  menuMap: Record<string, Menu> | (() => Record<string, Menu>)
) => void;

type RoamEnhance = {
  dependencyMap?: {
    plugin: Record<string, string[]>;
    dynamicMenu: Record<string, string[]>;
  };
  plugins?: ["metadata"?];
  dynamicMenu?: ["pull-zhihu"?];
  _plugins?: {};
  _dynamicMenu?: {};
  loaded?: Set<string>;
  host?: string;
  contextMenu?: {
    menus: {
      commonMenu: Menu[];
      blockMenu: Menu[];
      pageTitleMenu: Menu[];
      pageTitleMenu_Sidebar: Menu[];
    };
    // 2 个 registerMenu 是直接帮用户注册 menu
    registerMenu?: Set<registerMenu>;
    registerMenuCommand?: registerMenuCommand;
    dynamicMenu: { loaded: Set<string> };
    onClickArgs: Partial<ClickArgs>;
  };
  libs?: {
    react: typeof import("react");
    ReactDOM: typeof import("react-dom");
  };
} & typeof import("./src/globals").default;

declare interface document {
  arrive: typeof import("arrive");
}

declare interface Window {
  roamjs?: {
    alerted: boolean;
    loaded: Set<string>;
    extension: {
      [id: string]: {
        [method: string]: (args?: unknown) => void;
      };
    };
    dynamicElements: Set<HTMLElement>;
  };
  roamAlphaAPI?: {
    ui: {
      rightSidebar: {
        getWindows: () => {
          "collapsed?": boolean;
          order: number;
          "page-uid"?: string;
          "block-uid"?: string;
          "pinned?": false;
          type: "outline" | "block";
          "window-id": string;
        }[];
        addWindow: (options: { window: { "block-uid": uid; type: "outline" } }) => Promise<void>;
      };
    };
  };
  roam42?: {
    help: {
      displayMessage: (s: string, delay: number) => void;
    };
    smartBlocks?: {
      exclusionBlockSymbol: string;
      replaceFirstBlock: string;
      addCommands: (array: any[]) => void;
      customCommands: {
        key: string; // `<% ${string} %> (SmartBlock function)`, sad - https://github.com/microsoft/TypeScript/issues/13969
        icon: string;
        value: string | Function;
        processor: string;
      }[];
      activeWorkflow: {
        outputAdditionalBlock: (text: string) => void;
        arrayToWrite: any[];
      };
      proccessBlockWithSmartness: (s: string) => Promise<string>;
      outputArrayWrite: () => Promise<void>;
    };
    dateProcessing: {
      testIfRoamDateAndConvert: (s: string) => string;
    };
    common: {
      sleep: (ms: number) => Promise<void>;
      simulateMouseClick: (el: HTMLElement) => void;
      navigateUiTo: (title: string) => void;
      getPageUidByTitle: (title: string) => Promise<string>;
      getBlockInfoByUID: (uid: string, withChild?: boolean) => Promise<[[Roam.Block]] | null>;
      createBlock: (uid: string, order: number, string: string) => Promise<string>;
      createPage: (pageTitle: string) => Promise<string>;
      currentPageUID: () => Promise<string>;
      batchCreateBlocks: (uid: string, order: number, array: string[]) => Promise<void>;
      updateBlock: (uid: string, string: string, open?: boolean) => Promise<void>;
      deleteBlock: (uid: string) => Promise<void>;
      getDirectBlockParentUid: (
        uid: string
      ) => Promise<{ parentUID: string; order: number } | null>;
      getBlocksReferringToThisPage: (title: string) => Promise<[Roam.Block][]>;
      getBlocksReferringToThisBlockRef: (uid: string) => Promise<[Roam.Block][]>;
      getPageNamesFromBlockUidList: (
        uids: string[]
      ) => Promise<[Roam.Block, { uid: string; title: string }][]>;
      baseUrl: () => URL;
    };
    wB: {
      commandAddRunFromAnywhere: (command: string, fn: () => void) => Promise<void>;
      commandAddRunFromBlock: (command: string, fn: () => void) => Promise<void>;
      path: {
        launch: (
          displayOutput: (outputUID: string, outputText: string) => Promise<void>,
          excludeUIDs: string[],
          startUID?: string,
          startString?: string
        ) => void;
      };
    };
  };
  roam42KeyboardLib: {
    changeHeading: (heading: number) => Promise<void>;
  };
  iziToast?: import("izitoast").IziToast;
  roamEnhance?: RoamEnhance;
  yoyo?: RoamEnhance;
}

declare const API_URL: string;

type PromiseOrNot<T> = Promise<T> | T;
