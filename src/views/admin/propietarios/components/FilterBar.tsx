import React from 'react';
import Card from 'components/card/';
import CardMenu from "components/card/CardMenu";

interface FilterBarProps {
  onAddPropietario: () => void;
  onFilterChange: (filters: any) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ onAddPropietario, onFilterChange }) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ search: e.target.value });
  };

  const handleRazonSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ razonSocial: e.target.value });
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ email: e.target.value });
  };

  return (
    <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-1 lg:grid-cols-1 2xl:grid-cols-1 3xl:grid-cols-1 ">
      <Card extra="!flex-row flex-grow rounded-[20px] justify-end relative">
        <div className="ml-[18px] flex h-[90px] w-auto flex-row ">
          <input
            className="custom-input m-2"
            type="text"
            placeholder="Buscar por Nombre, Apellido o Rut"
            onChange={handleSearchChange}
          />
        </div>
        <div className="ml-[18px] flex h-[90px] w-auto flex-row ">
          <input
            className="custom-input m-2"
            type="text"
            placeholder="Buscar por Razon Social"
            onChange={handleRazonSocialChange}
          />
        </div>
        <div className="ml-[18px] flex h-[90px] w-auto flex-row ">
          <input
            className="custom-input m-2"
            type="text"
            placeholder="Buscar por Email"
            onChange={handleEmailChange}
          />
        </div>
        <div className="ml-[18px] flex h-[90px] w-auto flex-row items-center">
          <a
            target="blank"
            onClick={onAddPropietario}
            className="btn-nuevo-pago px-full linear flex cursor-pointer items-center justify-center rounded-xl bg-brand-500 py-[11px] font-bold text-white transition duration-200 hover:bg-brand-600 hover:text-white active:bg-brand-700 dark:bg-brand-400 dark:hover:bg-brand-300 dark:active:bg-brand-200"
          >
            + Propietario
          </a>
        </div>
        <div className="ml-[18px] flex h-[90px] w-auto flex-row items-center me-3">
          <CardMenu />
        </div>
      </Card>
    </div>
  );
};

export default FilterBar;
