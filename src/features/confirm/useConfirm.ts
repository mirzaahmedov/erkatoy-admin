import { useConfirmStore, type ConfirmOptions } from "./store";

export const useConfirm = () => {
  const { open } = useConfirmStore();

  const confirm = (options: ConfirmOptions) => {
    open(options);
  };

  return confirm;
};
