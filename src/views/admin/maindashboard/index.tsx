"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useSelector } from "react-redux"
import axios from "axios"
import {
  Box,
  Grid,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  Flex,
  Spinner,
  useColorModeValue,
  Stack,
} from "@chakra-ui/react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { MdAttachMoney, MdMonetizationOn, MdTrendingUp, MdWarning } from "react-icons/md"

import { API_ADDRESS } from "../../../variables/apiSettings"
import Widget from "../../../components/widget/Widget"
import MiniCalendar from "../../../components/calendar/MiniCalendar"
import AvisosCard from "../../../views/admin/maindashboard/components/AvisosCard"

const COLORS = ["#6366F1", "#EC4899", "#8B5CF6", "#10B981", "#F59E0B"]

interface SumaSaldos {
  suma_pendiente: number,
  suma_a_favor: number,
}

export default function EnhancedDashboard() {
  const [dataPieChart, setDataPieChart] = useState([])
  const [totalGastos, setTotalGastos] = useState(0)
  const [pendingAmount, setPendingAmount] = useState(0)
  const [monthlyExpenses, setMonthlyExpenses] = useState([])
  const [topExpenses, setTopExpenses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [saldos, setSaldos] = useState({
    suma_pendiente: 0,
    suma_a_favor: 0,
  })
  const periodoSeleccionado = useSelector((state: any) => state.periodo.periodoActual)

  const bgColor = useColorModeValue("white", "gray.800")
  const textColor = useColorModeValue("gray.800", "white")

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const token = localStorage.getItem("access_token")
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }

        const [sumaSaldos, gastosPorCategorias] = await Promise.all([
          axios.get(`${API_ADDRESS}sumasaldos/`, { headers }),
          axios.get(`${API_ADDRESS}gastos-por-categoria/`, { headers }),
        ])

        setSaldos(sumaSaldos.data)
        console.log (gastosPorCategorias.data)

      
      } catch (error) {
        console.error("Error al obtener los datos del dashboard:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [periodoSeleccionado])

  if (isLoading) {
    return (
      <Flex justifyContent="center" alignItems="center" height="100vh">
        <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
      </Flex>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 space-y-8 bg-gradient-to-br from-gray-50 to-gray-100"
    >
      <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap={6}>
        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
          <Widget
            icon={<MdAttachMoney className="h-10 w-10 text-indigo-500" />}
            title="Total a recaudar"
            subtitle={`$${saldos.suma_pendiente.toLocaleString()}`}
          />
        </motion.div>
        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
          <Widget
            icon={<MdMonetizationOn className="h-10 w-10 text-green-500" />}
            title="Pagado"
            subtitle={`$${saldos.suma_a_favor.toLocaleString()}`}
          />
        </motion.div>
        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
          <Widget
            icon={<MdTrendingUp className="h-10 w-10 text-green-500" />}
            title="Tasa de recaudación"
            subtitle={`${((saldos.suma_a_favor) / saldos.suma_pendiente * 100).toFixed(2)}%`}
          />
        </motion.div>
        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
          <Widget
            icon={<MdWarning className="h-10 w-10 text-yellow-500" />}
            title="Propietarios morosos"
            subtitle="5"
          />
        </motion.div>
      </Grid>

      <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6}>
        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
          <Card bg={bgColor} shadow="lg" rounded="2xl" overflow="hidden" transition="all 0.3s" _hover={{ shadow: "xl" }}>
            <CardHeader>
              <Heading size="md" color={textColor}>Gastos Mensuales</Heading>
            </CardHeader>
            <CardBody>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyExpenses}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="total" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>
        </motion.div>

        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.7 }}>
          <Card bg={bgColor} shadow="lg" rounded="2xl" overflow="hidden" transition="all 0.3s" _hover={{ shadow: "xl" }}>
            <CardHeader>
              <Heading size="md" color={textColor}>Gastos por Categoría</Heading>
            </CardHeader>
            <CardBody>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dataPieChart}
                    dataKey="total"
                    nameKey="categoria"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  >
                    {dataPieChart.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>
        </motion.div>
      </Grid>

      <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8 }}>
          <Card bg={bgColor} shadow="lg" rounded="2xl" overflow="hidden" transition="all 0.3s" _hover={{ shadow: "xl" }}>
            <CardHeader>
              <Heading size="md" color={textColor}>Top 5 Gastos</Heading>
            </CardHeader>
            <CardBody>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topExpenses}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="categoria" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total" fill="#8884d8">
                    {topExpenses.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>
        </motion.div>

        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.9 }}>
          <Card bg={bgColor} shadow="lg" rounded="2xl" overflow="hidden" transition="all 0.3s" _hover={{ shadow: "xl" }}>
            <CardHeader>
              <Heading size="md" color={textColor}>Calendario de Eventos</Heading>
            </CardHeader>
            <CardBody>
              <MiniCalendar />
            </CardBody>
          </Card>
        </motion.div>
      </Grid>

      <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1 }}>
        <Card bg={bgColor} shadow="lg" rounded="2xl" overflow="hidden" transition="all 0.3s" _hover={{ shadow: "xl" }}>
          <CardHeader>
            <Heading size="md" color={textColor}>Avisos Importantes</Heading>
          </CardHeader>
          <CardBody>
            <AvisosCard />
          </CardBody>
        </Card>
      </motion.div>
    </motion.div>
  )
}