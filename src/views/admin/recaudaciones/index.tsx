import React, { useState } from "react";
import ComplexTable from "./components/ComplexTable";
import FilterBar from "./components/FilterBar";
import AddPropietario from "./components/AddRecaudaciones";
import axios from 'axios'
import { API_ADDRESS } from '../../../variables/apiSettings'
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
import NoDataMessage from "views/components/NoDataMessage"

interface Recaudacion{
  "ID": number,
  "Propietario_FK": number,
  "Gasto_FK": number,
  "Fecha": string,
  "Monto": number,
  "Metodo_Pago": string,
  "Descripcion": string
}

interface Saldo{
  "ID": number,
  "Lote" : number,
  "Propietario": number,
  "Saldo Pendiente": number,
  "Saldo a Favor": number
}

const Dashboard: React.FC = () => {
  console.log("recaudaciones test");
  const toast = useToast();
  const [recaudaciones, setRecaudaciones] = React.useState([]);
  const [filteredGastos, setFilteredGastos] = useState([]);
  const [showAddPropietario, setShowAddPropietario] = useState<boolean>(false);
  const [filters, setFilters] = useState({ search: '', email: '' });
  const hiddenColumns = ["ID", "ID Gasto"];

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize] = useState(100);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const obtenerData = async () => {
    setIsLoading(true);
    try {
      const data = await axios.get(API_ADDRESS + "saldos/",
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

      const dataMapped = data.data.results.map((item: any) => (
        {
          "ID": item.id,
          "ID Lote": item.lote,
          "ID Propietario": item.propietario,
          "Saldo Pendiente": item.saldo_pendiente,
          "Saldo Abonado": item.saldo_a_favor,

        }
      ));
      console.log(data.data);
      setRecaudaciones(dataMapped);
      applyFilters(dataMapped, filters);
    } catch (error) {
      console.error("Error al obtener las recaudaciones:", error);
    }
    finally {
      setIsLoading(false);
    }
  };

  const handleAddPropietario = () => {
    setShowAddPropietario(true);
  };

  const handleGoBack = () => {
    setShowAddPropietario(false);
  };

  const handleUpdateGastos = async (updatedData: any) => {
    try {
      console.log(updatedData)
      let formatedData = {
        id: updatedData["ID"],
        Propietario_FK: updatedData.propietario,
        Gasto_FK: updatedData.Categoria,
        monto: updatedData.Monto,
        fecha: updatedData.Fecha,
        metodo_Pago: updatedData["Metodo Pago"],
        descripcion: updatedData.Descripcion,
      }
      await axios.put(`${API_ADDRESS}saldos/${formatedData.id}/`, formatedData,
        {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("access_token")}`
        }
      }
    );
      obtenerData();
      toast({
        title: "Gasto actualizado",
        status: "success",
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      console.error("Error al actualizar la recaudacion:", error);
      toast({
        title: "Error al actualizar el pago",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
  }
  const handleDeleteGastos = async (id: string) => {
    console.log("Testing")
    try {
      await axios.delete(`${API_ADDRESS}saldos/${id}/`,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("access_token")}`
          }
        }
      );
      obtenerData();
      toast({
        title: "Gasto eliminado",
        status: "success",
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      console.error("Error al eliminar:", error);
      toast({
        title: "Error al eliminar",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
  }
  const applyFilters = (data: any, filters: { search?: string, email?: string }) => {
    let filteredData = data;
    console.log(filteredData)
    if (filters.search) {
      filteredData = filteredData.filter((item: any) => {
        return Object.values(item).some((value: any) => {
          console.log(value)
          return value.toString().toLowerCase().includes(filters.search!.toLowerCase());
        });
      });
    }
    if (filters.email) {
      filteredData = filteredData.filter((item: any) => {
        return item.email.toLowerCase().includes(filters.email!.toLowerCase());
      });
    }
    setFilteredGastos(filteredData);
  }
  const handleFilterChange = (newFilters: { search?: string, email?: string }) => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
    applyFilters(recaudaciones, { ...filters, ...newFilters });
  };
  
  const exportToXLS = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredGastos);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Gastos");
    XLSX.writeFile(workbook, "gastos.xlsx");
  };

  React.useEffect(() => {
    obtenerData();
  }, []);

  const handlePageChange = (newPageIndex: number) => {
    setPageIndex(newPageIndex);
  };

  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const cardBgColor = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');

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
                  updateData={obtenerData}
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
