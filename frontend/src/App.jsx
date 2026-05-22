import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from './pages/Login'; 
import Dashboard from './pages/Dashboard';
import MainLayout from './components/MainLayout';
import Usuarios from './pages/Usuarios';
import Plantillas from './pages/Plantillas';
import DetallePlantilla from './pages/DetallePlantilla';
import FormularioPlantilla from './pages/FormularioPlantilla';


const RutaProtegida = () => {
  const token = sessionStorage.getItem("token"); // usa UNO solo (IMPORTANTE)

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

function App() {
  return (
    <BrowserRouter>
  <Routes>

    {/* Ruta raíz */}
    <Route path="/" element={<Navigate to="/login" replace />} />

    {/* Login */}
    <Route path="/login" element={<Login />} />

    {/* Rutas protegidas Todas las rutas internas requieren token de sesión activo */}
    <Route element={<RutaProtegida />}>
  
  <Route path="/dashboard" element={<MainLayout />}>
    
    <Route index element={<Dashboard />} />

    <Route path="plantillas">
      <Route index element={<Plantillas />} />
      <Route path="crear" element={<FormularioPlantilla />} />
      <Route path=":codigo" element={<DetallePlantilla />} />
    </Route>

    <Route path="auditorias" element={<div>Módulo Auditorías</div>} />
    <Route path="usuarios" element={<Usuarios />} />
    <Route path="reportes" element={<div>Módulo Reportes</div>} />

  </Route>

</Route>

    {/* Ruta inválida */}
    <Route path="*" element={<Navigate to="/login" replace />} />

  </Routes>
</BrowserRouter>
  );
}

export default App;