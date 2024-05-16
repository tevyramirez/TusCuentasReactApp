import { useState, useEffect } from "react";
import { TbLayoutSidebarLeftCollapse } from "react-icons/tb";
import Links from "./components/Links";
import routes from "routes";
import axios from 'axios';
import Popover from "components/popover";

interface Periodo {
  id_periodo: number;
  fecha_inicio: string;
  fecha_fin: string;
  estado: string;
}


const Sidebar = (props: {
  open: boolean;
  onClose: React.MouseEventHandler<HTMLSpanElement>;
}) => {
  const { open, onClose } = props;
  const [periodos, setPeriodos] = useState<Periodo[]>([]);
  const [selectedPeriodoId, setSelectedPeriodoId] = useState<number | null>(null);
  const [openConfirmationPopover, setOpenConfirmationPopover] = useState<boolean>(false);

  const fetchPeriodos = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/periodo/");
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
      if (estado === "cerrado") {
        setOpenConfirmationPopover(true);
      } else {
        setOpenConfirmationPopover(true);
      }
    }
  };

  const abrirPeriodo = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/periodo/abrir/", {
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
      const response = await fetch(`http://127.0.0.1:8000/api/periodo/${periodoId}/cerrar/`, {
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
    setOpenConfirmationPopover(false);
  };
  return (
    <div>
      <div className={`${open ? "hidden" : ""}`}>
        <span
          className={`absolute top-4 right-4 block cursor-pointer ${open ? "text-md" : "text-xl"
            }`}
          onClick={onClose}
        >
          <TbLayoutSidebarLeftCollapse />
        </span>
      </div>
      <div
        className={`sm:none duration-175 linear fixed !z-50 flex min-h-full flex-col bg-white pb-10 shadow-2xl shadow-white/5 transition-all dark:!bg-navy-800 dark:text-white md:!z-50 lg:!z-50 xl:!z-0 ${open ? "translate-x-0" : "-translate-x-20"
          }`}
      >
        <span
          className={`absolute top-4 right-4 block cursor-pointer ${open ? "text-xl" : "text-sm"
            }`}
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
                    <Popover
  trigger={
    <button
      type="button"
      onClick={handlePeriodoClick}
      className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-1 text-start"
    >
      {periodos.length > 0 && periodos[0].estado === "cerrado" && periodos[1].estado === "cerrado" ? "Abrir Periodo" : "Cerrar Periodo"}
    </button>
  }
  extra="z-auto"
  content={
    <div >
      <p>¿Está seguro de que quiere {periodos.length > 0 && periodos[0].estado === "cerrado" && periodos[1].estado === "cerrado" ? "abrir" : "cerrar"} el periodo?</p>
      <div className="flex justify-end mt-4">
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 mr-2" onClick={handleConfirmAction}>Confirmar</button>
        <button className="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4" onClick={() => setOpenConfirmationPopover(false)}>Cancelar</button>
      </div>
    </div>
  }
/>

        
  
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
        {/* Nav item */}
        {/* Nav item end */}

      </div>
      
    </div>
  );
};

export default Sidebar;
