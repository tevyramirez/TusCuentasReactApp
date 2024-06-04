import React, { useState, useEffect } from 'react';
import { Box, Flex, Text, Select, Button, Input, FormControl, FormLabel, useToast } from '@chakra-ui/react';
import Card from 'components/card/';
import InputField from 'components/fields/InputField'
import axios from 'axios'
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
  categoriaServicio: Categoria;
}
interface Categoria {
  id_categoria: number;
  nombre: string;
  descripcion: string;
}



const UserInterface: React.FC<AddProveedorProps> = ({ onGoBack, update }) => {
  const [proveedor, setProveedor] = useState<Proveedor>({
    categoriaServicio: { id_categoria: 0, nombre: '', descripcion: '' },
    nombre: '',
    apellido: '',
    rut: '',
    email: '',
    telefono: '',
  });
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const toast = useToast();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    console.log("Hola", name, value)
    setProveedor(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleCategoriaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategoriaId = parseInt(e.target.value);
    const selectedCategoria = categorias.find(categoria => categoria.id_categoria === selectedCategoriaId);

    if (selectedCategoria) {
      setProveedor(prevState => ({
        ...prevState,
        categoriaServicio: selectedCategoria,
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      const dataToSend = {
        rut: proveedor.rut,
        nombre: proveedor.nombre,
        apellido: proveedor.apellido,
        telefono: proveedor.telefono,
        email: proveedor.email,
        categoriaServicio: proveedor.categoriaServicio.id_categoria
      }
      
      const response = await axios.post(API_ADDRESS + 'proveedores/', dataToSend);
      console.log('Proveedor creado:', response.data);
      toast({
        title: 'Éxito',
        description: 'Proveedor creado exitosamente :D.',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position:'top'
      });
      // Aquí podrías redirigir al usuario a otra página o realizar alguna otra acción después de crear el propietario.
    } catch (error) {
      console.error('Error al crear el Proveedor:', error);
      toast({
        title: 'Error',
        description: 'Error al momento de agregar el proveedor',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position:'top'
      });
    }
  };

  useEffect(() => {
    async function fetchCategorias() {
      try {
        const response = await axios.get(API_ADDRESS + 'categorias-gastos/');
        setCategorias(response.data);
      } catch (error) {
        console.error('Error al obtener las categorías:', error);
      }
    }
    fetchCategorias();
  }, [])

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

          <input onChange={handleChange} name="telefono" type="text" className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
          </input>
        </Box>
        <Box flex="1" m={4} >

        </Box>

      </Flex>

      <Text className="m-3" fontSize="xl" fontWeight="bold" mb={4}>
        Información del servicio
      </Text>
      <Flex m={4}>
        <Box flex="1" m={4}>
          <Text m={4}>Categoría</Text>
          <select className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500" onChange={handleCategoriaChange} >
            {categorias.map(categoria => (
              <option key={categoria.id_categoria} value={categoria.id_categoria}>
                {categoria.nombre}
              </option>
            ))}
          </select>
        </Box>
        <Box flex="1" m={4}>
          <InputField
            id="Descripcion"
            label="Descripcion"
            extra="extra information"
            placeholder="Descripcion"
            variant="standard"
          />
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