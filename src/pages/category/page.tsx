import { CategoryTable } from "@/features/category/components/CategoryTable";
import { useLayoutStore } from "@/features/layout/store";
import {
  ActionButton,
  Button,
  ButtonGroup,
  Dialog,
  DialogTrigger,
  Heading,
} from "@adobe/react-spectrum";
import { parseAsBoolean, useQueryState } from "nuqs";
import { useEffect } from "react";

export const CategoryPage = () => {
  const setLayout = useLayoutStore((store) => store.setLayout);

  const [isCreateOpen, setCreateOpen] = useQueryState(
    "is_create_open",
    parseAsBoolean.withDefault(false),
  );

  useEffect(() => {
    setLayout({
      title: "Categories",
      enableCreate: true,
    });
  }, [setLayout]);

  return (
    <div className="h-full">
      <CategoryTable />
      <DialogTrigger
        isOpen={isCreateOpen}
        onOpenChange={setCreateOpen}
      >
        <ActionButton isHidden></ActionButton>
        {(close) => (
          <Dialog>
            <Heading>Internet Speed Test</Heading>
            <ButtonGroup>
              <Button
                variant="secondary"
                onPress={close}
              >
                Cancel
              </Button>
              <Button
                variant="cta"
                onPress={close}
              >
                Confirm
              </Button>
            </ButtonGroup>
          </Dialog>
        )}
      </DialogTrigger>
    </div>
  );
};
