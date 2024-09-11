import React from "react";
import { useState, useEffect } from "react";
import MiniCalendar from "components/calendar/MiniCalendar";
import { PieChart, ResponsiveContainer, Pie, Cell, } from "recharts";
import { MdAttachMoney, MdMonetizationOn } from "react-icons/md";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import Widget from "components/widget/Widget";
import AvisosCard from "views/admin/maindashboard/components/AvisosCard";
import { Fade, Card, Spinner, Box } from "@chakra-ui/react";
import axios from 'axios';
import { API_ADDRESS } from "variables/apiSettings";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

const Dashboard = () => {
  const [dataPieChart, setDataPieChart] = useState([])
  const [totalGastos, setTotalGastos] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const colors = ['#6366F1', '#EC4899', '#8B5CF6', '#10B981', '#F59E0B'];
  const periodoSeleccionado = useSelector((state: any) => state.periodo.periodoActual);
  
  const dataFetchPie = async () => {
    try {
      let token = localStorage.getItem("access_token");
      const data = await axios.get(API_ADDRESS + "gastos-por-categoria-por-periodo/"+periodoSeleccionado+"/", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      setDataPieChart(data.data.gastos_por_categoria);
    } catch (error) {
      console.error("Error al obtener los datos del dashboard:", error);
    }
  }

  const dataFetchGadgets = async () => {
    try {
      const data = await axios.get(API_ADDRESS + "gastos-totales-por-periodo/"+periodoSeleccionado+"/", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("access_token")}`
      }});
      setTotalGastos(data.data.total_gastos);
    } catch (error) {
      console.error("Error al obtener los datos del dashboard:", error);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([dataFetchPie(), dataFetchGadgets()]);
      setIsLoading(false);
    };
    fetchData();
  }, [periodoSeleccionado]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      </Box>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 space-y-8 bg-gradient-to-br from-gray-50 to-gray-100"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Widget
            icon={<MdAttachMoney className="h-10 w-10 text-indigo-500" />}
            title={"Total a recaudar"}
            subtitle={`$${totalGastos.toLocaleString()}`}
          
          />
        </motion.div>
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Widget
            icon={<MdMonetizationOn className="h-10 w-10 text-pink-500" />}
            title={"Pendiente"}
            subtitle={"$120.000"}
            
          />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white shadow-lg rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100">
            <Box className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Gastos por Categoría</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dataPieChart}
                    dataKey="total"
                    nameKey="categoria"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  >
                    {dataPieChart.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-white shadow-lg rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100">
            <Box className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Gastos por Categoría (Barras)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dataPieChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="categoria" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total" fill="#8884d8">
                    {dataPieChart.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </motion.div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-white shadow-lg rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100">
            <Box className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Calendario</h3>
              <MiniCalendar />
            </Box>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <Card className="bg-white shadow-lg rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100">
          <Box className="p-6">
            <AvisosCard />
          </Box>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;