import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login'; 
import Dashboard from './pages/Dashboard';
import MainLayout from './components/MainLayout';
import Usuarios from './pages/Usuarios';
import HistorialReportes from './pages/HistorialReportes';
import DetalleReporte from './pages/DetalleReporte';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* si alguien entra a la raiz lo mandamos al login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* ruta del Login */}
        <Route path="/login" element={<Login />} />
        
        {/**/}
        <Route 
          path="/dashboard/*" 
          element={
            <MainLayout>
              <Routes>
                {/* 1. Inicio (El panel con tarjetas de auditorías) */}
                <Route path="/" element={<Dashboard />} />
                
                {/* 2. Plantillas (Próximamente) */}
                <Route path="plantillas" element={<div>Módulo de Plantillas (Próximamente)</div>} />
                
                {/* 3. Auditorías (Próximamente) */}
                <Route path="auditorias" element={<div>Módulo de Auditorías (Próximamente)</div>} />
                
                {/* 4. Usuarios  */}
                <Route path="usuarios" element={<Usuarios />} />
                
                {/* 5. Reportes (Tabla General) */}
                <Route path="reportes" element={<HistorialReportes />} />

                {/* 6. Reportes (Detalle individual para el PDF) */}
                <Route path="reportes/detalle/:id" element={<DetalleReporte />} />

                {/* Si escriben una sub-ruta que no existe, los regresa al Inicio del Dashboard */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </MainLayout>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;