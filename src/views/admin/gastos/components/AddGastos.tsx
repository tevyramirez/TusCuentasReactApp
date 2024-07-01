import React, { useState, useEffect } from 'react';
import { Box, Flex, Text, Icon, Button, Spacer } from '@chakra-ui/react';
import Card from 'components/card/';
import InputField from 'components/fields/InputField'
import axios from 'axios'
import { FiFile, FiSearch } from 'react-icons/fi'
import { ModifierFlags } from 'typescript';
import GastosComunes from 'views/admin/gastos';
import { API_ADDRESS } from 'variables/apiSettings';
import DatePicker from 'react-datepicker'
import { Checkbox, CheckboxGroup, useToast } from '@chakra-ui/react'

interface Categoria {
  id_categoria: number;
  nombre: string;
  descripcion: string;
}

interface AddGastoProps {
  onGoBack: () => void,
  update: () => void;

}interface Proveedor {
  id_proveedor: number;
  rut: string;
  nombre: string;
  apellido: string;
  telefono: string;
  categoriaGasto: number;
}

interface Lote {
  id_lote: number;
  numero_unidad: string;
  metraje_cuadrado: number;
  alicuota: number;


}

interface Gasto {
  categoria: Categoria;
  proveedor: Proveedor;
  lote: Lote;
  fecha: Date;
  monto: number;
  metodo_pago: string;
  estado: string;
  cuotas: number;
  descripcion: string;
  periodo: number;
  es_general: boolean;
}
interface Periodo {
  id_periodo: number;
  fecha_inicio: Date;
  fecha_fin: Date;
  estado: string;
}

