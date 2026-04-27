import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login'; 
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* si alguien entra a la raiz lo mandamos al login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* ruta del Login */}
        <Route path="/login" element={<Login />} />
        
        {/**/}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;