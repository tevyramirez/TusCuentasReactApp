import React, { useState, useEffect } from 'react';
import { Box, Flex, Text, Button, Select, Input } from '@chakra-ui/react';
import { FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/react';
import Card from 'components/card/';
import axios from 'axios';
import { API_ADDRESS } from '../../../../variables/apiSettings';
import { useToast } from '@chakra-ui/react';
import { validateRut } from "@cristiansantana/chile-rut";

interface AddPropietarioProps {
  onGoBack: () => void,
  update: () => void;
}

const UserInterface: React.FC<AddPropietarioProps> = ({ onGoBack, update }) => {
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
    propietario: '',
    tipo_relacion: '',
  });
  const [unidades, setUnidades] = useState<any[]>([]);
  const [propietariosOptions, setPropietariosOptions] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [rutError, setRutError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [relacionesDisponibles, setRelacionesDisponibles] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API_ADDRESS + 'lotes-disponibles/');
        setUnidades(response.data);
      } catch (error) {
        console.error('Error al obtener los datos de las unidades:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const propietariosList = unidades.map((unidad: any) => ({
      value: unidad.lote.id_lote,
      label: unidad.lote.numero_unidad,
      relaciones: unidad.relaciones.map((rel: any) => rel.tipo_relacion),
    }));
    setPropietariosOptions(propietariosList);
  }, [unidades]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'rut') {
      if (!validateRut(value)) {
        setRutError('Ingrese un RUT válido.');
      } else {
        setRutError('');
      }
    }

    if (name === 'email') {
      // Simple email validation regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setEmailError('Ingrese un email válido.');
      } else {
        setEmailError('');
      }
    }

    setPropietario(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleChangeRelacion = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'loteId') {
      const selectedUnidad = propietariosOptions.find(option => option.value.toString() === value);
      const tiposRelacionExistentes = selectedUnidad ? selectedUnidad.relaciones : [];
      console.log("RelacionesExistentes",tiposRelacionExistentes)
      const tiposRelacionDisponibles = ['Dueño','Arrendatario','Corredor'].filter(tipo => !tiposRelacionExistentes.includes(tipo));
      console.log(tiposRelacionDisponibles)
      setRelacionesDisponibles(tiposRelacionDisponibles);
    }
    setRelacionLote(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredOptions = propietariosOptions.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async () => {
    if (rutError || emailError) {
      toast({
        title: 'Error',
        description: 'Corrija los errores en el formulario antes de enviar.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top'
      });
      return;
    }

    try {
      const response = await axios.post(API_ADDRESS + 'propietarios/', propietario);
      const propietarioId = response.data.id; // Obtener el ID del propietario creado
      const data = {
        propietario: propietarioId, // ID del propietario que deseas asignar al lote
        tipo_relacion: relacionLote.tipo_relacion, // Tipo de relación (propietario, arrendatario, corredor)
      };
      await axios.put(`${API_ADDRESS}asignar-relacion/${relacionLote.loteId}/`, data);
      toast({
        title: 'Éxito',
        description: 'Propietario creado y relación establecida con el lote.',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top'
      });
      onGoBack();
      update();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Hubo un problema al crear el propietario o al establecer la relación.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top'
      });
      console.error('Error al crear el propietario:', error);
    }
  };

  return (
    <Card p={5}>
      <div className="p-5">
        <Text fontSize="xl" fontWeight="bold" mb={4}>
          Información del usuario
        </Text>
        <Flex>
          <FormControl isInvalid={rutError !== ''} flex="1" m={4}>
            <FormLabel>RUT</FormLabel>
            <Input 
              onChange={handleChange} 
              name="rut" 
              type="text"
            />
            {rutError && <FormErrorMessage>{rutError}</FormErrorMessage>}
          </FormControl>
          <FormControl flex="1" m={4}>
            <FormLabel>Nombre</FormLabel>
            {propietario.razon_social ? (
              <p onClick={() => setPropietario(prevState => ({ ...prevState, nombre: prevState.razon_social }))}>
                {propietario.razon_social}
              </p>
            ) : (
              <Input onChange={handleChange} name="nombre" type="text" />
            )}
          </FormControl>
          <FormControl flex="1" m={4}>
            <FormLabel>Apellido</FormLabel>
            <Input onChange={handleChange} name="apellido" type="text" />
          </FormControl>
        </Flex>
        <Flex>
          <FormControl isInvalid={emailError !== ''} flex="1" m={4}>
            <FormLabel>E-mail</FormLabel>
            <Input onChange={handleChange} name="email" type="email" />
            {emailError && <FormErrorMessage>{emailError}</FormErrorMessage>}
          </FormControl>
          <FormControl flex="1" m={4}>
            <FormLabel>Número de Teléfono</FormLabel>
            <Input onChange={handleChange} name="numero_telefono" type="text" />
          </FormControl>
          <Box flex="1" m={4}></Box>
        </Flex>
        <Flex mt={7}>
          <Text fontSize="xl" fontWeight="bold" mt={4} mb={4}>
            Información de la unidad
          </Text>
        </Flex>
        <Flex mt={4}>
          <FormControl flex="1" m={2}>
            <Select onChange={handleChangeRelacion} name="loteId" value={relacionLote.loteId}>
              <option value="" disabled>
                Selecciona Unidad
              </option>
              {filteredOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl flex="1" m={2} isDisabled={!relacionLote.loteId}>
            <Select onChange={handleChangeRelacion} name="tipo_relacion" value={relacionLote.tipo_relacion}>
              <option value="" disabled>
                Selecciona Tipo de Propietario
              </option>
              {relacionesDisponibles.map(tipo => (
                <option key={tipo} value={tipo}>
                  {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                </option>
              ))}
            </Select>
          </FormControl>
        </Flex>
        <Flex mt={2}>
          <Box flex="1" m={2}></Box>
          <Box flex="1" m={2}></Box>
          <Box m={2}>
            <Button onClick={handleSubmit} colorScheme="blue">
              Agregar
            </Button>
            <Button
              onClick={() => {
                onGoBack();
                update();
              }}
              colorScheme="blue"
              m={2}
            >
              Volver
            </Button>
          </Box>
        </Flex>
      </div>
    </Card>
  );
};

export default UserInterface;
