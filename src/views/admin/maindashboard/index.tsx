import MiniCalendar from "components/calendar/MiniCalendar";
import PieChartCard from "views/admin/maindashboard/components/PieChartCard";
import { IoDocuments } from "react-icons/io5";
import { MdAttachMoney, MdBarChart, MdDashboard, MdMonetizationOn } from "react-icons/md";

import Widget from "components/widget/Widget";
import CheckTable from "views/admin/maindashboard/components/CheckTable";
import ComplexTable from "views/admin/maindashboard/components/ComplexTable";
import DailyTraffic from "views/admin/maindashboard/components/DailyTraffic";
import AvisosCard from "views/admin/maindashboard/components/AvisosCard";
import tableDataCheck from "./variables/tableDataCheck";
import tableDataComplex from "./variables/tableDataComplex";


const Dashboard = () => {

  return (
    <>
      <div>

        <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
          <Widget
            icon={<MdAttachMoney className="h-7 w-7" />}
            title={"Total a recaudar"}
            subtitle={"$195.000"}
          />
          <Widget
            icon={<IoDocuments className="h-6 w-6" />}
            title={"Recaudado"}
            subtitle={"$75.000"}
          />
          <Widget
            icon={<MdMonetizationOn className="h-7 w-7" />}
            title={"Pendiente"}
            subtitle={"$120.000"}
          />
        </div>

        {/* Charts */}

        {/*       <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        <TotalSpent />
        <WeeklyRevenue />
      </div>
 */}
        {/* Tables & Charts */}
        <div className="mt-5 grid grid-cols-1 gap-5">
          <ComplexTable tableData={tableDataComplex} />
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-3">
          {/* Check Table */}

          <AvisosCard />
          <div className="grid grid-cols-1 rounded-[20px]">
            <MiniCalendar />
          </div>
          <div className="grid grid-cols-1 gap-5 rounded-[20px]">
            <PieChartCard />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
