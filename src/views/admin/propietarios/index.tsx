import React, {  useState } from "react";
import ComplexTable from "views/admin/propietarios/components/ComplexTable";
import FilterBar from "./components/FilterBar";
import AddPropietario from "./components/AddPropietario";
import axios from 'axios'
import {API_ADDRESS} from '../../../variables/apiSettings'

const Dashboard: React.FC = () => {
  console.log("Propietarios test");
  const [propietarios, setPropietarios] = React.useState([]);
  const [showAddPropietario, setShowAddPropietario] = useState<boolean>(false);

  const obtenerPropietarios = async () => {
    try {
      const data = await axios.get(API_ADDRESS+"propietarios/");
      console.log("DATA PROPIETARIOS")
      console.log(data);
      const dataMapped = data.data.map((item: any) => (
        {
        "ID Propietario": item.id,
        "Rut":item.rut,
        "Razon Social": item.razon_social,
        "Nombre": item.nombre,
        "Apellido": item.apellido,
        "Email": item.email,
        "Numero de Telefono": item.numero_telefono,      
        "Propiedades": item.lotes.map((lote: any) => lote.numero_unidad).join(", "), 
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
    obtenerPropietarios();
  }, []);

  return (
    <>
      
        <div className="mt-5 grid grid-cols-1 gap-5">
          {!showAddPropietario && (
            <>
              <FilterBar onAddPropietario={handleAddPropietario} />
              <ComplexTable tableData={propietarios} />
            </>
          )}
          {showAddPropietario && (
            <AddPropietario onGoBack={handleGoBack} update={obtenerPropietarios} />
          )}
        </div>

    </>
  );
};

export default Dashboard;