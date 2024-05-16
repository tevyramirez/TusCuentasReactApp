import React, { useState } from 'react';
import { Box, Flex, Text, Select, Button, Input, FormControl, FormLabel } from '@chakra-ui/react';
import Card from 'components/card/';
import InputField from 'components/fields/InputField'
import axios from 'axios'

interface AddPropietarioProps {
  onGoBack: () => void,
  update: () => void;
  
}



const UserInterface: React.FC<AddPropietarioProps> = ({ onGoBack, update }) => {
  const [propietario, setPropietario] = useState({
    nombre: '',
    apellido: '',
    rut: '',
    email: '',
    numero_telefono: '',
    alicuota: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    console.log("Hola", name, value)
    setPropietario(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/proveedores/', propietario);
      console.log('Propietario creado:', response.data);
      // Aquí podrías redirigir al usuario a otra página o realizar alguna otra acción después de crear el propietario.
    } catch (error) {
      console.error('Error al crear el propietario:', error);
    }
  };

  return (
    <Card >
      <Text className="m-3" fontSize="xl" fontWeight="bold" mb={4}>
        Información del proveedor
      </Text>
      <Flex m={4}>
        <Box flex="1" m={4} >
          <Text fontSize="s" fontWeight="thin" mb={4}>
            RUT
          </Text>

          <input onChange={handleChange} name="rut" type="text" className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
          </input>
        </Box>
        <Box flex="1" m={4} >
          <Text fontSize="s" fontWeight="thin" mb={4}>
            Nombre
          </Text>

          <input onChange={handleChange} name="nombre" type="text" className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
          </input>
        </Box>
        <Box flex="1" m={4} >
          <Text fontSize="s" fontWeight="thin" mb={4}>
            Apellido
          </Text>

          <input onChange={handleChange} name="apellido" type="text" className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
          </input>
        </Box>
        

      </Flex>
      <Flex m={4}>

        <Box flex="1" m={4} >
          <Text fontSize="s" fontWeight="thin" mb={4}>
            E-mail (opcional)
          </Text>

          <input onChange={handleChange} name="email" type="text" className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
          </input>
        </Box>
        <Box flex="1" m={4} >
          <Text fontSize="s" fontWeight="thin" mb={4}>
            Numero Telefónico
          </Text>

          <input onChange={handleChange} name="numero_telefono" type="text" className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
          </input>
        </Box>
        <Box flex="1" m={4} >
          {/* <Text fontSize="s" fontWeight="thin" mb={4}>
            Alicuota
          </Text>

          <input onChange={handleChange} name="alicuota" type="text" className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
          </input> */}
        </Box>

      </Flex>

      <Text className="m-3" fontSize="xl" fontWeight="bold" mb={4}>
        Información del servicio
      </Text>
      <Flex m={2}>
        <Box m={2}>
          <InputField
            id="Descripcion"
            label="Descripcion"
            extra="extra information"
            placeholder="Descripcion"
            variant="standard"
          />
        </Box>
      {/*   <Box m={4}>
          <Text m={4}>Tipo de Servicio</Text>
          <select className="select-dropdown m-2">
            <option value="No">No</option>
            <option value="Si">Si</option>
          </select>
        </Box> */}
      </Flex>

      <Flex>
        <div className="ml-[18px] flex h-[90px] w-auto flex-row items-center">
          <Button
            onClick={handleSubmit}
            className="btn-configurar-cuenta m-3 px-full linear flex cursor-pointer items-center justify-center rounded-xl bg-brand-500 py-[11px] font-bold text-white transition duration-200 hover:bg-brand-600 hover:text-white active:bg-brand-700 dark:bg-brand-400 dark:hover:bg-brand-300 dark:active:bg-brand-200"
          >
            Agregar
          </Button>
          <Button
            onClick={() => {
              onGoBack();
              update();
            }}
            className="btn-configurar-cuenta m-3 px-full linear flex cursor-pointer items-center justify-center rounded-xl bg-brand-500 py-[11px] font-bold text-white transition duration-200 hover:bg-brand-600 hover:text-white active:bg-brand-700 dark:bg-brand-400 dark:hover:bg-brand-300 dark:active:bg-brand-200"
          >
            Volver
          </Button>
        </div>
      </Flex>
    </Card>
  );
};

export default UserInterface;