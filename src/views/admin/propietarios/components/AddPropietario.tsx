import React, { useState, useEffect } from 'react';
import { Box, Flex, Text, Button, Select } from '@chakra-ui/react';
import Card from 'components/card/';
import axios from 'axios';
import { API_ADDRESS } from '../../../../variables/apiSettings'
import { useToast } from '@chakra-ui/react'

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

  })

  const [unidades, setUnidades] = useState<any[]>([]);
  const [propietariosOptions, setPropietariosOptions] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API_ADDRESS + 'lotes/');
        setUnidades(response.data);
      } catch (error) {
        console.error('Error al obtener los datos de las unidades:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const propietariosList = unidades.map((unidad: any) => ({
      value: unidad.id_lote,
      label: unidad.numero_unidad,
    }));
    console.log("Lotes DATA")
    console.log(propietariosList)
    setPropietariosOptions(propietariosList);
  }, [unidades]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPropietario(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleChangeRelacion = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    console.log(name)
    console.log(value)
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

    try {
      const response = await axios.post(API_ADDRESS+'api/propietarios/', propietario);
      console.log('Propietario creado:', response.data);
      // Aquí podrías redirigir al usuario a otra página o realizar alguna otra acción después de crear el propietario.
      const propietarioId = response.data.id; // Obtener el ID del propietario creado
      const data = {
        propietario: propietarioId, // ID del propietario que deseas asignar al lote
        tipo_relacion: relacionLote.tipo_relacion, // Tipo de relación (propietario, arrendatario, corredor)
      };
      console.log(data)
      // Paso 2: Establecer la relación con el lote
      const responseEstablecerRelacion = await axios.put(`${API_ADDRESS}api/asignar-relacion/${relacionLote.loteId}/`, data);
      console.log('Relación establecida con el lote:', responseEstablecerRelacion.data);
      // Mostrar toast de éxito
      toast({
        title: 'Éxito',
        description: 'Propietario creado y relación establecida con el lote.',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position:'top'
      });

      // Aquí podrías redirigir al usuario a otra página o realizar alguna otra acción después de crear el propietario y establecer la relación con el lote.

    } catch (error) {
      toast({
        title: 'Error',
        description: 'Hubo un problema al crear el propietario o al establecer la relación.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position:'top'
      });

      console.error('Error al crear el propietario:', error);

    }
  };

  return (
    <Card p={5} >
      <div className="p-5">
        <Text fontSize="xl" fontWeight="bold" mb={4}>
          Información del usuario
        </Text>
        <Flex>
          <Box flex="1" m={4}>
            <Text fontSize="s" fontWeight="thin" mb={4}>
              RUT
            </Text>
            <input onChange={handleChange} className="mr-1 bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-md focus:ring-blue-500 focus:border-blue-500 p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" name="rut" type="text" />
          </Box>
          <Box flex="1" m={4}>
            <Text fontSize="s" fontWeight="thin" mb={4}>
              Nombre
            </Text>
            {propietario.razon_social ? (
              <p onClick={() => setPropietario(prevState => ({ ...prevState, nombre: prevState.razon_social }))}>
                {propietario.razon_social}
              </p>
            ) : (
              <input className="mr-1 bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-md focus:ring-blue-500 focus:border-blue-500 p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={handleChange} name="nombre" type="text" />
            )}
          </Box>
          <Box flex="1" m={4}>
            <Text fontSize="s" fontWeight="thin" mb={4}>
              Apellido
            </Text>
            <input className="mr-1 bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-md focus:ring-blue-500 focus:border-blue-500 p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={handleChange} name="apellido" type="text" />
          </Box>
        </Flex>
        <Flex>
          <Box flex="1" m={4}>
            <Text fontSize="s" fontWeight="thin" mb={4}>
              E-mail
            </Text>
            <input className="mr-1 bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-md focus:ring-blue-500 focus:border-blue-500 p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={handleChange} name="email" type="text" />
          </Box>
          <Box flex="1" m={4}>
            <Text fontSize="s" fontWeight="thin" mb={4}>
              Número de Teléfono
            </Text>
            <input className="mr-1 bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-md focus:ring-blue-500 focus:border-blue-500 p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={handleChange} name="numero_telefono" type="text" />
          </Box>
          <Box flex="1" m={4}>
          </Box>
        </Flex>
        <Flex mt={7}>
          <Text fontSize="xl" fontWeight="bold" mt={4} mb={4}>
            Información de la unidad
          </Text>
        </Flex>
        <Flex mt={4}>
          <Box flex="1" m={2}>
            
            <Select onChange={handleChangeRelacion} aria-placeholder='Selecciona Unidad' name="loteId" className="mr-1 bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-md focus:ring-blue-500 focus:border-blue-500 p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" >
              <option value="" disabled selected>
                Selecciona Unidad
              </option>
              {filteredOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </Box>

          <Box flex="1" m={2}>
            <Select onChange={handleChangeRelacion} name="tipo_relacion"  >
            <option value="" disabled selected>
    Selecciona Tipo de Propietario
  </option>
              <option value="arrendatario">Arrendatario</option>
              <option value="corredor">Corredor</option>
              <option value="dueno">Dueño</option>
            </Select>
          </Box>
        
        </Flex>


        <Flex mt={2}>
          <Box flex="1" m={2} ></Box>
          <Box flex="1" m={2} ></Box>
          <Box m={2} >
            <Button
              onClick={handleSubmit}
              colorScheme='blue'
            >
              Agregar
            </Button>
            <Button
              onClick={() => {
                onGoBack();
                update();
              }}
              colorScheme='blue'
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
