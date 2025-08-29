import {
  ActionButton,
  AlertDialog,
  DialogTrigger,
} from "@adobe/react-spectrum";
import { useConfirmStore } from "../store";

export const ConfirmProvider = () => {
  const { isOpen, title, message, onConfirm, close } = useConfirmStore();

  return (
    <DialogTrigger
      isOpen={isOpen}
      onOpenChange={close}
    >
      <ActionButton isHidden></ActionButton>
      <AlertDialog
        variant="confirmation"
        title={title}
        primaryActionLabel="Confirm"
        cancelLabel="Cancel"
        onPrimaryAction={onConfirm ?? undefined}
      >
        {message}
      </AlertDialog>
    </DialogTrigger>
  );
};
