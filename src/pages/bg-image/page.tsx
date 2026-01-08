import type { IBgImage } from '@/entities/BgImage'

import { useEffect, useState } from 'react'

import {
  ActionButton,
  Button,
  ButtonGroup,
  Content,
  Dialog,
  DialogTrigger,
  Divider,
  Heading
} from '@adobe/react-spectrum'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import { BgImageService } from '@/features/bg-image/api'
import { BgImageForm } from '@/features/bg-image/components/BgImageForm'
import { BgImageTable } from '@/features/bg-image/components/BgImageTable'
import { useConfirm } from '@/features/confirm/useConfirm'
import { useLayoutStore } from '@/features/layout/store'
import { swal } from '@/lib/swal'

export const BgImagePage = () => {
  const confirm = useConfirm()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const setLayout = useLayoutStore((store) => store.setLayout)

  const [isDialogOpen, setDialogOpen] = useState(false)
  const [imageData, setImageData] = useState<IBgImage | null>(null)

  const imagesQuery = useQuery({
    queryKey: [BgImageService.QueryKey.GetAll, { page: 1, limit: 100000 }],
    queryFn: BgImageService.findImages
  })
  const images = imagesQuery.data?.data?.data ?? []

  const createImageMutation = useMutation({
    mutationFn: BgImageService.createImage
  })
  const updateImageMutation = useMutation({
    mutationFn: (formData: FormData) => BgImageService.updateImage(Number(imageData?.id), formData)
  })

  const deleteImageMutation = useMutation({
    mutationFn: BgImageService.deleteImage
  })

  useEffect(() => {
    setLayout({
      title: 'Background Images',
      enableCreate: true,
      onCreate: () => {
        setDialogOpen(true)
        setImageData(null)
      }
    })
  }, [setLayout, navigate])

  const handleClickEdit = (image: IBgImage) => {
    setDialogOpen(true)
    setImageData(image)
  }
  const handleClickDelete = (id: number) => {
    confirm({
      title: 'Delete Image',
      message: 'Are you sure you want to delete this image?',
      onConfirm: () => {
        deleteImageMutation.mutateAsync(id).then(() => {
          queryClient.invalidateQueries({
            queryKey: [BgImageService.QueryKey.GetAll]
          })
          swal.fire({
            icon: 'success',
            title: 'Image Deleted'
          })
        })
      }
    })
  }

  const handleSubmit = (formData: FormData) => {
    if (imageData) {
      updateImageMutation.mutateAsync(formData).then(() => {
        queryClient.invalidateQueries({
          queryKey: [BgImageService.QueryKey.GetAll]
        })
        swal.fire({
          icon: 'success',
          title: 'Image Updated'
        })
        setDialogOpen(false)
      })
    } else {
      createImageMutation.mutateAsync(formData).then(() => {
        queryClient.invalidateQueries({
          queryKey: [BgImageService.QueryKey.GetAll]
        })
        swal.fire({
          icon: 'success',
          title: 'Image Created'
        })
        setDialogOpen(false)
      })
    }
  }

  return (
    <div className="h-full">
      <BgImageTable
        rowData={images}
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
            <Heading level={2}>{imageData ? 'Update Image' : 'Create Image'}</Heading>
            <Divider />
            <Content>
              <BgImageForm
                isPending={createImageMutation.isPending || updateImageMutation.isPending}
                onSubmit={handleSubmit}
                imageData={imageData ?? undefined}
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
                      isPending={createImageMutation.isPending || updateImageMutation.isPending}
                    >
                      {imageData ? 'Update' : 'Create'}
                    </Button>
                  </ButtonGroup>
                )}
              />
            </Content>
          </Dialog>
        )}
      </DialogTrigger>
    </div>
  )
}
