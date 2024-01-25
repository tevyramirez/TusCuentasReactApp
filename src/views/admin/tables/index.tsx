import tableDataDevelopment from "./variables/tableDataDevelopment";
import DevelopmentTable from "./components/DevelopmentTable";
import Card from "components/card/"

const Tables = () => {
  return (
    <div>

      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-1 lg:grid-cols-1 2xl:grid-cols-1 3xl:grid-cols-1">
        <Card extra="!flex-row flex-grow items-center rounded-[20px]">
        <div className="ml-[18px] flex h-[90px] w-auto flex-row items-center">
            {/* Selector de Meses */}
            <select
              className="select-dropdown m-2"
   /*            value={selectedMonth}
              onChange={(e) => handleSelectChange(e, "month")} */
            >
              <option value="">Seleccionar Mes</option>
              <option value="1">Enero</option>
              <option value="2">Febrero</option>
              {/* ... Agrega los demás meses */}
            </select>

            {/* Selector de Años */}
            <select
              className="select-dropdown m-2" 
/*               value={selectedYear}
              onChange={(e) => handleSelectChange(e, "year")} */
            >
              <option value="">Seleccionar Año</option>
              <option value="2022">2022</option>
              <option value="2023">2023</option>
              {/* ... Agrega los demás años */}
            </select>

            {/* Selector de Estado (Moroso/Pagado) */}
            <select
              className="select-dropdown m-2"
/*               value={selectedStatus}
              onChange={(e) => handleSelectChange(e, "status")} */
            >
              <option value="">Seleccionar Estado</option>
              <option value="moroso">Moroso</option>
              <option value="pagado">Pagado</option>
            </select>

            {/* Input con Placeholder */}
            <input
              className="custom-input m-2"
              type="text"
              placeholder="Ej: A201"
/*               value={customInput}
              onChange={(e) => setCustomInput(e.target.value)} */
            />
          </div>

          <div className="ml-[18px] flex h-[90px] w-auto flex-row items-center">
            <a
              target="blank"

              className=" btn-configurar-cuenta px-full linear flex cursor-pointer items-center justify-center rounded-xl bg-brand-500 py-[11px] font-bold text-white transition duration-200 hover:bg-brand-600 hover:text-white active:bg-brand-700 dark:bg-brand-400 dark:hover:bg-brand-300 dark:active:bg-brand-200"
            >
            Buscar
            </a>
          </div>
          <div className="ml-[18px] flex h-[90px] w-auto flex-row items-center">
            <a
              target="blank"

              className=" btn-nuevo-pago  px-full linear flex cursor-pointer items-center justify-center rounded-xl bg-brand-500 py-[11px] font-bold text-white transition duration-200 hover:bg-brand-600 hover:text-white active:bg-brand-700 dark:bg-brand-400 dark:hover:bg-brand-300 dark:active:bg-brand-200"
            >
              Nuevo Pago
            </a>
          </div>

          <div className="h-50 ml-4 flex w-auto flex-col justify-center">
            <p className="font-dm text-sm font-medium text-gray-600"></p>
            <h4 className="text-xl font-bold text-navy-700 dark:text-white">

            </h4>
          </div>
        </Card>
      </div>
      <div className="mt-5 grid h-full grid-cols-1 gap-5 md:grid-cols-1">
        <DevelopmentTable tableData={tableDataDevelopment} />
      </div>


    </div>
  );
};

export default Tables;
