import React, { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  Flex,
  Grid,
  Heading,
  Icon,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
  useColorModeValue,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Select,
  Input,
} from '@chakra-ui/react'
import { DayPicker } from 'react-day-picker'
import { Bar, Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { FaDollarSign, FaUsers, FaCalendar, FaChartBar, FaFileAlt } from 'react-icons/fa'
import { API_ADDRESS } from "../../../variables/apiSettings"
import { useSelector } from "react-redux"
import { useNavigate } from 'react-router-dom'
import PaymentNoticePreview from './pdf'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

interface SaldosApi {
  suma_pendiente: number,
  suma_a_favor: number,
}

interface PeriodoCierre {
  id: number,
  mesInicio: string,
}

interface Owner {
  id: number;
  nombre: string;
  apellido: string;
  rut: string;
  razon_social: string;
  email: string;
  numero_telefono: string;
  estado: number;
}

function OwnerSelector({ onOwnerSelect }: { onOwnerSelect: (owner: Owner) => void }) {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [filteredOwners, setFilteredOwners] = useState<Owner[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch(`${API_ADDRESS}todos-los-propietarios/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
        });
        const data = await response.json();
        setOwners(data);
        setFilteredOwners(data);
      } catch (error) {
        console.error("Error fetching owners:", error);
      }
    };

    fetchOwners();
  }, []);

  useEffect(() => {
    const filtered = owners.filter(owner => 
      owner.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      owner.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      owner.rut.includes(searchTerm)
    );
    setFilteredOwners(filtered);
  }, [searchTerm, owners]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOwner = owners.find(owner => owner.id === parseInt(event.target.value));
    if (selectedOwner) {
      onOwnerSelect(selectedOwner);
    }
  };

  return (
    <VStack spacing={4} align="stretch">
      <Input
        placeholder="Buscar por nombre o RUT"
        value={searchTerm}
        onChange={handleSearch}
      />
      <Select placeholder="Seleccionar propietario" onChange={handleSelect}>
        {filteredOwners.map(owner => (
          <option key={owner.id} value={owner.id}>
            {`${owner.nombre} ${owner.apellido} - ${owner.rut}`}
          </option>
        ))}
      </Select>
    </VStack>
  );
}

export default function VistaPreviaCierrePeriodo() {
  const [fecha, setFecha] = useState<Date | undefined>(new Date())
  const [resumen, setResumen] = useState<any>(null)
  const [gastos, setGastos] = useState<any[]>([])
  const [saldos, setSaldos] = useState<any[]>([])
  const [saldosApi, setSaldosApi] = useState<SaldosApi>({
    suma_pendiente: 0,
    suma_a_favor: 0,
  })
  const [periodoCierre, setPeriodoCierre] = useState<PeriodoCierre | null>(null)
  const [proyecciones, setProyecciones] = useState<any>(null)
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [gastosPorCategoria, setGastosPorCategoria] = useState<any[]>([])
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null)
  const cancelRef = React.useRef()
  const periodo = useSelector((state: any) => state.periodo.periodoActual)
  const toast = useToast()
  const navigate = useNavigate()
  const bgColor = useColorModeValue('navy.50', 'navy.900')
  const accentColor = useColorModeValue('navy.500', 'navy.400')
  
  useEffect(() => {
    getSaldosData();
  }, [])
  
  const getSaldosData = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`${API_ADDRESS}sumasaldos/periodo/${periodo}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });
      const data = await response.json();
      setSaldosApi(data.saldos)
      setPeriodoCierre(data)
      setGastosPorCategoria(data.gastos_por_categoria.gastos_por_categoria)
    } catch (error) {
      console.error("Error al sumar saldos:", error);
      toast({
        title: "Error",
        description: "Hubo un problema al sumar los saldos.",
        status: "error",
        duration: 5000,
        isClosable: true,
      })
    }
  };

  const cerrarPeriodo = async (periodoId: number) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`${API_ADDRESS}periodo/${periodoId}/cerrar/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });
      const data = await response.json();
      toast({
        title: "Período cerrado",
        description: "El período se ha cerrado exitosamente.",
        status: "success",
        duration: 5000,
        isClosable: true,
      })
      navigate('/admin')
    } catch (error) {
      console.error("Error al cerrar periodo:", error);
      toast({
        title: "Error",
        description: "Hubo un problema al cerrar el período.",
        status: "error",
        duration: 5000,
        isClosable: true,
      })
    }
  };
  
  const handleCierre = () => {
    setIsAlertOpen(true)
  }

  const onConfirmCierre = () => {
    setIsAlertOpen(false)
    cerrarPeriodo(periodo)
  }

  const handleOwnerSelect = (owner: Owner) => {
    setSelectedOwner(owner);
    // Here you would typically fetch the payment notice data for the selected owner
    // and update the PaymentNoticePreview component
  };

  const pieData = {
    labels: gastosPorCategoria.map(gasto => gasto.categoria),
    datasets: [
      {
        data: gastosPorCategoria.map(gasto => gasto.total),
        backgroundColor: [
          'rgba(0, 51, 102, 0.8)',
          'rgba(0, 102, 204, 0.8)',
          'rgba(51, 153, 255, 0.8)',
          'rgba(102, 178, 255, 0.8)',
          'rgba(153, 204, 255, 0.8)',
        ],
        borderColor: [
          'rgba(0, 51, 102, 1)',
          'rgba(0, 102, 204, 1)',
          'rgba(51, 153, 255, 1)',
          'rgba(102, 178, 255, 1)',
          'rgba(153, 204, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  }

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "right",
      },
      title: {
        display: true,
        text: "Resumen de Gastos",
        font: {
          size: 20,
         // Ajuste aquí
        },
      },
    },
  };
  

  return (
    <Box minH="100vh" bg={bgColor} p={4}>
      <Container maxW="container.xl">
        <Tabs isFitted variant="enclosed">
          <TabList mb="1em">
            <Tab><Icon as={FaDollarSign} mr={2} /> Resumen</Tab>
            <Tab><Icon as={FaFileAlt} mr={2} /> Informe</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Grid templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(3, 1fr)" }} gap={6} mb={6}>
                <TarjetaResumen
                  icon={FaDollarSign}
                  titulo="Gastos Totales"
                  valor={resumen ? `$${saldosApi.suma_pendiente.toFixed(0)}` : 'Cargando...'}
                  colorAcento={accentColor}
                />
                <TarjetaResumen
                  icon={FaUsers}
                  titulo="Saldos de Propietarios"
                  valor={resumen ? `$${saldosApi.suma_a_favor.toFixed(0)}` : 'Cargando...'}
                  colorAcento={accentColor}
                />
                <TarjetaResumen
                  icon={FaCalendar}
                  titulo="Período de Cierre"
                  valor={fecha ? format(fecha, 'MMMM yyyy', { locale: es }) : 'Seleccione una fecha'}
                  colorAcento={accentColor}
                />
              </Grid>
              <Card>
                <CardHeader>
                  <Heading size="md">Resumen Gastos</Heading>
                </CardHeader>
                <CardBody>
                  <Box h="400px">
                    <Pie data={pieData}  />
                  </Box>
                </CardBody>
              </Card>
            </TabPanel>
            <TabPanel>
              <Card>
                <CardHeader>
                  <Heading size="md">Informe de Cierre de Período</Heading>
                </CardHeader>
                <CardBody>
                  <OwnerSelector onOwnerSelect={handleOwnerSelect} />
                  {selectedOwner && (
                    <Flex direction="column" mt={4} p={4} bg="gray.100" borderRadius="md">
                      <Text><strong>Nombre:</strong> {selectedOwner.nombre} {selectedOwner.apellido}</Text>
                      <Text><strong>RUT:</strong> {selectedOwner.rut}</Text>
                      <Text><strong>Email:</strong> {selectedOwner.email}</Text>
                      <Text><strong>Teléfono:</strong> {selectedOwner.numero_telefono}</Text>
                    </Flex>
                  )}
                  <Box mt={6}>
                    <PaymentNoticePreview />
                  </Box>
                  <Button leftIcon={<Icon as={FaFileAlt} />} colorScheme="blue" mt={4}>
                    Descargar Informe Completo
                  </Button>
                </CardBody>
              </Card>
            </TabPanel>
          </TabPanels>
        </Tabs>
        <Flex justify="flex-end" mt={8} gap={4}>
          <Button variant="outline" colorScheme="blue" onClick={() => navigate('/admin')}>Cancelar</Button>
          <Button colorScheme="blue" onClick={handleCierre}>Confirmar Cierre</Button>
        </Flex>
      </Container>
      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsAlertOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirmar Cierre de Período
            </AlertDialogHeader>
            <AlertDialogBody>
              ¿Está seguro de que desea cerrar este período? Esta acción no se puede deshacer.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsAlertOpen(false)}>
                Cancelar
              </Button>
              <Button colorScheme="blue" onClick={onConfirmCierre} ml={3}>
                Confirmar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  )
}

function TarjetaResumen({ icon, titulo, valor, colorAcento }: { icon: React.ElementType; titulo: string; valor: string; colorAcento: string }) {
  return (
    <Card>
      <CardBody>
        <Flex align="center">
          <Icon as={icon} boxSize={6} color={colorAcento} mr={4} />
          <Box>
            <Text fontSize="sm" fontWeight="medium" color="gray.500">
              {titulo}
            </Text>
            <Text fontSize="2xl" fontWeight="bold" color={colorAcento}>
              {valor}
            </Text>
          </Box>
        </Flex>
      </CardBody>
    </Card>
  )
}