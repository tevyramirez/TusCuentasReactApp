import React, { useState, useEffect, useCallback } from 'react'
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Container,
  Flex,
  Grid,
  Heading,
  Spinner,
  Text,
  useColorModeValue,
  useToast,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Button,
  HStack,
} from '@chakra-ui/react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { FaDownload, FaFileExcel } from 'react-icons/fa'
import { API_ADDRESS } from "../../../variables/apiSettings"

interface AgingData {
  envejecimiento: {
    '0_30': number
    '31_60': number
    '61_90': number
    '90_mas': number
  }
}

export default function AgingReport() {
  const [data, setData] = useState<AgingData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const toast = useToast()
  const bgColor = useColorModeValue('white', 'gray.800')

  const fetchAgingData = useCallback(async () => {
    try {
      const token = localStorage.getItem("access_token")
      const response = await fetch(`${API_ADDRESS}bi/envejecimiento/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      })
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error("Error fetching aging data:", error)
      toast({
        title: "Error",
        description: "Hubo un problema al obtener los datos de envejecimiento.",
        status: "error",
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  const exportToCSV = () => {
    if (!data) return

    const csvContent = [
      ['Rango', 'Monto'],
      ['0-30 días', data.envejecimiento['0_30'] || 0],
      ['31-60 días', data.envejecimiento['31_60'] || 0],
      ['61-90 días', data.envejecimiento['61_90'] || 0],
      ['90+ días', data.envejecimiento['90_mas'] || 0]
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'envejecimiento-deudas.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  useEffect(() => {
    fetchAgingData()
  }, [fetchAgingData])

  if (isLoading) {
    return (
      <Flex justifyContent="center" alignItems="center" height="400px">
        <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
      </Flex>
    )
  }

  if (!data) {
    return (
      <Container maxW="container.xl" py={6}>
        <Text>No se pudieron cargar los datos de envejecimiento.</Text>
      </Container>
    )
  }

  // Transform data for chart
  const chartData = [
    { rango: '0-30 días', monto: data.envejecimiento['0_30'], color: '#10B981' },
    { rango: '31-60 días', monto: data.envejecimiento['31_60'], color: '#F59E0B' },
    { rango: '61-90 días', monto: data.envejecimiento['61_90'], color: '#F97316' },
    { rango: '90+ días', monto: data.envejecimiento['90_mas'], color: '#EF4444' },
  ]

  const totalOutstanding = Object.values(data.envejecimiento).reduce((sum, amount) => sum + amount, 0)

  return (
    <Container maxW="container.xl" py={6}>
      <Grid templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }} gap={6}>
        {/* Summary Cards */}
        <Card bg={bgColor} shadow="lg" rounded="2xl">
          <CardHeader>
            <Heading size="lg" color="gray.700">Resumen de Envejecimiento</Heading>
          </CardHeader>
          <CardBody>
            <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
              <Stat>
                <StatLabel>Total Pendiente</StatLabel>
                <StatNumber color="red.500">${totalOutstanding.toLocaleString()}</StatNumber>
                <StatHelpText>Monto total adeudado</StatHelpText>
              </Stat>
              <Stat>
                <StatLabel>Deudas Recientes</StatLabel>
                <StatNumber color="green.500">${data.envejecimiento['0_30'].toLocaleString()}</StatNumber>
                <StatHelpText>0-30 días</StatHelpText>
              </Stat>
              <Stat>
                <StatLabel>Deudas Moderadas</StatLabel>
                <StatNumber color="orange.500">${(data.envejecimiento['31_60'] + data.envejecimiento['61_90']).toLocaleString()}</StatNumber>
                <StatHelpText>31-90 días</StatHelpText>
              </Stat>
              <Stat>
                <StatLabel>Deudas Críticas</StatLabel>
                <StatNumber color="red.500">${data.envejecimiento['90_mas'].toLocaleString()}</StatNumber>
                <StatHelpText>90+ días</StatHelpText>
              </Stat>
            </Grid>
          </CardBody>
        </Card>

        {/* Chart */}
        <Card bg={bgColor} shadow="lg" rounded="2xl">
          <CardHeader>
            <Flex justify="space-between" align="center">
              <Heading size="lg" color="gray.700">Distribución por Antigüedad</Heading>
              <HStack spacing={2}>
                <Button leftIcon={<FaDownload />} size="sm" colorScheme="blue" variant="solid" onClick={exportToCSV}>
                  Descargar
                </Button>
                <Button leftIcon={<FaFileExcel />} size="sm" colorScheme="green" variant="solid">
                  Exportar a Excel
                </Button>
              </HStack>
            </Flex>
          </CardHeader>
          <CardBody>
            <Box h="400px">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="rango"
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Monto']}
                    labelFormatter={(label) => `Rango: ${label}`}
                  />
                  <Bar
                    dataKey="monto"
                    fill="#8884d8"
                    radius={[4, 4, 0, 0]}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardBody>
        </Card>
      </Grid>
    </Container>
  )
}
