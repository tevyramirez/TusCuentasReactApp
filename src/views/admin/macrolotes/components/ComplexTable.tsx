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
  nombre: string,
  apellido: string,
  email: string,
  numero_telefono: string,
  razon_social: string,
  alicuota: number
};
const columnHelper = createColumnHelper<RowObj>();

// const columns = columnsDataCheck;
export default function ComplexTable(props:{tableData:any}){
  const { tableData } = props;
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  let defaultData = tableData;
  console.log(defaultData)
  const dataLength = defaultData.length
  console.log("data:", dataLength)
  const columns = [
    columnHelper.accessor("nombre", {
      id: "nombre",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">Nombre</p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }), 
    columnHelper.accessor("apellido", {
      id: "apellido",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">Apellido</p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
      
    }),
    columnHelper.accessor("email", {
      id: "email",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">E-mail</p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
      
    }),
    columnHelper.accessor("numero_telefono", {
      id: "numero_telefono",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">Teléfono</p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
      
    }),
    columnHelper.accessor("alicuota", {
      id: "alicuota",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">Alicuota</p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
      
    }),
    columnHelper.accessor("alicuota", {
      id: "alicuota",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">Acciones</p>
      ),
      cell: (info) => (
        <div className="flex">
        <button className="mx-1 text-gray-600 dark:text-white">
          <MdVisibility/>
        </button>
        <button className="mx-1 text-gray-600 dark:text-white">
          <MdEdit/>
        </button>
        <button className="mx-1 text-gray-600 dark:text-white">
          <MdDelete/>
        </button>
      </div>
      ),
      
    }),
  ]; // eslint-disable-next-line
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
      {/* <div className="relative flex items-center justify-between pt-4">
        <div className="text-xl font-bold text-navy-700 dark:text-white">
        </div>
        <CardMenu />
      </div> */}

      <div className="mt-8 overflow-x-scroll xl:overflow-x-hidden">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="!border-px !border-gray-400">
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      onClick={header.column.getToggleSortingHandler()}
                      className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start"
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
            {table
              .getRowModel()
              .rows.slice(0, dataLength)
              .map((row) => {
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
