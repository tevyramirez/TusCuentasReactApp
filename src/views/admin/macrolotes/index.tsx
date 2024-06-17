import React, { useEffect } from "react"
import { useDispatch } from 'react-redux'; // Importamos useDispatch
import ComplexTable from "views/admin/propietarios/components/ComplexTable";
import { obtenerPropietarios } from "./api/obtenerPropietarios";
import FilterBar from "./components/FilterBar"
import { useDisclosure } from "@chakra-ui/react"
import Drawertest from "./components/Drawertest"




const Dashboard = () => {
  console.log("Propietarios test")
  const [tableDataComplex, setTableDataComplex] = React.useState([])
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = React.useRef()
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await obtenerPropietarios();
        console.log("woopa chela la data", data)
        setTableDataComplex(data);
      } catch (error) {
        // Manejar errores
      }
    };

    fetchData();
  }, []);

  return (
    <>
    <Drawertest />
    <div className="">
      


   

      <div className="mt-5 grid grid-cols-1 gap-5">
        
      <FilterBar />
      </div>


    </div >
    </>
  );
};

export default Dashboard;
