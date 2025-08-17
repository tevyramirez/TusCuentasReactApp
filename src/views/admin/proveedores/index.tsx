import React, { useState, useEffect } from "react";
import ComplexTable from "views/components/ComplexTable";
import FilterBar from "./components/FilterBar";
import AddProveedor from "./components/AddProveedor";
import axios from 'axios';
import { API_ADDRESS } from 'variables/apiSettings';
import * as XLSX from "xlsx";
import NoDataMessage from "views/components/NoDataMessage";
import {
  useToast,
  Button,
  Flex,
  Text,
  Select,
  Box,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';

const ProveedoresView: React.FC = () => {
  const toast = useToast();
  const [proveedores, setProveedores] = useState<any[]>([]);
  const [filteredProveedores, setFilteredProveedores] = useState<any[]>([]);
  const [filters, setFilters] = useState({ search: '', email: '' });
  const [showAddProveedor, setShowAddProveedor] = useState<boolean>(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize] = useState(100);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const hiddenColumns = ["ID"];
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const cardBgColor = useColorModeValue('white', 'gray.700');

  const obtenerData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_ADDRESS}proveedores/`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        params: {
          page: pageIndex + 1,
          page_size: pageSize,
        },
      });

      // Adapt mapping to the API shape
      const data = response.data?.results ?? response.data ?? [];
      const count = response.data?.count ?? (Array.isArray(data) ? data.length : 0);

      const mapped = data.map((item: any) => ({
        ID: item.id_proveedor ?? item.id ?? item.pk,
        Rut: item.rut ?? item.RUT ?? '',
        Nombre: item.nombre ?? '',
        Apellido: item.apellido ?? '',
        Telefono: item.telefono ?? item.numero_telefono ?? '',
        Servicio: item.servicio ?? '',
        Email: item.email ?? '',
      }));

      setProveedores(mapped);
      applyFilters(mapped, filters);
      setTotalPages(Math.ceil(count / pageSize));
    } catch (error) {
      console.error('Error al obtener los proveedores:', error);
      toast({ title: 'Error', description: 'No se pudieron cargar los proveedores', status: 'error', duration: 4000, isClosable: true });
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = (data: any[], filtersObj: { search?: string; email?: string }) => {
    let result = data;
    if (filtersObj.search) {
      const q = filtersObj.search.toLowerCase();
      result = result.filter((row) => Object.values(row).some(v => v != null && String(v).toLowerCase().includes(q)));
    }
    if (filtersObj.email) {
      const q = filtersObj.email.toLowerCase();
      result = result.filter((row) => (row.Email ?? '').toLowerCase().includes(q));
    }
    setFilteredProveedores(result);
  };

  const handleFilterChange = (newFilters: { search?: string; email?: string }) => {
    const merged = { ...filters, ...newFilters };
    setFilters(merged);
    applyFilters(proveedores, merged);
  };

  const handleAddProveedor = () => setShowAddProveedor(true);
  const handleGoBack = () => setShowAddProveedor(false);

  const handleUpdate = async (updated: any) => {
    try {
      const payload = {
        id: updated.ID,
        nombre: updated.Nombre,
        apellido: updated.Apellido,
        rut: updated.Rut,
        telefono: updated.Telefono,
        servicio: updated.Servicio,
        email: updated.Email,
      };
      await axios.put(`${API_ADDRESS}proveedores/${payload.id}/`, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      await obtenerData();
      toast({ title: 'Proveedor actualizado', status: 'success', duration: 3000, isClosable: true });
    } catch (error) {
      console.error('Error al actualizar proveedor', error);
      toast({ title: 'Error', description: 'No se pudo actualizar el proveedor', status: 'error', duration: 3000, isClosable: true });
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      await axios.delete(`${API_ADDRESS}proveedores/${id}/`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      await obtenerData();
      toast({ title: 'Proveedor eliminado', status: 'success', duration: 3000, isClosable: true });
    } catch (error) {
      console.error('Error al eliminar proveedor', error);
      toast({ title: 'Error', description: 'No se pudo eliminar el proveedor', status: 'error', duration: 3000, isClosable: true });
    }
  };

  const handlePageChange = (newPageIndex: number) => setPageIndex(newPageIndex);

  const exportToXLS = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredProveedores.length ? filteredProveedores : proveedores);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Proveedores');
    XLSX.writeFile(workbook, 'Proveedores.xlsx');
  };

  useEffect(() => {
    obtenerData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex]);

  return (
    <Box bg={bgColor} minH="100vh" p={2}>
      <VStack spacing={6} align="stretch">
        {!showAddProveedor ? (
          <>
            <FilterBar onAddPropietario={handleAddProveedor} onFilterChange={handleFilterChange} onExport={exportToXLS} />

            {filteredProveedores.length > 0 || isLoading ? (
              <Box bg={cardBgColor} borderRadius="lg" overflow="hidden" boxShadow="md">
                <ComplexTable
                  tableData={filteredProveedores}
                  onDelete={handleDelete}
                  onUpdate={handleUpdate}
                  hiddenColumns={hiddenColumns}
                  obtenerData={obtenerData}
                  isLoading={isLoading}
                />

                <Flex justify="space-between" align="center" p={4} borderTop="1px" borderColor="gray.200">
                  <Button onClick={() => handlePageChange(Math.max(pageIndex - 1, 0))} disabled={pageIndex === 0 || isLoading} colorScheme="blue" size="sm">Anterior</Button>

                  <Flex align="center">
                    <Text mr={2} fontSize="sm">Ir a página:</Text>
                    <Select value={pageIndex} onChange={(e) => handlePageChange(Number(e.target.value))} size="sm" w="auto">
                      {[...Array(totalPages)].map((_, i) => (
                        <option key={i} value={i}>{i + 1}</option>
                      ))}
                    </Select>
                    <Text ml={2} fontSize="sm">de {totalPages}</Text>
                  </Flex>

                  <Button onClick={() => handlePageChange(Math.min(pageIndex + 1, totalPages - 1))} disabled={pageIndex >= totalPages - 1 || isLoading} colorScheme="blue" size="sm">Siguiente</Button>
                </Flex>
              </Box>
            ) : (
              <NoDataMessage />
            )}
          </>
        ) : (
          <AddProveedor onGoBack={handleGoBack} update={obtenerData} />
        )}
      </VStack>
    </Box>
  );
};

export default ProveedoresView;