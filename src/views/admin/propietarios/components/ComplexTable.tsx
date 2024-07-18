import React, { useState } from "react";
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
import ViewModal from "./ViewModal";
import EditModal from "./EditModal";
import ConfirmModal from "./ConfirmModal";

type RowObj = {
  [key: string]: any;
};

export default function ComplexTable(props: { tableData: any, onUpdate: (updatedData: any) => void, onDelete: (id: string) => void, hiddenColumns: any }) {
  
  const { tableData, onUpdate, onDelete, hiddenColumns } = props;

  const [sorting, setSorting] = useState<SortingState>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [modalData, setModalData] = useState<RowObj | null>(null);
  const [editData, setEditData] = useState<RowObj | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const columnHelper = createColumnHelper<RowObj>();

  const firstRow = tableData.length > 0 ? tableData[0] : {};

  const openModal = (data: RowObj) => {
    setModalData(data);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalData(null);
  };

  const openEditModal = (data: RowObj) => {
    setEditData(data);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditData(null);
  };

  const openConfirmModal = (id: string) => {
    setDeleteId(id);
    setIsConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setDeleteId(null);
  };

  const handleSave = (updatedData: any) => {
    onUpdate(updatedData);
  };

  const handleDelete = () => {
    if (deleteId) {
      onDelete(deleteId);
      closeConfirmModal();
    }
  };


  const columns = Object.keys(firstRow).filter(key => !hiddenColumns.includes(key)).map((key) =>
    columnHelper.accessor(key, {
      id: key,
      header: () => {
        // Evita que se cree la columna razon social, por ahora no se necesita
      if (key === "Razon Social"){
        return ""}
      else{
      return <Th style={{ margin:"1px",padding: "1px", minWidth: "20px", maxWidth: "120px", fontSize:"12px" }}>{key}</Th>}},
      cell: (info) => {
        const value = info.getValue();
        if (key === "Propiedades2") {
          const units = value.split(", ");
          return (
            <Select style={{ padding: "2px", minWidth: "80px", maxWidth: "150px" }}>
              <option value="">Selecciona</option>
              {units.map((unit: string, index: number) => (
                <option key={index} value={unit.trim()}>
                  {unit.trim()}
                </option>
              ))}
            </Select>
          );
        } 
        if (key === "Razon Social"){
          return " "
        }

        else {
          return <Td style={{ margin:"1px",padding: "1px", minWidth: "20px", maxWidth: "150px", fontSize:"11px" }}>{value}</Td>;
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
            isRound={true}
            aria-label="Ver"
            style={{padding: "2px", margin:"1px",fontSize: "12px"}}
            size="sm"
            icon={<MdVisibility />}
            onClick={() => openModal(info.row.original)} // Abrir modal con la data del propietario
          />
          <IconButton
          isRound={true}
          size="sm"
            aria-label="Editar"
            style={{padding: "2px", margin:"1px",fontSize: "12px"}}
            icon={<MdEdit />}
            onClick={() => openEditModal(info.row.original)} // Abrir modal de edición con la data del propietario
          />
          <IconButton
          isRound={true}
          size="sm"
            aria-label="Eliminar"
            style={{padding: "2px", margin:"1px",fontSize: "12px"}}
            icon={<MdDelete />}
            onClick={() => openConfirmModal(info.row.original["ID Propietario"])} // Abrir modal de confirmación con el id del propietario
          />
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
      <ViewModal isOpen={isModalOpen} onClose={closeModal} data={modalData} />
      <EditModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        data={editData}
        onSave={handleSave}
      />
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={closeConfirmModal}
        onConfirm={handleDelete}
      />
    </Card>
  );
}
