import type { PostFormValues } from '../schema'
import type { IPost } from '@/entities/post'

import { type FC, type ReactNode, useEffect, useState } from 'react'

import {
  Button,
  ComboBox,
  type DropItem,
  DropZone,
  FileTrigger,
  Flex,
  Heading,
  Icon,
  IllustratedMessage,
  Image,
  Item,
  Text,
  TextArea,
  TextField,
  View
} from '@adobe/react-spectrum'
import Upload from '@spectrum-icons/illustrations/Upload'
import { useQuery } from '@tanstack/react-query'
import { Controller, type UseFormReturn, useForm } from 'react-hook-form'
import { BiEdit } from 'react-icons/bi'
import { Form } from 'react-router-dom'

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

  const [file, setFile] = useState<File | null>(null)
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const [isEditingFile, setEditingFile] = useState(true)

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
      setFileUrl(getImageUrl(postData.image))
      setEditingFile(false)
    } else {
      form.reset(defaultValues)
    }
  }, [form, postData])

  const handleSubmit = form.handleSubmit((values) => {
    const formData = new FormData()

    formData.append('title', values.title)
    formData.append('content', values.content)
    formData.append('fio', values.fio)

    if (file) {
      formData.append('image', file)
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

  const handleDrop = (item: DropItem) => {
    if (item.kind === 'file' && item.type?.startsWith('image/')) {
      item.getFile().then((f) => {
        setFile(f)
        setFileUrl(URL.createObjectURL(f))
        setEditingFile(false)
      })
    }
  }

  const categoryData = categoryQuery.data?.data?.data ?? []

  return (
    <Form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2.5"
    >
      <Flex gap="size-300">
        {isEditingFile || !fileUrl ? (
          <DropZone
            width="540px"
            height="360px"
            onDrop={(e) => handleDrop(e.items[0])}
            UNSAFE_className="!p-10"
          >
            <IllustratedMessage>
              <Icon>
                <Upload />
              </Icon>
              <Heading>Drag and drop your file</Heading>
              <View marginTop="size-200">
                <FileTrigger
                  onSelect={(e) => {
                    if (!e) return
                    const files = Array.from(e)
                    setFile(files[0])
                    setFileUrl(URL.createObjectURL(files[0]))
                    setEditingFile(false)
                  }}
                >
                  <Button variant="accent">Select a file</Button>
                </FileTrigger>
              </View>
            </IllustratedMessage>
          </DropZone>
        ) : (
          <Flex
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
                src={fileUrl}
                alt="Uploaded"
                width="100%"
                height="100%"
                objectFit="contain"
              />
            </Flex>
            <View>
              <Button
                variant="primary"
                onPress={() => setEditingFile(true)}
              >
                <Icon>
                  <BiEdit />
                </Icon>
                <Text>Edit</Text>
              </Button>
            </View>
          </Flex>
        )}

        <Flex
          flex={1}
          direction="column"
          gap="size-200"
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

          <div className="mt-6 pb-20">
            <Controller
              control={form.control}
              name="content"
              render={({ field }) => (
                <QuillEditor
                  {...field}
                  className="h-96"
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
