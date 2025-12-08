import type { AdsFormValues } from '../schema'

import { type FC, type ReactNode, useEffect, useState } from 'react'

import { Button, Icon, Image, Switch, TextArea, TextField, Picker, Item } from '@adobe/react-spectrum'
import { useQuery } from '@tanstack/react-query'
import { Controller, type UseFormReturn, useForm } from 'react-hook-form'
import { BiEdit } from 'react-icons/bi'
import { Form } from 'react-router-dom'

import { AspectRatio } from '@/components/AspectRatio'
import { FileDropZone } from '@/components/FileDropZone'
import { AdsService } from '@/features/ads/api'
import type { IAds } from '@/entities/ads'

const defaultValues: AdsFormValues = {
  title: '',
  description: "",
  status: false,
  type: "navbar"
}

export const AdsForm: FC<{
  onSubmit: (values: FormData) => void
  adData?: IAds
  isPending: boolean
  actions: (form: UseFormReturn<AdsFormValues>) => ReactNode
}> = (props) => {
  const { onSubmit, adData, isPending, actions } = props

  const [file, setFile] = useState<File | null>(null)
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const [isFileEditing, setFileEditing] = useState(true)

  const form = useForm<AdsFormValues>({
    disabled: isPending,
    defaultValues
  })

  const adsQuery = useQuery({
    queryKey: [AdsService.QueryKey.GetById, { page: 1, limit: 100 }],
    queryFn: () => AdsService.getAdsByID(adData?.id ?? 0),
    enabled: !!adData?.id
  })

  const adsData = adsQuery.data?.data


  useEffect(() => {
    if (adsData && adData) {
      form.reset({
        title: adsData.title,
        description: adsData.description,
        status: adsData.status,
        type: adsData.type,
      })
      if (adsData.file_url) {
        setFileUrl(adsData.file_url)
      }
      setFileEditing(false)
    } else {
      form.reset(defaultValues)
    }
  }, [form, adsData, adData])

  const handleSubmit = form.handleSubmit((values) => {
    const formData = new FormData()

    formData.append('title', values.title)
    formData.append('type', values.type)
    formData.append("status", (values.status ?? false).toString())

    if (file) {
      formData.append('file', file)
    }
    if (values.description) {
      formData.append('description', values.description)
    }

    onSubmit(formData)
  })


  const handleFileChange = (file: File) => {
    setFile(file)
    setFileUrl(URL.createObjectURL(file))
    setFileEditing(false)
  }


  return (
    <Form
      onSubmit={handleSubmit}
      className="h-full flex flex-col"
    >
      <div className="col-span-4 flex flex-col gap-8">
        <div>
          <AspectRatio ratio={3 / 2}>
            {isFileEditing || !fileUrl ? (
              <FileDropZone
                onFileChange={handleFileChange}
                label="Upload File"
              />
            ) : (
              <div className="w-full h-full">
                <div className="w-full h-full bg-neutral-900 overflow-hidden">
                  <Image
                    src={fileUrl}
                    alt="Thumbnail Preview"
                    width="100%"
                    height="100%"
                    objectFit="contain"
                  />
                </div>
                <div className="absolute right-4 bottom-4">
                  <Button
                    variant="primary"
                    onPress={() => setFileEditing(true)}
                    aria-label="Edit Thumbnail"
                  >
                    <Icon>
                      <BiEdit />
                    </Icon>
                  </Button>
                </div>
              </div>
            )}
          </AspectRatio>
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-8">
        <Controller
          control={form.control}
          name="title"
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Title"
              width="100%"
              errorMessage={fieldState.error?.message}
            />
          )}
        />

        <Controller
          control={form.control}
          name="description"
          render={({ field, fieldState }) => (
            <TextArea
              {...field}
              label="Description"
              width="100%"
              errorMessage={fieldState.error?.message}
            />
          )}
        />

        <Controller
          control={form.control}
          name="status"
          render={({ field }) => (
            <Switch ref={field.ref} isSelected={field.value} onChange={field.onChange} name={field.name}>
              Is Active
            </Switch>
          )}
        />

        <Controller
          control={form.control}
          name="type"
          render={({ field }) => (
            <Picker selectedKey={field.value} onSelectionChange={field.onChange}>
              <Item key="navbar">Navbar</Item>
              <Item key="side">Side</Item>
            </Picker>
          )}
        />

        {actions(form)}
      </div>
    </Form>
  )
}
