import { Routes, Route, Navigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css"
import RTLLayout from "./layouts/rtl";
import AdminLayout from "./layouts/admin";
import AuthLayout from "./layouts/auth";
import LandingPage from "./layouts/landingpage";  // Importa el nuevo componente LandingPage

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />  {/* Añade esta línea para la landing page */}
      <Route path="auth/*" element={<AuthLayout />} />
      <Route path="admin/*" element={<AdminLayout />} />
      <Route path="rtl/*" element={<RTLLayout />} />
      {/* Elimina o comenta la siguiente línea si quieres que la ruta raíz sea la landing page */}
      {/* <Route path="/" element={<Navigate to="/auth/sign-in" replace />} /> */}
    </Routes>
  );
};

export default App;