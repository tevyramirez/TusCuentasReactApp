import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Text,
  Button,
  Select,
  Input,
  FormControl,
  FormErrorMessage,
  FormLabel,
  useToast,
  VStack,
  HStack,
  Divider,
  Icon,
} from '@chakra-ui/react';
import Card from 'components/card/';
import { MdPersonAdd, MdArrowBack } from 'react-icons/md';
import { validateRut } from "@cristiansantana/chile-rut";
import { guardarPropietario } from 'views/admin/propietarios/api/propietariosApi';
interface AddPropietarioProps {
  onGoBack: () => void;
  update: () => void;
}

const AddPropietario: React.FC<AddPropietarioProps> = ({ onGoBack, update }) => {
  const toast = useToast();
  const [propietario, setPropietario] = useState({
    razon_social: '',
    nombre: '',
    apellido: '',
    rut: '',
    email: '',
    numero_telefono: '',
  });
  const [relacionLote, setRelacionLote] = useState({
    loteId: '',
    tipo_relacion: '',
  });
  const [unidades, setUnidades] = useState<any[]>([]);
  const [relacionesDisponibles, setRelacionesDisponibles] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Fetch unidades data
    // This is a placeholder. Replace with actual API call.
    setUnidades([
      { id: '1', numero_unidad: 'Unidad 1' },
      { id: '2', numero_unidad: 'Unidad 2' },
    ]);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name in propietario) {
      setPropietario(prev => ({ ...prev, [name]: value }));
    } else if (name in relacionLote) {
      setRelacionLote(prev => ({ ...prev, [name]: value }));
      if (name === 'loteId') {
        // Update relacionesDisponibles based on selected unit
        setRelacionesDisponibles(['Dueño', 'Arrendatario', 'Corredor']);
      }
    }
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!validateRut(propietario.rut)) newErrors.rut = 'RUT inválido';
    if (!propietario.nombre) newErrors.nombre = 'El nombre es obligatorio';
    if (!propietario.apellido) newErrors.apellido = 'El apellido es obligatorio';
    if (!propietario.numero_telefono) newErrors.numero_telefono = 'El teléfono es obligatorio';
    if (propietario.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(propietario.email)) {
      newErrors.email = 'Email inválido';
    }
    if (!relacionLote.loteId) newErrors.loteId = 'Debe seleccionar una unidad';
    if (!relacionLote.tipo_relacion) newErrors.tipo_relacion = 'Debe seleccionar un tipo de relación';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validate()) {
      setIsSubmitting(true);
      console.log('Propietario:', propietario);
      console.log('Relación con lote:', relacionLote);
      try {
        guardarPropietario(propietario);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        toast({
          title: 'Éxito',
          description: 'Propietario creado y relación establecida con el lote.',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top',
        });
        setIsSubmitting(false);
        if (window.confirm('¿Desea agregar otro propietario?')) {
          setPropietario({
            razon_social: '',
            nombre: '',
            apellido: '',
            rut: '',
            email: '',
            numero_telefono: '',
          });
          setRelacionLote({
            loteId: '',
            tipo_relacion: '',
          });
        } else {
          onGoBack();
          update();
        }
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: 'Error',
          description: 'Hubo un problema al crear el propietario o al establecer la relación.',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top',
        });
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Card>
      <VStack spacing={6} align="stretch" p={6}>
        <Text fontSize="2xl" fontWeight="bold">
          Información del propietario
        </Text>
        <Divider />
        <Flex direction={{ base: 'column', md: 'row' }} gap={4}>
          <FormControl isInvalid={!!errors.rut}>
            <FormLabel>RUT</FormLabel>
            <Input name="rut" value={propietario.rut} onChange={handleChange} placeholder="Ingrese RUT" />
            <FormErrorMessage>{errors.rut}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.nombre}>
            <FormLabel>Nombre</FormLabel>
            <Input name="nombre" value={propietario.nombre} onChange={handleChange} placeholder="Ingrese nombre" />
            <FormErrorMessage>{errors.nombre}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.apellido}>
            <FormLabel>Apellido</FormLabel>
            <Input name="apellido" value={propietario.apellido} onChange={handleChange} placeholder="Ingrese apellido" />
            <FormErrorMessage>{errors.apellido}</FormErrorMessage>
          </FormControl>
        </Flex>
        <Flex direction={{ base: 'column', md: 'row' }} gap={4}>
          <FormControl isInvalid={!!errors.email}>
            <FormLabel>E-mail</FormLabel>
            <Input name="email" value={propietario.email} onChange={handleChange} placeholder="Ingrese email" />
            <FormErrorMessage>{errors.email}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.numero_telefono}>
            <FormLabel>Número de Teléfono</FormLabel>
            <Input name="numero_telefono" value={propietario.numero_telefono} onChange={handleChange} placeholder="Ingrese teléfono" />
            <FormErrorMessage>{errors.numero_telefono}</FormErrorMessage>
          </FormControl>
        </Flex>
        <Text fontSize="xl" fontWeight="bold">
          Información de la unidad
        </Text>
        <Divider />
        <Flex direction={{ base: 'column', md: 'row' }} gap={4}>
          <FormControl isInvalid={!!errors.loteId}>
            <FormLabel>Unidad</FormLabel>
            <Select name="loteId" value={relacionLote.loteId} onChange={handleChange} placeholder="Selecciona Unidad">
              {unidades.map(unidad => (
                <option key={unidad.id} value={unidad.id}>
                  {unidad.numero_unidad}
                </option>
              ))}
            </Select>
            <FormErrorMessage>{errors.loteId}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.tipo_relacion}>
            <FormLabel>Tipo de Relación</FormLabel>
            <Select
              name="tipo_relacion"
              value={relacionLote.tipo_relacion}
              onChange={handleChange}
              placeholder="Selecciona Tipo de Relación"
              isDisabled={!relacionLote.loteId}
            >
              {relacionesDisponibles.map(tipo => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </Select>
            <FormErrorMessage>{errors.tipo_relacion}</FormErrorMessage>
          </FormControl>
        </Flex>
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
    </Card>
  );
};

export default AddPropietario;