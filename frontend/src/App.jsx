import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/usuarios');

        if (res.data && res.data.exito) {
          setUsuarios(res.data.data);
        }
      } catch (err) {
        console.error("Error al conectar con el servidor de Robles:", err);
      } finally {
        setCargando(false);
      }
    };
    obtenerDatos();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Sistema de Auditoría Robles (SAR) </h1>
      <p>Panel de Control - Gestión de Cuentas</p>
      <hr />
      
      {cargando ? (
        <p>Consultando base de datos...</p>
      ) : usuarios.length === 0 ? (
        <p>No se encontraron registros en la tabla SAR_Usuarios.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table border="1" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
            <thead>
              <tr style={{ backgroundColor: '#2c3e50', color: 'white' }}>
                <th style={{ padding: '12px' }}>ID</th>
                <th style={{ padding: '12px' }}>Username</th>
                <th style={{ padding: '12px' }}>ID Rol</th>
                <th style={{ padding: '12px' }}>ID Empleado</th>
                <th style={{ padding: '12px' }}>Estado</th>
                <th style={{ padding: '12px' }}>Creado En</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id_usuario} style={{ textAlign: 'center' }}>
                  <td style={{ padding: '10px' }}>{u.id_usuario}</td>
                  <td style={{ padding: '10px' }}><strong>{u.username}</strong></td>
                  <td style={{ padding: '10px' }}>{u.id_rol}</td>
                  <td style={{ padding: '10px' }}>{u.id_empleado || 'Sin asignar'}</td>
                  <td style={{ padding: '10px' }}>
                    {u.estado_activo ? 'Activo' : 'Inactivo'}
                  </td>
                  <td style={{ padding: '10px' }}>
                    {new Date(u.creado_en).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;