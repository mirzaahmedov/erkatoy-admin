
import { type FC, type ReactNode, useEffect, useState } from 'react'

import { Button, Icon, Image } from '@adobe/react-spectrum'
import { type UseFormReturn, useForm } from 'react-hook-form'
import { BiEdit } from 'react-icons/bi'
import { Form } from 'react-router-dom'

import { AspectRatio } from '@/components/AspectRatio'
import { FileDropZone } from '@/components/FileDropZone'
import z from 'zod'
import { getGifURL } from '../utils'
import type { IGif } from '@/entities/gif'

export const GifFormSchema = z.object({
  file: z.string()
})
export type GifFormValues = z.infer<typeof GifFormSchema>

const defaultValues: GifFormValues = {
  file: ""
}

export const GifForm: FC<{
  onSubmit: (values: FormData) => void
  gifData?: IGif
  isPending: boolean
  actions: (form: UseFormReturn<GifFormValues>, isDisabled: boolean) => ReactNode
}> = (props) => {
  const { onSubmit, gifData, isPending, actions } = props


  const [gifFile, setGifFile] = useState<File | null>(null)
  const [gifUrl, setGifUrl] = useState<string | null>(null)
  const [isGifEditing, setGifEditing] = useState(true)

  const form = useForm<GifFormValues>({
    disabled: isPending,
    defaultValues
  })

  useEffect(() => {
    if (gifData) {
      if (gifData) {
        setGifUrl(getGifURL(gifData))
      }
      setGifEditing(false)
    } else {
      form.reset(defaultValues)
    }
  }, [form, gifData])

  const handleSubmit = form.handleSubmit(() => {
    const formData = new FormData()

    if (gifFile) {
      formData.append('file', gifFile)
    }

    onSubmit(formData)
  })


  const handleGifChange = (file: File) => {
    setGifFile(file)
    setGifUrl(URL.createObjectURL(file))
    setGifEditing(false)
  }

  return (
    <Form
      onSubmit={handleSubmit}
      className="h-full flex flex-col gap-5"
    >
      <AspectRatio ratio={3 / 2}>
        {isGifEditing || !gifUrl ? (
          <FileDropZone
            onFileChange={handleGifChange}
            label="Upload GIF"
            acceptedTypes={['image/gif']}
          />
        ) : (
          <div className="w-full h-full">
            <div className="w-full h-full bg-neutral-900 overflow-hidden">
              <Image
                src={gifUrl}
                alt="GIF Preview"
                width="100%"
                height="100%"
                objectFit="contain"
              />
            </div>
            <div className="absolute right-4 bottom-4">
              <Button
                variant="primary"
                onPress={() => setGifEditing(true)}
                aria-label="Edit GIF"
              >
                <Icon>
                  <BiEdit />
                </Icon>
              </Button>
            </div>
          </div>
        )}
      </AspectRatio>
      {actions(form, !gifFile)}
    </Form>
  )
}
