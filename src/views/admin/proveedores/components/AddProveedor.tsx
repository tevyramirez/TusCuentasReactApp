import React, { useState, useEffect } from 'react';
import { Box, Flex, Text, Select, Button, Input, FormControl, FormLabel, FormErrorMessage, useToast, useDisclosure } from '@chakra-ui/react';
import Card from 'components/card/';
import InputField from 'components/fields/InputField';
import axios from 'axios';
import { API_ADDRESS } from 'variables/apiSettings';

interface AddProveedorProps {
  onGoBack: () => void,
  update: () => void;
}

interface Proveedor {
  rut: string;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  servicio: string;
}

const UserInterface: React.FC<AddProveedorProps> = ({ onGoBack, update }) => {
  const [proveedor, setProveedor] = useState<Proveedor>({
    nombre: '',
    apellido: '',
    rut: '',
    email: '',
    telefono: '',
    servicio: '',
  });

  
  const [errors, setErrors] = useState({
    rut: '',
    nombre: '',
    apellido: '',
    telefono: '',
    email: '',
    servicio: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProveedor(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validate = () => {
    let valid = true;
    let newErrors = { rut: '', nombre: '', apellido: '', telefono: '', email: '', servicio:'' };

    if (!proveedor.rut) {
      newErrors.rut = 'El RUT es obligatorio';
      valid = false;
    }

    if (!proveedor.nombre) {
      newErrors.nombre = 'El nombre es obligatorio';
      valid = false;
    }

    if (!proveedor.apellido) {
      newErrors.apellido = 'El apellido es obligatorio';
      valid = false;
    }

    if (!proveedor.telefono) {
      newErrors.telefono = 'El teléfono es obligatorio';
      valid = false;
    }

    if (proveedor.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(proveedor.email)) {
      newErrors.email = 'El email no es válido';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    if (validate()) {
      try {
        const dataToSend = {
          rut: proveedor.rut,
          nombre: proveedor.nombre,
          apellido: proveedor.apellido,
          telefono: proveedor.telefono,
          email: proveedor.email,
          servicio: proveedor.servicio,
        };  

        const response = await axios.post(API_ADDRESS + 'proveedores/', dataToSend);
        console.log('Proveedor creado:', response.data);
        toast({
          title: 'Éxito',
          description: 'Proveedor creado exitosamente.',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top',
        });
        setIsSubmitted(true);
        onOpen();
      } catch (error) {
        console.error('Error al crear el proveedor:', error);
        toast({
          title: 'Error',
          description: 'Error al momento de agregar el proveedor',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top',
        });
      }
    }
  };

  const handleAddAnother = () => {
    setIsSubmitted(false);
    setProveedor({
      nombre: '',
      apellido: '',
      rut: '',
      email: '',
      telefono: '',
      servicio: '',
    });
    onClose();
  };

  const handleGoBack = () => {
    onGoBack();
    update();
  };



  return (
    <Card>
      <Text className="m-3" fontSize="xl" fontWeight="bold" mb={4}>
        Información del proveedor
      </Text>
      <Flex m={4}>
        <Box flex="1" m={4}>
          <FormControl isInvalid={!!errors.rut}>
            <FormLabel>RUT</FormLabel>
            <Input name="rut" value={proveedor.rut} onChange={handleChange} />
            <FormErrorMessage>{errors.rut}</FormErrorMessage>
          </FormControl>
        </Box>
        <Box flex="1" m={4}>
          <FormControl isInvalid={!!errors.nombre}>
            <FormLabel>Nombre</FormLabel>
            <Input name="nombre" value={proveedor.nombre} onChange={handleChange} />
            <FormErrorMessage>{errors.nombre}</FormErrorMessage>
          </FormControl>
        </Box>
        <Box flex="1" m={4}>
          <FormControl isInvalid={!!errors.apellido}>
            <FormLabel>Apellido</FormLabel>
            <Input name="apellido" value={proveedor.apellido} onChange={handleChange} />
            <FormErrorMessage>{errors.apellido}</FormErrorMessage>
          </FormControl>
        </Box>
      </Flex>
      <Flex m={4}>
        <Box flex="1" m={4}>
          <FormControl isInvalid={!!errors.email}>
            <FormLabel>E-mail (opcional)</FormLabel>
            <Input name="email" value={proveedor.email} onChange={handleChange} />
            <FormErrorMessage>{errors.email}</FormErrorMessage>
          </FormControl>
        </Box>
        <Box flex="1" m={4}>
          <FormControl isInvalid={!!errors.telefono}>
            <FormLabel>Número Telefónico</FormLabel>
            <Input name="telefono" value={proveedor.telefono} onChange={handleChange} />
            <FormErrorMessage>{errors.telefono}</FormErrorMessage>
          </FormControl>
        </Box>
      </Flex>
      <Text className="m-3" fontSize="xl" fontWeight="bold" mb={4}>
        Información del servicio
      </Text>
      <Flex m={4}>
       
        <Box flex="1" m={4}>
        <FormControl isInvalid={!!errors.telefono}>
            <FormLabel>Descripción</FormLabel>
            <Input name="servicio" value={proveedor.servicio} onChange={handleChange} />
            <FormErrorMessage>{errors.servicio}</FormErrorMessage>
          </FormControl>
        </Box>
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
            onClick={handleGoBack}
            className="btn-configurar-cuenta m-3 px-full linear flex cursor-pointer items-center justify-center rounded-xl bg-brand-500 py-[11px] font-bold text-white transition duration-200 hover:bg-brand-600 hover:text-white active:bg-brand-700 dark:bg-brand-400 dark:hover:bg-brand-300 dark:active:bg-brand-200"
          >
            Volver
          </Button>
        </div>
      </Flex>

      {isSubmitted && (
        <Box p={4} borderWidth={1} borderRadius="md" boxShadow="md" bg="white" mt={4}>
          <Text mb={4}>Proveedor agregado exitosamente. ¿Desea agregar otro proveedor?</Text>
          <Button
            onClick={handleAddAnother}
            className="btn-configurar-cuenta m-3 px-full linear flex cursor-pointer items-center justify-center rounded-xl bg-brand-500 py-[11px] font-bold text-white transition duration-200 hover:bg-brand-600 hover:text-white active:bg-brand-700 dark:bg-brand-400 dark:hover:bg-brand-300 dark:active:bg-brand-200"
          >
            Agregar otro proveedor
          </Button>
          <Button
            onClick={handleGoBack}
            className="btn-configurar-cuenta m-3 px-full linear flex cursor-pointer items-center justify-center rounded-xl bg-brand-500 py-[11px] font-bold text-white transition duration-200 hover:bg-brand-600 hover:text-white active:bg-brand-700 dark:bg-brand-400 dark:hover:bg-brand-300 dark:active:bg-brand-200"
          >
            Regresar a la tabla
          </Button>
        </Box>
      )}
    </Card>
  );
};

export default UserInterface;
