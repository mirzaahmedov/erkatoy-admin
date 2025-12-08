import { ActionButton, Button, ButtonGroup, Content, Dialog, DialogTrigger, Divider, Heading } from "@adobe/react-spectrum";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { GifForm } from "@/features/gif/components/GifForm";
import { GifService } from "@/features/gif/api";
import { GifTable } from "@/features/gif/components/GifTable";
import type { IGif } from "@/entities/gif";
import { swal } from "@/lib/swal";
import { useConfirm } from "@/features/confirm/useConfirm";
import { useLayoutStore } from "@/features/layout/store";
import { useNavigate } from "react-router-dom";

export const GifPage = () => {
  const confirm = useConfirm();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const setLayout = useLayoutStore((store) => store.setLayout);

  const [isDialogOpen, setDialogOpen] = useState(false)
  const [gifData, setGifData] = useState<IGif | null>(null)

  const gifQuery = useQuery({
    queryKey: [GifService.QueryKey.GetAll, { page: 1, limit: 10 }],
    queryFn: GifService.getGifs,
  });
  const gifs = gifQuery.data?.data ?? [];

  const createGifMutation = useMutation({
    mutationFn: GifService.createGif
  })
  const updateGifMutation = useMutation({
    mutationFn: (formData: FormData) => GifService.updateGif(Number(gifData?.id), formData)
  })

  const deleteGifMutation = useMutation({
    mutationFn: GifService.deleteGif,
  });

  useEffect(() => {
    setLayout({
      title: "Gifs",
      enableCreate: true,
      onCreate: () => {
        setDialogOpen(true)
        setGifData(null)
      },
    });
  }, [setLayout, navigate]);

  const handleClickEdit = (gif: IGif) => {
    setDialogOpen(true)
    setGifData(gif)
  };
  const handleClickDelete = (id: number) => {
    confirm({
      title: "Delete Gif",
      message: "Are you sure you want to delete this gif?",
      onConfirm: () => {
        deleteGifMutation.mutateAsync(id).then(() => {
          queryClient.invalidateQueries({
            queryKey: [GifService.QueryKey.GetAll],
          });
          swal.fire({
            icon: "success",
            title: "Gif Deleted",
          });
        });
      },
    });
  };

  const handleSubmit = (formData: FormData) => {
    if (gifData) {
      updateGifMutation.mutateAsync(formData).then(() => {
        queryClient.invalidateQueries({
          queryKey: [GifService.QueryKey.GetAll]
        })
        swal.fire({
          icon: 'success',
          title: 'Gif Updated'
        })
        setDialogOpen(false)
      })
    } else {
      createGifMutation.mutateAsync(formData).then(() => {
        queryClient.invalidateQueries({
          queryKey: [GifService.QueryKey.GetAll]
        })
        swal.fire({
          icon: 'success',
          title: 'Gif Created'
        })
        setDialogOpen(false)
      })
    }
  }


  return (
    <div className="h-full">
      <GifTable
        rowData={gifs}
        onEdit={handleClickEdit}
        onDelete={handleClickDelete}
      />
      <DialogTrigger
        isOpen={isDialogOpen}
        onOpenChange={setDialogOpen}
      >
        <ActionButton isHidden></ActionButton>
        {(close) => (
          <Dialog width="size-6000">
            <Heading level={2}>
              {gifData ? "Update Gif" : "Create Gif"}
            </Heading>
            <Divider />
            <Content>
              <GifForm
                isPending={
                  createGifMutation.isPending ||
                  updateGifMutation.isPending
                }
                onSubmit={handleSubmit}
                gifData={gifData ?? undefined}
                actions={(_, isDisabled) => (
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
                      isDisabled={isDisabled}
                      isPending={
                        createGifMutation.isPending ||
                        updateGifMutation.isPending
                      }
                    >
                      {gifData ? "Update" : "Create"}
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
