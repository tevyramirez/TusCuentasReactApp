import React, { useState, useEffect } from "react";
import { TbLayoutSidebarLeftCollapse, TbLayoutSidebarRightCollapseFilled } from "react-icons/tb";
import Links from "./components/Links";
import routes from "routes";
import axios from 'axios';
import { API_ADDRESS } from "variables/apiSettings";
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

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  const fetchPeriodos = async () => {
    try {
      const response = await fetch(API_ADDRESS+"periodo/");
      const data = await response.json();

      const periodosAbiertos = data.filter((periodo: Periodo) => periodo.estado === "abierto");
      const periodosCerrados = data.filter((periodo: Periodo) => periodo.estado === "cerrado");
      const sortedPeriodosCerrados = periodosCerrados.sort((a: Periodo, b: Periodo) => new Date(b.fecha_inicio).getTime() - new Date(a.fecha_inicio).getTime());

      if (periodosAbiertos.length > 0) {
        sortedPeriodosCerrados.unshift(periodosAbiertos[0]);
      }

      setPeriodos(sortedPeriodosCerrados);
      if (sortedPeriodosCerrados.length > 0) {
        setSelectedPeriodoId(sortedPeriodosCerrados[0].id_periodo);
      }
    } catch (error) {
      console.error("Error fetching periodos:", error);
    }
  };

  useEffect(() => {
    fetchPeriodos();
  }, []);

  const optionsMeses = [...new Set(periodos.map(periodo => new Date(periodo.fecha_inicio).getMonth()))].map(month => {
    return <option key={month} value={month + 1}>{new Date(0, month).toLocaleString('default', { month: 'long' })}</option>;
  });

  const uniqueYears = [...new Set(periodos.map(periodo => new Date(periodo.fecha_inicio).getFullYear()))];
  const optionsAnios = uniqueYears.map(year => {
    return <option key={year} value={year}>{year}</option>;
  });

  const handlePeriodoClick = () => {
    if (periodos.length > 0) {
      const estado = periodos[0].estado;
      setIsOpen(true);
    }
  };

  const abrirPeriodo = async () => {
    try {
      const response = await fetch(API_ADDRESS+"periodo/abrir/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
      });
      const data = await response.json();
      console.log("Periodo abierto:", data);
      // Actualizar la lista de periodos después de abrir uno nuevo
      fetchPeriodos();
    } catch (error) {
      console.error("Error al abrir periodo:", error);
    }
  };

  const cerrarPeriodo = async (periodoId: number) => {
    try {
      const response = await fetch(`${API_ADDRESS}periodo/${periodoId}/cerrar/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
      });
      const data = await response.json();
      console.log("Periodo cerrado:", data);
      // Actualizar la lista de periodos después de cerrar el periodo
      fetchPeriodos();
    } catch (error) {
      console.error("Error al cerrar periodo:", error);
    }
  };

  const handleConfirmAction = () => {
    if (periodos.length > 0) {
      const estado = periodos[0].estado;
      if (estado === "cerrado") {
        abrirPeriodo();
      } else {
        cerrarPeriodo(periodos[0].id_periodo);
      }
    }
    handleClose();
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
            className={`sm:none duration-175 linear fixed !z-50 flex min-h-full flex-col bg-white pb-10 shadow-2xl shadow-white/5 transition-all dark:!bg-navy-800 dark:text-white md:!z-50 lg:!z-50 xl:!z-0 ${open ? "translate-x-0" : "-translate-x-20"}`}
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
                        <select className="mr-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                          {optionsMeses}
                        </select>
                        <select className="mr-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                          {optionsAnios}
                        </select>
                      </div>
                      <div className="mt-2">
                        <Popover isOpen={isOpen} onClose={handleClose}>
                          <PopoverTrigger>
                            <Button
                              size='sm'
                              onClick={handleOpen}
                              colorScheme="blue"
                            >
                              {periodos.length > 0 && periodos[0].estado === 'cerrado' && periodos[1].estado === 'cerrado' ? 'Abrir Periodo' : 'Cerrar Periodo'}
                            </Button>
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
