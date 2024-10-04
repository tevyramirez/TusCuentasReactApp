import React, { useState, useCallback, useMemo, Suspense } from "react";
import {
  Box,
  Flex,
  IconButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Spinner,
  Text,
  VStack,
  useColorModeValue,
  Checkbox,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { MdEdit, MdVisibility, MdDelete } from "react-icons/md";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
  RowSelectionState,
} from "@tanstack/react-table";
import { useVirtual } from "react-virtual";

type RowObj = {
  [key: string]: any;
};

interface ComplexTableProps {
  tableData: RowObj[];
  onUpdate: (updatedData: RowObj) => void;
  onDelete: (id: string) => void;
  hiddenColumns: string[];
  obtenerData: () => void;
  isLoading: boolean;
  onMultipleSelect?: (selectedRows: RowObj[]) => void;
}

const ComplexTable: React.FC<ComplexTableProps> = React.memo(({
  tableData,
  onUpdate,
  onDelete,
  hiddenColumns,
  obtenerData,
  isLoading,
  onMultipleSelect,
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedRowIds, setSelectedRowIds] = useState<RowSelectionState>({});
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [modalData, setModalData] = useState<RowObj | null>(null);
  const [editData, setEditData] = useState<RowObj | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const columnHelper = createColumnHelper<RowObj>();

  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const hoverBgColor = useColorModeValue("gray.100", "gray.700");

  const openViewModal = (data: RowObj) => {
    setModalData(data);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
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

  const handleSave = (updatedData: RowObj) => {
    onUpdate(updatedData);
    closeEditModal();
  };

  const handleDelete = () => {
    if (deleteId) {
      onDelete(deleteId);
      closeConfirmModal();
    }
  };

  const handleMultipleSelect = useCallback(() => {
    const selectedRows = Object.keys(selectedRowIds).map(id => 
      tableData.find(row => row.ID === id)
    ).filter(Boolean) as RowObj[];
    onMultipleSelect?.(selectedRows);
  }, [selectedRowIds, tableData, onMultipleSelect]);

  const columns = useMemo(() => [
    columnHelper.display({
      id: "select",
      header: ({ table }) => (
        <Checkbox
          isChecked={table.getIsAllRowsSelected()}
          isIndeterminate={table.getIsSomeRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          isChecked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
        />
      ),
    }),
    ...Object.keys(tableData[0] || {})
      .filter((key) => !hiddenColumns.includes(key))
      .map((key) =>
        columnHelper.accessor(key, {
          header: () => <Th>{key}</Th>,
          cell: (info) => info.getValue(),
        })
      ),
    columnHelper.display({
      id: "actions",
      header: () => <Th>Acciones</Th>,
      cell: ({ row }) => (
        <Flex>
          <IconButton
            aria-label="Ver"
            icon={<MdVisibility />}
            onClick={() => openViewModal(row.original)}
            size="sm"
            colorScheme="blue"
            variant="ghost"
            mr={1}
          />
          <IconButton
            aria-label="Editar"
            icon={<MdEdit />}
            onClick={() => openEditModal(row.original)}
            size="sm"
            colorScheme="green"
            variant="ghost"
            mr={1}
          />
          <IconButton
            aria-label="Eliminar"
            icon={<MdDelete />}
            onClick={() => openConfirmModal(row.original["ID"])}
            size="sm"
            colorScheme="red"
            variant="ghost"
          />
        </Flex>
      ),
    }),
  ], [tableData, hiddenColumns]);

  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      sorting,
      rowSelection: selectedRowIds,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableRowSelection: true,
    onRowSelectionChange: setSelectedRowIds,
  });

  const { rows } = table.getRowModel();

  const parentRef = React.useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtual({
    parentRef,
    size: rows.length,
    overscan: 10,
  });

  if (isLoading) {
    return (
      <Flex justifyContent="center" alignItems="center" height="200px">
        <VStack spacing={4}>
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="md"
          />
          <Text fontSize="sm" fontWeight="medium" color={textColor}>
            Cargando datos...
          </Text>
        </VStack>
      </Flex>
    );
  }

  return (
    <Box bg={bgColor} borderRadius="lg" overflow="hidden" boxShadow="md">
      {onMultipleSelect && (
        <Flex justify="flex-end" p={4}>
          <Button
            onClick={handleMultipleSelect}
            colorScheme="blue"
            isDisabled={Object.keys(selectedRowIds).length === 0}
          >
            Acción múltiple ({Object.keys(selectedRowIds).length})
          </Button>
        </Flex>
      )}
      <TableContainer ref={parentRef} height="400px" overflowY="auto">
        <Table variant="simple" size="sm">
          <Thead position="sticky" top={0} zIndex={1} bg={bgColor}>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    cursor="pointer"
                    px={2}
                    py={2}
                    borderColor={borderColor}
                    color={textColor}
                    fontWeight="semibold"
                    fontSize="xs"
                    textTransform="uppercase"
                    _hover={{ bg: hoverBgColor }}
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
            {rowVirtualizer.virtualItems.map((virtualRow) => {
              const row = rows[virtualRow.index];
              return (
                <Tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <Td
                      key={cell.id}
                      px={2}
                      py={1}
                      borderColor={borderColor}
                      color={textColor}
                      fontSize="xs"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Td>
                  ))}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>

      {/* View Modal */}
      <Modal isOpen={isViewModalOpen} onClose={closeViewModal} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Detalle del Registro</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {modalData && (
              <VStack spacing={4} align="stretch">
                {Object.entries(modalData).map(([key, value]) => (
                  <Box key={key}>
                    <Text fontWeight="bold">{key}:</Text>
                    <Text>{value as string}</Text>
                  </Box>
                ))}
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={closeViewModal}>
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={closeEditModal} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar Registro</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {editData && (
              <VStack spacing={4} align="stretch">
                {Object.entries(editData).map(([key, value]) => (
                  <FormControl key={key}>
                    <FormLabel>{key}</FormLabel>
                    <Input
                      value={value as string}
                      onChange={(e) =>
                        setEditData({ ...editData, [key]: e.target.value })
                      }
                    />
                  </FormControl>
                ))}
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={() => handleSave(editData!)}>
              Guardar
            </Button>
            <Button variant="ghost" onClick={closeEditModal}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Confirm Delete Modal */}
      <Modal isOpen={isConfirmModalOpen} onClose={closeConfirmModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirmar Eliminación</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            ¿Estás seguro de que deseas eliminar este registro?
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={handleDelete}>
              Eliminar
            </Button>
            <Button variant="ghost" onClick={closeConfirmModal}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
});

export default ComplexTable;