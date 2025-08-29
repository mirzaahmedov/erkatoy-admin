import { CategoryService } from "@/features/category/api";
import { CategoryForm } from "@/features/category/components/CategoryForm";
import { CategoryTable } from "@/features/category/components/CategoryTable";
import type { CategoryFormValues } from "@/features/category/schema";
import { useLayoutStore } from "@/features/layout/store";
import { swal } from "@/lib/swal";
import {
  ActionButton,
  Button,
  ButtonGroup,
  Content,
  Dialog,
  DialogTrigger,
  Divider,
  Heading,
} from "@adobe/react-spectrum";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { parseAsBoolean, useQueryState } from "nuqs";
import { useEffect } from "react";

export const CategoryPage = () => {
  const queryClient = useQueryClient();
  const setLayout = useLayoutStore((store) => store.setLayout);

  const [isCreateOpen, setCreateOpen] = useQueryState(
    "is_create_open",
    parseAsBoolean.withDefault(false),
  );

  const createCategoryMutation = useMutation({
    mutationFn: CategoryService.createCategory,
  });
  const deleteCategoryMutation = useMutation({
    mutationFn: CategoryService.deleteCategory,
  });

  useEffect(() => {
    setLayout({
      title: "Categories",
      enableCreate: true,
    });
  }, [setLayout]);

  const handleSubmit = (values: CategoryFormValues) => {
    createCategoryMutation.mutateAsync(values).then(() => {
      queryClient.invalidateQueries({
        queryKey: [CategoryService.QueryKey.GetAll],
      });
      swal.fire({
        icon: "success",
        title: "Category Created",
      });
      setCreateOpen(false);
    });
  };

  const handleDelete = (id: number) => {
    deleteCategoryMutation.mutateAsync(id).then(() => {
      queryClient.invalidateQueries({
        queryKey: [CategoryService.QueryKey.GetAll],
      });
      swal.fire({
        icon: "success",
        title: "Category Deleted",
      });
    });
  };

  return (
    <div className="h-full">
      <CategoryTable onDelete={handleDelete} />
      <DialogTrigger
        isOpen={isCreateOpen}
        onOpenChange={setCreateOpen}
      >
        <ActionButton isHidden></ActionButton>
        {(close) => (
          <Dialog width="size-5000">
            <Heading level={2}>Create Category</Heading>
            <Divider />
            <Content>
              <CategoryForm
                isPending={createCategoryMutation.isPending}
                onSubmit={handleSubmit}
                actions={
                  <ButtonGroup>
                    <Button
                      variant="secondary"
                      onPress={close}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="cta"
                    >
                      Create
                    </Button>
                  </ButtonGroup>
                }
              />
            </Content>
          </Dialog>
        )}
      </DialogTrigger>
    </div>
  );
};
