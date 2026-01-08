import type { IBgImage } from '@/entities/BgImage'
import type { CustomCellRendererProps } from 'ag-grid-react'
import type { FC } from 'react'

import { Button, ButtonGroup, Icon, Image, ProgressCircle, Switch } from '@adobe/react-spectrum'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { BiEdit, BiTrash } from 'react-icons/bi'

import { GenericTable } from '@/components/GenericTable'
import { formatDate } from '@/utils/format/date'

import { BgImageService } from '../api'

export interface BgImageTableProps {
  rowData: IBgImage[]
  onEdit: (post: IBgImage) => void
  onDelete: (id: number) => void
}
export const BgImageTable: FC<BgImageTableProps> = (props) => {
  const { rowData, onEdit, onDelete } = props

  return (
    <div className="h-full">
      <GenericTable
        rowData={rowData}
        columnDefs={[
          {
            flex: 1,
            field: 'file',
            headerName: 'Image',
            minWidth: 120,
            maxWidth: 140,
            cellRenderer: (props: CustomCellRendererProps) => (
              <div className="flex items-center justify-center h-full">
                <Image
                  src={props.data.file_url}
                  alt="Image Preview"
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
            field: 'active',
            headerName: 'Is Active',
            cellRenderer: StatusCell
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

const StatusCell = ({ value, data }: CustomCellRendererProps) => {
  const queryClient = useQueryClient()

  const updateStatus = useMutation({
    mutationFn: (status: boolean) => BgImageService.updateImageActive(data.id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [BgImageService.QueryKey.GetAll]
      })
    }
  })

  return updateStatus.isPending ? (
    <ProgressCircle isIndeterminate />
  ) : (
    <Switch
      isSelected={value}
      onChange={(selected) => updateStatus.mutate(selected)}
    ></Switch>
  )
}
