import React, { useState, useEffect } from "react";
import ComplexTable from "views/components/ComplexTable";
import FilterBar from "./components/FilterBar";
import AddPropietario from "./components/AddGastos";
import axios from 'axios';
import { API_ADDRESS } from '../../../variables/apiSettings';
import { capitalize } from 'lodash';
import { useToast, Button, Flex, Text } from '@chakra-ui/react';
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
  
  const hiddenColumns = ["ID", "ID Categoria"];

  const periodoSeleccionado = useSelector((state: any) => state.periodo.periodoActual);

  const obtenerData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_ADDRESS}gastos/periodo/${periodoSeleccionado}/`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("access_token")}`
        },
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

      await axios.put(`${API_ADDRESS}gastos/${formatedData.id}/`, formatedData, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("access_token")}`
        }
      });

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
      await axios.delete(`${API_ADDRESS}gastos/${id}/`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("access_token")}`
        }
      });

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
    <div className="mt-5 grid grid-cols-1 gap-5">
      {!showAddPropietario && (
        <>
          <FilterBar
            onAddPropietario={handleAddPropietario}
            onFilterChange={handleFilterChange}
            onExport={exportToXLS}
          />
          {filteredGastos.length > 0 || isLoading ? (
            <>
              <ComplexTable
                tableData={filteredGastos}
                onDelete={handleDeleteGastos}
                onUpdate={handleUpdateGastos}
                hiddenColumns={hiddenColumns}
                obtenerData={obtenerData}
                isLoading={isLoading}
              />
              <Flex justify="space-between" align="center" mt={4}>
                <Button
                  onClick={() => handlePageChange(Math.max(pageIndex - 1, 0))}
                  disabled={pageIndex === 0 || isLoading}
                >
                  Anterior
                </Button>
                <Text>Página {pageIndex + 1} de {totalPages}</Text>
                <Button
                  onClick={() => handlePageChange(Math.min(pageIndex + 1, totalPages - 1))}
                  disabled={pageIndex >= totalPages - 1 || isLoading}
                >
                  Siguiente
                </Button>
              </Flex>
            </>
          ) : (
            <NoDataMessage />
          )}
        </>
      )}
      {showAddPropietario && (
        <AddPropietario onGoBack={handleGoBack} update={obtenerData} />
      )}
    </div>
  );
};

export default Dashboard;