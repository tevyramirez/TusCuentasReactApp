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
  const [telefonoError, setTelefonoError] = useState('');
  const [nombreError, setNombreError] = useState('');
  const [apellidoError, setApellidoError] = useState('');
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
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setEmailError('Ingrese un email válido.');
      } else {
        setEmailError('');
      }
    }

    if (name === 'numero_telefono') {
      const telefonoRegex = /^\d+$/;
      if (!telefonoRegex.test(value)) {
        setTelefonoError('Ingrese un número de teléfono válido.');
      } else if (value.length < 9 || value.length > 11) {
        setTelefonoError('El número de teléfono debe tener entre 9 y 11 dígitos.');
      } else {
        setTelefonoError('');
      }
    }

    if (name === 'nombre' || name === 'apellido') {
      const nombreApellidoRegex = /^[a-zA-Z\s]+$/;
      if (!nombreApellidoRegex.test(value)) {
        if (name === 'nombre') {
          setNombreError('El nombre no puede contener números ni caracteres especiales.');
        } else {
          setApellidoError('El apellido no puede contener números ni caracteres especiales.');
        }
      } else {
        if (name === 'nombre') {
          setNombreError('');
        } else {
          setApellidoError('');
        }
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
      const tiposRelacionDisponibles = ['Dueño', 'Arrendatario', 'Corredor'].filter(tipo => !tiposRelacionExistentes.includes(tipo));
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
    if (rutError || emailError || telefonoError || nombreError || apellidoError) {
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
          propietario: '',
          tipo_relacion: '',
        });
      } else {
        onGoBack();
        update();
      }
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
              value={propietario.rut}
              type="text"
            />
            {rutError && <FormErrorMessage>{rutError}</FormErrorMessage>}
          </FormControl>
          <FormControl isInvalid={nombreError !== ''} flex="1" m={4}>
            <FormLabel>Nombre</FormLabel>
            <Input onChange={handleChange} value={propietario.nombre} name="nombre" type="text" />
            {nombreError && <FormErrorMessage>{nombreError}</FormErrorMessage>}
          </FormControl>
          <FormControl isInvalid={apellidoError !== ''} flex="1" m={4}>
            <FormLabel>Apellido</FormLabel>
            <Input onChange={handleChange} name="apellido" value={propietario.apellido} type="text" />
            {apellidoError && <FormErrorMessage>{apellidoError}</FormErrorMessage>}
          </FormControl>
        </Flex>
        <Flex>
          <FormControl isInvalid={emailError !== ''} flex="1" m={4}>
            <FormLabel>E-mail</FormLabel>
            <Input onChange={handleChange} name="email" value={propietario.email} type="email" />
            {emailError && <FormErrorMessage>{emailError}</FormErrorMessage>}
          </FormControl>
          <FormControl isInvalid={telefonoError !== ''} flex="1" m={4}>
            <FormLabel>Número de Teléfono</FormLabel>
            <Input onChange={handleChange} name="numero_telefono" value={propietario.numero_telefono} type="text" />
            {telefonoError && <FormErrorMessage>{telefonoError}</FormErrorMessage>}
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
