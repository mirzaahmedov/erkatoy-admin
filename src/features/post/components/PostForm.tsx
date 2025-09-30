import type { PostFormValues } from '../schema'
import type { IPost } from '@/entities/post'

import { type FC, type ReactNode, useEffect, useState } from 'react'

import {
  Button,
  ComboBox,
  Flex,
  Icon,
  Image,
  Item,
  TextArea,
  TextField,
  View
} from '@adobe/react-spectrum'
import { useQuery } from '@tanstack/react-query'
import { Controller, type UseFormReturn, useForm } from 'react-hook-form'
import { BiEdit } from 'react-icons/bi'
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
  const [isImageEditing, setImageEditing] = useState(true)

  const [gifFile, setGifFile] = useState<File | null>(null)
  const [gifUrl, setGifUrl] = useState<string | null>(null)
  const [isGifEditing, setGifEditing] = useState(true)

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
      setImageEditing(false)
      if (postData.gif) {
        setGifUrl(getImageUrl(postData.gif))
      }
      setGifEditing(false)
    } else {
      form.reset(defaultValues)
    }
  }, [form, postData])

  const handleSubmit = form.handleSubmit((values) => {
    const formData = new FormData()

    formData.append('title', values.title)
    formData.append('content', values.content)
    formData.append('fio', values.fio)

    if (imageFile) {
      formData.append('image', imageFile)
    }
    if (gifFile) {
      formData.append('gif', gifFile)
    }
    if (values.descr) {
      formData.append('description', values.descr)
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
    setImageEditing(false)
  }

  const handleGifChange = (file: File) => {
    setGifFile(file)
    setGifUrl(URL.createObjectURL(file))
    setGifEditing(false)
  }

  return (
    <Form
      onSubmit={handleSubmit}
      className="h-full flex flex-col gap-2.5 overflow-hidden"
    >
      <Flex
        flex={1}
        gap="size-300"
        UNSAFE_className="min-h-0"
      >
        <Flex
          direction="column"
          gap="size-400"
        >
          {/* Thumbnail Upload Section */}
          <View UNSAFE_className="mb-2">
            <strong style={{ fontSize: '1rem', display: 'block', marginBottom: 4 }}>
              Thumbnail (Main Image)
            </strong>
            <span style={{ color: '#888', fontSize: '0.9rem', display: 'block', marginBottom: 8 }}>
              This image will be shown as the post thumbnail.
            </span>
            {isImageEditing || !imageUrl ? (
              <FileDropZone
                onFileChange={handleImageChange}
                label="Upload Thumbnail"
              />
            ) : (
              <Flex
                position="relative"
                direction="column"
                gap="size-200"
              >
                <Flex
                  width="540px"
                  height="360px"
                  justifyContent="center"
                  alignItems="center"
                  UNSAFE_className="bg-neutral-900 overflow-hidden"
                >
                  <Image
                    src={imageUrl}
                    alt="Thumbnail Preview"
                    width="100%"
                    height="100%"
                    objectFit="contain"
                  />
                </Flex>
                <View
                  position="absolute"
                  right="size-100"
                  bottom="size-100"
                >
                  <Button
                    variant="primary"
                    onPress={() => setImageEditing(true)}
                    aria-label="Edit Thumbnail"
                  >
                    <Icon>
                      <BiEdit />
                    </Icon>
                  </Button>
                </View>
              </Flex>
            )}
          </View>

          <View UNSAFE_className="mb-2">
            <strong style={{ fontSize: '1rem', display: 'block', marginBottom: 4 }}>
              GIF (Hover Animation)
            </strong>
            <span style={{ color: '#888', fontSize: '0.9rem', display: 'block', marginBottom: 8 }}>
              This GIF will play when users hover over the post thumbnail.
            </span>
            {isGifEditing || !gifUrl ? (
              <FileDropZone
                onFileChange={handleGifChange}
                label="Upload GIF"
                acceptedTypes={['image/gif']}
              />
            ) : (
              <Flex
                position="relative"
                direction="column"
                gap="size-200"
              >
                <Flex
                  width="540px"
                  height="360px"
                  justifyContent="center"
                  alignItems="center"
                  UNSAFE_className="bg-neutral-900 overflow-hidden"
                >
                  <Image
                    src={gifUrl}
                    alt="GIF Preview"
                    width="100%"
                    height="100%"
                    objectFit="contain"
                  />
                </Flex>
                <View
                  position="absolute"
                  right="size-100"
                  bottom="size-100"
                >
                  <Button
                    variant="primary"
                    onPress={() => setGifEditing(true)}
                    aria-label="Edit GIF"
                  >
                    <Icon>
                      <BiEdit />
                    </Icon>
                  </Button>
                </View>
              </Flex>
            )}
          </View>
        </Flex>

        <Flex
          flex={1}
          direction="column"
          gap="size-50"
          UNSAFE_className="min-h-0 h-full overflow-hidden"
        >
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

          <div className="flex-1 min-h-0 overflow-hidden pt-4 pb-14">
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
        </Flex>
      </Flex>

      {actions(form)}
    </Form>
  )
}
