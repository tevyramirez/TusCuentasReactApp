import React, {  useState, useEffect } from "react";
import ComplexTable from "views/components/ComplexTable";
import FilterBar from "./components/FilterBar";
import AddPropietario from "./components/AddProveedor";
import axios from 'axios'
import {API_ADDRESS} from '../../../variables/apiSettings'
import * as XLSX from "xlsx"
import NoDataMessage from "views/components/NoDataMessage"
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

const Dashboard: React.FC = () => {
  console.log("Propietarios test");
  const toast = useToast();
  const [propietarios, setPropietarios] = React.useState([]);
  const [filteredPropietarios, setFilteredPropietarios] = useState([]);
  const [filters, setFilters] = useState({ search: '', razonSocial: '', email: '' });
  const [showAddPropietario, setShowAddPropietario] = useState<boolean>(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize] = useState(100);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const hiddenColumns = ["ID"]
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const cardBgColor = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');


  const obtenerData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(API_ADDRESS+"proveedores/",
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
      console.log("DATA PROVEEDORES");
      console.log(response);
      
      const { data } = response;
      const count = data.length;
      console.log("results", data);
      const dataMapped = data.map((item: any) => (
        {
          "ID": item.id_proveedor,
          "Rut":item.rut,
          "Nombre": item.nombre,
          "Apellido": item.apellido,
          "Telefono": item.telefono,
          "Servicio": item.servicio ,
          
      }));
      console.log(dataMapped);
      setPropietarios(dataMapped);
      applyFilters(dataMapped, filters);
      setTotalPages(Math.ceil(count / pageSize));
    } catch (error) {
      console.error("Error al obtener los proveedores:", error);
    }
    finally {
      setIsLoading(false);
    }
  };

  const applyFilters = (data: any[], filters: { search: string, razonSocial: string, email: string }) => {
    let filteredData = data;
    console.log(filteredData)
    if (filters.search) {
      console.log(filters.search)
      filteredData = filteredData.filter((prop: any) => {
        return Object.values(prop).some((value: any) => {
          console.log(value)
          if (value !== null) {
          return value.toString().toLowerCase().includes(filters.search!.toLowerCase());
        }});
      });
    }
    if (filters.email) {
      filteredData = filteredData.filter((prop: any) => 
        prop.Email.toLowerCase().includes(filters.email.toLowerCase())
      );
    }
    setFilteredPropietarios(filteredData);
    console.log("datos filtrados", filteredData)
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

  React.useEffect(() => {
    obtenerData();
  }, []);

  const handleUpdatePropietario = async (updatedData: any) => {
    try {
      console.log(updatedData)
      let formatedData = {
        id: updatedData["ID"],
        nombre: updatedData.Nombre,
        apellido: updatedData.Apellido,
        rut: updatedData.Rut,
        telefono: updatedData.Telefono,
        servicio: updatedData.Servicio,
      }
      await axios.put(`${API_ADDRESS}proveedores/${formatedData.id}/`, formatedData,
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("access_token")}`
        }
      }
      );
      obtenerData();
      toast ({
        title: "Proveedor actualizado",
        status: "success",
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      console.error("Error al actualizar el proveedor:", error);
      toast ({
        title: "Error al actualizar el proveedor",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
  };

  const handleDeletePropietario = async (id: string) => {
    try {
      await axios.delete(`${API_ADDRESS}proveedores/${id}/`,{
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("access_token")}`
        }
      });
      obtenerData();
      toast ({
        title: "Propietario eliminado",
        status: "success",
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      console.error("Error al eliminar el proveedor:", error);
      toast ({
        title: "Error al eliminar el propietario",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
  };

  const handlePageChange = (newPageIndex: number) => {
    setPageIndex(newPageIndex);
  };

  const exportToXLS = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredPropietarios);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Proveedores");
    XLSX.writeFile(workbook, "Proveedores.xlsx");
  };
  useEffect(() => {
    obtenerData();
  }, []);
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

export default Dashboard;