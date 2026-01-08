import type { IBgImage } from '@/entities/BgImage'

import { type FC, type ReactNode, useEffect, useState } from 'react'

import { Button, Icon, Image } from '@adobe/react-spectrum'
import { type UseFormReturn, useForm } from 'react-hook-form'
import { BiEdit } from 'react-icons/bi'
import { Form } from 'react-router-dom'
import z from 'zod'

import { AspectRatio } from '@/components/AspectRatio'
import { FileDropZone } from '@/components/FileDropZone'

export const BgImageFormSchema = z.object({
  file: z.string()
})
export type BgFormValues = z.infer<typeof BgImageFormSchema>

const defaultValues: BgFormValues = {
  file: ''
}

export const BgImageForm: FC<{
  onSubmit: (values: FormData) => void
  imageData?: IBgImage
  isPending: boolean
  actions: (form: UseFormReturn<BgFormValues>, isDisabled: boolean) => ReactNode
}> = (props) => {
  const { onSubmit, imageData, isPending, actions } = props

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isImageEditing, setImageEditing] = useState(true)

  const form = useForm<BgFormValues>({
    disabled: isPending,
    defaultValues
  })

  useEffect(() => {
    if (imageData) {
      if (imageData) {
        setImageUrl(imageData.file_url)
      }
      setImageEditing(false)
    } else {
      form.reset(defaultValues)
    }
  }, [form, imageData])

  const handleSubmit = form.handleSubmit(() => {
    const formData = new FormData()

    if (imageFile) {
      formData.append('file', imageFile)
    }

    onSubmit(formData)
  })

  const handleGifChange = (file: File) => {
    setImageFile(file)
    setImageUrl(URL.createObjectURL(file))
    setImageEditing(false)
  }

  return (
    <Form
      onSubmit={handleSubmit}
      className="h-full flex flex-col gap-5"
    >
      <AspectRatio ratio={3 / 2}>
        {isImageEditing || !imageUrl ? (
          <FileDropZone
            onFileChange={handleGifChange}
            label="Upload Image"
            acceptedTypes={['image/*']}
          />
        ) : (
          <div className="w-full h-full">
            <div className="w-full h-full bg-neutral-900 overflow-hidden">
              <Image
                src={imageUrl}
                alt="Image Preview"
                width="100%"
                height="100%"
                objectFit="contain"
              />
            </div>
            <div className="absolute right-4 bottom-4">
              <Button
                variant="primary"
                onPress={() => setImageEditing(true)}
                aria-label="Edit Image"
              >
                <Icon>
                  <BiEdit />
                </Icon>
              </Button>
            </div>
          </div>
        )}
      </AspectRatio>
      {actions(form, !imageFile)}
    </Form>
  )
}
