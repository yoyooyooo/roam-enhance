export interface Menu {
  text: string;
  key?: string;
  onClick?: any;
  children?: Menu[];
}

export type ClickArea = "block" | "pageTitle" | "pageTitle_sidebar" | null;
export interface ClickArgs {
  target: HTMLElement;
  pageTitle?: string;
  currentUid?: string;
  selectUids?: string[];
}
