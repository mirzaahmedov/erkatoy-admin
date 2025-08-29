import { create } from "zustand";

export interface IBreadcrumbItem {
  title: string;
  to?: string;
}

export interface ILayoutStore {
  title: string;
  enableCreate: boolean;
  breadcrumbs?: IBreadcrumbItem[];
  setLayout: (layout: {
    title: string;
    enableCreate: boolean;
    breadcrumbs?: IBreadcrumbItem[];
  }) => void;
}

export const useLayoutStore = create<ILayoutStore>((set) => ({
  title: "",
  enableCreate: false,
  breadcrumbs: [],
  setLayout({ title, enableCreate = false, breadcrumbs = [] }) {
    set({ title, enableCreate, breadcrumbs });
  },
}));
