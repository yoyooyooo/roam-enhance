declare const BUILD_VERSION: string;

declare namespace Roam {
  interface Block {
    string: string;
    uid: string;
    order: number;
    heading: number;
    "view-type": "document" | "bullet" | "numbered";
    open: boolean;
    children: Block[];
  }
}

type registerMenu = (
  menu: import("./src/contextmenu/types").Menu[],
  clickArea: import("./src/contextmenu/types").ClickArea,
  onClickArgs: import("./src/contextmenu/types").ClickArgs
) => void | Promise<void>;

type RoamEnhance = {
  dependencyMap?: Record<string, string[]>;
  plugins?: ["metadata"?];
  _plugins?: {};
  loaded?: Set<string>;
  host?: string;
  contextMenu?: {
    registerMenu?: Set<registerMenu>;
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
  tippy?: any;
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
  roamAlphaAPI?: any;
  roam42?: {
    help: {
      displayMessage: (s: string, delay: number) => void;
    };
    smartBlocks?: {
      addCommands: (array: any[]) => void;
      customCommands: {
        key: string; // `<% ${string} %> (SmartBlock function)`, sad - https://github.com/microsoft/TypeScript/issues/13969
        icon: string;
        value: string | Function;
        processor: string;
      }[];
      activeWorkflow: {
        outputAdditionalBlock: (text: string) => void;
      };
      proccessBlockWithSmartness: (s: string) => Promise<string>;
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
