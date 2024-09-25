import React, { useState, forwardRef } from "react";
import {
  Box,
  Flex,
  IconButton,
  IconButtonProps,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  chakra,
  Spinner,
  Text,
  VStack,
  useColorModeValue,
  shouldForwardProp,
} from "@chakra-ui/react";
import { MdEdit, MdVisibility, MdDelete } from "react-icons/md";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
} from "@tanstack/react-table";
import { motion, isValidMotionProp, AnimatePresence } from "framer-motion";

const ViewModal = React.lazy(() =>
  import("../admin/propietarios/components/ViewModal")
);
const EditModal = React.lazy(() =>
  import("../admin/propietarios/components/EditModal")
);
const ConfirmModal = React.lazy(() =>
  import("../admin/propietarios/components/ConfirmModal")
);

type RowObj = {
  [key: string]: any;
};

export default function ComplexTable(props: {
  tableData: any;
  onUpdate: (updatedData: any) => void;
  onDelete: (id: string) => void;
  hiddenColumns: any;
  obtenerData: () => void;
  isLoading: boolean;
}) {
  const { tableData, onUpdate, onDelete, hiddenColumns, isLoading } = props;

  const [sorting, setSorting] = useState<SortingState>([]);
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

  const MotionBox = chakra(motion.div, {
    shouldForwardProp: (prop) =>
      isValidMotionProp(prop) || shouldForwardProp(prop),
  });

  const MotionTr = chakra(motion.tr, {
    shouldForwardProp: (prop) =>
      isValidMotionProp(prop) || shouldForwardProp(prop),
  });

  const MotionTd = chakra(motion.td, {
    shouldForwardProp: (prop) =>
      isValidMotionProp(prop) || shouldForwardProp(prop),
  });

  const MotionIconButton = motion(
    forwardRef<HTMLButtonElement, IconButtonProps>((props, ref) => (
      <IconButton ref={ref} {...props} />
    ))
  );

  const columns = Object.keys(firstRow)
    .filter((key) => !hiddenColumns.includes(key))
    .map((key) =>
      columnHelper.accessor(key, {
        id: key,
        header: () => <Th>{key}</Th>,
        cell: (info) => {
          const value = info.getValue();
          if (key === "Propiedades2") {
            const units = value.split(", ");
            return (
              <Select size="xs">
                <option value="">Selecciona</option>
                {units.map((unit: string, index: number) => (
                  <option key={index} value={unit.trim()}>
                    {unit.trim()}
                  </option>
                ))}
              </Select>
            );
          }
          return value;
        },
      })
    );

  columns.push(
    columnHelper.display({
      id: "actions",
      header: () => <Th>Acciones</Th>,
      cell: (info) => (
        <Flex>
          <MotionIconButton
            aria-label="Ver"
            icon={<MdVisibility />}
            onClick={() => openModal(info.row.original)}
            size="xs"
            colorScheme="blue"
            variant="ghost"
            mr={1}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          />
          <MotionIconButton
            aria-label="Editar"
            icon={<MdEdit />}
            onClick={() => openEditModal(info.row.original)}
            size="xs"
            colorScheme="green"
            variant="ghost"
            mr={1}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          />
          <MotionIconButton
            aria-label="Eliminar"
            icon={<MdDelete />}
            onClick={() => openConfirmModal(info.row.original["ID"])}
            size="xs"
            colorScheme="red"
            variant="ghost"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          />
        </Flex>
      ),
    })
  );

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

  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Box bg={bgColor} borderRadius="lg" overflow="hidden">
      <TableContainer>
        <Table variant="simple" size="sm">
          <Thead>
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
                    _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
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
                </Td>
              </Tr>
            ) : (
              <AnimatePresence>
                {table.getRowModel().rows.map((row) => (
                  <MotionTr
                    key={row.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
          
                  >
                    {row.getVisibleCells().map((cell) => (
                      <MotionTd
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
                      </MotionTd>
                    ))}
                  </MotionTr>
                ))}
              </AnimatePresence>
            )}
          </Tbody>
        </Table>
      </TableContainer>
      <React.Suspense fallback={<Spinner />}>
        {isModalOpen && (
          <ViewModal isOpen={isModalOpen} onClose={closeModal} data={modalData} />
        )}
        {isEditModalOpen && (
          <EditModal
            isOpen={isEditModalOpen}
            onClose={closeEditModal}
            data={editData}
            onSave={handleSave}
          />
        )}
        {isConfirmModalOpen && (
          <ConfirmModal
            isOpen={isConfirmModalOpen}
            onClose={closeConfirmModal}
            onConfirm={handleDelete}
          />
        )}
      </React.Suspense>
    </Box>
  );
}