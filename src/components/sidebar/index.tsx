import React, { useState, useEffect } from "react";
import { TbLayoutSidebarLeftCollapse, TbLayoutSidebarRightCollapseFilled } from "react-icons/tb";
import Links from "./components/Links";
import routes from "routes";
import axios from 'axios';
import { API_ADDRESS } from "variables/apiSettings";
import { useNavigate } from "react-router-dom";
import { 
  Button, 
  Popover, 
  PopoverTrigger, 
  PopoverContent, 
  PopoverHeader, 
  PopoverBody, 
  PopoverFooter, 
  PopoverArrow, 
  PopoverCloseButton, 
  useToast, 
  Portal, 
  Slide,
  Fade
} from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { setPeriodoActual } from 'features/periodo/periodoSlice';
import { useAppSelector } from 'app/hooks';

interface Periodo {
  id_periodo: number;
  fecha_inicio: string;
  fecha_fin: string;
  estado: string;
}

const Sidebar = (props: { open: boolean; onClose: React.MouseEventHandler<HTMLSpanElement>; }) => {
  const { open, onClose } = props;
  const [periodos, setPeriodos] = useState<Periodo[]>([]);
  const [selectedPeriodoId, setSelectedPeriodoId] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const toast = useToast();
  const dispatch = useDispatch();
  const periodoActual = useAppSelector((state) => state.periodo.periodoActual);
  const navigate = useNavigate();

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  const fetchPeriodos = async () => {
    
    try {
      if (selectedPeriodoId === null) {
      const token = localStorage.getItem("access_token");
      const response = await fetch(API_ADDRESS+"periodo/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });
      const data2 = await response.json();
      const data= data2.results;
      console.log(data)
      const periodosAbiertos = data.filter((periodo: Periodo) => periodo.estado === "abierto");
      const cerrados = data.filter((periodo: Periodo) => periodo.estado === "cerrado");
      const sortedPeriodosCerrados = cerrados.sort((a: Periodo, b: Periodo) => new Date(b.fecha_inicio).getTime() - new Date(a.fecha_inicio).getTime());
      if (periodosAbiertos.length > 0) {
        sortedPeriodosCerrados.unshift(periodosAbiertos[0]);
      }
       setPeriodos(sortedPeriodosCerrados);
      if (sortedPeriodosCerrados.length > 0) {
        setSelectedPeriodoId(sortedPeriodosCerrados[0].id_periodo);
        dispatch(setPeriodoActual(sortedPeriodosCerrados[0].id_periodo));
      }}
      else {
        console.log("El periodo seleccionado es : ", selectedPeriodoId);}
    } catch (error) {
      console.error("Error fetching periodos:", error);
    }
  };

  

  useEffect(() => {
    fetchPeriodos();
    console.log("Periodo actual:", periodoActual);
    if (selectedPeriodoId !== null) {
      console.log("Periodo actual (useEffect):", periodoActual);
      // Otros efectos secundarios basados en el cambio de periodoActual
      const periodoActualEstado = periodos.find(periodo => periodo.id_periodo === periodoActual)?.estado;
      console.log("Estado del periodo actual:", periodoActualEstado);
    }
    
  }, [periodoActual]);

  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const optionsMeses = periodos.map(periodo => {
    const month = new Date(periodo.fecha_inicio).getMonth();
    return (
      <option key={periodo.id_periodo} value={periodo.id_periodo}>
        {capitalizeFirstLetter(new Date(0, month).toLocaleString('es-ES', { month: 'long' }))}
      </option>
    );
  });

  const uniqueYears = [...new Set(periodos.map(periodo => new Date(periodo.fecha_inicio).getFullYear()))];
  const optionsAnios = uniqueYears.map(year => {
    return <option key={year} value={year}>{year}</option>;
  });

  const handlePeriodoChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = parseInt(event.target.value);
    setSelectedPeriodoId(selectedId);
    console.log("Selected ID:", selectedId);
    dispatch(setPeriodoActual(selectedId));
    

  };

  const handleConfirmAction = () => {
    if (periodos.length > 0) {
      const estado = periodos[0].estado;
      if (estado === "cerrado" || estado !== "abierto") {
        abrirPeriodo();
      } else {
        navigate("/admin/preview-reporteCierreGastos");
      }
    }
    if (periodos.length === 0) {
      abrirPeriodo();
    }
    handleClose();
  };

  const abrirPeriodo = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(API_ADDRESS+"periodo/abrir/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });
      const data = await response.json();
      fetchPeriodos();
    } catch (error) {
      console.error("Error al abrir periodo:", error);
    }
  };

  

  const renderButton = () => {
    if (selectedPeriodoId === null && periodos.length > 0) {
      return (
        <Button size='sm' colorScheme="blue" isDisabled>
          Seleccione un periodo
        </Button>
      );
    }
    const selectedPeriodo = periodos.find(periodo => periodo.id_periodo === selectedPeriodoId) ?? {
      id_periodo: 0,
      fecha_inicio: "",
      fecha_fin: "",
      estado: "",
    };

    if ((selectedPeriodo.estado === 'cerrado' && periodos[0].id_periodo === selectedPeriodoId) || periodos.length === 0 || !periodos) {
      
      return (
        <Button size='sm' onClick={handleOpen} colorScheme="blue">
          Abrir Periodo
        </Button>
      );
    }

    if (selectedPeriodo.estado === 'abierto' && periodos[0].id_periodo === selectedPeriodoId) {
      return (
        <Button size='sm' onClick={handleOpen} colorScheme="blue">
          Cerrar Periodo
        </Button>
      );
    }
  };
  return (
    <div>
      <span
        className={`absolute top-4 right-4 block cursor-pointer ${open ? "hidden" : "text-xl"}`}
        onClick={onClose}
      >
        <TbLayoutSidebarRightCollapseFilled />
      </span>
      <Slide direction="left" in={open}>
        <Fade in={open}>
          <div
            className={`sm:none duration-175 linear fixed !z-50 flex min-h-full flex-col bg-white pb-10 shadow-2xl shadow-white/5 transition-all dark:!bg-navy-800 dark:text-white md:!z-50 lg:!z-50 xl:!z-0 ${open ? "translate-x-0  w-[300px]" : "-translate-x-20"}`}
          >
            <span
              className={`absolute top-4 right-4 block cursor-pointer ${open ? "text-xl" : "text-xl"}`}
              onClick={onClose}
            >
              <TbLayoutSidebarLeftCollapse />
            </span>
            {open && (
              <>
                <div className={`mx-[56px] mt-[50px] flex items-center`}>
                  <div className="mt-1 ml-1 h-2.5 font-poppins text-[24px] font-bold uppercase text-navy-700 dark:text-white">
                    AVISO<span className="font-medium">DE</span>COBRO
                  </div>
                </div>
                <div className="mt-[58px] mb-3 h-px bg-gray-300 dark:bg-white/30" />
                <div className={`mx-[10px] flex items-center`}>
                  <div className="max-w-sm mx-auto">
                    <form className="max-w-sm mx-auto">
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Periodo</label>
                      <div className="flex">
                        <select
                          className="mr-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          value={selectedPeriodoId || ""}
                          onChange={handlePeriodoChange}
                        >
                          {optionsMeses}
                        </select>
                        <select className="mr-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                          {optionsAnios}
                        </select>
                      </div>
                      <div className="mt-2">
                        <Popover isOpen={isOpen} onClose={handleClose}>
                          <PopoverTrigger>
                            <div>{renderButton()}</div>
                          </PopoverTrigger>
                          <Portal>
                            <PopoverContent zIndex="popover">
                              <PopoverArrow />
                              <PopoverCloseButton />
                              <PopoverHeader>Confirmación</PopoverHeader>
                              <PopoverBody>
                                <p>¿Está seguro de que quiere {periodos.length > 0 && periodos[0].estado === 'cerrado' && periodos[1].estado === 'cerrado' ? 'abrir' : 'cerrar'} el periodo?</p>
                              </PopoverBody>
                              <PopoverFooter justifyContent="flex-end">
                                <Button colorScheme="blue" onClick={() => { handleConfirmAction(); handleClose(); }} mr={3}>Confirmar</Button>
                                <Button variant="outline" onClick={handleClose}>Cancelar</Button>
                              </PopoverFooter>
                            </PopoverContent>
                          </Portal>
                        </Popover>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="mt-3 mb-7 h-px bg-gray-300 dark:bg-white/30" />
                <ul className="mb-auto pt-1">
                  <Links routes={routes} open={props.open} />
                </ul>
              </>
            )}
          </div>
        </Fade>
      </Slide>
    </div>
  );
};

export default Sidebar;