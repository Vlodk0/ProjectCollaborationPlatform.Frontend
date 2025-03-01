export interface MenuConfigInterface {
  developerMenu: MenuItemInterface[];
  projectOwnerMenu: MenuItemInterface[];
  adminMenu: MenuItemInterface[];
}

export interface MenuItemInterface {
  routerLink: string;
  controlName?: string;
  icon: string;
  title: string;
  tooltip?: string;
  children?: ChildMenuItemInterface[];
}

export interface ChildMenuItemInterface {
  scrollElement: string
  title: string;
}
