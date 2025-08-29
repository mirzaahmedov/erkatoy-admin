import type { FC } from "react";

import { colorSchemeDark, themeQuartz } from "ag-grid-community";
import { AgGridReact, type AgGridReactProps } from "ag-grid-react";

export const GenericTable: FC<AgGridReactProps> = (props) => {
  return (
    <AgGridReact
      theme={themeQuartz.withPart(colorSchemeDark)}
      defaultColDef={{
        sortable: false,
      }}
      rowHeight={50}
      {...props}
    />
  );
};
