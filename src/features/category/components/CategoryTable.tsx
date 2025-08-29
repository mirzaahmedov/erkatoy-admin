import { useQuery } from "@tanstack/react-query";
import { CategoryService } from "../api";
import { GenericTable } from "@/components/GenericTable";
import { formatDate } from "@/utils/format/date";
import { Button, ButtonGroup, Checkbox, Icon } from "@adobe/react-spectrum";
import type { CustomCellRendererProps } from "ag-grid-react";
import { BiEdit, BiTrash } from "react-icons/bi";
import type { FC } from "react";

export interface CategoryTableProps {
  onDelete: (id: number) => void;
}
export const CategoryTable: FC<CategoryTableProps> = ({ onDelete }) => {
  const categoryQuery = useQuery({
    queryKey: [CategoryService.QueryKey.GetAll, { page: 1, limit: 10 }],
    queryFn: CategoryService.getCategories,
  });

  const rowData = categoryQuery.data?.data?.data ?? [];

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
              <Checkbox isSelected={value} />
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
              <ButtonGroup marginTop="size-50">
                <Button variant="secondary">
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
