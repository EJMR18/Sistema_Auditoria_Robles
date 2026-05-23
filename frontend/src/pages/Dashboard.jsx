import { useState, useEffect } from "react";
import api from "../api/axios"; 
import { CheckCircle2 } from 'lucide-react';
import { Play } from 'lucide-react';
import { XCircle } from 'lucide-react';

const Dashboard = () => {
  // Dejamos el estado vacío para que refleje la base de datos actual
  const [auditorias, setAuditorias] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
  const obtenerDatos = async () => {
    try {

      setCargando(true);

      const res = await api.get('/dashboard/principal');

      if (res.data?.exito) {
        setAuditorias(res.data.datos || []);
      }

    } catch (err) {

      console.error(
        "Error al conectar con SAR Robles:",
        err.response?.data || err.message
      );

      setAuditorias([]);

    } finally {
      setCargando(false);
    }
  };

  obtenerDatos();
}, []);
  // Los contadores marcarán 0 automáticamente si el arreglo está vacío
  const activas = auditorias.filter(a => a.estado === 'EN_PROCESO').length;
  const completas = auditorias.filter(a => a.estado === 'FINALIZADA').length;
  const abortadas = auditorias.filter(a => a.estado === 'ABORTADA').length;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.titulo}>Panel de Control Operativo</h1>
          <p style={styles.subtitulo}>Resumen de inspecciones en plantas de Robles</p>
        </div>
      </header>

      {/* SECCIÓN DE TARJETAS */}
      <div style={styles.gridCards}>
        <div style={{...styles.card, borderTop: '5px solid #3498db'}}>
          <Play size={32} style={{ color: '#3b82f6' }} />
          <h3 style={styles.cardValue}>{activas}</h3>
          <p style={styles.cardLabel}>Auditorías Activas</p>
        </div>

        <div style={{...styles.card, borderTop: '5px solid #2ecc71'}}>
          <CheckCircle2 size={32} style={{ color: '#22c55e' }} />
          <h3 style={styles.cardValue}>{completas}</h3>
          <p style={styles.cardLabel}>Auditorías Completas</p>
        </div>

        <div style={styles.columnaAccion}>
          <button style={styles.btnNuevo}>+ Nueva Auditoría</button>
          <div style={{...styles.card, borderTop: '5px solid #e74c3c', width: '100%'}}>
            <XCircle size={32} style={{ color: '#ef4444' }} />
            <h3 style={styles.cardValue}>{abortadas}</h3>
            <p style={styles.cardLabel}>Auditorías Abortadas</p>
          </div>
        </div>
      </div>

      <div style={styles.tablaWrapper}>
        <h3 style={{color: '#0a1f33', marginBottom: '15px'}}>Auditorías Recientes</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.tabla}>
            <thead>
              <tr style={styles.filaHeader}>
                <th>CÓDIGO</th>
                <th>PLANTA</th>
                <th>FECHA</th>
                <th>ESTADO</th>
                <th>ACCIÓN</th>
              </tr>
            </thead>
            <tbody>
              {auditorias.length > 0 ? (
                auditorias.map((a) => (
                  <tr key={a.id_auditoria} style={styles.filaBody}>
                    <td style={styles.celda}><strong>{a.codigo_auditoria}</strong></td>
                    <td style={styles.celda}>{a.nombre_planta || 'Sin especificar'}</td>
                    <td style={styles.celda}>{new Date(a.creado_en).toLocaleDateString()}</td>
                    <td style={styles.celda}>
                      <span style={a.estado === 'FINALIZADA' ? styles.tagFin : styles.tagProc}>
                        {a.estado}
                      </span>
                    </td>
                    <td style={styles.celda}>
                      <button style={styles.btnVer}>VER</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{textAlign: 'center', padding: '30px', color: '#7f8c8d'}}>
                    {cargando ? "Cargando datos..." : "No hay auditorías registradas en la base de datos."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { 
    padding: '30px',
     backgroundColor: '#f4f7f6',
      minHeight: '100vh' 
    },
  header: { 
    marginBottom: '20px' 
  },
  titulo: { 
    fontSize: '1.8rem',
     color: '#0a1f33',
      margin: 0
     },
  subtitulo: {
     color: '#7f8c8d',
      margin: '5px 0 0 0' 
    },
  gridCards: { 
    display: 'flex',
     gap: '20px',
      alignItems: 'flex-end',
       marginBottom: '40px' 
      },
  columnaAccion: { 
    display: 'flex',
     flexDirection: 'column', 
     gap: '15px',
      flex: '1',
       minWidth: '200px'
       },
  card: {
     flex: '1', 
     minWidth: '200px',
      backgroundColor: '#fff',
       padding: '20px',
        textAlign: 'center',
         boxShadow: '0 4px 6px rgba(0,0,0,0.05)', 
         borderRadius: '12px'
         },
  btnNuevo: {
     backgroundColor: '#b89241',
      color: 'white',
       border: 'none',
        padding: '12px',
         borderRadius: '8px',
          fontWeight: 'bold',
           cursor: 'pointer',
            boxShadow: '0 4px 10px rgba(184, 146, 65, 0.3)'
           },
  cardValue: { 
    fontSize: '2.2rem',
     margin: '10px 0',
      color: '#0a1f33' 
    },
  cardLabel: {
     color: '#95a5a6',
      fontWeight: 'bold', 
      fontSize: '0.8rem',
       textTransform: 'uppercase'
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
     textAlign: 'left', 
     color: '#7f8c8d',
      borderBottom: '2px solid #eee' 
    },
  filaBody: {
     borderBottom: '1px solid #f1f1f1' 
    },
  celda: {
     padding: '15px 10px' 
    },
  btnVer: {
     backgroundColor: '#0a1f33', 
     color: '#fff', 
     border: 'none', 
     padding: '6px 15px',
      borderRadius: '4px',
       cursor: 'pointer' 
      },
  tagFin: {
     backgroundColor: '#d4edda',
      color: '#155724',
       padding: '4px 8px',
        borderRadius: '4px', 
        fontSize: '0.75rem' 
      },
  tagProc: { 
    backgroundColor: '#fff3cd',
     color: '#856404',
      padding: '4px 8px', 
      borderRadius: '4px',
       fontSize: '0.75rem'
       }
};

export default Dashboard;