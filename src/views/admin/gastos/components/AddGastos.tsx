import React, { useState, useEffect } from 'react';
import {
  Box, Flex, Text, Button, Select, Input, FormControl, FormLabel, FormErrorMessage, Checkbox, useToast, SimpleGrid, Alert, AlertIcon, AlertTitle, AlertDescription, useDisclosure,
} from '@chakra-ui/react';
import Card from 'components/card/';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import { API_ADDRESS } from 'variables/apiSettings';
import { FiFile } from 'react-icons/fi';

interface Categoria {
  id_categoria: number;
  nombre: string;
  descripcion: string;
}

interface AddGastoProps {
  onGoBack: () => void,
  update: () => void;
}

interface Proveedor {
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
  const [showAlert, setShowAlert] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

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

  const [errors, setErrors] = useState({
    rut: '',
    nombre: '',
    apellido: '',
    monto: '',
    estado: '',
    metodo_pago: '',
    cuotas: '',
    descripcion: '',
  });

  const validate = () => {
    let isValid = true;
    const newErrors = {
      rut: '',
      nombre: '',
      apellido: '',
      monto: '',
      estado: '',
      metodo_pago: '',
      cuotas: '',
      descripcion: '',
    };

    if (!gasto.proveedor.rut) {
      newErrors.rut = 'RUT es requerido';
      isValid = false;
    }
    if (!gasto.proveedor.nombre) {
      newErrors.nombre = 'Nombre es requerido';
      isValid = false;
    }
    if (!gasto.proveedor.apellido) {
      newErrors.apellido = 'Apellido es requerido';
      isValid = false;
    }
    if (!gasto.monto || gasto.monto <= 0) {
      newErrors.monto = 'Monto debe ser mayor a 0';
      isValid = false;
    }
    if (!gasto.metodo_pago) {
      newErrors.metodo_pago = 'Método de pago es requerido';
      isValid = false;
    }
    if (showCuotas && (!gasto.cuotas || gasto.cuotas <= 0)) {
      newErrors.cuotas = 'Número de cuotas debe ser mayor a 0';
      isValid = false;
    }
    if (!gasto.descripcion) {
      newErrors.descripcion = 'Descripción es requerida';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'fecha') {
      setGasto(prevState => ({
        ...prevState,
        fecha: new Date(value),
      }));
    } else if (name === 'monto' || name === 'cuotas') {
      setGasto(prevState => ({
        ...prevState,
        [name]: parseFloat(value),
      }));
    } else if (name === 'metodo_pago') {
      setShowCuotas(value === 'credito');
      setGasto(prevState => ({
        ...prevState,
        [name]: value,
      }));
    } else {
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
    const selectedProveedor = proveedores.find(proveedor => proveedor.id_proveedor === selectedProveedorId);

    if (selectedProveedor) {
      
      setGasto(prevState => ({
        ...prevState,
        proveedor: selectedProveedor,
        
      }));
    }
  };

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleFileUpload = async (gastoId: number) => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      try {
        await axios.post(`${API_ADDRESS}gastos/${gastoId}/upload/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        toast({
          title: 'Archivo Subido',
          description: 'El archivo se subió correctamente.',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top',
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Error al subir el archivo.',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top',
        });
      }
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
        // Filtra el array para encontrar el periodo con estado "abierto"
        const periodoAbierto = response.data.find((periodo: Periodo) => periodo.estado === "abierto");
        // Si existe un periodo abierto, actualiza el estado con su ID
        if (periodoAbierto) {
          console.log(periodoAbierto)
          setPeriodo(periodoAbierto.id_periodo);
        } else {
          console.log("No se encontró un periodo abierto.");
        }
        console.log(response.data);
      } catch (error) {
        console.error('Error al obtener los periodos:', error);
      }
    }

    fetchCategorias();
    fetchProveedores();
    fetchLotes();
    fetchPeriodo();
  }, []);

  const handleSubmit = async () => {
    if (validate()) {
      try {
        const gastoUpload = {
          categoria: gasto.categoria.id_categoria,
          proveedor: gasto.proveedor.id_proveedor,
          lote: gasto.lote.id_lote,
          fecha: gasto.fecha.toISOString().split('T')[0],
          monto: gasto.monto,
          metodo_pago: gasto.metodo_pago,
          estado: gasto.estado,
          cuotas: gasto.cuotas,
          descripcion: gasto.descripcion,
          periodo: periodo, 
          es_general: gasto.es_general,
        }
        const response = await axios.post(API_ADDRESS + 'gastos/', gastoUpload);
        const gastoId = response.data.id_gasto;

        if (selectedFile) {
          await handleFileUpload(gastoId);
        }

        toast({
          title: 'Gasto Creado',
          description: 'El gasto se creó correctamente.',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top',
        });
        setShowAlert(true);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Error al crear el gasto.',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top',
        });
        console.error('Error al crear el gasto:', error);
      }
    }
  };

  const handleAddAnother = () => {
    setGasto({
      categoria: { id_categoria: 0, nombre: '', descripcion: '' },
      proveedor: { id_proveedor: 0, rut: '', nombre: '', apellido: '', telefono: '', categoriaGasto: 0 },
      lote: { id_lote: 0, numero_unidad: '', metraje_cuadrado: 0, alicuota: 0 },
      fecha: new Date(),
      monto: 0,
      metodo_pago: '',
      estado: '',
      cuotas: 0,
      descripcion: '',
      periodo: 0,
      es_general: false,
    });
    setSelectedFile(null);
    setShowAlert(false);
  };

  const handleGoBack = () => {
    setShowAlert(false);
    onGoBack();
  };

  return (
    <Flex direction='column' pt={{ base: '120px', md: '25px' }}>
      <Card p='16px'>
        <Flex align={{ sm: 'flex-start', lg: 'center' }} justify='space-between' w='100%' px='22px' py='18px'>
          <Text fontSize='xl' color='gray.700' fontWeight='bold'>
            Agregar Gasto
          </Text>
        </Flex>
        <Flex direction='column' px='22px' py='18px'>
          <SimpleGrid columns={{ sm: 1, md: 3 }} spacing={4}>
            <FormControl isInvalid={!!errors.rut}>
              <FormLabel>Proveedor</FormLabel>
              <Select
                placeholder="Selecciona un proveedor"
                value={gasto.proveedor.id_proveedor}
                onChange={handleProveedorChange}
              >
                {proveedores.map((proveedor) => (
                  <option key={proveedor.id_proveedor} value={proveedor.id_proveedor}>
                    {proveedor.nombre} {proveedor.apellido} - {proveedor.rut}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{errors.rut}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.nombre}>
              <FormLabel>Categoría</FormLabel>
              <Select
                placeholder="Selecciona una categoría"
                value={gasto.categoria.id_categoria}
                onChange={handleCategoriaChange}
              >
                {categorias.map((categoria) => (
                  <option key={categoria.id_categoria} value={categoria.id_categoria}>
                    {categoria.nombre}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{errors.nombre}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.apellido}>
              <FormLabel>Lote</FormLabel>
              <Select
                placeholder="Selecciona un lote"
                value={gasto.lote.id_lote}
                onChange={handleLoteChange}
                isDisabled={gasto.es_general}
              >
                {lotes.map((lote) => (
                  <option key={lote.id_lote} value={lote.id_lote}>
                    {lote.numero_unidad}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{errors.apellido}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.monto}>
              <FormLabel>Monto</FormLabel>
              <Input
                type='number'
                name='monto'
                value={gasto.monto}
                onChange={handleChange}
              />
              <FormErrorMessage>{errors.monto}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.metodo_pago}>
              <FormLabel>Método de Pago</FormLabel>
              <Select
                placeholder="Selecciona un método de pago"
                name='metodo_pago'
                value={gasto.metodo_pago}
                onChange={handleChange}
              >
                <option value="contado">Contado</option>
                <option value="credito">Crédito</option>
              </Select>
              <FormErrorMessage>{errors.metodo_pago}</FormErrorMessage>
            </FormControl>

            {showCuotas && (
              <FormControl isInvalid={!!errors.cuotas}>
                <FormLabel>Número de Cuotas</FormLabel>
                <Input
                  type='number'
                  name='cuotas'
                  value={gasto.cuotas}
                  onChange={handleChange}
                />
                <FormErrorMessage>{errors.cuotas}</FormErrorMessage>
              </FormControl>
            )}

            <FormControl isInvalid={!!errors.descripcion}>
              <FormLabel>Descripción</FormLabel>
              <Input
                type='text'
                name='descripcion'
                value={gasto.descripcion}
                onChange={handleChange}
              />
              <FormErrorMessage>{errors.descripcion}</FormErrorMessage>
            </FormControl>

            <FormControl>
              <FormLabel>Fecha</FormLabel>
              <DatePicker
                selected={gasto.fecha}
                onChange={handleChangeDate}
                dateFormat='yyyy-MM-dd'
                customInput={<Input />}
              />
            </FormControl>

            <Checkbox
              isChecked={gasto.es_general}
              onChange={handleCheckboxChange}
            >
              Gasto General
            </Checkbox>

            <FormControl>
              <FormLabel>Comprobante</FormLabel>
              <Input type='file' onChange={handleFileChange} />
            </FormControl>
          </SimpleGrid>

          <Button
            leftIcon={<FiFile />}
            colorScheme='blue'
            onClick={handleSubmit}
            mt={4}
          >
            Guardar Gasto
          </Button>

          {showAlert && (
            <Alert status='success' mt={4}>
              <AlertIcon />
              <Box flex='1'>
                <AlertTitle>Gasto creado exitosamente!</AlertTitle>
                <AlertDescription display='block'>
                  ¿Desea agregar otro gasto?
                </AlertDescription>
              </Box>
              <Flex>
                <Button colorScheme='green' ml={4} onClick={handleAddAnother}>
                  Sí
                </Button>
                <Button colorScheme='red' ml={4} onClick={handleGoBack}>
                  No
                </Button>
              </Flex>
            </Alert>
          )}
        </Flex>
      </Card>
    </Flex>
  );
};

export default UserInterface;
