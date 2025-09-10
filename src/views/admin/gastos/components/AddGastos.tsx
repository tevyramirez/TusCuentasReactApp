'use client'

import React, { useState, useEffect, useCallback } from 'react'
import {
  Box,
  Flex,
  Text,
  Button,
  Select,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Checkbox,
  useToast,
  SimpleGrid,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  VStack,
  HStack,
  Heading,
  Divider,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  List,
  ListItem,
  Tag,
  TagLabel,
  TagCloseButton,
} from '@chakra-ui/react'
import { SearchIcon, CalendarIcon, AttachmentIcon, AddIcon } from '@chakra-ui/icons'
import DatePicker from 'react-datepicker'
import debounce from 'lodash/debounce'
import { setPeriodoActual } from 'features/periodo/periodoSlice';
import { useAppSelector } from 'app/hooks';
import { Proveedor } from 'types/proveedores'
import api from 'services/api'

interface Categoria {
  id_categoria: number
  nombre: string
  descripcion: string
}

interface AddGastoProps {
  onGoBack: () => void
  update: () => void
}

interface Lote {
  id_lote: number
  numero_unidad: string
  metraje_cuadrado: number
  alicuota: number
}

interface Gasto {
  categoria: Categoria
  proveedor: Proveedor
  lote: Lote
  fecha: Date
  monto: number
  metodo_pago: string
  estado: string
  cuotas: number
  descripcion: string
  periodo: number
  es_general: boolean
}

interface Periodo {
  id_periodo: number
  fecha_inicio: Date
  fecha_fin: Date
  estado: string
}

