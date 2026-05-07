import { useState, useEffect } from "react";
import api from "../api/axios"; 

const Usuarios= () => { 
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const res = await api.get('/usuarios');
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
    <div style={styles.container}>
      {/* 1. ENCABEZADO */}
      <header style={styles.header}>
        <div>
          <h1 style={styles.titulo}>Gestión de Usuarios</h1>
          <p style={styles.subtitulo}>Administración de cuentas y accesos de Robles</p>
        </div>
        <button style={styles.btnNuevo}>+ Nuevo Usuario</button>
      </header>

      {/* 2. TARJETAS DE RESUMEN DE EMPLEADOS */}
      <div style={styles.gridCards}>
        <div style={styles.card}>
          <div style={{fontSize: '2rem'}}>👥</div>
          <h3 style={styles.cardValue}>{usuarios.length}</h3>
          <p style={styles.cardLabel}>Usuarios Totales</p>
        </div>
        <div style={styles.card}>
          <div style={{fontSize: '2rem'}}>🛡️</div>
          <h3 style={styles.cardValue}>
            {usuarios.filter(u => u.id_rol === 1).length}
          </h3>
          <p style={styles.cardLabel}>Administradores</p>
        </div>
        <div style={styles.card}>
          <div style={{fontSize: '2rem'}}>✅</div>
          <h3 style={styles.cardValue}>
            {usuarios.filter(u => u.estado_activo).length}
          </h3>
          <p style={styles.cardLabel}>Cuentas Activas</p>
        </div>
      </div>

      {/* 3. TABLA DE USUARIOS/EMPLEADOS */}
      <div style={styles.tablaWrapper}>
        <h3 style={{color: '#0a1f33', marginBottom: '15px'}}>Listado de Cuentas</h3>
        {cargando ? (
          <p>Cargando personal...</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.tabla}>
              <thead>
                <tr style={styles.filaHeader}>
                  <th>Username</th>
                  <th>Rol</th>
                  <th>ID Empleado</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u) => (
                  <tr key={u.id_usuario} style={styles.filaBody}>
                    <td style={styles.celda}><strong>{u.username}</strong></td>
                    <td style={styles.celda}>{u.id_rol === 1 ? 'Admin' : 'Auditor'}</td>
                    <td style={styles.celda}>{u.id_empleado || 'S/A'}</td>
                    <td style={styles.celda}>
                      <span style={u.estado_activo ? styles.tagActivo : styles.tagInactivo}>
                        {u.estado_activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td style={styles.celda}>
                      <button style={styles.btnAccion}>Editar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};


const styles = {
  container:{ 
    padding: '30px',
     backgroundColor:
     '#f4f7f6',
      minHeight: '100vh' },

  header: {
     display: 'flex', 
     justifyContent: 'space-between',
      alignItems: 'center',
       marginBottom: '30px'
     },
  titulo: {
     margin: 0,
      color: '#0a1f33', 
      fontSize: '1.8rem'
     },
  subtitulo: {
     margin: 0,
      color: '#7f8c8d',
       fontSize: '0.9rem'
     },
  btnNuevo: { 
    backgroundColor: '#b89241',
     color: 'white',
      border: 'none', 
      padding: '10px 20px',
       borderRadius: '8px', 
       fontWeight: 'bold',
        cursor: 'pointer'
     },
  gridCards: {
     display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
       gap: '20px',
        marginBottom: '30px'
     },
  card: {
     backgroundColor: 'white',
      padding: '20px', 
      borderRadius: '12px',
       boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
        textAlign: 'center' 
    },
  cardValue: { 
    fontSize: '1.5rem',
     margin: '10px 0 5px 0',
      color: '#0a1f33' 
    },
  cardLabel: {
     margin: 0,
      color: '#7f8c8d',
       fontSize: '0.8rem' 
    },
  tablaWrapper: { 
    backgroundColor: 'white',
     padding: '20px',
      borderRadius: '12px', 
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
     },
  tabla: {
     width: '100%',
      borderCollapse: 'collapse'
     },
  filaHeader: {
     borderBottom: '2px solid #f1f1f1', 
     textAlign: 'left',
      color: '#7f8c8d',
       fontSize: '0.85rem' 
    },
  filaBody: {
     borderBottom: '1px solid #f1f1f1' 
    },
  celda: {
     padding: '15px 10px', 
     fontSize: '0.9rem' 
    },
  tagActivo: {
     backgroundColor: '#d4edda',
      color: '#155724',
       padding: '4px 8px',
        borderRadius: '6px',
         fontSize: '0.75rem'
         },
  tagInactivo: {
     backgroundColor: '#f8d7da',
      color: '#721c24', 
      padding: '4px 8px', 
      borderRadius: '6px',
       fontSize: '0.75rem' 
    },
  btnAccion: {
     backgroundColor: 'transparent', 
     border: '1px solid #b89241', 
     color: '#b89241', 
     padding: '5px 10px',
      borderRadius: '5px', 
      cursor: 'pointer' 
    }
};

export default Usuarios; // <--- Exportamos como Usuarios