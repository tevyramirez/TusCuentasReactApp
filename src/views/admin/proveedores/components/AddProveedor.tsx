import React, { useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Button,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  useToast,
  useDisclosure,
  VStack,
  HStack,
  Divider,
  Icon,
} from '@chakra-ui/react';
import Card from 'components/card/';
import { MdPersonAdd, MdArrowBack } from 'react-icons/md';

interface AddProveedorProps {
  onGoBack: () => void;
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

const AddProveedor: React.FC<AddProveedorProps> = ({ onGoBack, update }) => {
  const [proveedor, setProveedor] = useState<Proveedor>({
    rut: '',
    nombre: '',
    apellido: '',
    telefono: '',
    email: '',
    servicio: '',
  });

  const [errors, setErrors] = useState<Partial<Proveedor>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProveedor((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof Proveedor]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Partial<Proveedor> = {};
    if (!proveedor.rut) newErrors.rut = 'El RUT es obligatorio';
    if (!proveedor.nombre) newErrors.nombre = 'El nombre es obligatorio';
    if (!proveedor.apellido) newErrors.apellido = 'El apellido es obligatorio';
    if (!proveedor.telefono) newErrors.telefono = 'El teléfono es obligatorio';
    if (proveedor.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(proveedor.email)) {
      newErrors.email = 'El email no es válido';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validate()) {
      setIsSubmitting(true);
      try {
        // Aquí iría la lógica para enviar los datos al servidor
        // Por ahora, simularemos una operación exitosa
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        toast({
          title: 'Éxito',
          description: 'Proveedor creado exitosamente.',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top',
        });
        setIsSubmitting(false);
        onOpen(); // Abre el diálogo de confirmación
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
        setIsSubmitting(false);
      }
    }
  };

  const handleAddAnother = () => {
    setProveedor({
      rut: '',
      nombre: '',
      apellido: '',
      telefono: '',
      email: '',
      servicio: '',
    });
    onClose();
  };

  return (
    <Card>
      <VStack spacing={6} align="stretch" p={6}>
        <Text fontSize="2xl" fontWeight="bold">
          Información del proveedor
        </Text>
        <Divider />
        <Flex direction={{ base: 'column', md: 'row' }} gap={4}>
          <FormControl isInvalid={!!errors.rut}>
            <FormLabel>RUT</FormLabel>
            <Input name="rut" value={proveedor.rut} onChange={handleChange} placeholder="Ingrese RUT" />
            <FormErrorMessage>{errors.rut}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.nombre}>
            <FormLabel>Nombre</FormLabel>
            <Input name="nombre" value={proveedor.nombre} onChange={handleChange} placeholder="Ingrese nombre" />
            <FormErrorMessage>{errors.nombre}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.apellido}>
            <FormLabel>Apellido</FormLabel>
            <Input name="apellido" value={proveedor.apellido} onChange={handleChange} placeholder="Ingrese apellido" />
            <FormErrorMessage>{errors.apellido}</FormErrorMessage>
          </FormControl>
        </Flex>
        <Flex direction={{ base: 'column', md: 'row' }} gap={4}>
          <FormControl isInvalid={!!errors.email}>
            <FormLabel>E-mail (opcional)</FormLabel>
            <Input name="email" value={proveedor.email} onChange={handleChange} placeholder="Ingrese email" />
            <FormErrorMessage>{errors.email}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.telefono}>
            <FormLabel>Número Telefónico</FormLabel>
            <Input name="telefono" value={proveedor.telefono} onChange={handleChange} placeholder="Ingrese teléfono" />
            <FormErrorMessage>{errors.telefono}</FormErrorMessage>
          </FormControl>
        </Flex>
        <Text fontSize="xl" fontWeight="bold">
          Información del servicio
        </Text>
        <Divider />
        <FormControl>
          <FormLabel>Descripción</FormLabel>
          <Input name="servicio" value={proveedor.servicio} onChange={handleChange} placeholder="Describa el servicio" />
        </FormControl>
        <HStack justifyContent="flex-end" spacing={4}>
          <Button
            leftIcon={<Icon as={MdArrowBack} />}
            onClick={onGoBack}
            variant="outline"
          >
            Volver
          </Button>
          <Button
            leftIcon={<Icon as={MdPersonAdd} />}
            onClick={handleSubmit}
            isLoading={isSubmitting}
            loadingText="Agregando..."
            colorScheme="blue"
          >
            Agregar
          </Button>
        </HStack>
      </VStack>

      {isOpen && (
        <Box
          position="fixed"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg="rgba(0,0,0,0.5)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex={9999}
        >
          <Box bg="white" p={6} borderRadius="md" maxWidth="400px" width="90%">
            <Text mb={4}>Proveedor agregado exitosamente. ¿Desea agregar otro proveedor?</Text>
            <HStack justifyContent="flex-end" spacing={4}>
              <Button onClick={handleAddAnother}>Agregar otro</Button>
              <Button onClick={() => { onGoBack(); update(); }}>Volver a la tabla</Button>
            </HStack>
          </Box>
        </Box>
      )}
    </Card>
  );
};

export default AddProveedor;