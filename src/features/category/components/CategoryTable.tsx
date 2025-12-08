import { BiEdit, BiTrash } from "react-icons/bi";
import { Button, ButtonGroup, Icon, Switch } from "@adobe/react-spectrum";

import type { CustomCellRendererProps } from "ag-grid-react";
import type { FC } from "react";
import { GenericTable } from "@/components/GenericTable";
import type { ICategory } from "@/entities/category";
import { formatDate } from "@/utils/format/date";

export interface CategoryTableProps {
  rowData: ICategory[];
  onEdit: (category: ICategory) => void;
  onDelete: (id: number) => void;
}
export const CategoryTable: FC<CategoryTableProps> = (props) => {
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
            field: "is_active",
            headerName: "Is Active",
            cellRenderer: ({ value }: CustomCellRendererProps) => (
              <Switch isSelected={value} />
            ),
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
