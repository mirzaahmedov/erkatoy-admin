import type { ITag } from "@/entities/tag";

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

import { useLayoutStore } from "@/features/layout/store";
import { swal } from "@/lib/swal";
import { useConfirm } from "@/features/confirm/useConfirm";
import { TagForm } from "@/features/tag/components/TagForm";
import { TagTable } from "@/features/tag/components/TagTable";
import { TagService } from "@/features/tag/api";
import type { TagFormValues } from "@/features/tag/schema";

export const TagPage = () => {
  const confirm = useConfirm();
  const queryClient = useQueryClient();
  const setLayout = useLayoutStore((store) => store.setLayout);

  const [selectedTag, setSelectedTag] = useState<ITag | null>(null);
  const [isCreateOpen, setCreateOpen] = useQueryState(
    "is_create_open",
    parseAsBoolean.withDefault(false),
  );

  const tagQuery = useQuery({
    queryKey: [TagService.QueryKey.GetAll, { page: 1, limit: 10 }],
    queryFn: TagService.getTags,
  });
  const tagData = tagQuery.data?.data?.data ?? [];

  const createTagMutation = useMutation({
    mutationFn: TagService.createTag,
  });
  const updateTagMutation = useMutation({
    mutationFn: (values: TagFormValues) =>
      TagService.updateTag(selectedTag!.id, values),
  });
  const deleteTagMutation = useMutation({
    mutationFn: TagService.deleteTag,
  });

  useEffect(() => {
    setLayout({
      title: "Tags",
      enableCreate: true,
    });
  }, [setLayout]);

  const handleSubmit = (values: TagFormValues) => {
    if (selectedTag) {
      updateTagMutation.mutateAsync(values).then(() => {
        queryClient.invalidateQueries({
          queryKey: [TagService.QueryKey.GetAll],
        });
        swal.fire({
          icon: "success",
          title: "Tag Updated",
        });
        setSelectedTag(null);
        setCreateOpen(false);
      });
    } else {
      createTagMutation.mutateAsync(values).then(() => {
        queryClient.invalidateQueries({
          queryKey: [TagService.QueryKey.GetAll],
        });
        swal.fire({
          icon: "success",
          title: "Tag Created",
        });
        setSelectedTag(null);
        setCreateOpen(false);
      });
    }
  };

  const handleClickEdit = (tag: ITag) => {
    setCreateOpen(true);
    setSelectedTag(tag);
  };
  const handleClickDelete = (id: number) => {
    confirm({
      title: "Delete Tag",
      message: "Are you sure you want to delete this tag?",
      onConfirm: () => {
        deleteTagMutation.mutateAsync(id).then(() => {
          queryClient.invalidateQueries({
            queryKey: [TagService.QueryKey.GetAll],
          });
          swal.fire({
            icon: "success",
            title: "Tag Deleted",
          });
        });
      },
    });
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedTag(null);
    }
    setCreateOpen(open);
  };

  return (
    <div className="h-full">
      <TagTable
        rowData={tagData}
        onEdit={handleClickEdit}
        onDelete={handleClickDelete}
      />
      <DialogTrigger
        isOpen={isCreateOpen || !!selectedTag}
        onOpenChange={handleOpenChange}
      >
        <ActionButton isHidden></ActionButton>
        {(close) => (
          <Dialog width="size-6000">
            <Heading level={2}>
              {selectedTag ? "Update Tag" : "Create Tag"}
            </Heading>
            <Divider />
            <Content>
              <TagForm
                isPending={
                  createTagMutation.isPending || updateTagMutation.isPending
                }
                onSubmit={handleSubmit}
                tagData={selectedTag ?? undefined}
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
                        createTagMutation.isPending ||
                        updateTagMutation.isPending
                      }
                    >
                      {selectedTag ? "Update" : "Create"}
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
