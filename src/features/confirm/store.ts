import { create } from "zustand";

export interface ConfirmOptions {
  title: string;
  message: string;
  onConfirm: () => void;
}

export interface IConfirmStore {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: (() => void) | null;
  open: (options: ConfirmOptions) => void;
  close: () => void;
}

export const useConfirmStore = create<IConfirmStore>((set) => ({
  isOpen: false,
  title: "",
  message: "",
  onConfirm: null,
  open: ({ title, message, onConfirm }) =>
    set(() => ({
      isOpen: true,
      title,
      message,
      onConfirm,
    })),
  close: () =>
    set(() => ({
      isOpen: false,
      title: "",
      message: "",
      onConfirm: null,
    })),
}));
