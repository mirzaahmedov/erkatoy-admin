import type { IPost } from '@/entities/post'
import type { CustomCellRendererProps } from 'ag-grid-react'
import type { FC } from 'react'

import { Button, ButtonGroup, Icon, Image } from '@adobe/react-spectrum'
import { BiEdit, BiTrash } from 'react-icons/bi'

import { GenericTable } from '@/components/GenericTable'
import { formatDate } from '@/utils/format/date'
import { getImageUrl } from '@/utils/image'

export interface PostTableProps {
  rowData: IPost[]
  onEdit: (post: IPost) => void
  onDelete: (id: number) => void
}
export const PostTable: FC<PostTableProps> = (props) => {
  const { rowData, onEdit, onDelete } = props

  return (
    <div className="h-full">
      <GenericTable
        rowData={rowData}
        columnDefs={[
          {
            flex: 1,
            field: 'image',
            headerName: 'Thumbnail',
            minWidth: 120,
            maxWidth: 140,
            cellRenderer: (props: CustomCellRendererProps) => (
              <div className="flex items-center justify-center h-full">
                <Image
                  src={getImageUrl(props.data.image)}
                  alt="Thumbnail Preview"
                  width={96}
                  height={64}
                  objectFit="cover"
                  UNSAFE_className="rounded"
                />
              </div>
            )
          },
          {
            flex: 1,
            field: 'title'
          },
          {
            flex: 1,
            field: 'description',
            headerName: 'Description',
            autoHeight: true,
            cellStyle: { whiteSpace: 'normal', lineHeight: '1.4', padding: '8px' },
            wrapText: true
          },
          {
            flex: 1,
            field: 'category_name',
            headerName: 'Category Name'
          },
          {
            flex: 1,
            field: 'created_at',
            headerName: 'Created At',
            valueFormatter: ({ value }) => formatDate(value)
          },
          {
            flex: 1,
            field: 'updated_at',
            headerName: 'Updated At',
            valueFormatter: ({ value }) => formatDate(value)
          },
          {
            flex: 1,
            field: 'actions',
            headerName: 'Actions',
            cellRenderer: ({ data }: CustomCellRendererProps) => (
              <ButtonGroup>
                <Button
                  variant="secondary"
                  onPress={() => onEdit(data)}
                >
                  <Icon>
                    <BiEdit />
                  </Icon>
                </Button>
                <Button
                  variant="negative"
                  onPress={() => onDelete(data.id)}
                >
                  <Icon>
                    <BiTrash />
                  </Icon>
                </Button>
              </ButtonGroup>
            )
          }
        ]}
      />
    </div>
  )
}