const UserInterface: React.FC<AddGastoProps> = ({ onGoBack, update }) => {
  const toast = useToast();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [periodo, setPeriodo] = useState<Periodo[]>([]);
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [startDate, setStartDate] = useState(new Date());
  const [showCuotas, setShowCuotas] = useState(false);

  const [gasto, setGasto] = useState<Gasto>({
    categoria: { id_categoria: 0, nombre: '', descripcion: '' },
    proveedor: { id_proveedor: 0, rut: '', nombre: '', apellido: '', telefono: '', categoriaGasto: 0 },
    lote: { id_lote: 0, numero_unidad: '', metraje_cuadrado: 0, alicuota: 0 },
    fecha: startDate,
    monto: 0,
    metodo_pago: '',
    estado: '',
    cuotas: 0,
    descripcion: '',
    periodo: 0,
    es_general: false,
  });



  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Manejar campos especiales
    if (name === 'fecha') {
      console.log(value);
      setGasto(prevState => ({
        ...prevState,
        fecha: new Date(value), // Convertir valor a objeto Date
      }));
    } else if (name === 'monto' || name === 'cuotas') {
      // Convertir valores numéricos a números
      setGasto(prevState => ({
        ...prevState,
        [name]: parseFloat(value),
      }));

    } else if (name === 'metodo_pago') {
      if (value === 'credito') {
        // Mostrar el campo de cuotas si el método de pago es crédito
        setShowCuotas(value === 'credito');
        setGasto(prevState => ({
          ...prevState,
          [name]: value,
        }));
      } else {
        setShowCuotas(false);
        setGasto(prevState => ({
          ...prevState,
          [name]: value,
        }));
      }

    }
    else {
      // Para otros campos, simplemente actualizar el estado
      setGasto(prevState => ({
        ...prevState,
        [name]: value,
      }));
    }
  };
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setGasto((prevState) => ({
      ...prevState,
      es_general: checked,
      lote: { id_lote: 0, numero_unidad: '', metraje_cuadrado: 0, alicuota: 0 }
    }));
  };


  const handleChangeDate = (date: Date) => {
    setGasto(prevState => ({
      ...prevState,
      fecha: date,
    }));
  };
  const handleProveedorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProveedorId = parseInt(e.target.value);
    console.log("Proveedor seleccionado:", selectedProveedorId); // Verificar si se selecciona el proveedor correctamente
    const selectedProveedor = proveedores.find(proveedor => proveedor.id_proveedor === selectedProveedorId);

    if (selectedProveedor) {
      const selectedCategoria = categorias.find(categoria => categoria.id_categoria === selectedProveedor.categoriaGasto);
      setGasto(prevState => ({
        ...prevState,
        proveedor: selectedProveedor,
        categoria: selectedCategoria, // Actualizar la categoría del gasto con la categoría del proveedor seleccionado
      }));
      console.log("Estado actualizado:", gasto); // Verificar si los campos se actualizan correctamente
    }
  }





  const handleCategoriaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategoriaId = parseInt(e.target.value);
    const selectedCategoria = categorias.find(categoria => categoria.id_categoria === selectedCategoriaId);

    if (selectedCategoria) {
      setGasto(prevState => ({
        ...prevState,
        categoria: selectedCategoria,
      }));
    }
  };

  const handleLoteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLoteId = parseInt(e.target.value);
    const selectedLote = lotes.find(lote => lote.id_lote === selectedLoteId);

    if (selectedLote) {
      setGasto(prevState => ({
        ...prevState,
        lote: selectedLote,
      }));
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

    async function fetchProveedores() {
      try {
        const response = await axios.get(API_ADDRESS + 'proveedores/');
        setProveedores(response.data);
      } catch (error) {
        console.error('Error al obtener los proveedores:', error);
      }
    }
    async function fetchLotes() {
      try {
        const response = await axios.get(API_ADDRESS + 'lotes/');
        setLotes(response.data);
      } catch (error) {
        console.error('Error al obtener los lotes:', error);
      }
    }
    async function fetchPeriodo() {
      try {
        const response = await axios.get(API_ADDRESS + 'periodo/');
        // Process the response data as needed
        setPeriodo(response.data.filter((item: Periodo) => item.estado === "abierto"));

      } catch (error) {
        console.error('Error al obtener el periodo:', error);
      }
    }

    fetchPeriodo();
    console.log(periodo)
    fetchCategorias();
    fetchProveedores();
    fetchLotes();
  }, []);

  const handleSubmit = async () => {
    try {
      const dataToSend = {
        categoria: gasto.categoria.id_categoria,
        proveedor: gasto.proveedor.id_proveedor,
        lote: gasto.lote.id_lote,
        fecha: gasto.fecha.toISOString().split('T')[0], // Formato 'YYYY-MM-DD'
        monto: gasto.monto,
        metodo_pago: gasto.metodo_pago,
        estado: gasto.estado,
        cuotas: gasto.cuotas,
        descripcion: gasto.descripcion,
        periodo: periodo[0].id_periodo,
      };
      console.log(dataToSend)
      const response = await axios.post(API_ADDRESS + 'gastos/', dataToSend);
      console.log('Gasto creado:', response.data);
      toast({
        title: 'Éxito',
        description: 'Gasto creado exitosamente :D.',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top'
      });

      // Aquí podrías redirigir al usuario a otra página o realizar alguna otra acción después de crear el gasto.
    } catch (error) {
      console.error('Error al crear el gasto:', error);
      toast({
        title: 'Error',
        description: 'Error al momento de agregar el gasto',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top'
      });
    }
  };


  return (
    <>
      <Card >
        <Text className="m-3" fontSize="xl" fontWeight="bold" mb={4}>
          Información del proveedor
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
            <Text m={4}>Proveedor</Text>
            <select className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500" onChange={handleProveedorChange} name="proveedor">
              {proveedores.map(proveedor => (
                <option key={proveedor.id_proveedor} value={proveedor.id_proveedor}>
                  {proveedor.nombre} {proveedor.apellido}
                </option>
              ))}
            </select>
            <Flex>
              <Button m={4}
                onClick={() => {
                }}
                className="btn-configurar-cuenta cursor-pointer rounded-xl bg-brand-500 text-white transition duration-200 hover:bg-brand-600 hover:text-white active:bg-brand-700 dark:bg-brand-400 dark:hover:bg-brand-300 dark:active:bg-brand-200"
              >
                <FiSearch className="h-5 w-5 text-gray-400" />
              </Button>
              <Button m={4}
                onClick={() => {
                }}
                className="btn-configurar-cuenta cursor-pointer rounded-xl bg-brand-500 text-white transition duration-200 hover:bg-brand-600 hover:text-white active:bg-brand-700 dark:bg-brand-400 dark:hover:bg-brand-300 dark:active:bg-brand-200"
              >
                +
              </Button>
            </Flex>

          </Box>
          <Box flex="1" m={4}>
            <Text m={4}>Fecha</Text>

            <DatePicker className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"  dateFormat="dd/MM/yyyy" selected={gasto.fecha} onChange={handleChangeDate} />
          </Box>
        </Flex>
        <Flex m={4}>

          <Box flex="1" m={4} >
            <Text fontSize="s" fontWeight="thin" mb={4}>
              RUT
            </Text>

            <input onChange={handleChange} value={gasto.proveedor.rut} name="rut" type="text" className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            </input>
          </Box>
          <Box flex="1" m={4} >
            <Text fontSize="s" fontWeight="thin" mb={4}>
              Nombre
            </Text>

            <input onChange={handleChange} value={gasto.proveedor.nombre} name="nombre" type="text" className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            </input>
          </Box>
          <Box flex="1" m={4} >
            <Text fontSize="s" fontWeight="thin" mb={4}>
              Apellido
            </Text>

            <input onChange={handleChange} value={gasto.proveedor.apellido} name="apellido" type="text" className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            </input>
          </Box>



        </Flex>
      </Card>
      <Card>
        <Flex m={4}>

          <Text className="m-3" fontSize="xl" fontWeight="bold" mb={4}>
            Detalle economico del gasto
          </Text>



        </Flex>


        <Flex className="m-3" m={5}>
          <Box flex="1" m={4} >
            <Text fontSize="s" fontWeight="thin" mb={4}>
              Monto
            </Text>

            <input onChange={handleChange} name="monto" type="text" className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            </input>
          </Box>
          <Box flex="1" m={4}>
            <Text fontWeight="thin" m={4}>Estado</Text>
            <select onChange={handleChange} name="estado" className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
              <option value="impago">Impago</option>
              <option value="pagado">Pagado</option>
            </select>
          </Box>
          <Box flex="1" m={4}>
            <Text fontWeight="thin" m={4}>Método de Pago</Text>
            <select onChange={handleChange} name="metodo_pago" className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
              <option value="efectivo">Efectivo</option>
              <option value="transferencia">Transferencia</option>
              <option value="credito">Credito</option>
            </select>
          </Box>
          {showCuotas && (
            <Box flex="1" m={4}>
              <Text fontWeight="thin" m={4}>Número de Cuotas</Text>
              <select onChange={handleChange} name="cuotas" className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                <option value="">Seleccionar Número de Cuotas</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </Box>
          )}
        </Flex>
      </Card>
      <Card>
        <Flex>

          <Text className="m-3" fontSize="xl" fontWeight="bold" mb={4}>
            Distribución del gasto
          </Text>
        </Flex>
        <Flex m={4}>
          <Box flex="1" m={4} >
            <Text fontSize="s" fontWeight="thin" mb={4}>
              Asignación
            </Text>

            <select onChange={handleLoteChange} className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500" name="lote" disabled={gasto.es_general}>
              {lotes.map(lote => (
                <option key={lote.id_lote} value={lote.id_lote}>
                  {lote.numero_unidad}
                </option>
              ))}
            </select>
          </Box>
          <Box flex="1" m={4}>

            <Checkbox isChecked={gasto.es_general}
              onChange={handleCheckboxChange}
              name="es_general">¿Es un gasto general?</Checkbox>

          </Box>

        </Flex>
      </Card>

      <Card>
        <Flex>
          <Text className="m-3" fontSize="xl" fontWeight="bold" mb={4}>
            Documentación
          </Text>
        </Flex>
        <Flex>
          <Box flex="1" m={4} >
            <Button className="btn-configurar-cuenta m-3 px-full linear flex cursor-pointer items-center justify-center rounded-xl bg-brand-500 py-[11px] font-bold text-white transition duration-200 hover:bg-brand-600 hover:text-white active:bg-brand-700 dark:bg-brand-400 dark:hover:bg-brand-300 dark:active:bg-brand-200" leftIcon={<Icon as={FiFile} />}>
              Subir
            </Button>
          </Box>
          <Box flex="1" m={4} >
            <Text fontSize="s" fontWeight="thin" mb={4}>
              Descripcion
            </Text>

            <input onChange={handleChange} name="descripcion" type="text" className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            </input>
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
      </Card>
    </>
  );
};

export default UserInterface;