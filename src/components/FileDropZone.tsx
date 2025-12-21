import type { DropEvent } from '@react-types/shared'
import type { FC } from 'react'

import {
  Button,
  DropZone,
  FileTrigger,
  Flex,
  Heading,
  IllustratedMessage,
  Text,
  View
} from '@adobe/react-spectrum'
import { IconPhoto, IconUpload, IconVideo } from '@tabler/icons-react'

import { swal } from '@/lib/swal'

export interface FileDropZoneProps {
  label: string
  acceptedTypes?: string[]
  onFileChange: (file: File) => void
}

const getTablerIconByType = (types?: string[]) => {
  if (!types || types.length === 0) return IconUpload

  if (types.some((t) => t.startsWith('image/'))) return IconPhoto
  if (types.some((t) => t.startsWith('video/'))) return IconVideo

  return IconUpload
}

export const FileDropZone: FC<FileDropZoneProps> = ({ label, acceptedTypes, onFileChange }) => {
  const IconComponent = getTablerIconByType(acceptedTypes)

  const handleDrop = async (e: DropEvent) => {
    try {
      const item = e.items[0]
      if (item.kind !== 'file') {
        throw new Error('Invalid item')
      }

      const file = await item.getFile()

      if (
        acceptedTypes &&
        !acceptedTypes.some((type) => file.type.startsWith(type.replace('*', '')))
      ) {
        throw new Error(`Unsupported file type`)
      }

      onFileChange(file)
    } catch (error) {
      swal.fire({
        title: 'Upload error',
        text: (error as Error).message || 'Failed to upload file',
        icon: 'error'
      })
    }
  }

  const handleSelect = (files: FileList | null) => {
    if (!files?.length) {
      swal.fire({
        title: 'Error',
        text: 'No file selected',
        icon: 'error'
      })
      return
    }

    onFileChange(files[0])
  }

  return (
    <DropZone
      width="100%"
      height="100%"
      onDrop={handleDrop}
      UNSAFE_className="!p-10"
    >
      <Flex justifyContent="center">
        <IconComponent size={40} />
      </Flex>
      <IllustratedMessage>
        <Heading level={6}>{label}</Heading>

        <Text>Drag & drop or select a file</Text>

        <View marginTop="size-300">
          <FileTrigger
            acceptedFileTypes={acceptedTypes}
            onSelect={handleSelect}
          >
            <Button variant="accent">Select file</Button>
          </FileTrigger>
        </View>
      </IllustratedMessage>
    </DropZone>
  )
}
