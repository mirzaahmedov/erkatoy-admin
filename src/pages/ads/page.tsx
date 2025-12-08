import { ActionButton, Button, ButtonGroup, Content, Dialog, DialogTrigger, Divider, Heading } from "@adobe/react-spectrum";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { AdsForm } from "@/features/ads/components/AdsForm";
import { AdsService } from "@/features/ads/api";
import { AdsTable } from "@/features/ads/components/AdsTable";
import type { IAds } from "@/entities/ads";
import { swal } from "@/lib/swal";
import { useConfirm } from "@/features/confirm/useConfirm";
import { useLayoutStore } from "@/features/layout/store";
import { useNavigate } from "react-router-dom";

export const AdsPage = () => {
  const confirm = useConfirm();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const setLayout = useLayoutStore((store) => store.setLayout);

  const [adData, setAdData] = useState<IAds | null>(null)
  const [isDialogOpen, setDialogOpen] = useState(false)

  const postQuery = useQuery({
    queryKey: [AdsService.QueryKey.GetAll, { page: 1, limit: 10 }],
    queryFn: AdsService.getAds,
  });
  const postData = postQuery.data?.data ?? [];

  const createGifMutation = useMutation({
    mutationFn: AdsService.createAds
  })
  const updateGifMutation = useMutation({
    mutationFn: (formData: FormData) => AdsService.updateAds(Number(adData?.id), formData)
  })
  
  const deletePostMutation = useMutation({
    mutationFn: AdsService.deleteAds,
  });

  useEffect(() => {
    setLayout({
      title: "Ads",
      enableCreate: true,
      onCreate: () => {
        setDialogOpen(true)
        setAdData(null) 
      },
    });
  }, [setLayout, navigate]);

  const handleClickEdit = (ad: IAds) => {
    setDialogOpen(true)
    setAdData(ad)
  };
  const handleClickDelete = (id: number) => {
    confirm({
      title: "Delete Ads",
      message: "Are you sure you want to delete this ad?",
      onConfirm: () => {
        deletePostMutation.mutateAsync(id).then(() => {
          queryClient.invalidateQueries({
            queryKey: [AdsService.QueryKey.GetAll],
          });
          swal.fire({
            icon: "success",
            title: "Ads Deleted",
          });
        });
      },
    });
  };

  const handleSubmit = (formData: FormData) => {
    if (adData) {
      updateGifMutation.mutateAsync(formData).then(() => {
        queryClient.invalidateQueries({
          queryKey: [AdsService.QueryKey.GetAll]
        })
        swal.fire({
          icon: 'success',
          title: 'Ads Updated'
        })
        setDialogOpen(false)
      })
    } else {
      createGifMutation.mutateAsync(formData).then(() => {
        queryClient.invalidateQueries({
          queryKey: [AdsService.QueryKey.GetAll]
        })
        swal.fire({
          icon: 'success',
          title: 'Ads Created'
        })
        setDialogOpen(false)
      })
    }
  }

  return (
    <div className="h-full">
      <AdsTable
        rowData={postData}
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
              {adData ? "Update Ads" : "Create Ads"}
            </Heading>
            <Divider />
            <Content>
              <AdsForm
                isPending={
                  createGifMutation.isPending ||
                  updateGifMutation.isPending
                }
                onSubmit={handleSubmit}
                adData={adData ?? undefined}
                actions={() => (
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
                      isPending={
                        createGifMutation.isPending ||
                        updateGifMutation.isPending
                      }
                    >
                      {adData ? "Update" : "Create"}
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
