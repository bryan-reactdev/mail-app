import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";
import Error from "./pages/Error";
import { useEffect } from "react";
import { useUserStore } from "./stores/useUserStore";
import Usuarios from "./pages/Usuarios";
import Estadisticas from "./pages/Estadisticas";

export default function App() {
  const { authenticate } = useUserStore();

  useEffect(() => {
    authenticate();
  }, []);

  return (
    <>
      <Toaster
        position="top-center"
        richColors
      />
      <Router>
        <Routes>
          <Route path="/" element={<Landing/>} errorElement={<Error/>}/>
          <Route path="/login" element={<Login/>} errorElement={<Error/>}/>
          <Route path="/register" element={<Register/>} errorElement={<Error/>}/>

          <Route path="/app" element={<ProtectedRoute/>} errorElement={<Error/>}>
            <Route path="" element={<Dashboard/>} errorElement={<Error/>}/>
            <Route path="users" element={<Usuarios/>} errorElement={<Error/>}/>
            <Route path="statistics" element={<Estadisticas/>} errorElement={<Error/>}/>
            <Route path="*" element={<NotFound/>}/>
          </Route>

          <Route path="*" element={<NotFound/>}/>
        </Routes>

      </Router>
    </>
  )
}
