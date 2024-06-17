import React, { useState, useEffect } from "react";
import ComplexTable from "views/admin/propietarios/components/ComplexTable";
import FilterBar from "./components/FilterBar";
import AddPropietario from "./components/AddPropietario";
import axios from 'axios';
import { API_ADDRESS } from '../../../variables/apiSettings';
import { useToast } from '@chakra-ui/react';

const PropietariosDashboard: React.FC = () => {
  const [propietarios, setPropietarios] = useState([]);
  const [showAddPropietario, setShowAddPropietario] = useState<boolean>(false);
  const toast = useToast();

  const obtenerData = async () => {
    try {
      const response = await axios.get(`${API_ADDRESS}propietarios/`);
      const dataMapped = response.data.map((item: any) => ({
        "ID Propietario": item.id,
        "Rut": item.rut,
        "Razon Social": item.razon_social,
        "Nombre": item.nombre,
        "Apellido": item.apellido,
        "Email": item.email,
        "Numero de Telefono": item.numero_telefono,
        "Propiedades": item.lotes.map((lote: any) => `${lote.lote.numero_unidad} (${lote.tipo_relacion})`).join(", "),
      }));
      setPropietarios(dataMapped);
    } catch (error) {
      console.error("Error al obtener los propietarios:", error);
    }
  };

  const handleAddPropietario = () => {
    setShowAddPropietario(true);
  };

  const handleGoBack = () => {
    setShowAddPropietario(false);
  };

  const handleUpdatePropietario = async (updatedData: any) => {
    try {
      console.log(updatedData)
      let formatedData = {
        id: updatedData["ID Propietario"],
        nombre: updatedData.Nombre,
        apellido: updatedData.Apellido,
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
      })
    } catch (error) {
      console.error("Error al actualizar el propietario:", error);
      toast ({
        title: "Error al actualizar el propietario",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
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
      })
    } catch (error) {
      console.error("Error al eliminar el propietario:", error);
      toast ({
        title: "Error al eliminar el propietario",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
  };

  useEffect(() => {
    obtenerData();
  }, []);

  return (
    <div className="mt-5 grid grid-cols-1 gap-5">
      {!showAddPropietario && (
        <>
          <FilterBar onAddPropietario={handleAddPropietario} />
          <ComplexTable
            tableData={propietarios}
            onUpdate={handleUpdatePropietario}
            onDelete={handleDeletePropietario}
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
