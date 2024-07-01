import React, {  useState } from "react";
import ComplexTable from "views/admin/propietarios/components/ComplexTable";
import FilterBar from "./components/FilterBar";
import AddPropietario from "./components/AddProveedor";
import axios from 'axios'
import {API_ADDRESS} from '../../../variables/apiSettings'
import { useToast } from '@chakra-ui/react';


const Dashboard: React.FC = () => {
  console.log("Propietarios test");
  const toast = useToast();
  const [propietarios, setPropietarios] = React.useState([]);
  const [showAddPropietario, setShowAddPropietario] = useState<boolean>(false);
  const hiddenColumns = ["ID Propietario"]

  const obtenerData = async () => {
    try {
      const data = await axios.get(API_ADDRESS+"proveedores/");
      console.log("DATA PROVEEDORES");
      console.log(data);
      const dataMapped = data.data.map((item: any) => (
        {
          "ID Propietario": item.id_proveedor,
          "Rut":item.rut,
          "Nombre": item.nombre,
          "Apellido": item.apellido,
          "Telefono": item.telefono,
          "Servicio": item.servicio ,
          
      }));
      console.log(dataMapped);
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

  React.useEffect(() => {
    obtenerData();
  }, []);

  const handleUpdatePropietario = async (updatedData: any) => {
    try {
      console.log(updatedData)
      let formatedData = {
        id: updatedData["ID Propietario"],
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

  return (
    <>
      
        <div className="mt-5 grid grid-cols-1 gap-5">
          {!showAddPropietario && (
            <>
              <FilterBar onAddPropietario={handleAddPropietario} />
              <ComplexTable 
              tableData={propietarios} 
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