import React, {  useState } from "react";
import ComplexTable from "views/admin/propietarios/components/ComplexTable";
import FilterBar from "./components/FilterBar";
import AddPropietario from "./components/AddGastos";
import axios from 'axios'
import {API_ADDRESS} from '../../../variables/apiSettings'
import { capitalize } from 'lodash';
import { useToast } from '@chakra-ui/react';

const Dashboard: React.FC = () => {
  console.log("Propietarios test");
  const toast = useToast();
  const [propietarios, setPropietarios] = React.useState([]);
  const [showAddPropietario, setShowAddPropietario] = useState<boolean>(false);

  const obtenerData = async () => {
    try {
      const data = await axios.get(API_ADDRESS+"gastos/");

      console.log("DATA PROVEEDORES");
      console.log(data);
      const dataMapped = data.data.map((item: any) => (
        {
          "ID Gastos": item.id_gasto,
          "ID Categoria": item.categoria,
          "Categoria": item.categoria_nombre,
          "Proveedor": item.proveedor_nombre + " " + item.proveedor_apellido,
          "Monto": item.monto,
          "Fecha": item.fecha,
          "Metodo Pago": capitalize(item.metodo_pago), // Use the capitalize function to capitalize the method of payment
          "Descripcion": item.descripcion,
        }
      ));
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

  const handleUpdateGastos = async (updatedData: any) => {
    try {
      console.log(updatedData)
      let formatedData = {
        id: updatedData["ID Gastos"],
        categoria: updatedData["ID Categoria"],
        categoria_nombre: updatedData.Categoria,
        proveedor_nombre: updatedData.Proveedor,
        monto: updatedData.Monto,
        fecha: updatedData.Fecha,
        metodo_pago: updatedData["Metodo Pago"],
        descripcion: updatedData.Descripcion,
      }
      await axios.put(`${API_ADDRESS}gastos/${formatedData.id}/`, formatedData);
      obtenerData();
      toast ({
        title: "Gasto actualizado",
        status: "success",
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      console.error("Error al actualizar el propietario:", error);
      toast ({
        title: "Error al actualizar el gasto",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
  }
  const handleDeleteGastos = async (id: string) => {
    try {
      await axios.delete(`${API_ADDRESS}gastos/${id}/`);
      obtenerData();
      toast ({  
        title: "Gasto eliminado",
        status: "success",
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      console.error("Error al eliminar el propietario:", error);
      toast ({
        title: "Error al eliminar el gasto",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
  }

  React.useEffect(() => {
    obtenerData();
  }, []);

  return (
    <>
      
        <div className="mt-5 grid grid-cols-1 gap-5">
          {!showAddPropietario && (
            <>
              <FilterBar onAddPropietario={handleAddPropietario} />
              <ComplexTable tableData={propietarios} onDelete={handleDeleteGastos} onUpdate={handleUpdateGastos}/>
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