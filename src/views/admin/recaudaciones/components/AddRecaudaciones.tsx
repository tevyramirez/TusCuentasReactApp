import React, { useState, useEffect } from 'react';
import {
  Box, Flex, Text, Button, Select, Input, FormControl, FormLabel, FormErrorMessage, Checkbox, useToast, SimpleGrid, Alert, AlertIcon, AlertTitle, AlertDescription, useDisclosure,
} from '@chakra-ui/react';
import Card from 'components/card/';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import { API_ADDRESS } from 'variables/apiSettings';
import { FiFile } from 'react-icons/fi';

interface AddGastoProps {
  onGoBack: () => void,
  update: () => void;
}
interface Lote {
  id_lote: number;
  numero_unidad: string;
  metraje_cuadrado: number;
  alicuota: number;
}

interface Gasto {
  id_gasto: number;
  id_categoria: number;
  id_proveedor: number;
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

interface Recaudacion {
  id_recaudacion: number;
  id_lote: number;
  id_gasto: number;
  fecha: Date;
  monto: number;
  metodo_pago: string;
  cuota: number;
  descripcion: string;
}

const UserInterface: React.FC<AddGastoProps> = ({ onGoBack, update }) => {
  const toast = useToast();
  const [startDate, setStartDate] = useState(new Date());
  const [showCuotas, setShowCuotas] = useState(false);
  const [showCuotasGasto, setShowCuotasGasto] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const [showLoteSelect, setShowLoteSelect] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [lotes, setLotes] = useState<Lote[]>([]);

  const [recaudacion, setRecaudacion] = useState<Recaudacion>({
    id_recaudacion: 0,
    id_lote: 0,
    id_gasto: 0,
    fecha: startDate,
    monto: 0,
    metodo_pago: '',
    cuota: 0,
    descripcion: '',
  }
  );

  const [gasto, setGasto] = useState<Gasto>({
    id_gasto: 0,
    id_categoria: 0,
    id_proveedor: 0,
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
    if (name === 'descripcion') {
      setRecaudacion(prevState => ({
          ...prevState,
          descripcion: value,
        }));
      }else if (name === 'fecha') {
      setRecaudacion(prevState => ({
        ...prevState,
        fecha: new Date(value),
      }));
    } else if (name === 'monto' || name === 'cuotas') {
      setRecaudacion(prevState => ({
        ...prevState,
        [name]: parseFloat(value),
      }));
    } else if (name === 'metodo_pago') {
      setShowCuotas(value === 'credito');
      setRecaudacion(prevState => ({
        ...prevState,
        [name]: value,
      }));
    } else {
      setRecaudacion(prevState => ({
        ...prevState,
        [name]: value,
      }));
    }
  };
  const handleChangeMetodoPagoGasto = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setShowCuotasGasto(value === 'credito');
    setGasto(prevState => ({
      ...prevState,
      metodo_pago: value,
    }));
  }



  const handleChangeDate = (date: Date) => {
    setRecaudacion(prevState => ({
      ...prevState,
      fecha: date,
    }));
  };

  const handleGastoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedGastoId = parseInt(e.target.value);
    const selectedGasto = gastos.find(gasto => gasto.id_gasto === selectedGastoId);

    if (selectedGasto) {
      console.log("Gasto seleccionado:", selectedGasto);
      setGasto(selectedGasto);
      if (selectedGasto.es_general) {
        setShowLoteSelect(true);
      }
    
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleFileUpload = async (gastoId: number) => {
    if (selectedFile) {
      console.log("Subiendo archivo2...");
      const formData = new FormData();
      formData.append('file', selectedFile);
      console.log(formData);
      try {
        await axios.post(`${API_ADDRESS}gastos/${gastoId}/upload/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Content-Disposition': 'attachment; filename=' + selectedFile.name,
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

    async function fetchGastos() {
      try {
        const response = await axios.get(API_ADDRESS + 'gastos/', {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("access_token")}`
          }
        });
        setGastos(response.data);
        console.log(gastos)
      } catch (error) {
        console.error('Error al obtener las categorias:', error);
      }
    }

    async function fetchLotes() {
      try {
        const response = await axios.get(API_ADDRESS + 'lotes/', {
          headers: {
            "Content-Type": "application/json",
            " Authorization": `Bearer ${localStorage.getItem("access_token")}`
          }
        });
        setLotes(response.data);
        console.log(gastos)
      } catch (error) {
        console.error('Error al obtener las categorias:', error);
      }
    }





    fetchGastos();
    fetchLotes();
  }, []);

  const handleSubmit = async () => {
    if (validate()) {
      try {
        console.log(gasto)
        console.log(recaudacion)
        const recaudacionUpload = {
          id_lote: recaudacion.id_lote,
          id_gasto: gasto.id_gasto,
          fecha: recaudacion.fecha.toISOString().split('T')[0],
          monto: recaudacion.monto,
          metodo_pago: recaudacion.metodo_pago,
          cuota: 0,
          descripcion: recaudacion.descripcion,
        }
        const response = await axios.post(API_ADDRESS + 'recaudaciones/', recaudacionUpload,{
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("access_token")}`
          }
        });
        const gastoId = response.data.id_gasto;

        if (selectedFile) {
          console.log("Subiendo archivo...");
          await handleFileUpload(gastoId);
        }

        toast({
          title: 'Recaudacion Creada',
          description: 'La recaudación se creó correctamente.',
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

  const handleLoteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLoteId = parseInt(e.target.value);
    const selectedLote = lotes.find(lote => lote.id_lote === selectedLoteId);

    if (selectedLote) {
      console.log("Lote seleccionado:", selectedLote);
      setRecaudacion(prevState => ({
        ...prevState,
        id_lote: selectedLote.id_lote,
      }));
    }
  }

  const handleAddAnother = () => {
    setRecaudacion({
      id_recaudacion: 0,
      id_lote: 0,
      id_gasto: 0,
      fecha: startDate,
      monto: 0,
      metodo_pago: '',
      cuota: 0,
      descripcion: '',
    });
    setSelectedFile(null);
    setShowAlert(false);
  };

  const handleGoBack = () => {
    setShowAlert(false);
    onGoBack();
  };

  return (
    <>
      <Flex direction='column' pt={{ base: '120px', md: '25px' }}>
        <Card p='16px'>
          <Flex align={{ sm: 'flex-start', lg: 'center' }} justify='space-between' w='100%' px='22px' py='18px'>
            <Text fontSize='xl' color='gray.700' fontWeight='bold'>
              Detalle Gasto
            </Text>
          </Flex>
          <Flex direction='column' px='22px' py='18px'>
            <SimpleGrid columns={{ sm: 1, md: 3 }} spacing={4}>
              <FormControl isInvalid={!!errors.apellido}>
                <FormLabel>Gasto</FormLabel>
                <Select
                  placeholder="Selecciona un gasto"
                  value={gasto.id_gasto}
                  onChange={handleGastoChange}
                >
                  {gastos.map((gastos) => (

                    <option key={gastos.id_gasto} value={gastos.id_gasto}>
                      {gastos.monto}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>{errors.apellido}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.descripcion}>
                <FormLabel>Descripción</FormLabel>
                <Input
                  type='text'
                  name='descripcion'
                  value={gasto.descripcion}
                  isDisabled={true}
         
                />
                <FormErrorMessage>{errors.descripcion}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.monto}>
                <FormLabel>Monto</FormLabel>
                <Input
                  type='number'
                  name='monto'
                  value={gasto.monto}
                  isDisabled={true}
          
                />
                <FormErrorMessage>{errors.monto}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.metodo_pago}>
                <FormLabel>Método de Pago</FormLabel>
                <Select
                  placeholder="Selecciona un método de pago"
                  name='metodo_pago'
                  value={gasto.metodo_pago}
                  onChange={handleChangeMetodoPagoGasto}
                  isDisabled={true}
                >
                  <option value="contado">Contado</option>
                  <option value="credito">Crédito</option>
                </Select>
                <FormErrorMessage>{errors.metodo_pago}</FormErrorMessage>
              </FormControl>

              {showCuotasGasto && (
                <FormControl isInvalid={!!errors.cuotas}>
                  <FormLabel>Número de Cuotas</FormLabel>
                  <Input
                    type='number'
                    name='cuotas'
                    value={gasto.cuotas}
                  />
                  <FormErrorMessage>{errors.cuotas}</FormErrorMessage>
                </FormControl>
              )}



              <FormControl>
                <FormLabel>Fecha</FormLabel>
                <DatePicker
                  selected={gasto.fecha}
                  onChange={handleChangeDate}
                  dateFormat='dd-MM-yyyy'
                  customInput={<Input />}
                  disabled={true}
                  
                />
              </FormControl>

          {showLoteSelect &&   <FormControl isInvalid={!!errors.apellido}>
                <FormLabel>Lotes</FormLabel>
                <Select
                  placeholder="Selecciona un gasto"
                  value={recaudacion.id_lote}
                  onChange={handleLoteChange}
                >
                  {lotes.map((lote) => (

                    <option key={lote.id_lote} value={lote.id_lote}>
                      {lote.numero_unidad}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>{errors.apellido}</FormErrorMessage>
              </FormControl>

          }

            </SimpleGrid>
          </Flex>
        </Card>

      </Flex>
      <Flex direction='column' pt={{ base: '120px', md: '25px' }}>
        <Card mt={5} p='16px'>
          <Flex align={{ sm: 'flex-start', lg: 'center' }} justify='space-between' w='100%' px='22px' py='18px'>
            <Text fontSize='xl' color='gray.700' fontWeight='bold'>
              Agregar Recaudacion
            </Text>
          </Flex>
          <Flex direction='column' px='22px' py='18px'>
            <SimpleGrid columns={{ sm: 1, md: 3 }} spacing={4}>
              

  
              <FormControl isInvalid={!!errors.monto}>
                <FormLabel>Monto</FormLabel>
                <Input
                  type='number'
                  name='monto'
                  value={recaudacion.monto}
                  onChange={handleChange}
                />
                <FormErrorMessage>{errors.monto}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.metodo_pago}>
                <FormLabel>Método de Pago</FormLabel>
                <Select
                  placeholder="Selecciona un método de pago"
                  name='metodo_pago'
                  value={recaudacion.metodo_pago}
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
                    value={recaudacion.cuota}
                    onChange={handleChange}
                  />
                  <FormErrorMessage>{errors.cuotas}</FormErrorMessage>
                </FormControl>
              )}
              
              


              <FormControl>
                <FormLabel>Fecha</FormLabel>
                <DatePicker
                  selected={recaudacion.fecha}
                  onChange={handleChangeDate}
                  dateFormat='dd-MM-yyyy'
                  customInput={<Input />}
                />
              </FormControl>
              
              <FormControl isInvalid={!!errors.descripcion}>
                <FormLabel>Descripcion</FormLabel>
                <Input
                  type='text'
                  name='descripcion'
                  value={recaudacion.descripcion}
                  onChange={handleChange}
                />
                <FormErrorMessage>{errors.monto}</FormErrorMessage>
              </FormControl>

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
              Guardar Recaudacion
            </Button>

            {showAlert && (
              <Alert status='success' mt={4}>
                <AlertIcon />
                <Box flex='1'>
                  <AlertTitle>Recaudacion creado exitosamente!</AlertTitle>
                  <AlertDescription display='block'>
                    ¿Desea agregar otra recaudacion?
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
    </>
  );
};

export default UserInterface;
