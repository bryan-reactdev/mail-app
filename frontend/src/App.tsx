import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Router>
      <Toaster
        position="top-right"
        richColors
      />

      <Routes>
        <Route path="/" element={<Landing/>}/>
        <Route path="/login" element={<Login/>}/>

        <Route element={<ProtectedRoute/>}>
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="*" element={<NotFound/>}/>
        </Route> 
        
      </Routes>

    </Router>
  )
}