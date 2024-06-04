import React, {  useState } from "react";
import ComplexTable from "views/admin/propietarios/components/ComplexTable";
import FilterBar from "./components/FilterBar";
import AddPropietario from "./components/AddGastos";
import axios from 'axios'
import {API_ADDRESS} from '../../../variables/apiSettings'
import { capitalize } from 'lodash';

const Dashboard: React.FC = () => {
  console.log("Propietarios test");
  const [propietarios, setPropietarios] = React.useState([]);
  const [showAddPropietario, setShowAddPropietario] = useState<boolean>(false);

  const obtenerPropietarios = async () => {
    try {
      const data = await axios.get(API_ADDRESS+"gastos/");

      console.log("DATA PROVEEDORES");
      console.log(data);
      const dataMapped = data.data.map((item: any) => (
        {
          "ID Propietario": item.id_gastos,
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