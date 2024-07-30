import React, {  useState, useEffect } from "react";
import ComplexTable from "views/components/ComplexTable";
import FilterBar from "./components/FilterBar";
import AddPropietario from "./components/AddProveedor";
import axios from 'axios'
import {API_ADDRESS} from '../../../variables/apiSettings'
import { useToast } from '@chakra-ui/react';
import * as XLSX from "xlsx"


const Dashboard: React.FC = () => {
  console.log("Propietarios test");
  const toast = useToast();
  const [propietarios, setPropietarios] = React.useState([]);
  const [filteredPropietarios, setFilteredPropietarios] = useState([]);
  const [filters, setFilters] = useState({ search: '', razonSocial: '', email: '' });
  const [showAddPropietario, setShowAddPropietario] = useState<boolean>(false);
  const hiddenColumns = ["ID"]

  const obtenerData = async () => {
    try {
      const data = await axios.get(API_ADDRESS+"proveedores/");
      console.log("DATA PROVEEDORES");
      console.log(data);
      const dataMapped = data.data.map((item: any) => (
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
    } catch (error) {
      console.error("Error al obtener los proveedores:", error);
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
      await axios.put(`${API_ADDRESS}proveedores/${formatedData.id}/`, formatedData);
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
      await axios.delete(`${API_ADDRESS}proveedores/${id}/`);
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
    <>
      
        <div className="mt-5 grid grid-cols-1 gap-5">
          {!showAddPropietario && (
            <>
              <FilterBar onAddPropietario={handleAddPropietario} onFilterChange={handleFilterChange} onExport={exportToXLS} />
              <ComplexTable 
              tableData={filteredPropietarios} 
              onUpdate={handleUpdatePropietario} 
              onDelete={handleDeletePropietario}
              hiddenColumns={hiddenColumns}/>
            </>
          )}
          {showAddPropietario && (
            <AddPropietario onGoBack={handleGoBack} update={obtenerData} />
          )}
        </div>

    </>
  );
};

export default Dashboard;