import React from "react";
import {
  Box,
  Card,
  CardBody,
  Flex,
  IconButton,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Spinner,
} from "@chakra-ui/react";
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

export default function ComplexTable(props: { tableData: any }) {
  const { tableData } = props;
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const columnHelper = createColumnHelper<RowObj>();

  const firstRow = tableData.length > 0 ? tableData[0] : {};

  const columns = Object.keys(firstRow)
    .filter((key) => key !== "ID Propietario")
    .filter((key) => key !== "Razon Social")
    .map((key) =>
      columnHelper.accessor(key, {
        id: key,
        header: () => <Th>{key}</Th>,
        cell: (info) => {
          const value = info.getValue();
          if (key === "Propiedades") {
            const units = value.split(", ");
            return (
              <Select>
                <option value="">Selecciona</option>
                {units.map((unit: string, index: number) => (
                  <option key={index} value={unit.trim()}>
                    {unit.trim()}
                  </option>
                ))}
              </Select>
            );
          } else {
            return <Td>{value}</Td>;
          }
        },
      })
    );

  columns.push(
    columnHelper.accessor("actions", {
      id: "actions",
      header: () => <Th>Acciones</Th>,
      cell: (info) => (
        <Flex>
          <IconButton
            aria-label="Ver"
            icon={<MdVisibility />}
            value={info.row.original.id}
          />
          <IconButton aria-label="Editar" icon={<MdEdit />} />
          <IconButton aria-label="Eliminar" icon={<MdDelete />} />
        </Flex>
      ),
    })
  );

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
    <Card>
      <CardBody>
        <TableContainer>
          <Table size="sm">
            <Thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <Tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <Th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                     
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </Th>
                  ))}
                </Tr>
              ))}
            </Thead>
            <Tbody>
              {isLoading ? (
                <Tr>
                  <Td colSpan={columns.length}>
                    <Flex justifyContent="center" alignItems="center">
                      <Spinner />
                    </Flex>
                  </Td>
                </Tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <Tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <Td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </Td>
                    ))}
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </CardBody>
    </Card>
  );
}