export default function GastoForm({ onGoBack, update }: AddGastoProps) {
  const toast = useToast()
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [proveedores, setProveedores] = useState<Proveedor[]>([])
  const [filteredProveedores, setFilteredProveedores] = useState<Proveedor[]>([])
  const [periodo, setPeriodo] = useState<Periodo[]>([])
  const [lotes, setLotes] = useState<Lote[]>([])
  const [startDate, setStartDate] = useState(new Date())
  const [showCuotas, setShowCuotas] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showProveedorModal, setShowProveedorModal] = useState(false)
  const [newProveedor, setNewProveedor] = useState<Proveedor>({
    rut: '',
    nombre: '',
    apellido: '',
    numero_telefono: '',
    email: '',
    servicio: '',
  })
  const [showProveedorSearch, setShowProveedorSearch] = useState(true)
  const periodoActual = useAppSelector((state) => state.periodo.periodoActual);

  const [gasto, setGasto] = useState<Gasto>({
    categoria: { id_categoria: 0, nombre: '', descripcion: '' },
    proveedor: { id_proveedor: 0, rut: '', nombre: '', apellido: '', numero_telefono: '' },
    lote: { id_lote: 0, numero_unidad: '', metraje_cuadrado: 0, alicuota: 0 },
    fecha: startDate,
    monto: 0,
    metodo_pago: '',
    estado: '',
    cuotas: 0,
    descripcion: '',
    periodo: 0,
    es_general: false,
  })

  const [errors, setErrors] = useState({
    rut: '',
    nombre: '',
    apellido: '',
    monto: '',
    estado: '',
    metodo_pago: '',
    cuotas: '',
    descripcion: '',
  })

  const validate = useCallback(() => {
    let isValid = true
    const newErrors = {
      rut: '',
      nombre: '',
      apellido: '',
      monto: '',
      estado: '',
      metodo_pago: '',
      cuotas: '',
      descripcion: '',
    }

    if (!gasto.proveedor.rut) {
      newErrors.rut = 'RUT es requerido'
      isValid = false
    }
    if (!gasto.proveedor.nombre) {
      newErrors.nombre = 'Nombre es requerido'
      isValid = false
    }
    if (!gasto.proveedor.apellido) {
      newErrors.apellido = 'Apellido es requerido'
      isValid = false
    }
    if (!gasto.monto || gasto.monto <= 0) {
      newErrors.monto = 'Monto debe ser mayor a 0'
      isValid = false
    }
    if (!gasto.metodo_pago) {
      newErrors.metodo_pago = 'Método de pago es requerido'
      isValid = false
    }
    if (showCuotas && (!gasto.cuotas || gasto.cuotas <= 0)) {
      newErrors.cuotas = 'Número de cuotas debe ser mayor a 0'
      isValid = false
    }
    if (!gasto.descripcion) {
      newErrors.descripcion = 'Descripción es requerida'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }, [gasto, showCuotas])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    if (name === 'fecha') {
      setGasto(prevState => ({
        ...prevState,
        fecha: new Date(value),
      }))
    } else if (name === 'monto' || name === 'cuotas') {
      setGasto(prevState => ({
        ...prevState,
        [name]: parseFloat(value),
      }))
    } else if (name === 'metodo_pago') {
      setShowCuotas(value === 'credito')
      setGasto(prevState => ({
        ...prevState,
        [name]: value,
      }))
    } else {
      setGasto(prevState => ({
        ...prevState,
        [name]: value,
      }))
    }
    validate()
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target
    setGasto((prevState) => ({
      ...prevState,
      es_general: checked,
      lote: { id_lote: 0, numero_unidad: '', metraje_cuadrado: 0, alicuota: 0 }
    }))
  }

  const handleChangeDate = (date: Date) => {
    setGasto(prevState => ({
      ...prevState,
      fecha: date,
    }))
  }

  const handleProveedorChange = (proveedor: Proveedor) => {
    setGasto(prevState => ({
      ...prevState,
      proveedor: proveedor,
    }))
    setSearchTerm('')
    setFilteredProveedores([])
    setShowProveedorSearch(false)
  }

  const handleRemoveProveedor = () => {
    setGasto(prevState => ({
      ...prevState,
      proveedor: { id_proveedor: 0, rut: '', nombre: '', apellido: '', numero_telefono: '', categoriaGasto: 0 },
    }))
    setShowProveedorSearch(true)
  }

  const handleCategoriaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategoriaId = parseInt(e.target.value)
    const selectedCategoria = categorias.find(categoria => categoria.id_categoria === selectedCategoriaId)

    if (selectedCategoria) {
      setGasto(prevState => ({
        ...prevState,
        categoria: selectedCategoria,
      }))
    }
  }

  const handleLoteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLoteId = parseInt(e.target.value)
    const selectedLote = lotes.find(lote => lote.id_lote === selectedLoteId)

    if (selectedLote) {
      setGasto(prevState => ({
        ...prevState,
        lote: selectedLote,
      }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleProveedorSearch = useCallback(
    debounce(async (searchTerm: string) => {
      if (searchTerm.length > 2) {
        try {
          const response = await api.get(`proveedores/?q=${searchTerm}`)
          setFilteredProveedores(response.data)
        } catch (error) {
          console.error('Error al buscar proveedores:', error)
        }
      } else {
        setFilteredProveedores([])
      }
    }, 300),
    []
  )

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value
    setSearchTerm(searchTerm)
    handleProveedorSearch(searchTerm)
  }

  const handleFileUpload = async (gastoId: number) => {
    if (selectedFile) {
      console.log("Subiendo archivo...")
      const formData = new FormData()
      formData.append('file', selectedFile)
      console.log(formData)
      try {
        await api.post(`gastos/${gastoId}/upload/`, formData)
        toast({
          title: 'Archivo Subido',
          description: 'El archivo se subió correctamente.',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top',
        })
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Error al subir el archivo.',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top',
        })
      }
    }
  }

  useEffect(() => {
    async function fetchCategorias() {
      try {
        const response = await api.get('categorias-gastos/')
        setCategorias(response.data.results)
      } catch (error) {
        console.error('Error al obtener las categorías:', error)
      }
    }

    async function fetchLotes() {
      try {
        const response = await api.get('lotes/')
        setLotes(response.data.results)
      } catch (error) {
        console.error('Error al obtener los lotes:', error)
      }
    }

    async function fetchPeriodo() {
      try {
        const response = await api.get('periodo/')
        const periodoAbierto = response.data.find((periodo: Periodo) => periodo.estado === "abierto")
        if (periodoAbierto) {
          console.log(periodoAbierto)
          setPeriodo(periodoAbierto.id_periodo)
        } else {
          console.log("No se encontró un periodo abierto.")
        }
        console.log(response.data)
      } catch (error) {
        console.error('Error al obtener los periodos:', error)
      }
    }

    fetchCategorias()
    fetchLotes()
    fetchPeriodo()
  }, [])

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
          periodo: periodoActual,
          es_general: gasto.es_general,
        }
        const response = await api.post('gastos/', gastoUpload)
        const gastoId = response.data.id_gasto

        if (selectedFile) {
          console.log("Subiendo archivo...")
          await handleFileUpload(gastoId)
        }

        toast({
          title: 'Gasto Creado',
          description: 'El gasto se creó correctamente.',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top',
        })
        setShowAlert(true)
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Error al crear el gasto.',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top',
        })
        console.error('Error al crear el gasto:', error)
      }
    }
  }

  const handleAddAnother = () => {
    setGasto({
      categoria: { id_categoria: 0, nombre: '', descripcion: '' },
      proveedor: { id_proveedor: 0, rut: '', nombre: '', apellido: '', numero_telefono: '' },
      lote: { id_lote: 0, numero_unidad: '', metraje_cuadrado: 0, alicuota: 0 },
      fecha: new Date(),
      monto: 0,
      metodo_pago: '',
      estado: '',
      cuotas: 0,
      descripcion: '',
      periodo: 0,
      es_general: false,
    })
    setSelectedFile(null)
    setShowAlert(false)
  }

  const handleGoBack = () => {
    setShowAlert(false)
    onGoBack()
  }

  const handleNewProveedorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewProveedor(prev => ({ ...prev, [name]: value }))
  }

  const handleCreateNewProveedor = async () => {
    try {
      const response = await api.post('proveedores/', newProveedor)
      const createdProveedor = response.data
      setProveedores(prev => [...prev, createdProveedor])
      handleProveedorChange(createdProveedor)
      setShowProveedorModal(false)
      toast({
        title: 'Proveedor Creado',
        description: 'El proveedor se creó correctamente.',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top',
      })
    } catch (error) {
      console.error('Error al crear el proveedor:', error)
      toast({
        title: 'Error',
        description: 'Error al crear el proveedor.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      })
    }
  }

  return (
    <Box maxWidth="4xl" margin="auto" mt={5}>
      <VStack spacing={6} align="stretch" bg="white" p={6} borderRadius="md" boxShadow="md">
        <Heading size="lg">Agregar Gasto</Heading>
        <Divider />
        <VStack spacing={6} align="stretch">
          <FormControl isInvalid={!!errors.rut}>
            <FormLabel>Proveedor</FormLabel>
            {showProveedorSearch ? (
              <>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <SearchIcon color="gray.300" />
                  </InputLeftElement>
                  <Input
                    placeholder="Buscar proveedor..."
                    value={searchTerm}
                    onChange={handleSearchInputChange}
                  />
                </InputGroup>
                {filteredProveedores.length > 0 && (
                  <List spacing={2} mt={2} maxH="200px" overflowY="auto" borderWidth={1} borderRadius="md" p={2}>
                    {filteredProveedores.map((proveedor) => (
                      <ListItem 
                        key={proveedor.id_proveedor} 
                        onClick={() => handleProveedorChange(proveedor)}
                        cursor="pointer"
                        _hover={{ bg: "gray.100" }}
                        p={2}
                      >
                        {proveedor.nombre} {proveedor.apellido} - {proveedor.rut}
                      </ListItem>
                    ))}
                  </List>
                )}
                {searchTerm && filteredProveedores.length === 0 && (
                  <Button leftIcon={<AddIcon />} mt={2} onClick={() => setShowProveedorModal(true)}>
                    Crear nuevo proveedor
                  </Button>
                )}
              </>
            ) : (
              <Tag size="lg" colorScheme="blue" borderRadius="full">
                <TagLabel>{gasto.proveedor.nombre} {gasto.proveedor.apellido} - {gasto.proveedor.rut}</TagLabel>
                <TagCloseButton onClick={handleRemoveProveedor} />
              </Tag>
            )}
            <FormErrorMessage>{errors.rut}</FormErrorMessage>
          </FormControl>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <FormControl>
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
            </FormControl>

            <FormControl>
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
            </FormControl>

            <FormControl isInvalid={!!errors.monto}>
              <FormLabel>Monto</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none" color="gray.300">
                  $
                </InputLeftElement>
                <Input
                  type="number"
                  name="monto"
                  value={gasto.monto}
                  onChange={handleChange}
                />
              </InputGroup>
              <FormErrorMessage>{errors.monto}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.metodo_pago}>
              <FormLabel>Método de Pago</FormLabel>
              <Select
                placeholder="Selecciona un método de pago"
                name="metodo_pago"
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
                  type="number"
                  name="cuotas"
                  value={gasto.cuotas}
                  onChange={handleChange}
                />
                <FormErrorMessage>{errors.cuotas}</FormErrorMessage>
              </FormControl>
            )}

            <FormControl isInvalid={!!errors.descripcion}>
              <FormLabel>Descripción</FormLabel>
              <Input
                type="text"
                name="descripcion"
                value={gasto.descripcion}
                onChange={handleChange}
              />
              <FormErrorMessage>{errors.descripcion}</FormErrorMessage>
            </FormControl>

            <FormControl>
              <FormLabel>Fecha</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <CalendarIcon color="gray.300" />
                </InputLeftElement>
                <DatePicker
                  selected={gasto.fecha}
                  onChange={handleChangeDate}
                  dateFormat="yyyy-MM-dd"
                  customInput={<Input />}
                />
              </InputGroup>
            </FormControl>
          </SimpleGrid>

          <HStack>
            <Checkbox
              isChecked={gasto.es_general}
              onChange={handleCheckboxChange}
            >
              Gasto General
            </Checkbox>
          </HStack>

          <FormControl>
            <FormLabel>Comprobante</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <AttachmentIcon color="gray.300" />
              </InputLeftElement>
              <Input type="file" onChange={handleFileChange} />
            </InputGroup>
          </FormControl>
        </VStack>
        <Divider />
        <Button colorScheme="blue" onClick={handleSubmit}>
          Guardar Gasto
        </Button>

        {showAlert && (
          <Alert status="success" mt={4}>
            <AlertIcon />
            <Box flex="1">
              <AlertTitle>Gasto creado exitosamente!</AlertTitle>
              <AlertDescription display="block">
                ¿Desea agregar otro gasto?
              </AlertDescription>
            </Box>
            <HStack spacing={4}>
              <Button colorScheme="green" onClick={handleAddAnother}>
                Sí
              </Button>
              <Button colorScheme="red" onClick={handleGoBack}>
                No
              </Button>
            </HStack>
          </Alert>
        )}
      </VStack>

      <Modal isOpen={showProveedorModal} onClose={() => setShowProveedorModal(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Crear Nuevo Proveedor</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>RUT</FormLabel>
                <Input name="rut" value={newProveedor.rut || ''} onChange={handleNewProveedorChange} />
              </FormControl>
              <FormControl>
                <FormLabel>Nombre</FormLabel>
                <Input name="nombre" value={newProveedor.nombre || ''} onChange={handleNewProveedorChange} />
              </FormControl>
              <FormControl>
                <FormLabel>Apellido</FormLabel>
                <Input name="apellido" value={newProveedor.apellido || ''} onChange={handleNewProveedorChange} />
              </FormControl>
              <FormControl>
                <FormLabel>Teléfono</FormLabel>
                <Input name="numero_telefono" value={newProveedor.numero_telefono || ''} onChange={handleNewProveedorChange} />
              </FormControl>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input name="email" value={newProveedor.email || ''} onChange={handleNewProveedorChange} />
              </FormControl>
              <FormControl>
                <FormLabel>Servicio</FormLabel>
                <Input name="servicio" value={newProveedor.servicio || ''} onChange={handleNewProveedorChange} />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleCreateNewProveedor}>
              Crear Proveedor
            </Button>
            <Button variant="ghost" onClick={() => setShowProveedorModal(false)}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}