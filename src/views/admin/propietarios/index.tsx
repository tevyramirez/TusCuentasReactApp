import React, { useState, useEffect } from "react";
import ComplexTable from "views/components/ComplexTable";
import FilterBar from "./components/FilterBar";
import AddPropietario from "./components/AddPropietario";
import axios from 'axios';
import { API_ADDRESS } from '../../../variables/apiSettings';
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
import * as XLSX from 'xlsx'; // Importa la biblioteca
import NoDataMessage from "views/components/NoDataMessage"

const PropietariosDashboard: React.FC = () => {
  const [propietarios, setPropietarios] = useState([]);
  const [filteredPropietarios, setFilteredPropietarios] = useState([]);
  const [showAddPropietario, setShowAddPropietario] = useState<boolean>(false);
  const [filters, setFilters] = useState({ search: '', razonSocial: '', email: '' });
  
  const hiddenColumns = ["ID", "Razon Social"]

  const toast = useToast();
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize] = useState(100);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const cardBgColor = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');


  const obtenerData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_ADDRESS}propietarios/`,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("access_token")}`
          },
          params: {
            "page": pageIndex + 1,
            "page_size": pageSize
          }

        }
      );
      const { results, count } = response.data;
      const dataMapped = response.data.results.map((item: any) => ({
        "ID": item.id,
        "Propiedades": item.lotes.map((lote: any) => `${lote.lote.numero_unidad}`).join(", "),
        "Rol": item.lotes.map((lote:any) =>`${lote.tipo_relacion}`),
        "Rut": item.rut,
        "Razon Social": item.razon_social,
        "Nombre": item.razon_social ? item.razon_social : `${item.nombre}`,
        "Apellidos": item.apellido,
        "Email": item.email,
        "Telefono": item.numero_telefono,
       
      }));
      setPropietarios(dataMapped);
      applyFilters(dataMapped, filters);
      setFilteredPropietarios(dataMapped);
      setTotalPages(Math.ceil(count / pageSize));
      console.log(propietarios)
    } catch (error) {
      console.error("Error al obtener los propietarios:", error);
    }
    finally {
      setIsLoading(false);
    }
  };

  const applyFilters = (data: any[], filters: { search: string, razonSocial: string, email: string }) => {
    let filteredData = data;
    if (filters.search) {
      filteredData = filteredData.filter((prop: any) => 
        prop.Nombre.toLowerCase().includes(filters.search.toLowerCase()) ||
        prop.Rut.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    if (filters.email) {
      filteredData = filteredData.filter((prop: any) => 
        prop.Email.toLowerCase().includes(filters.email.toLowerCase())
      );
    }
    setFilteredPropietarios(filteredData);
  };
  
  const handleFilterChange = (newFilters: { search?: string, email?: string }) => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
    applyFilters(propietarios, { ...filters, ...newFilters });
  };

  const handleAddPropietario = () => {
    setShowAddPropietario(true);
  };

  const handleGoBack = () => {
    setShowAddPropietario(false);
  };

  const handleUpdatePropietario = async (updatedData: any) => {
    try {
      let formatedData = {
        id: updatedData["ID"],
        nombre: updatedData.Nombre,
        apellido: updatedData.Apellidos,
        rut: updatedData.Rut,
        email: updatedData.Email,
        numero_telefono: updatedData["Telefono"],
        razon_social: updatedData["Razon Social"],
      }
      await axios.put(`${API_ADDRESS}propietarios/${formatedData.id}/`, formatedData,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("access_token")}`
          }
        }
      );
      obtenerData();
      toast ({
        title: "Propietario actualizado",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error al actualizar el propietario:", error);
      toast ({
        title: "Error al actualizar el propietario",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeletePropietario = async (id: string) => {
    try {
      await axios.delete(`${API_ADDRESS}propietarios/${id}/`,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("access_token")}`
          }
        }
      );
      obtenerData();
      toast ({
        title: "Propietario eliminado",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error al eliminar el propietario:", error);
      toast ({
        title: "Error al eliminar el propietario",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  const exportToXLS = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredPropietarios);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Propietarios");
    XLSX.writeFile(workbook, "Propietarios.xlsx");
  };

  const handlePageChange = (newPageIndex: number) => {
    setPageIndex(newPageIndex);
  };

  
  useEffect(() => {
    obtenerData();
  }, [pageIndex, pageSize]);
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
          {filteredPropietarios.length > 0 || isLoading ? (
            <Box bg={cardBgColor} borderRadius="lg" overflow="hidden" boxShadow="md">
              <ComplexTable
                tableData={filteredPropietarios}
                onDelete={handleDeletePropietario}
                onUpdate={handleUpdatePropietario}
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

export default PropietariosDashboard;
