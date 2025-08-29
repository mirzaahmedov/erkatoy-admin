import type { CustomCellRendererProps } from "ag-grid-react";
import type { FC } from "react";

import { Button, ButtonGroup, Icon } from "@adobe/react-spectrum";
import { BiEdit, BiTrash } from "react-icons/bi";

import { GenericTable } from "@/components/GenericTable";
import { formatDate } from "@/utils/format/date";

import type { ITag } from "@/entities/tag";

export interface TagTableProps {
  rowData: ITag[];
  onEdit: (tag: ITag) => void;
  onDelete: (id: number) => void;
}
export const TagTable: FC<TagTableProps> = (props) => {
  const { rowData, onEdit, onDelete } = props;

  return (
    <div className="h-full">
      <GenericTable
        rowData={rowData}
        columnDefs={[
          {
            flex: 1,
            field: "name",
          },
          {
            flex: 1,
            field: "created_at",
            headerName: "Created At",
            valueFormatter: ({ value }) => formatDate(value),
          },
          {
            flex: 1,
            field: "updated_at",
            headerName: "Updated At",
            valueFormatter: ({ value }) => formatDate(value),
          },
          {
            flex: 1,
            field: "actions",
            headerName: "Actions",
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
            ),
          },
        ]}
      />
    </div>
  );
};
