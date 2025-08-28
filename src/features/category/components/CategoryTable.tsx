import { useQuery } from "@tanstack/react-query";
import { CategoryService } from "../api";
import { GenericTable } from "@/components/GenericTable";

export const CategoryTable = () => {
  const categoryQuery = useQuery({
    queryKey: [CategoryService.QueryKey.GetAll, { page: 1, limit: 10 }],
    queryFn: CategoryService.getCategories,
  });

  const rowData = categoryQuery.data?.data?.data?.data ?? [];

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
          },
          {
            flex: 1,
            field: "created_at",
            headerName: "Created At",
            valueFormatter: ({ value }) => new Date(value).toLocaleString(),
          },
          {
            flex: 1,
            field: "updated_at",
            headerName: "Updated At",
            valueFormatter: ({ value }) => new Date(value).toLocaleString(),
          },
        ]}
      />
    </div>
  );
};
