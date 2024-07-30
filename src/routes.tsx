import React from "react";
import MainDashboard from "views/admin/maindashboard";
import Proveedores from "views/admin/proveedores";
import GastosComunes from "views/admin/gastos";
import Propietarios from "views/admin/propietarios"
import Recaudaciones from "views/admin/recaudaciones";
import { FaCashRegister } from "react-icons/fa6";
import SignIn from "views/auth/SignIn";
import {
  MdHome,
  MdLock,
  MdEmojiPeople,

  MdPeople,
  MdOutlineAttachMoney
} from "react-icons/md";

const routes = [
  {
    name: "Dashboard Principal",
    layout: "/admin",
    path: "default",
    icon: <MdHome className="h-6 w-6" />,
    component: <MainDashboard />,
  },
  /* {
    name: "Macrolotes",
    layout: "/admin",
    icon: <MdMapsHomeWork className="h-6 w-6" />,
    path: "macrolotes",
    component: <Proveedores />,
  }, */
 /*  {
    name: "Lotes",
    layout: "/admin",
    icon: <MdApartment className="h-6 w-6" />,
    path: "loteh",
    component: <Lote />,
  }, */
  {
    name: "Proveedores",
    layout: "/admin",
    icon: <MdPeople className="h-6 w-6" />,
    path: "proveedores",
    component: <Proveedores />,
  },
  {
    name: "Gastos Comunes",
    layout: "/admin",
    path: "gastoscomunes",
    icon: <FaCashRegister className="h-6 w-6" />,
    component: <GastosComunes />,
  },
  {
    name: "Recaudaciones",
    layout: "/admin",
    path: "recaudaciones",
    icon: <MdOutlineAttachMoney className="h-6 w-6" />,
    component: <Recaudaciones />,
  },
  {
    name: "Propietarios",
    layout: "/admin",
    path: "propietarios",
    icon: <MdEmojiPeople className="h-6 w-6" />,
    component: <Propietarios />,
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
