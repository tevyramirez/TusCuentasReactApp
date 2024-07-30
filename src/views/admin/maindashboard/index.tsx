import React from "react";
import { useState, useEffect } from "react";
import MiniCalendar from "components/calendar/MiniCalendar";
import { PieChart, ResponsiveContainer, Pie, Cell, } from "recharts";
import { MdAttachMoney, MdMonetizationOn } from "react-icons/md";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList } from 'recharts';
import Widget from "components/widget/Widget";

import AvisosCard from "views/admin/maindashboard/components/AvisosCard";

import { Fade, Card } from "@chakra-ui/react";
import axios from 'axios';
import { API_ADDRESS } from "variables/apiSettings";

const Dashboard = () => {

  const [dataPieChart, setDataPieChart] = useState([])
  const [totalGastos, setTotalGastos] = useState([])
  const data01 = [
    {
      "name": "Group A",
      "value": 400
    },
    {
      "name": "Group B",
      "value": 300
    },
    {
      "name": "Group C",
      "value": 300
    },
    {
      "name": "Group D",
      "value": 200
    },
    {
      "name": "Group E",
      "value": 278
    },
    {
      "name": "Group F",
      "value": 189
    }
  ];
  const data02 = [
    {
      "name": "Group A",
      "value": 2400
    },
    {
      "name": "Group B",
      "value": 4567
    },
    {
      "name": "Group C",
      "value": 1398
    },
    {
      "name": "Group D",
      "value": 9800
    },
    {
      "name": "Group E",
      "value": 3908
    },
    {
      "name": "Group F",
      "value": 4800
    }
  ];
  const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  const dataFetchPie = async () => {
    try {
      const data = await axios.get(API_ADDRESS + "gastos-por-categoria/");
      console.log("DATA DASHBOARD");
      console.log(data.data.gastos_por_categoria);
      setDataPieChart(data.data.gastos_por_categoria);
      console.log(dataPieChart);
    } catch (error) {
      console.error("Error al obtener los datos del dashboard:", error);
    }
  }
  const dataFetchGadgets = async () => {
    try {
      const data = await axios.get(API_ADDRESS + "gastos-totales/");
      console.log("DATA GASTOS TOTALES");
      console.log(data.data)
      setTotalGastos(data.data.total_gastos);
     
    } catch (error) {
      console.error("Error al obtener los datos del dashboard:", error);
    }
  }

  useEffect(() => {
    dataFetchPie();
    dataFetchGadgets();
  }, []);
  return (
    <div>
      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
        <Fade in={true}>
          <Widget
            icon={<MdAttachMoney className="h-7 w-7" />}
            title={"Total a recaudar"}
            subtitle={`$${totalGastos}`}
          />
        </Fade>

        <Fade in={true} delay={0.2}>
          <Widget
            icon={<MdMonetizationOn className="h-7 w-7" />}
            title={"Pendiente"}
            subtitle={"$120.000"} />
        </Fade>
      </div>

      {/* Complex Table */}
      {/*       <Fade in={true} >
        <div className="mt-5 gr      <Fade in={true} >
        <div className="mt-5 grid grid-cols-1 gap-5">
          <ComplexTable tableData={tableDataComplex} />
        </div>
      </Fade>id grid-cols-1 gap-5">
          <ComplexTable tableData={tableDataComplex} />
        </div>
      </Fade> */}

      {/* Additional Cards */}
      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-3">
        {/* Avisos Card */}

        {/* Pie Chart */}
        <Fade in={true} delay={0.3}>
          
            <Card>
              {/* <ResponsiveContainer width="100%" >
              
              <PieChart width={300} height={300} data={dataPieChart}>
                <Pie  dataKey="total" nameKey="categoria"  fill="#8884d8"  />
              </PieChart>
              
            </ResponsiveContainer> */}
              <ResponsiveContainer width="100%" height={300}>
              <PieChart width={730} height={250}>
                  <Pie data={dataPieChart} dataKey="total"  cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#82ca9d" label >
                  {dataPieChart.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
</PieChart>
              </ResponsiveContainer>
            </Card>
        
        </Fade>
        <Fade in={true} delay={0.3}>
      
      <Card>

        <ResponsiveContainer width="100%" height={300} >
          <BarChart width={730} height={250} data={dataPieChart}>
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
      </Card>
    
  </Fade>
      </div>
      {/* Additional Cards */}
      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-3">
        {/* Avisos Card */}
        <Fade in={true} delay={0.1}>
          <AvisosCard />
        </Fade>
        {/* Mini Calendar */}
        <Fade in={true} delay={0.2}>
          <div className="grid grid-cols-1 rounded-[20px]">
            <MiniCalendar />
          </div>
        </Fade>
        {/* Pie Chart */}
       
      </div>
    </div>
  );
};

export default Dashboard;
