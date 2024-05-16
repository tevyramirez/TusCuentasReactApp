import React from 'react';
import { Box, Flex, Input, Text, Select, Button, FormControl, FormLabel } from '@chakra-ui/react';
import Card from 'components/card/';
import InputField from 'components/fields/InputField'


interface AddLoteProps {
  onGoBack: () => void;
}

const UserInterface: React.FC<AddLoteProps> = ({ onGoBack }) => {
  return (
    <Card >
      <Text className="m-3" fontSize="xl" fontWeight="bold" mb={4}>
        Información del usuario
      </Text>
      <Flex m={4}>
        <Box m={4}>

          <InputField
            id="email"
            label="Correo"
            extra="extra information"
            placeholder="Email"
            variant="standard"
          />
        </Box>
        <Box m={4}>

          <InputField
            id="nombre"
            label="Nombre"
            extra="extra information"
            placeholder="Nombre"
            variant="standard"
          />
        </Box>
        <Box m={4}>
          <InputField
            id="nombre"
            label="Apellido"
            extra="extra information"
            placeholder="Apellido"
            variant="standard"
          />
        </Box>
       
      </Flex>
      <Flex>
      
        <Box m={4}>
          <InputField
            id="rut"
            label="RUT"
            extra="extra information"
            placeholder="RUT"
            variant="standard"
          />
        </Box>
        <Box m={4}>
          <InputField
            id="direccion"
            label="Direccion"
            extra="extra information"
            placeholder="Direccion"
            variant="standard"
          />
        </Box>
        <Box m={4}>
          <InputField
            id="direccion"
            label="Teléfono"
            extra="extra information"
            placeholder="Teléfono"
            variant="standard"
          />
        </Box>

      </Flex>

      <Text className="m-3" fontSize="xl" fontWeight="bold" mb={4}>
        Información de la unidad
      </Text>
      <Flex m={4}>
        <Box m={4}>
          <InputField
            id="Unidad"
            label="Unidad"
            extra="extra information"
            placeholder="Unidad"
            variant="standard"
          />
        </Box>
        <Box m={4}>
          <Text m={4}>¿A cargo de la unidad?</Text>
          <Select placeholder="Selecciona">
            <option value="No">No</option>
            <option value="Si">Si</option>
          </Select>
        </Box>
      </Flex>

      <Flex>
        <div className="ml-[18px] flex h-[90px] w-auto flex-row items-center">
          <a
            target="blank"
            onClick={onGoBack}
            className=" btn-configurar-cuenta px-full linear flex cursor-pointer items-center justify-center rounded-xl bg-brand-500 py-[11px] font-bold text-white transition duration-200 hover:bg-brand-600 hover:text-white active:bg-brand-700 dark:bg-brand-400 dark:hover:bg-brand-300 dark:active:bg-brand-200"
          >
            Volver
          </a>
        </div>
      </Flex>
    </Card>
  );
};

export default UserInterface;