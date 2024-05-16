import React, { useState, useEffect } from 'react';
import { Box, Flex, Text, Button } from '@chakra-ui/react';
import Card from 'components/card/';
import axios from 'axios';
import { API_ADDRESS } from '../../../../variables/apiSettings'

interface AddPropietarioProps {
  onGoBack: () => void,
  update: () => void;
}

const UserInterface: React.FC<AddPropietarioProps> = ({ onGoBack, update }) => {
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
      const response = await axios.post('http://localhost:8000/api/propietarios/', propietario);
      console.log('Propietario creado:', response.data);
      // Aquí podrías redirigir al usuario a otra página o realizar alguna otra acción después de crear el propietario.
      const propietarioId = response.data.id; // Obtener el ID del propietario creado
      const data = {
        propietario: propietarioId, // ID del propietario que deseas asignar al lote
        tipo_relacion: relacionLote.tipo_relacion, // Tipo de relación (propietario, arrendatario, corredor)
      };
      console.log(data)
      // Paso 2: Establecer la relación con el lote
      const responseEstablecerRelacion = await axios.put(`http://localhost:8000/api/asignar-relacion/${relacionLote.loteId}/`, data);
      console.log('Relación establecida con el lote:', responseEstablecerRelacion.data);

      // Aquí podrías redirigir al usuario a otra página o realizar alguna otra acción después de crear el propietario y establecer la relación con el lote.

    } catch (error) {
      console.error('Error al crear el propietario:', error);
    }
  };

  return (
    <Card >
      <div className="p-5">
        <Text fontSize="xl" fontWeight="bold" mb={4}>
          Información del usuario
        </Text>
        <Flex>
          <Box flex="1" m={4}>
            <Text fontSize="s" fontWeight="thin" mb={4}>
              RUT
            </Text>
            <input onChange={handleChange} name="rut" type="text" />
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
              <input onChange={handleChange} name="nombre" type="text" />
            )}
          </Box>
          <Box flex="1" m={4}>
            <Text fontSize="s" fontWeight="thin" mb={4}>
              Apellido
            </Text>
            <input onChange={handleChange} name="apellido" type="text" />
          </Box>
        </Flex>
        <Flex>
          <Box flex="1" m={4}>
            <Text fontSize="s" fontWeight="thin" mb={4}>
              E-mail
            </Text>
            <input onChange={handleChange} name="email" type="text" />
          </Box>
          <Box flex="1" m={4}>
            <Text fontSize="s" fontWeight="thin" mb={4}>
              Número de Teléfono
            </Text>
            <input onChange={handleChange} name="numero_telefono" type="text" />
          </Box>
        </Flex>

        <Text fontSize="xl" fontWeight="bold" mb={4}>
          Información de la unidad
        </Text>
        <Flex>
          <Box flex="1" m={4}>
            <Text fontSize="s" fontWeight="thin" mb={4}>
              Unidad
            </Text>

            <select onChange={handleChangeRelacion} name="loteId" className="select-dropdown">
              {filteredOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Box>

          <Box flex="1" m={4}>
            <Text fontSize="s" fontWeight="thin" mb={4}>
              Tipo de Propietario
            </Text>
            <select onChange={handleChangeRelacion} name="tipo_relacion" className="select-dropdown">
              <option value="arrendatario">Arrendatario</option>
              <option value="corredor">Corredor</option>
              <option value="dueno">Dueño</option>
            </select>
          </Box>
        </Flex>


        <Flex>
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
        </Flex>
      </div>
    </Card>
  );
};

export default UserInterface;
