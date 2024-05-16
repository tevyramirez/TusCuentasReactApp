import React from "react";
import CardMenu from "components/card/CardMenu";
import Card from "components/card";
import { MdEdit, MdVisibility, MdDelete } from "react-icons/md";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

type RowObj = {
  [key: string]: any;
};


// const columns = columnsDataCheck;
export default function ComplexTable(props:{tableData:any}){
  const { tableData } = props;
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const columnHelper = createColumnHelper<RowObj>();
 
  const firstRow = tableData.length > 0 ? tableData[0] : {};
  const handleClick = (event: { target: { value: any; }; }) => {
    const propietarioId = event.target.value;
    console.log("ID del propietario:", propietarioId);
    // Aquí puedes realizar otras acciones según la ID del propietario
  };

// Dentro del componente ComplexTable
const columns = Object.keys(firstRow)
  .filter(key => key !== "ID Propietario")
  .filter(key => key !== "Razon Social")  // Exclude "ID Propietario"
  .map((key) => columnHelper.accessor(key, {
    id: key,
    header: () => (
      <p className="text-sm font-bold text-gray-600 dark:text-white">{key}</p>
    ),
    cell: (info) => {
      const value = info.getValue();
      if (key === 'Propiedades') {
        const units = value.split(', '); // Dividir la cadena por comas y espacio
        return (
          <select className="select-dropdown m-2">
            <option>Selecciona</option>
            {units.map((unit: string, index: number) => (
              <option key={index} value={unit.trim()}>{unit.trim()}</option>
            ))}
          </select>
        );
      } else {
        return (
          <p className="text-sm font-bold text-navy-700 dark:text-white">
            {value}
          </p>
        );
      }
    },
  })
);

    // Agregar la columna de acciones
    columns.push(
      columnHelper.accessor("actions", {
        id: "actions",
        header: () => (
          <p className="text-sm font-bold text-gray-600 dark:text-white">
            Acciones
          </p>
        ),
        cell: (info) => (
          <div className="flex">
            <button className="mx-1 text-gray-600 dark:text-white" value={info.row.original.id}>
              <MdVisibility />
            </button>
            <button className="mx-1 text-gray-600 dark:text-white">
              <MdEdit />
            </button>
            <button className="mx-1 text-gray-600 dark:text-white">
              <MdDelete />
            </button>
          </div>
        ),
      })
    );
 // eslint-disable-next-line
  React.useEffect(() => {
    if (tableData && tableData.length > 0) {
      setIsLoading(false);
    }
  }, [tableData]);
  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });
  return (
    <Card extra={"w-full h-full px-6 pb-6 sm:overflow-x-auto"}>

      <div className="mt-8 ">
        <table className="max-w-25">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="!border-px !border-gray-400">
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      onClick={header.column.getToggleSortingHandler()}
                      className="cursor-pointer border-b-[1px] border-gray-200 pb-2 pr-4 text-start"
                    >
                      <div className="items-center justify-between text-xs text-gray-200">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: "",
                          desc: "",
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
          {table.getRowModel().rows.map((row) => {
              return (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td
                        key={cell.id}
                        className="min-w-[150px] border-white/0 py-3  pr-4"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
