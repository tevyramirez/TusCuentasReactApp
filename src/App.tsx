import { Routes, Route, Navigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css"
import RtlLayout from "layouts/rtl";
import AdminLayout from "layouts/admin";
import AuthLayout from "layouts/auth";
const App = () => {
  return (
    <Routes>
      <Route path="auth/*" element={<AuthLayout />} />
      <Route path="admin/*" element={<AdminLayout />} />
      <Route path="rtl/*" element={<RtlLayout />} />
      <Route path="/" element={<Navigate to="/auth/sign-in" replace />} />
    </Routes>
  );
};

export default App;
