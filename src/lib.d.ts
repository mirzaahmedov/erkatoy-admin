import Quill from 'quill'

declare module 'quill-image-uploader' {
  interface ImageUploaderOptions {
    upload: (file: File) => Promise<string>
  }

  class ImageUploader {
    constructor(quill: Quill, options: ImageUploaderOptions)
  }

  export = ImageUploader
}
