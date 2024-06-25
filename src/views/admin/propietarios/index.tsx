import React, { useState, useEffect } from "react";
import ComplexTable from "views/admin/propietarios/components/ComplexTable";
import FilterBar from "./components/FilterBar";
import AddPropietario from "./components/AddPropietario";
import axios from 'axios';
import { API_ADDRESS } from '../../../variables/apiSettings';
import { useToast } from '@chakra-ui/react';

const PropietariosDashboard: React.FC = () => {
  const [propietarios, setPropietarios] = useState([]);
  const [filteredPropietarios, setFilteredPropietarios] = useState([]);
  const [showAddPropietario, setShowAddPropietario] = useState<boolean>(false);
  const [filters, setFilters] = useState({ search: '', razonSocial: '', email: '' });
  const hiddenColumns = ["ID Propietario"]
  const toast = useToast();

  const obtenerData = async () => {
    try {
      const response = await axios.get(`${API_ADDRESS}propietarios/`);
      const dataMapped = response.data.map((item: any) => ({
        "ID Propietario": item.id,
        "Propiedades": item.lotes.map((lote: any) => `${lote.lote.numero_unidad}`).join(", "),
        "Rol": item.lotes.map((lote:any) =>`${lote.tipo_relacion}`),
        "Rut": item.rut,
        "Razon Social": item.razon_social,
        "Nombre": item.razon_social ? item.razon_social : `${item.nombre}`,
        "Apellidos": item.apellido,
        "Email": item.email,
        "Numero de Telefono": item.numero_telefono,
       
      }));
      setPropietarios(dataMapped);
      applyFilters(dataMapped, filters);
    } catch (error) {
      console.error("Error al obtener los propietarios:", error);
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
    if (filters.razonSocial) {
      filteredData = filteredData.filter((prop: any) => 
        prop["Razon Social"] && prop["Razon Social"].toLowerCase().includes(filters.razonSocial.toLowerCase())
      );
    }
    if (filters.email) {
      filteredData = filteredData.filter((prop: any) => 
        prop.Email.toLowerCase().includes(filters.email.toLowerCase())
      );
    }
    setFilteredPropietarios(filteredData);
  };
  
  const handleFilterChange = (newFilters: { search?: string, razonSocial?: string, email?: string }) => {
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
        id: updatedData["ID Propietario"],
        nombre: updatedData.Nombre,
        apellido: updatedData.Apellidos,
        rut: updatedData.Rut,
        email: updatedData.Email,
        numero_telefono: updatedData["Numero de Telefono"],
        razon_social: updatedData["Razon Social"],
      }
      await axios.put(`${API_ADDRESS}propietarios/${formatedData.id}/`, formatedData);
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
      await axios.delete(`${API_ADDRESS}propietarios/${id}/`);
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

  useEffect(() => {
    obtenerData();
  }, []);

  return (
    <div className="mt-5 grid grid-cols-1 gap-5">
      {!showAddPropietario && (
        <>
          <FilterBar onAddPropietario={handleAddPropietario} onFilterChange={handleFilterChange} />
          <ComplexTable
            tableData={filteredPropietarios}
            onUpdate={handleUpdatePropietario}
            onDelete={handleDeletePropietario}
            hiddenColumns={hiddenColumns}
          />
        </>
      )}
      {showAddPropietario && (
        <AddPropietario onGoBack={handleGoBack} update={obtenerData} />
      )}
    </div>
  );
};

export default PropietariosDashboard;
