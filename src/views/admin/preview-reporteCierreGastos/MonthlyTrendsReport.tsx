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
  useColorModeValue,
  useToast,
  Button,
  HStack,
} from '@chakra-ui/react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { FaDownload, FaFileExcel } from 'react-icons/fa'
import { API_ADDRESS } from "../../../variables/apiSettings.js"

export default function MonthlyTrendsReport() {
  const [data, setData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const toast = useToast()
  const bgColor = useColorModeValue('white', 'gray.800')

  const fetchMonthlySeries = useCallback(async () => {
    try {
      const token = localStorage.getItem("access_token")
      const response = await fetch(`${API_ADDRESS}bi/series-mensuales/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      })
      const result = await response.json()

      // Transform data for recharts
      const chartData = result.meses.map((mes: string, index: number) => ({
        mes: mes,
        esperado: result.esperado[index],
        recaudado: result.recaudado[index]
      }))

      setData(chartData)
    } catch (error) {
      console.error("Error fetching monthly series:", error)
      toast({
        title: "Error",
        description: "Hubo un problema al obtener las series mensuales.",
        status: "error",
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  const exportToCSV = () => {
    if (data.length === 0) return

    const csvContent = [
      ['Mes', 'Monto Esperado', 'Monto Recaudado'],
      ...data.map(item => [item.mes, item.esperado, item.recaudado])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'tendencias-mensuales.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  useEffect(() => {
    fetchMonthlySeries()
  }, [fetchMonthlySeries])

  if (isLoading) {
    return (
      <Flex justifyContent="center" alignItems="center" height="400px">
        <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
      </Flex>
    )
  }

  return (
    <Container maxW="container.xl" py={6}>
      <Grid templateColumns={{ base: "1fr" }} gap={6}>
        <Card bg={bgColor} shadow="lg" rounded="2xl">
          <CardHeader>
            <Flex justify="space-between" align="center">
              <Heading size="lg" color="gray.700">Tendencias Mensuales de Recaudación</Heading>
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
            <Box h="500px">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="mes"
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                    labelFormatter={(label) => `Mes: ${label}`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="esperado"
                    stroke="#8884d8"
                    strokeWidth={3}
                    name="Monto Esperado"
                    dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="recaudado"
                    stroke="#82ca9d"
                    strokeWidth={3}
                    name="Monto Recaudado"
                    dot={{ fill: '#82ca9d', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </CardBody>
        </Card>
      </Grid>
    </Container>
  )
}
