import type { PostFormValues } from '../schema'
import type { IPost } from '@/entities/post'

import { type FC, type ReactNode, useEffect, useState } from 'react'

import { Button, ComboBox, Icon, Image, Item, TextArea, TextField } from '@adobe/react-spectrum'
import { useQuery } from '@tanstack/react-query'
import { Controller, type UseFormReturn, useForm } from 'react-hook-form'
import { BiEdit } from 'react-icons/bi'
import ReactPlayer from 'react-player'
import { Form } from 'react-router-dom'

import { FileDropZone } from '@/components/FileDropZone'
import { QuillEditor } from '@/components/QuillEditor'
import { CategoryService } from '@/features/category/api'
import { getImageUrl } from '@/utils/image'

const defaultValues: PostFormValues = {
  title: '',
  content: '',
  descr: '',
  fio: '',
  tags: []
}

export const PostForm: FC<{
  onSubmit: (values: FormData) => void
  postData?: IPost
  isPending: boolean
  actions: (form: UseFormReturn<PostFormValues>) => ReactNode
}> = (props) => {
  const { onSubmit, postData, isPending, actions } = props

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isImageEditing, setIsImageEditing] = useState(true)

  const [gifFile, setGifFile] = useState<File | null>(null)
  const [gifUrl, setGifUrl] = useState<string | null>(null)
  const [isGifEditing, setIsGifEditing] = useState(true)

  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [isVideoEditing, setIsVideoEditing] = useState(true)

  const form = useForm<PostFormValues>({
    disabled: isPending,
    defaultValues
  })

  const categoryQuery = useQuery({
    queryKey: [CategoryService.QueryKey.GetAll, { page: 1, limit: 100 }],
    queryFn: CategoryService.getCategories
  })

  useEffect(() => {
    if (postData) {
      form.reset({
        fio: postData.fio,
        title: postData.title,
        descr: postData.description,
        category_id: postData.category_id,
        content: postData.content,
        tags: []
      })
      setImageUrl(getImageUrl(postData.image))
      setIsImageEditing(false)

      if (postData.gif) {
        setGifUrl(getImageUrl(postData.gif))
      }
      setIsGifEditing(false)

      if (postData.video) {
        setVideoUrl(getImageUrl(postData.video))
      }
      setIsVideoEditing(false)
    } else {
      form.reset(defaultValues)
    }
  }, [form, postData])

  const handleSubmit = form.handleSubmit((values) => {
    const formData = new FormData()

    formData.append('title', values.title)
    formData.append('content', values.content)
    formData.append('fio', values.fio)
    formData.append('description', values.descr ?? '')

    if (imageFile) {
      formData.append('image', imageFile)
    }
    if (gifFile) {
      formData.append('gif', gifFile)
    }
    if (videoFile) {
      formData.append('video', videoFile)
    }
    if (values.tags && values.tags.length > 0) {
      values.tags.forEach((tag) => formData.append('tags[]', tag.toString()))
    }
    if (values.category_id) {
      formData.append('category_id', values.category_id.toString())
    }

    onSubmit(formData)
  })

  const categoryData = categoryQuery.data?.data?.data ?? []

  const handleImageChange = (file: File) => {
    setImageFile(file)
    setImageUrl(URL.createObjectURL(file))
    setIsImageEditing(false)
  }

  const handleGifChange = (file: File) => {
    setGifFile(file)
    setGifUrl(URL.createObjectURL(file))
    setIsGifEditing(false)
  }

  const handleVideoChange = (file: File) => {
    setVideoFile(file)
    setVideoUrl(URL.createObjectURL(file))
    setIsVideoEditing(false)
  }

  return (
    <Form
      onSubmit={handleSubmit}
      className="h-full flex flex-col"
    >
      <div className="grid grid-cols-12 gap-8 p-5 flex-1">
        <div className="col-span-4 flex flex-col gap-6">
          <MediaCard
            title="Thumbnail"
            src={imageUrl}
            isEditing={isImageEditing}
            onEdit={() => setIsImageEditing(true)}
            onFileChange={handleImageChange}
          />

          <MediaCard
            title="GIF (Hover)"
            src={gifUrl}
            isEditing={isGifEditing}
            onEdit={() => setIsGifEditing(true)}
            onFileChange={handleGifChange}
            accept={['image/gif']}
          />

          <MediaCard
            title="Video"
            src={videoUrl}
            isEditing={isVideoEditing}
            onEdit={() => setIsVideoEditing(true)}
            onFileChange={handleVideoChange}
            accept={['video/mp4']}
          />
        </div>

        <div className="col-span-8 flex flex-col min-h-0 gap-4">
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
            name="descr"
            render={({ field, fieldState }) => (
              <TextArea
                {...field}
                label="Description"
                width="100%"
                errorMessage={fieldState.error?.message}
              />
            )}
          />

          <div className="grid grid-cols-2 gap-5">
            <Controller
              control={form.control}
              name="fio"
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="FIO"
                  width="100%"
                  errorMessage={fieldState.error?.message}
                />
              )}
            />
            <Controller
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <ComboBox
                  label="Category"
                  width="100%"
                  menuTrigger="focus"
                  selectedKey={field.value ? String(field.value) : null}
                  onSelectionChange={(key) => {
                    field.onChange(key ? Number(key) : undefined)
                  }}
                  items={categoryData ?? []}
                >
                  {(item) => <Item key={item.id}>{item.name}</Item>}
                </ComboBox>
              )}
            />
          </div>

          <div className="flex-1 min-h-0 overflow-hidden pb-20">
            <Controller
              control={form.control}
              name="content"
              render={({ field }) => (
                <QuillEditor
                  {...field}
                  className="h-full"
                  onValueChange={field.onChange}
                />
              )}
            />
          </div>

          {actions(form)}
        </div>
      </div>
    </Form>
  )
}

const isVideo = (accept?: string[], src?: string | null) => {
  if (accept?.some((t) => t.startsWith('video/'))) return true
  if (!src) return false
  return /\.(mp4|webm|ogg)$/i.test(src)
}

const MediaCard: FC<{
  title: string
  src?: string | null
  isEditing: boolean
  onEdit: () => void
  onFileChange: (file: File) => void
  accept?: string[]
}> = ({ title, src, isEditing, onEdit, onFileChange, accept }) => {
  const video = isVideo(accept, src)

  return (
    <div className="flex flex-col gap-2">
      <strong className="text-sm">{title}</strong>

      <div className="relative overflow-hidden min-h-[180px]">
        {isEditing || !src ? (
          <FileDropZone
            onFileChange={onFileChange}
            acceptedTypes={accept}
            label={`Upload ${title}`}
          />
        ) : (
          <>
            {video ? (
              <ReactPlayer
                src={src}
                controls
                width="100%"
                height="100%"
              />
            ) : (
              <Image
                src={src}
                alt={title}
                width="100%"
                height="100%"
                objectFit="contain"
              />
            )}

            <div className="absolute top-3 right-3">
              <Button
                variant="primary"
                onPress={onEdit}
                aria-label={`Edit ${title}`}
                UNSAFE_className="backdrop-blur"
              >
                <Icon>
                  <BiEdit />
                </Icon>
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
