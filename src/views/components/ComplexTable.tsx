"use client"

import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
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
  Spinner,
  Text,
  VStack,
  HStack,
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
  Icon
} from "@chakra-ui/react";
import { MdEdit, MdVisibility, MdDelete, MdInfo } from "react-icons/md";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
  RowSelectionState,
} from "@tanstack/react-table";

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

const MemoizedCheckbox = React.memo(Checkbox);

const TableCell = React.memo(({ value }: { value: any }) => (
  <Td
    px={1}
    py={2}
    fontSize="xs"
  >
    {value}
  </Td>
));

const ActionButtons = React.memo(({ row, openViewModal, openEditModal, openConfirmModal }: {
  row: RowObj,
  openViewModal: (data: RowObj) => void,
  openEditModal: (data: RowObj) => void,
  openConfirmModal: (id: string) => void
}) => (
  <Flex>
    <IconButton
      aria-label="Ver"
      icon={<MdVisibility />}
      onClick={() => openViewModal(row)}
      size="sm"
      colorScheme="blue"
      variant="ghost"
      mr={1}
    />
    <IconButton
      aria-label="Editar"
      icon={<MdEdit />}
      onClick={() => openEditModal(row)}
      size="sm"
      colorScheme="green"
      variant="ghost"
      mr={1}
    />
    <IconButton
      aria-label="Eliminar"
      icon={<MdDelete />}
      onClick={() => openConfirmModal(row["ID"])}
      size="sm"
      colorScheme="red"
      variant="ghost"
    />
  </Flex>
));

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

  const modalBgColor = useColorModeValue("white", "gray.800");
  const modalHeaderBgColorView = useColorModeValue("blue.500", "blue.200");
  const modalHeaderTextColorView = useColorModeValue("white", "gray.800");
  const modalHeaderBgColorEdit = useColorModeValue("green.500", "green.200");
  const modalHeaderTextColorEdit = useColorModeValue("white", "gray.800");
  const modalHeaderBgColorDelete = useColorModeValue("red.500", "red.200");
  const modalHeaderTextColorDelete = useColorModeValue("white", "gray.800");
  const modalCloseButtonColor = useColorModeValue("white", "gray.800");
  const modalBodyBgColor = useColorModeValue("gray.50", "gray.700");
  const modalBodyTextColor = useColorModeValue("gray.600", "gray.400");

  const openViewModal = useCallback((data: RowObj) => {
    setModalData(data);
    setIsViewModalOpen(true);
  }, []);

  const closeViewModal = useCallback(() => {
    setIsViewModalOpen(false);
    setModalData(null);
  }, []);

  const openEditModal = useCallback((data: RowObj) => {
    setEditData(data);
    setIsEditModalOpen(true);
  }, []);

  const closeEditModal = useCallback(() => {
    setIsEditModalOpen(false);
    setEditData(null);
  }, []);

  const openConfirmModal = useCallback((id: string) => {
    setDeleteId(id);
    setIsConfirmModalOpen(true);
  }, []);

  const closeConfirmModal = useCallback(() => {
    setIsConfirmModalOpen(false);
    setDeleteId(null);
  }, []);

  const handleSave = useCallback((updatedData: RowObj) => {
    onUpdate(updatedData);
    closeEditModal();
  }, [onUpdate, closeEditModal]);

  const handleDelete = useCallback(() => {
    if (deleteId) {
      onDelete(deleteId);
      closeConfirmModal();
    }
  }, [deleteId, onDelete, closeConfirmModal]);

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
        <Box width="20px">
          <MemoizedCheckbox
            isChecked={table.getIsAllRowsSelected()}
            isIndeterminate={table.getIsSomeRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
            size="sm"
          />
        </Box>
      ),
      cell: ({ row }) => (
        <Box width="20px">
          <MemoizedCheckbox
            isChecked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            size="sm"
          />
        </Box>
      ),
      size: 20,
    }),
    ...Object.keys(tableData[0] || {})
      .filter((key) => !hiddenColumns.includes(key))
      .map((key) =>
        columnHelper.accessor(key, {
          header: () => <Text fontWeight="bold">{key}</Text>,
          cell: (info) => <TableCell value={info.getValue()} />,
        })
      ),
    columnHelper.display({
      id: "actions",
      header: () => <Text fontWeight="bold">Acciones</Text>,
      cell: ({ row }) => (
        <ActionButtons
          row={row.original}
          openViewModal={openViewModal}
          openEditModal={openEditModal}
          openConfirmModal={openConfirmModal}
        />
      ),
    }),
  ], [tableData, hiddenColumns, openViewModal, openEditModal, openConfirmModal]);

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

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [tableHeight, setTableHeight] = useState(400);

  useEffect(() => {
    const updateTableHeight = () => {
      if (tableContainerRef.current) {
        const windowHeight = window.innerHeight;
        const tableTop = tableContainerRef.current.getBoundingClientRect().top;
        const newHeight = windowHeight - tableTop - 20;
        setTableHeight(Math.max(newHeight, 400));
      }
    };

    updateTableHeight();
    window.addEventListener('resize', updateTableHeight);

    return () => window.removeEventListener('resize', updateTableHeight);
  }, []);

  if (isLoading) {
    return (
      <Flex justifyContent="center" alignItems="center" height="200px">
        <VStack spacing={4}>
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
          <Text fontSize="lg" fontWeight="medium" color={textColor}>
            Cargando datos...
          </Text>
        </VStack>
      </Flex>
    );
  }

  return (
    <Box bg={bgColor} borderRadius="lg" overflow="hidden" boxShadow="xl">
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
      <Box
        height={`${tableHeight}px`}
        overflowY="auto"
        position="relative"
        css={{
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            width: '10px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'gray',
            borderRadius: '24px',
          },
        }}
      >
        <Table variant="simple" size="sm" layout="fixed" width="100%">
          <Thead position="sticky" top={0} zIndex={1} bg={bgColor}>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    cursor="pointer"
                    px={1}
                    py={2}
                    borderColor={borderColor}
                    color={textColor}
                    fontWeight="semibold"
                    fontSize="xs"
                    textTransform="uppercase"
                    _hover={{ bg: hoverBgColor }}
                    width={header.column.id === 'select' ? "20px" : "auto"}
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
            {rows.map((row) => (
              <Tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <React.Fragment key={cell.id}>
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </React.Fragment>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* View Modal */}
      <Modal isOpen={isViewModalOpen} onClose={closeViewModal} size="xl">
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
        <ModalContent 
          bg={modalBgColor}
          borderRadius="xl"
          boxShadow="xl"
        >
          <ModalHeader 
            bg={modalHeaderBgColorView} 
            color={modalHeaderTextColorView}
            borderTopRadius="xl"
            p={6}
          >
            <Flex align="center">
              <Icon as={MdInfo} boxSize={6} mr={3} />
              <Text fontSize="2xl" fontWeight="bold">Detalle del Registro</Text>
            </Flex>
          </ModalHeader>
          <ModalCloseButton color={modalCloseButtonColor} />
          <ModalBody p={6}>
            {modalData && (
              <VStack spacing={6} align="stretch">
                {Object.entries(modalData).map(([key, value]) => (
                  <Box key={key} bg={modalBodyBgColor} p={4} borderRadius="md">
                    <Text fontWeight="bold" fontSize="sm" color={modalBodyTextColor} mb={1}>
                      {key}:
                    </Text>
                    <Text fontSize="lg">{value as string}</Text>
                  </Box>
                ))}
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={closeViewModal} size="lg" borderRadius="full">
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={closeEditModal} size="xl">
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
        <ModalContent 
          bg={modalBgColor}
          borderRadius="xl"
          boxShadow="xl"
        >
          <ModalHeader 
            bg={modalHeaderBgColorEdit} 
            color={modalHeaderTextColorEdit}
            borderTopRadius="xl"
            p={6}
          >
            <Flex align="center">
              <Icon as={MdEdit} boxSize={6} mr={3} />
              <Text fontSize="2xl" fontWeight="bold">Editar Registro</Text>
            </Flex>
          </ModalHeader>
          <ModalCloseButton color={modalCloseButtonColor} />
          <ModalBody p={6}>
            {editData && (
              <VStack spacing={6} align="stretch">
                {Object.entries(editData).map(([key, value]) => (
                  <FormControl key={key}>
                    <FormLabel fontWeight="bold" color={modalBodyTextColor}>
                      {key}
                    </FormLabel>
                    <Input
                      value={value as string}
                      onChange={(e) =>
                        setEditData({ ...editData, [key]: e.target.value })
                      }
                      bg={modalBodyBgColor}
                      borderColor={borderColor}
                      _hover={{ borderColor: hoverBgColor }}
                      _focus={{ borderColor: "green.400", boxShadow: "0 0 0 1px green.400" }}
                    />
                  </FormControl>
                ))}
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <HStack spacing={4}>
              <Button colorScheme="green" onClick={() => handleSave(editData!)} size="lg" borderRadius="full">
                Guardar
              </Button>
              <Button variant="outline" onClick={closeEditModal} size="lg" borderRadius="full">
                Cancelar
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Confirm Delete Modal */}
      <Modal isOpen={isConfirmModalOpen} onClose={closeConfirmModal} isCentered>
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
        <ModalContent 
          bg={modalBgColor}
          borderRadius="xl"
          boxShadow="xl"
          maxW="400px"
        >
          <ModalHeader 
            bg={modalHeaderBgColorDelete} 
            color={modalHeaderTextColorDelete}
            borderTopRadius="xl"
            p={6}
          >
            <Flex align="center">
              <Icon as={MdDelete} boxSize={6} mr={3} />
              <Text fontSize="2xl" fontWeight="bold">Confirmar Eliminación</Text>
            </Flex>
          </ModalHeader>
          <ModalCloseButton color={modalCloseButtonColor} />
          <ModalBody p={6}>
            <Text fontSize="lg" fontWeight="medium">
              ¿Estás seguro de que deseas eliminar este registro?
            </Text>
            <Text fontSize="md" color={modalBodyTextColor} mt={2}>
              Esta acción no se puede deshacer.
            </Text>
          </ModalBody>
          <ModalFooter>
            <HStack spacing={4}>
              <Button colorScheme="red" onClick={handleDelete} size="lg" borderRadius="full">
                Eliminar
              </Button>
              <Button variant="outline" onClick={closeConfirmModal} size="lg" borderRadius="full">
                Cancelar
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
});

export default ComplexTable;