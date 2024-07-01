import React from "react";
import MiniCalendar from "components/calendar/MiniCalendar";
import PieChartCard from "views/admin/maindashboard/components/PieChartCard";
import { IoDocuments } from "react-icons/io5";
import { MdAttachMoney, MdMonetizationOn } from "react-icons/md";

import Widget from "components/widget/Widget";
import ComplexTable from "views/admin/maindashboard/components/ComplexTable";
import AvisosCard from "views/admin/maindashboard/components/AvisosCard";
import tableDataComplex from "./variables/tableDataComplex";
import { Fade } from "@chakra-ui/react";

const Dashboard = () => {
  return (
    <div>
      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
        <Fade in={true}>
          <Widget
            icon={<MdAttachMoney className="h-7 w-7" />}
            title={"Total a recaudar"}
            subtitle={"$195.000"}
          />
        </Fade>
        <Fade in={true} delay={0.1}>
          <Widget
            icon={<IoDocuments className="h-6 w-6" />}
            title={"Recaudado"}
            subtitle={"$75.000"}
          />
        </Fade>
        <Fade in={true} delay={0.2}>
          <Widget
            icon={<MdMonetizationOn className="h-7 w-7" />}
            title={"Pendiente"}
            subtitle={"$120.000"}
          />
        </Fade>
      </div>

      {/* Complex Table */}
      <Fade in={true} >
        <div className="mt-5 grid grid-cols-1 gap-5">
          <ComplexTable tableData={tableDataComplex} />
        </div>
      </Fade>

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
        <Fade in={true} delay={0.3}>
          <div className="grid grid-cols-1 gap-5 rounded-[20px]">
            <PieChartCard />
          </div>
        </Fade>
      </div>
    </div>
  );
};

export default Dashboard;
