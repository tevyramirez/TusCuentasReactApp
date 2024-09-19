import React, { useState, useCallback, useMemo, forwardRef } from "react";
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
  shouldForwardProp
} from "@chakra-ui/react";
import { MdEdit, MdVisibility, MdDelete, MdAdd } from "react-icons/md";
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

// Importaciones de componentes modales
const ViewModal = React.lazy(() => import("../../propietarios/components/ViewModal"));
const EditModal = React.lazy(() => import("../../propietarios/components/EditModal"));
const ConfirmModal = React.lazy(() => import("../../propietarios/components/ConfirmModal"));

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

// Crear componentes Chakra con Framer Motion
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
    // Redireccion a admin/recaudaciones
    navigate("/admin/recaudaciones");
  }, [newRecaudacion, onSubmit]);

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
  const { tableData, onUpdate, onDelete, hiddenColumns } = props;

  const [sorting, setSorting] = useState<SortingState>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [modalData, setModalData] = useState<RowObj | null>(null);
  const [editData, setEditData] = useState<RowObj | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const updateData = props.updateData;
  const periodoSeleccionado = useSelector((state: any) => state.periodo.periodoActual);
  const openModal = useCallback((data: RowObj) => {
    setModalData(data);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
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
  }, [onUpdate]);

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
      console.log("newRecaudacionPEriodo", periodoSeleccionado);
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
      // Aquí podrías actualizar los datos de la tabla si es necesario
      updateData();
    } catch (error) {
      console.error("Error al agregar recaudación:", error);
    }
  }, []);

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
              return <Th style={{ margin:"1px",padding: "1px", minWidth: "20px", maxWidth: "120px", fontSize:"12px" }}>{key}</Th>;
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
                style={{ margin:"1px",padding: "1px", minWidth: "20px", maxWidth: "150px", fontSize:"14px" }}
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
              style={{padding: "2px", margin:"1px",fontSize: "13px"}}
              size="sm"
              icon={<MdVisibility />}
              onClick={() => openModal(info.row.original)}
            />
            <MotionIconButton
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              isRound={true}
              size="sm"
              aria-label="Editar"
              style={{padding: "2px", margin:"1px",fontSize: "13px"}}
              icon={<MdEdit />}
              onClick={() => openEditModal(info.row.original)}
            />
            <MotionIconButton
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              isRound={true}
              size="sm"
              aria-label="Eliminar"
              style={{padding: "2px", margin:"1px",fontSize: "13px"}}
              icon={<MdDelete />}
              onClick={() => openConfirmModal(info.row.original["ID"])}
            />
            <MotionIconButton
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              isRound={true}
              size="sm"
              aria-label={expandedRow === info.row.original["ID"] ? "Cerrar Recaudación" : "Agregar Recaudación"}
              style={{padding: "2px", margin:"1px",fontSize: "13px"}}
              icon={<MdAdd />}
              onClick={() => handleAddRecaudacion(info.row.original["ID"])}
            />
          </Flex>
        ),
      })
    );

    return baseColumns;
  }, [tableData, hiddenColumns, expandedRow, openModal, openEditModal, openConfirmModal, handleAddRecaudacion, columnHelper]);

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
      <React.Suspense fallback={<Spinner />}>
        {isModalOpen && <ViewModal isOpen={isModalOpen} onClose={closeModal} data={modalData} />}
        {isEditModalOpen && <EditModal isOpen={isEditModalOpen} onClose={closeEditModal} data={editData} onSave={handleSave} />}
        {isConfirmModalOpen && <ConfirmModal isOpen={isConfirmModalOpen} onClose={closeConfirmModal} onConfirm={handleDelete} />}
      </React.Suspense>
    </Card>
  );
}