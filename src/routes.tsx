import React from "react";
import MainDashboard from "views/admin/default";
import DataTables from "views/admin/tables";
import RTLDefault from "views/rtl/default";
import { PiMoney } from "react-icons/pi";
import { FaCashRegister } from "react-icons/fa6";
import SignIn from "views/auth/SignIn";
import {
  MdHome,
  MdLock,
} from "react-icons/md";

const routes = [
  {
    name: "Dashboard Principal",
    layout: "/admin",
    path: "default",
    icon: <MdHome className="h-6 w-6" />,
    component: <MainDashboard />,
  },
/*   {
    name: "NFT Marketplace",
    layout: "/admin",
    path: "nft-marketplace",
    icon: <MdOutlineShoppingCart className="h-6 w-6" />,
    component: <NFTMarketplace />,
    secondary: true,
  }, */
  {
    name: "Recaudaciones",
    layout: "/admin",
    icon: <PiMoney className="h-6 w-6" />,
    path: "data-tables",
    component: <DataTables />,
  },
/*   {
    name: "Profile",
    layout: "/admin",
    path: "profile",
    icon: <MdPerson className="h-6 w-6" />,
    component: <Profile />,
  }, */
  {
    name: "Gastos Comunes",
    layout: "/admin",
    path: "rtl",
    icon: <FaCashRegister className="h-6 w-6" />,
    component: <RTLDefault />,
  },
  {
    name: "Cerrar Sesion",
    layout: "/auth",
    path: "sign-in",
    icon: <MdLock className="h-6 w-6" />,
    component: <SignIn />,
  },
  
];
export default routes;
