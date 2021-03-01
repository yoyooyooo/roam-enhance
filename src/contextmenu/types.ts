export interface Menu {
  text: string;
  key?: string;
  onClick?: any;
  children?: Menu[];
}
