import React, { useState } from "react";
import ComplexTable from "views/components/ComplexTable";
import FilterBar from "./components/FilterBar";
import AddPropietario from "./components/AddRecaudaciones";
import axios from 'axios'
import { API_ADDRESS } from '../../../variables/apiSettings'
import { capitalize } from 'lodash';
import { useToast } from '@chakra-ui/react';
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

const Dashboard: React.FC = () => {
  console.log("recaudaciones test");
  const toast = useToast();
  const [recaudaciones, setRecaudaciones] = React.useState([]);
  const [filteredGastos, setFilteredGastos] = useState([]);
  const [showAddPropietario, setShowAddPropietario] = useState<boolean>(false);
  const [filters, setFilters] = useState({ search: '', email: '' });
  const hiddenColumns = ["ID", "ID Lote", "ID Gasto"];

  const obtenerData = async () => {
    try {
      const data = await axios.get(API_ADDRESS + "recaudaciones/",
        {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("access_token")}`
        }
      }
    );

      console.log("DATA recaudaciones");
      console.log(data);
      const dataMapped = data.data.map((item: any) => (
        {
          "ID": item.id_recaudacion,
          "ID Lote": item.id_lote,
          "Unidad": item.nombre_unidad,
          "Monto": item.monto,
          "Fecha": item.fecha,
          "Metodo Pago": capitalize(item.metodo_pago), // Use the capitalize function to capitalize the method of payment
          "Descripcion": item.descripcion,
        }
      ));
      console.log(dataMapped);
      setRecaudaciones(dataMapped);
      applyFilters(dataMapped, filters);
    } catch (error) {
      console.error("Error al obtener las recaudaciones:", error);
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
      await axios.put(`${API_ADDRESS}recaudaciones/${formatedData.id}/`, formatedData,
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
      await axios.delete(`${API_ADDRESS}recaudaciones/${id}/`,
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

  return (
    <>

      <div className="mt-5 grid grid-cols-1 gap-5">
        {!showAddPropietario && (
          <>
            <FilterBar onAddPropietario={handleAddPropietario} onFilterChange={handleFilterChange} onExport={exportToXLS}/>
            {recaudaciones.length >0 ? <ComplexTable
              tableData={filteredGastos}
              onDelete={handleDeleteGastos}
              onUpdate={handleUpdateGastos}
              hiddenColumns={hiddenColumns}
              /> : <NoDataMessage/>}
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
