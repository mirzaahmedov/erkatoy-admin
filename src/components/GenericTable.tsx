import { colorSchemeDark, themeQuartz } from "ag-grid-community";
import { AgGridReact, type AgGridReactProps } from "ag-grid-react";
import type { FC } from "react";

export const GenericTable: FC<AgGridReactProps> = (props) => {
  return (
    <AgGridReact
      theme={themeQuartz.withPart(colorSchemeDark)}
      {...props}
    />
  );
};
