import React, { useState, useEffect } from "react";
import ComplexTable from "views/components/ComplexTable";
import FilterBar from "./components/FilterBar";
import AddPropietario from "./components/AddGastos";
import api from 'services/api';
import { capitalize } from 'lodash';
import { 
  useToast, 
  Button, 
  Flex, 
  Text, 
  Select, 
  Box, 
  VStack,
  useColorModeValue
} from '@chakra-ui/react';
import * as XLSX from 'xlsx';
import NoDataMessage from "views/components/NoDataMessage";
import { useSelector } from 'react-redux';

const Dashboard: React.FC = () => {
  const toast = useToast();
  const [propietarios, setPropietarios] = useState([]);
  const [filteredGastos, setFilteredGastos] = useState([]);
  const [showAddPropietario, setShowAddPropietario] = useState<boolean>(false);
  const [filters, setFilters] = useState({ search: '', email: '' });
  
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize] = useState(100);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  const hiddenColumns = ["ID", "ID Categoria", "Descripcion"];

  const periodoSeleccionado = useSelector((state: any) => state.periodo.periodoActual);

  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const cardBgColor = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');

  const obtenerData = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`gastos/periodo/${periodoSeleccionado}/`, {
        params: {
          "page": pageIndex + 1,
          "page_size": pageSize
        }
      });
      
      const { results, count } = response.data;
      const dataMapped = results.map((item: any) => ({
        "ID": item.id_gasto,
        "ID Categoria": item.categoria,
        "Categoria": item.categoria_nombre,
        "Proveedor": item.proveedor_nombre + " " + item.proveedor_apellido,
        "Monto": item.monto,
        "Fecha": item.fecha,
        "Metodo Pago": capitalize(item.metodo_pago),
        "Descripcion": item.descripcion,
      }));

      setPropietarios(dataMapped);
      setFilteredGastos(dataMapped);
      setTotalPages(Math.ceil(count / pageSize));
    } catch (error) {
      console.error("Error al obtener los gastos:", error);
      toast({
        title: "Error al obtener los gastos",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    obtenerData();
  }, [periodoSeleccionado, pageIndex, pageSize]);

  const handleAddPropietario = () => {
    setShowAddPropietario(true);
  };

  const handleGoBack = () => {
    setShowAddPropietario(false);
  };

  const handleUpdateGastos = async (updatedData: any) => {
    try {
      const formatedData = {
        id: updatedData["ID"],
        categoria: updatedData["ID Categoria"],
        categoria_nombre: updatedData.Categoria,
        proveedor_nombre: updatedData.Proveedor,
        monto: updatedData.Monto,
        fecha: updatedData.Fecha,
        metodo_pago: updatedData["Metodo Pago"],
        descripcion: updatedData.Descripcion,
      };

      await api.put(`gastos/${formatedData.id}/`, formatedData);

      obtenerData();
      toast({
        title: "Gasto actualizado",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error al actualizar el gasto:", error);
      toast({
        title: "Error al actualizar el gasto",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteGastos = async (id: string) => {
    try {
      await api.delete(`gastos/${id}/`);

      obtenerData();
      toast({
        title: "Gasto eliminado",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error al eliminar el gasto:", error);
      toast({
        title: "Error al eliminar el gasto",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const applyFilters = (data: any, filters: { search?: string, email?: string }) => {
    let filteredData = data;
    if (filters.search) {
      filteredData = filteredData.filter((item: any) => {
        return Object.values(item).some((value: any) =>
          value.toString().toLowerCase().includes(filters.search!.toLowerCase())
        );
      });
    }
    if (filters.email) {
      filteredData = filteredData.filter((item: any) =>
        item.email.toLowerCase().includes(filters.email!.toLowerCase())
      );
    }
    setFilteredGastos(filteredData);
  };

  const handleFilterChange = (newFilters: { search?: string, email?: string }) => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
    applyFilters(propietarios, { ...filters, ...newFilters });
  };

  const exportToXLS = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredGastos);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Gastos");
    XLSX.writeFile(workbook, "gastos.xlsx");
  };

  const handlePageChange = (newPageIndex: number) => {
    setPageIndex(newPageIndex);
  };

  return (
    <Box bg={bgColor} minH="100vh" p={2}>
      <VStack spacing={6} align="stretch">
        {!showAddPropietario && (
          <>
            <FilterBar
              onAddPropietario={handleAddPropietario}
              onFilterChange={handleFilterChange}
              onExport={exportToXLS}
            />
            {filteredGastos.length > 0 || isLoading ? (
              <Box bg={cardBgColor} borderRadius="lg" overflow="hidden" boxShadow="md">
                <ComplexTable
                  tableData={filteredGastos}
                  onDelete={handleDeleteGastos}
                  onUpdate={handleUpdateGastos}
                  hiddenColumns={hiddenColumns}
                  obtenerData={obtenerData}
                  isLoading={isLoading}
                />
                <Flex justify="space-between" align="center" p={4} borderTop="1px" borderColor="gray.200">
                  <Button
                    onClick={() => handlePageChange(Math.max(pageIndex - 1, 0))}
                    disabled={pageIndex === 0 || isLoading}
                    colorScheme="blue"
                    size="sm"
                  >
                    Anterior
                  </Button>
                  <Flex align="center">
                    <Text mr={2} fontSize="sm">Ir a página:</Text>
                    <Select
                      value={pageIndex}
                      onChange={(e) => handlePageChange(Number(e.target.value))}
                      size="sm"
                      w="auto"
                    >
                      {[...Array(totalPages)].map((_, i) => (
                        <option key={i} value={i}>
                          {i + 1}
                        </option>
                      ))}
                    </Select>
                    <Text ml={2} fontSize="sm">
                      de {totalPages}
                    </Text>
                  </Flex>
                  <Button
                    onClick={() => handlePageChange(Math.min(pageIndex + 1, totalPages - 1))}
                    disabled={pageIndex >= totalPages - 1 || isLoading}
                    colorScheme="blue"
                    size="sm"
                  >
                    Siguiente
                  </Button>
                </Flex>
              </Box>
            ) : (
              <NoDataMessage />
            )}
          </>
        )}
        {showAddPropietario && (
          <AddPropietario onGoBack={handleGoBack} update={obtenerData} />
        )}
      </VStack>
    </Box>
  );
};

export default Dashboard;