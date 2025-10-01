import type { DropEvent } from '@react-types/shared'
import type { FC } from 'react'

import {
  Button,
  DropZone,
  FileTrigger,
  Heading,
  Icon,
  IllustratedMessage,
  View
} from '@adobe/react-spectrum'
import Upload from '@spectrum-icons/illustrations/Upload'

import { swal } from '@/lib/swal'

export interface FileDropZoneProps {
  label: string
  acceptedTypes?: string[]
  onFileChange: (file: File) => void
}
export const FileDropZone: FC<FileDropZoneProps> = ({ label, acceptedTypes, onFileChange }) => {
  const handleDrop = async (e: DropEvent) => {
    try {
      const item = e.items[0]
      if (item.kind === 'file' && item.type.startsWith('image/')) {
        onFileChange(await item.getFile())
      } else {
        throw new Error('Only image files are allowed')
      }
    } catch (error) {
      console.error(error)
      swal.fire({
        title: 'Error',
        text: (error as Error).message || 'Failed to upload file',
        icon: 'error'
      })
    }
  }

  const handleSelect = (files: FileList | null) => {
    if (files) {
      onFileChange(files[0])
    } else {
      swal.fire({
        title: 'Error',
        text: 'No file selected',
        icon: 'error'
      })
    }
  }

  return (
    <DropZone
      width="100%"
      height="100%"
      onDrop={handleDrop}
      UNSAFE_className="!p-10"
    >
      <IllustratedMessage>
        <Icon>
          <Upload />
        </Icon>
        <Heading>{label}</Heading>
        <View marginTop="size-200">
          <FileTrigger
            acceptedFileTypes={acceptedTypes}
            onSelect={handleSelect}
          >
            <Button variant="accent">Select a file</Button>
          </FileTrigger>
        </View>
      </IllustratedMessage>
    </DropZone>
  )
}
