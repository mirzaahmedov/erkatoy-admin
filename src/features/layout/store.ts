import { create } from "zustand";

export interface IBreadcrumbItem {
  title: string;
  to?: string;
}

export interface ILayoutStore {
  title: string;
  enableCreate: boolean;
  onCreate?: () => void;
  breadcrumbs?: IBreadcrumbItem[];
  setLayout: (layout: {
    title: string;
    enableCreate: boolean;
    onCreate?: () => void;
    breadcrumbs?: IBreadcrumbItem[];
  }) => void;
}

export const useLayoutStore = create<ILayoutStore>((set) => ({
  title: "",
  enableCreate: false,
  breadcrumbs: [],
  setLayout({ title, enableCreate = false, onCreate, breadcrumbs = [] }) {
    set({ title, enableCreate, onCreate, breadcrumbs });
  },
}));
