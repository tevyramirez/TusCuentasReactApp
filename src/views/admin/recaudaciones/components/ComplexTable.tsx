import React, { useState, useCallback, useMemo, forwardRef, useEffect } from "react";
import {
  Box,
  Card,
  CardBody,
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
  Spinner,
  Input,
  FormControl,
  FormLabel,
  Button,
  chakra,
  shouldForwardProp,
  useColorModeValue,
  Text,
  VStack,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Icon
} from "@chakra-ui/react";
import { MdEdit, MdVisibility, MdDelete, MdAdd, MdInfo } from "react-icons/md";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import DatePicker from 'react-datepicker';
import axios from 'axios';
import { API_ADDRESS } from 'variables/apiSettings';
import { motion, isValidMotionProp, AnimatePresence } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";

type RowObj = {
  [key: string]: any;
};

interface Recaudacion {
  id_recaudacion: number;
  id_lote: number;
  id_saldo: number;
  id_periodo_ingreso_id: number;
  fecha: Date;
  monto: number;
  metodo_pago: string;
  descripcion: string;
}

const MotionBox = chakra(motion.div, {
  shouldForwardProp: (prop) => isValidMotionProp(prop) || shouldForwardProp(prop),
});

const MotionTr = chakra(motion.tr, {
  shouldForwardProp: (prop) => isValidMotionProp(prop) || shouldForwardProp(prop),
});

const MotionTd = chakra(motion.td, {
  shouldForwardProp: (prop) => isValidMotionProp(prop) || shouldForwardProp(prop),
});

const MotionIconButton = motion(
  forwardRef<HTMLButtonElement, IconButtonProps>((props, ref) => (
    <IconButton ref={ref} {...props} />
  ))
);

const AddRecaudacionForm = React.memo(({ saldoId, loteId, onSubmit, onCancel }: {
  saldoId: number;
  loteId: number;
  onSubmit: (recaudacion: Recaudacion) => void;
  onCancel: () => void;
}) => {
  const [newRecaudacion, setNewRecaudacion] = useState<Recaudacion>({
    id_recaudacion: 0,
    id_lote: loteId,
    id_saldo: saldoId,
    id_periodo_ingreso_id: 0,
    fecha: new Date(),
    monto: 0,
    metodo_pago: "",
    descripcion: "",
  });

  const navigate = useNavigate();

  const handleRecaudacionChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewRecaudacion((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleDateChange = useCallback((date: Date) => {
    setNewRecaudacion((prev) => ({ ...prev, fecha: date }));
  }, []);

  const handleSubmit = useCallback(() => {
    onSubmit(newRecaudacion);
    navigate("/admin/recaudaciones");
  }, [newRecaudacion, onSubmit, navigate]);

  return (
    <MotionBox
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Box bg="gray.50" p={4} borderRadius="md">
        <FormControl>
          <FormLabel>Fecha</FormLabel>
          <DatePicker
            selected={newRecaudacion.fecha}
            onChange={handleDateChange}
            dateFormat="dd-MM-yyyy"
            customInput={<Input />}
          />
        </FormControl>
        <FormControl mt={2}>
          <FormLabel>Monto</FormLabel>
          <Input
            type="number"
            name="monto"
            value={newRecaudacion.monto}
            onChange={handleRecaudacionChange}
          />
        </FormControl>
        <FormControl mt={2}>
          <FormLabel>Método de Pago</FormLabel>
          <Select
            name="metodo_pago"
            value={newRecaudacion.metodo_pago}
            onChange={handleRecaudacionChange}
          >
            <option value="">Seleccione</option>
            <option value="contado">Contado</option>
            <option value="credito">Crédito</option>
          </Select>
        </FormControl>
        <FormControl mt={2}>
          <FormLabel>Descripción</FormLabel>
          <Input
            name="descripcion"
            value={newRecaudacion.descripcion}
            onChange={handleRecaudacionChange}
          />
        </FormControl>
        <Flex justifyContent="flex-end" mt={4}>
          <Button as={motion.button} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} colorScheme="blue" mr={3} onClick={handleSubmit}>
            Guardar
          </Button>
          <Button as={motion.button} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onCancel}>
            Cancelar
          </Button>
        </Flex>
      </Box>
    </MotionBox>
  );
});

