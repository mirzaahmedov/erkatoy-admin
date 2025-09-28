import { type FC, forwardRef, useCallback, useMemo, useRef } from 'react'

import { useMutation } from '@tanstack/react-query'
import Quill from 'quill'
import QuillResizeImage from 'quill-resize-image'
import 'quill/dist/quill.snow.css'

import { StorageService } from '@/features/storage/api'
import { getImageUrl } from '@/features/storage/utils'
import { swal } from '@/lib/swal'

import ReactQuill, { type ReactQuillProps } from './ReactQuill'

Quill.register('modules/resize', QuillResizeImage)

export const QuillEditor: FC<ReactQuillProps> = forwardRef((props) => {
  const quillRef = useRef<{
    getQuill: () => Quill | null
  }>(null)

  const { mutate: uploadImage } = useMutation({
    mutationFn: StorageService.uploadImage
  })

  const imageHandler = useCallback(() => {
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')
    input.click()

    input.onchange = async () => {
      if (input.files && input.files[0]) {
        const file = input.files[0]
        const range = quillRef.current?.getQuill()?.getSelection(true)

        const formData = new FormData()
        formData.append('image', file)
        uploadImage(formData, {
          onSuccess: (res) => {
            const quill = quillRef.current?.getQuill()
            const imageId = res.data?.[0]?.id
            if (quill && range && imageId) {
              quill.insertEmbed(range.index, 'image', getImageUrl(imageId))
              swal.fire({
                title: 'Success',
                text: 'Image uploaded successfully',
                icon: 'success'
              })
            }
          },
          onError: () => {
            swal.fire({
              title: 'Error',
              text: 'Failed to upload image',
              icon: 'error'
            })
          }
        })
      }
    }
  }, [uploadImage])

  const modules = useMemo(() => {
    return {
      resize: {
        locale: {}
      },
      toolbar: {
        container: toolbarItems,
        handlers: {
          image: imageHandler
        }
      }
    }
  }, [imageHandler])

  return (
    <ReactQuill
      ref={quillRef}
      theme="snow"
      modules={modules}
      {...props}
    />
  )
})

const toolbarItems = [
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],
  ['link', 'image'],

  [{ header: 1 }, { header: 2 }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ indent: '-1' }, { indent: '+1' }],

  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }],
  [{ font: [] }],
  [{ align: [] }],

  ['clean']
]
