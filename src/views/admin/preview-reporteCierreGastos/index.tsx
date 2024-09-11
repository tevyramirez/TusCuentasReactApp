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
import { API_ADDRESS } from "../../../variables/apiSettings";
import { useSelector } from "react-redux";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

// Simulación de llamadas a API (sin cambios)
const fetchResumen = async () => {
  // Simula una llamada a API
  await new Promise(resolve => setTimeout(resolve, 500))
  return {
    gastosTotales: 45678.90,
    saldosPropietarios: 123456.78,
    periodoCierre: new Date()
  }
}

const fetchGastos = async () => {
  await new Promise(resolve => setTimeout(resolve, 500))
  return [
    { concepto: 'Mantenimiento', monto: 12345.67 },
    { concepto: 'Servicios', monto: 5678.90 },
    { concepto: 'Honorarios de Gestión', monto: 3456.78 },
    { concepto: 'Seguros', monto: 2345.67 },
    { concepto: 'Impuestos', monto: 21851.88 }
  ]
}

const fetchSaldos = async () => {
  await new Promise(resolve => setTimeout(resolve, 500))
  return [
    { propietario: 'Propietario A', saldo: 45678.90 },
    { propietario: 'Propietario B', saldo: 34567.89 },
    { propietario: 'Propietario C', saldo: 23456.78 },
    { propietario: 'Propietario D', saldo: 19753.21 }
  ]
}

const fetchProyecciones = async () => {
  await new Promise(resolve => setTimeout(resolve, 500))
  return {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    proyectado: [12000, 19000, 15000, 17000, 22000, 24000],
    real: [11000, 18500, 14800, 16900, 21500, 23800]
  }
}

export default function VistaPreviaCierrePeriodo() {
  const [fecha, setFecha] = useState<Date | undefined>(new Date())
  const [resumen, setResumen] = useState<any>(null)
  const [gastos, setGastos] = useState<any[]>([])
  const [saldos, setSaldos] = useState<any[]>([])
  const [proyecciones, setProyecciones] = useState<any>(null)
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const cancelRef = React.useRef()
  const periodo = useSelector((state: any) => state.periodo.periodoActual)
  const toast = useToast()

  const bgColor = useColorModeValue('navy.50', 'navy.900')
  const cardBgColor = useColorModeValue('white', 'navy.800')
  const textColor = useColorModeValue('navy.700', 'white')
  const accentColor = useColorModeValue('navy.500', 'navy.400')

  useEffect(() => {
    fetchResumen().then(setResumen)
    fetchGastos().then(setGastos)
    fetchSaldos().then(setSaldos)
    fetchProyecciones().then(setProyecciones)
  }, [])
  
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

  const chartData = proyecciones ? {
    labels: proyecciones.labels,
    datasets: [
      {
        label: 'Pagos Proyectados',
        data: proyecciones.proyectado,
        backgroundColor: 'rgba(0, 51, 102, 0.6)',
        borderColor: 'rgba(0, 51, 102, 1)',
        borderWidth: 1,
      },
      {
        label: 'Pagos Reales',
        data: proyecciones.real,
        backgroundColor: 'rgba(0, 102, 204, 0.6)',
        borderColor: 'rgba(0, 102, 204, 1)',
        borderWidth: 1,
      },
    ],
  } : null

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Proyecciones de Pagos vs Reales',
        font: {
          size: 16,
          weight: 'bold',
        },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      x: {
        type: 'category' as const,
        grid: {
          display: false,
        },
      },
      y: {
        type: 'linear' as const,
        beginAtZero: true,
        ticks: {
          callback: (value: number) => `$${value / 1000}k`,
        },
      },
    },
  }

  const pieData = {
    labels: gastos.map(gasto => gasto.concepto),
    datasets: [
      {
        data: gastos.map(gasto => gasto.monto),
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
        position: 'right' as const,
      },
      title: {
        display: true,
        text: 'Distribución de Gastos',
        font: {
          size: 16,
          weight: 'bold',
        },
      },
    },
  }

  return (
    <Box minH="100vh" bg={bgColor} p={4}>
      <Container maxW="container.xl">
        <Tabs isFitted variant="enclosed">
          <TabList mb="1em">
            <Tab><Icon as={FaDollarSign} mr={2} /> Resumen</Tab>
            <Tab><Icon as={FaUsers} mr={2} /> Saldos</Tab>
            <Tab><Icon as={FaCalendar} mr={2} /> Proyecciones</Tab>
            <Tab><Icon as={FaFileAlt} mr={2} /> Informe</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Grid templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(3, 1fr)" }} gap={6} mb={6}>
                <TarjetaResumen
                  icon={FaDollarSign}
                  titulo="Gastos Totales"
                  valor={resumen ? `$${resumen.gastosTotales.toFixed(2)}` : 'Cargando...'}
                  colorAcento={accentColor}
                />
                <TarjetaResumen
                  icon={FaUsers}
                  titulo="Saldos de Propietarios"
                  valor={resumen ? `$${resumen.saldosPropietarios.toFixed(2)}` : 'Cargando...'}
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
                  <Heading size="md">Saldos de Propietarios</Heading>
                </CardHeader>
                <CardBody>
                  <VStack align="start" spacing={2}>
                    {saldos.map((saldo, index) => (
                      <Text key={index}>{saldo.propietario}: ${saldo.saldo.toFixed(2)}</Text>
                    ))}
                  </VStack>
                </CardBody>
              </Card>
            </TabPanel>
            <TabPanel>
              <Card>
                <CardHeader>
                  <Heading size="md">Proyecciones de Pagos</Heading>
                </CardHeader>
                <CardBody>
                  <Box h="400px">
                    {chartData && <Bar data={chartData}/>}
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
                  <Box
                    as="iframe"
                    src="/placeholder.svg?text=Vista+Previa+PDF"
                    width="100%"
                    height="500px"
                    borderRadius="md"
                    mb={4}
                  />
                  <Button leftIcon={<Icon as={FaFileAlt} />} colorScheme="blue">
                    Descargar Informe Completo
                  </Button>
                </CardBody>
              </Card>
            </TabPanel>
          </TabPanels>
        </Tabs>
        <Flex justify="flex-end" mt={8} gap={4}>
          <Button variant="outline" colorScheme="blue">Cancelar</Button>
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