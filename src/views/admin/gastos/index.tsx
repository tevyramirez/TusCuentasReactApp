import React, { useState, useEffect } from "react";
import ComplexTable from "views/components/ComplexTable";
import FilterBar from "./components/FilterBar";
import AddPropietario from "./components/AddGastos";
import axios from 'axios';
import { API_ADDRESS } from '../../../variables/apiSettings';
import { capitalize } from 'lodash';
import { useToast } from '@chakra-ui/react';
import * as XLSX from 'xlsx';
import NoDataMessage from "views/components/NoDataMessage";
import { useSelector } from 'react-redux'; // Importa useSelector

const Dashboard: React.FC = () => {
  const toast = useToast();
  const [propietarios, setPropietarios] = useState([]);
  const [filteredGastos, setFilteredGastos] = useState([]);
  const [showAddPropietario, setShowAddPropietario] = useState<boolean>(false);
  const [filters, setFilters] = useState({ search: '', email: '' });
  const hiddenColumns = ["ID", "ID Categoria"];

  // Obtiene el periodo actual desde el estado global
  const periodoSeleccionado = useSelector((state: any) => state.periodo.periodoActual);

  const obtenerData = async () => {
    try {
      const data = await axios.get(`${API_ADDRESS}gastos/periodo/${periodoSeleccionado}/`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("access_token")}`
        }
      });

      const dataMapped = data.data.map((item: any) => ({
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
      applyFilters(dataMapped, filters);
  
    } catch (error) {
      console.error("Error al obtener los gastos:", error);
    }
  };

  useEffect(() => {
    console.log("Periodo actual se ha actualizado:", periodoSeleccionado);
    obtenerData();
  }, [periodoSeleccionado]); // Ejecuta obtenerData cada vez que cambie periodoSeleccionado

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

  return (
    <div className="mt-5 grid grid-cols-1 gap-5">
      {!showAddPropietario && (
        <>
          <FilterBar
            onAddPropietario={handleAddPropietario}
            onFilterChange={handleFilterChange}
            onExport={exportToXLS}
          />
          {propietarios.length > 0 ? (
            <ComplexTable
              tableData={filteredGastos}
              onDelete={handleDeleteGastos}
              onUpdate={handleUpdateGastos}
              hiddenColumns={hiddenColumns}
            />
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
