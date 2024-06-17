import React, {useEffect, useState} from "react";
import ComplexTable from "views/admin/lote/components/ComplexTable";
import axios from "axios";
import FilterBar from "./components/FilterBar";
import { API_ADDRESS } from "variables/apiSettings";
/* import AddLote from "./components/AddLote" */

const Dashboard = () => {
  console.log("Lote test");
  const [tableDataComplex, setTableDataComplex] = React.useState([]);
  const [propietarios, setPropietarios] = React.useState([]);
  const [showAddLote, setShowAddLote] = useState<boolean>(false);

  const obtenerPropietarios = async () => {
    try {
      const data = await axios.get(API_ADDRESS+"/lotes/");
      console.log("DATA LOTES");
      console.log(data);
      const dataMapped = data.data.map((item: any) => ({
        "ID Lote": item.id_lote,
        "Número Unidad": item.numero_unidad,
        "Metraje Cuadrado": item.metraje_cuadrado,
        "Propietario":item.propietario_nombre + ' '+ item.propietario_apellido
      }));
      console.log(dataMapped);
      setPropietarios(dataMapped);
    } catch (error) {
      console.error("Error al obtener los propietarios:", error);
    }
  };

  const handleAddPropietario = () => {
    setShowAddLote(true);
  };

  const handleGoBack = () => {
    setShowAddLote(false);
  };

  React.useEffect(() => {
    obtenerPropietarios();
  }, []);

  return (
    <>
      
        <div className="mt-5 grid grid-cols-1 gap-5">
          {!showAddLote && (
            <>
              <FilterBar onAddPropietario={handleAddPropietario} />
              <ComplexTable tableData={propietarios} />
            </>
          )}
 {/*          {showAddLote && (
            <AddLote onGoBack={handleGoBack} />
          )}  */}
        </div>

    </>
  );
};

export default Dashboard;