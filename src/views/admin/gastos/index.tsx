import React, { useState } from "react";
import ComplexTable from "views/admin/propietarios/components/ComplexTable";
import FilterBar from "./components/FilterBar";
import AddPropietario from "./components/AddGastos";
import axios from 'axios'
import { API_ADDRESS } from '../../../variables/apiSettings'
import { capitalize } from 'lodash';
import { useToast } from '@chakra-ui/react';

const Dashboard: React.FC = () => {
  console.log("Propietarios test");
  const toast = useToast();
  const [propietarios, setPropietarios] = React.useState([]);
  const [filteredGastos, setFilteredGastos] = useState([]);
  const [showAddPropietario, setShowAddPropietario] = useState<boolean>(false);
  const [filters, setFilters] = useState({ search: '', email: '' });
  const hiddenColumns = ["ID", "ID Categoria"]

  const obtenerData = async () => {
    try {
      const data = await axios.get(API_ADDRESS + "gastos/");

      console.log("DATA PROVEEDORES");
      console.log(data);
      const dataMapped = data.data.map((item: any) => (
        {
          "ID": item.id_gasto,
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
      applyFilters(dataMapped, filters);
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
        id: updatedData["ID"],
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
      toast({
        title: "Gasto actualizado",
        status: "success",
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      console.error("Error al actualizar el propietario:", error);
      toast({
        title: "Error al actualizar el gasto",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
  }
  const handleDeleteGastos = async (id: string) => {
    console.log("Testing")
    try {
      await axios.delete(`${API_ADDRESS}gastos/${id}/`);
      obtenerData();
      toast({
        title: "Gasto eliminado",
        status: "success",
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      console.error("Error al eliminar el propietario:", error);
      toast({
        title: "Error al eliminar el gasto",
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
    applyFilters(propietarios, { ...filters, ...newFilters });
  };
  React.useEffect(() => {
    obtenerData();
  }, []);

  return (
    <>

      <div className="mt-5 grid grid-cols-1 gap-5">
        {!showAddPropietario && (
          <>
            <FilterBar onAddPropietario={handleAddPropietario} onFilterChange={handleFilterChange}/>
            <ComplexTable
              tableData={filteredGastos}
              onDelete={handleDeleteGastos}
              onUpdate={handleUpdateGastos}
              hiddenColumns={hiddenColumns}
            />
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