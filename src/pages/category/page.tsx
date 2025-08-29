import type { ICategory } from "@/entities/category";
import type { CategoryFormValues } from "@/features/category/schema";

import { useEffect, useState } from "react";

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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { parseAsBoolean, useQueryState } from "nuqs";

import { CategoryService } from "@/features/category/api";
import { CategoryForm } from "@/features/category/components/CategoryForm";
import { CategoryTable } from "@/features/category/components/CategoryTable";
import { useLayoutStore } from "@/features/layout/store";
import { swal } from "@/lib/swal";
import { useConfirm } from "@/features/confirm/useConfirm";

export const CategoryPage = () => {
  const confirm = useConfirm();
  const queryClient = useQueryClient();
  const setLayout = useLayoutStore((store) => store.setLayout);

  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(
    null,
  );
  const [isCreateOpen, setCreateOpen] = useQueryState(
    "is_create_open",
    parseAsBoolean.withDefault(false),
  );

  const categoryQuery = useQuery({
    queryKey: [CategoryService.QueryKey.GetAll, { page: 1, limit: 10 }],
    queryFn: CategoryService.getCategories,
  });
  const categoryData = categoryQuery.data?.data?.data ?? [];

  const createCategoryMutation = useMutation({
    mutationFn: CategoryService.createCategory,
  });
  const updateCategoryMutation = useMutation({
    mutationFn: (values: CategoryFormValues) =>
      CategoryService.updateCategory(selectedCategory!.id, values),
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
    if (selectedCategory) {
      updateCategoryMutation.mutateAsync(values).then(() => {
        queryClient.invalidateQueries({
          queryKey: [CategoryService.QueryKey.GetAll],
        });
        swal.fire({
          icon: "success",
          title: "Category Updated",
        });
        setCreateOpen(false);
        setSelectedCategory(null);
      });
    } else {
      createCategoryMutation.mutateAsync(values).then(() => {
        queryClient.invalidateQueries({
          queryKey: [CategoryService.QueryKey.GetAll],
        });
        swal.fire({
          icon: "success",
          title: "Category Created",
        });
        setCreateOpen(false);
        setSelectedCategory(null);
      });
    }
  };

  const handleClickEdit = (category: ICategory) => {
    setSelectedCategory(category);
    setCreateOpen(true);
  };
  const handleClickDelete = (id: number) => {
    confirm({
      title: "Delete Category",
      message: "Are you sure you want to delete this category?",
      onConfirm: () => {
        deleteCategoryMutation.mutateAsync(id).then(() => {
          queryClient.invalidateQueries({
            queryKey: [CategoryService.QueryKey.GetAll],
          });
          swal.fire({
            icon: "success",
            title: "Category Deleted",
          });
        });
      },
    });
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedCategory(null);
    }
    setCreateOpen(open);
  };

  return (
    <div className="h-full">
      <CategoryTable
        rowData={categoryData}
        onEdit={handleClickEdit}
        onDelete={handleClickDelete}
      />
      <DialogTrigger
        isOpen={isCreateOpen || !!selectedCategory}
        onOpenChange={handleOpenChange}
      >
        <ActionButton isHidden></ActionButton>
        {(close) => (
          <Dialog width="size-6000">
            <Heading level={2}>
              {categoryData ? "Update Category" : "Create Category"}
            </Heading>
            <Divider />
            <Content>
              <CategoryForm
                isPending={
                  createCategoryMutation.isPending ||
                  updateCategoryMutation.isPending
                }
                onSubmit={handleSubmit}
                categoryData={selectedCategory ?? undefined}
                actions={(form) => (
                  <ButtonGroup alignSelf="end">
                    <Button
                      variant="secondary"
                      onPress={close}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="cta"
                      isDisabled={!form.formState.isDirty}
                      isPending={
                        createCategoryMutation.isPending ||
                        updateCategoryMutation.isPending
                      }
                    >
                      {categoryData ? "Update" : "Create"}
                    </Button>
                  </ButtonGroup>
                )}
              />
            </Content>
          </Dialog>
        )}
      </DialogTrigger>
    </div>
  );
};