export default function ComplexTable(props: { tableData: any, onUpdate: (updatedData: any) => void, onDelete: (id: string) => void, hiddenColumns: any, updateData: () => void }) {
  const { tableData, onUpdate, onDelete, hiddenColumns, updateData } = props;

  const [sorting, setSorting] = useState<SortingState>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [modalData, setModalData] = useState<RowObj | null>(null);
  const [editData, setEditData] = useState<RowObj | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const periodoSeleccionado = useSelector((state: any) => state.periodo.periodoActual);

  const bgColor = useColorModeValue("white", "gray.800");
  const headerBgColor = useColorModeValue("blue.500", "blue.200");
  const headerTextColor = useColorModeValue("white", "gray.800");
  const closeButtonColor = useColorModeValue("white", "gray.800");
  const boxBgColor = useColorModeValue("gray.50", "gray.700");
  const boxTextColor = useColorModeValue("gray.600", "gray.400");
  const editHeaderBgColor = useColorModeValue("green.500", "green.200");
  const deleteHeaderBgColor = useColorModeValue("red.500", "red.200");

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

  const handleSave = useCallback((updatedData: any) => {
    onUpdate(updatedData);
    closeEditModal();
  }, [onUpdate, closeEditModal]);

  const handleDelete = useCallback(() => {
    if (deleteId) {
      onDelete(deleteId);
      closeConfirmModal();
    }
  }, [deleteId, onDelete, closeConfirmModal]);

  const handleAddRecaudacion = useCallback((saldoId: number) => {
    setExpandedRow((prev) => prev === saldoId ? null : saldoId);
  }, []);

  const handleSubmitRecaudacion = useCallback(async (newRecaudacion: Recaudacion) => {
    try {
      await axios.post(
        `${API_ADDRESS}recaudaciones/`,
        {
          ...newRecaudacion,
          fecha: newRecaudacion.fecha.toISOString().split("T")[0],
          id_periodo_ingreso: periodoSeleccionado
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setExpandedRow(null);
      updateData();
    } catch (error) {
      console.error("Error al agregar recaudación:", error);
    }
  }, [periodoSeleccionado, updateData]);

  const columnHelper = createColumnHelper<RowObj>();

  const columns = useMemo(() => {
    const firstRow = tableData.length > 0 ? tableData[0] : {};
    const baseColumns = Object.keys(firstRow)
      .filter(key => !hiddenColumns.includes(key))
      .map((key) =>
        columnHelper.accessor(key, {
          id: key,
          header: () => {
            if (key === "Razon Social") {
              return "";
            } else {
              return <Th style={{ margin:"1px", padding: "1px", minWidth: "20px", maxWidth: "120px", fontSize:"12px" }}>{key}</Th>;
            }
          },
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
            } else if (key === "Razon Social") {
              return " ";
            } else {
              return <MotionTd
                style={{ margin:"1px", padding: "1px", minWidth: "20px", maxWidth: "150px", fontSize:"14px" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {value}
              </MotionTd>;
            }
          },
        })
      );

    baseColumns.push(
      columnHelper.accessor("actions", {
        id: "actions",
        header: () => <Th>Acciones</Th>,
        cell: (info) => (
          <Flex>
            <MotionIconButton
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              isRound={true}
              aria-label="Ver"
              style={{padding: "2px", margin:"1px", fontSize: "13px"}}
              size="sm"
              icon={<MdVisibility />}
              onClick={() => openViewModal(info.row.original)}
            />
            <MotionIconButton
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              isRound={true}
              size="sm"
              aria-label="Editar"
              style={{padding: "2px", margin:"1px", fontSize: "13px"}}
              icon={<MdEdit />}
              onClick={() => openEditModal(info.row.original)}
            />
            <MotionIconButton
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              isRound={true}
              size="sm"
              aria-label="Eliminar"
              style={{padding: "2px", margin:"1px", fontSize: "13px"}}
              icon={<MdDelete />}
              onClick={() => openConfirmModal(info.row.original["ID"])}
            />
            <MotionIconButton
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              isRound={true}
              size="sm"
              aria-label={expandedRow === info.row.original["ID"] ? "Cerrar Recaudación" : "Agregar Recaudación"}
              style={{padding: "2px", margin:"1px", fontSize: "13px"}}
              icon={<MdAdd />}
              onClick={() => handleAddRecaudacion(info.row.original["ID"])}
            />
          </Flex>
        ),
      })
    );

    return baseColumns;
  }, [tableData, hiddenColumns, expandedRow, openViewModal, openEditModal, openConfirmModal, handleAddRecaudacion, columnHelper]);

  useEffect(() => {
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
                <AnimatePresence>
                  {table.getRowModel().rows.map((row) => (
                    <React.Fragment key={row.id}>
                      <MotionTr
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <MotionTd key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </MotionTd>
                        ))}
                      </MotionTr>
                      <AnimatePresence>
                        {expandedRow === row.original["ID"] && (
                          <MotionTr
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                          >
                            <Td colSpan={columns.length}>
                              <AddRecaudacionForm
                                saldoId={row.original["ID"]}
                                loteId={row.original["ID Lote"]}
                                onSubmit={handleSubmitRecaudacion}
                                onCancel={() => setExpandedRow(null)}
                              />
                            </Td>
                          </MotionTr>
                        )}
                      </AnimatePresence>
                    </React.Fragment>
                  ))}
                </AnimatePresence>
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </CardBody>

      {/* View Modal */}
      <Modal isOpen={isViewModalOpen} onClose={closeViewModal} size="xl">
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
        <ModalContent 
          bg={bgColor}
          borderRadius="xl"
          boxShadow="xl"
        >
          <ModalHeader 
            bg={headerBgColor}
            color={headerTextColor}
            borderTopRadius="xl"
            p={6}
          >
            <Flex align="center">
              <Icon as={MdInfo} boxSize={6} mr={3} />
              <Text fontSize="2xl" fontWeight="bold">Detalle del Registro</Text>
            </Flex>
          </ModalHeader>
          <ModalCloseButton color={closeButtonColor} />
          <ModalBody p={6}>
            {modalData && (
              <VStack spacing={6} align="stretch">
                {Object.entries(modalData).map(([key, value]) => (
                  <Box key={key} bg={boxBgColor} p={4} borderRadius="md">
                    <Text fontWeight="bold" fontSize="sm" color={boxTextColor} mb={1}>
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
          bg={bgColor}
          borderRadius="xl"
          boxShadow="xl"
        >
          <ModalHeader 
            bg={editHeaderBgColor}
            color={headerTextColor}
            borderTopRadius="xl"
            p={6}
          >
            <Flex align="center">
              <Icon as={MdEdit} boxSize={6} mr={3} />
              <Text fontSize="2xl" fontWeight="bold">Editar Registro</Text>
            </Flex>
          </ModalHeader>
          <ModalCloseButton color={closeButtonColor} />
          <ModalBody p={6}>
            {editData && (
              <VStack spacing={6} align="stretch">
                {Object.entries(editData).map(([key, value]) => (
                  <FormControl key={key}>
                    <FormLabel fontWeight="bold" color={boxTextColor}>
                      {key}
                    </FormLabel>
                    <Input
                      value={value as string}
                      onChange={(e) =>
                        setEditData({ ...editData, [key]: e.target.value })
                      }
                      bg={boxBgColor}
                      borderColor={boxTextColor}
                      _hover={{ borderColor: "green.400" }}
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
          bg={bgColor}
          borderRadius="xl"
          boxShadow="xl"
          maxW="400px"
        >
          <ModalHeader 
            bg={deleteHeaderBgColor}
            color={headerTextColor}
            borderTopRadius="xl"
            p={6}
          >
            <Flex align="center">
              <Icon as={MdDelete} boxSize={6} mr={3} />
              <Text fontSize="2xl" fontWeight="bold">Confirmar Eliminación</Text>
            </Flex>
          </ModalHeader>
          <ModalCloseButton color={closeButtonColor} />
          <ModalBody p={6}>
            <Text fontSize="lg" fontWeight="medium">
              ¿Estás seguro de que deseas eliminar este registro?
            </Text>
            <Text fontSize="md" color={boxTextColor} mt={2}>
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
    </Card>
  );
}