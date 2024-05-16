import React from 'react';
import Card from 'components/card/';
import CardMenu from "components/card/CardMenu";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure
} from "@chakra-ui/react";

interface FilterBarProps {
  onAddPropietario: () => void;
}

const FilterBar : React.FC<FilterBarProps> = ({ onAddPropietario }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  // Función para manejar cambios en los selectores
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>, type: string) => {
    // Lógica para manejar cambios en los selectores
    console.log(`Seleccionado ${type}: ${e.target.value}`);
  };

  return (
    <>
    
    <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-1 lg:grid-cols-1 2xl:grid-cols-1 3xl:grid-cols-1 ">
      <Card extra="!flex-row flex-grow rounded-[20px] justify-end relative">
        <div className="ml-[18px] flex h-[90px] w-auto flex-row ">

          {/* Input con Placeholder */}
          <input
            className="custom-input m-2"
            type="text"
            placeholder="Ej: A201"
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
            onClick={onAddPropietario}
            className=" btn-nuevo-pago px-full linear flex cursor-pointer items-center justify-center rounded-xl bg-brand-500 py-[11px] font-bold text-white transition duration-200 hover:bg-brand-600 hover:text-white active:bg-brand-700 dark:bg-brand-400 dark:hover:bg-brand-300 dark:active:bg-brand-200"
          >
            + Proveedor
          </a>
        </div>

        <div className="ml-[18px] flex h-[90px] w-auto flex-row items-center me-3">
          <CardMenu />
        </div>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Modal Title</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
            
            </ModalBody>

            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={onClose}>
                Close
              </Button>
              <Button variant='ghost'>Secondary Action</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Card>
    </div>
    </>
  );
};

export default FilterBar;