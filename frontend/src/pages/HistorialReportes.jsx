import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import api from "../api/axios"; 

const HistorialReportes = () => { 
  const [auditorias, setAuditorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const [filtros, setFiltros] = useState({
      fecha_inicio: '',
      fecha_fin: '',
      estado: ''
  });

  const navigate = useNavigate();

const obtenerReportes = async () => {
    try {
      setCargando(true);

      // 1. Limpiador mágico: Solo agregamos los parámetros si tienen texto
      const parametrosLimpios = {};
      if (filtros.fecha_inicio) parametrosLimpios.fecha_inicio = filtros.fecha_inicio;
      if (filtros.fecha_fin) parametrosLimpios.fecha_fin = filtros.fecha_fin;
      if (filtros.estado) parametrosLimpios.estado = filtros.estado;

      // 2. Enviamos la petición con los filtros ya purificados
      const res = await api.get('/reporte', {
          params: parametrosLimpios
      });
      
      if (res.data && res.data.estado === 'exito') {
          setAuditorias(res.data.datos);
      }
      setError(null);
    } catch (err) {
      // Este console.log ahora te dirá exactamente qué se queja el backend
      console.error("Error del backend:", err.response?.data || err.message);
      setError("Hubo un problema al cargar el historial de reportes.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerReportes();
  }, []);

  const handleBuscar = (e) => {
      e.preventDefault();
      obtenerReportes();
  };

  return (
    <div style={styles.container}>
      {/* 1. ENCABEZADO */}
      <header style={styles.header}>
        <div>
          <h1 style={styles.titulo}>Historial de Reportes</h1>
          <p style={styles.subtitulo}>Consulta general de auditorías finalizadas y abortadas</p>
        </div>
      </header>

      {/* 2. FILTROS DE BÚSQUEDA */}
      <form style={styles.filtrosWrapper} onSubmit={handleBuscar}>
          <div style={styles.inputGroup}>
              <label style={styles.label}>Fecha Inicio</label>
              <input 
                  type="date" 
                  style={styles.input}
                  value={filtros.fecha_inicio}
                  onChange={(e) => setFiltros({...filtros, fecha_inicio: e.target.value})}
              />
          </div>
          <div style={styles.inputGroup}>
              <label style={styles.label}>Fecha Fin</label>
              <input 
                  type="date" 
                  style={styles.input}
                  value={filtros.fecha_fin}
                  onChange={(e) => setFiltros({...filtros, fecha_fin: e.target.value})}
              />
          </div>
          <div style={styles.inputGroup}>
              <label style={styles.label}>Estado</label>
              <select 
                  style={styles.input}
                  value={filtros.estado}
                  onChange={(e) => setFiltros({...filtros, estado: e.target.value})}
              >
                  <option value="">Todos</option>
                  <option value="FINALIZADA">Finalizadas</option>
                  <option value="ABORTADA">Abortadas</option>
              </select>
          </div>
          <button type="submit" style={styles.btnBuscar}>
              Buscar
          </button>
      </form>

      {/* 3. TABLA DE REPORTES */}
      <div style={styles.tablaWrapper}>
        <h3 style={{color: '#0a1f33', marginBottom: '15px'}}>Resultados</h3>
        {cargando ? (
          <p>Cargando reportes...</p>
        ) : error ? (
          <p style={{color: 'red'}}>{error}</p>
        ) : auditorias.length === 0 ? (
          <p>No se encontraron reportes con estos filtros.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.tabla}>
              <thead>
                <tr style={styles.filaHeader}>
                  <th>Código</th>
                  <th>Fecha</th>
                  <th>Planta</th>
                  <th>Auditado</th>
                  <th>Nota</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {auditorias.map((auditoria) => (
                  <tr key={auditoria.id_auditoria} style={styles.filaBody}>
                    <td style={styles.celda}><strong>{auditoria.codigo_auditoria}</strong></td>
                    <td style={styles.celda}>{new Date(auditoria.fecha_fin).toLocaleDateString()}</td>
                    <td style={styles.celda}>{auditoria.nombre_planta || 'N/A'}</td>
                    <td style={styles.celda}>{auditoria.auditado}</td>
                    <td style={styles.celda}>
                        <strong>{auditoria.nota !== null ? `${auditoria.nota}%` : '-'}</strong>
                    </td>
                    <td style={styles.celda}>
                      <span style={
                          auditoria.resultado === 'APROBADA' ? styles.tagAprobada : 
                          auditoria.resultado === 'REPROBADA' ? styles.tagReprobada : 
                          styles.tagNeutro
                      }>
                        {auditoria.resultado}
                      </span>
                    </td>
                    <td style={styles.celda}>
                      <button 
                        style={styles.btnAccion}
                        onClick={() => navigate(`/dashboard/reportes/detalle/${auditoria.id_auditoria}`)}
                      >
                        Ver Detalle
                      </button>
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

// --- ESTILOS ADAPTADOS DE TU VISTA DE USUARIOS ---
const styles = {
  container:{ padding: '30px', backgroundColor: '#f4f7f6', minHeight: '100vh' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
  titulo: { margin: 0, color: '#0a1f33', fontSize: '1.8rem' },
  subtitulo: { margin: 0, color: '#7f8c8d', fontSize: '0.9rem' },
  
  filtrosWrapper: { display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'flex-end', backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '20px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { margin: 0, color: '#7f8c8d', fontSize: '0.85rem', fontWeight: 'bold' },
  input: { padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.9rem', outline: 'none', minWidth: '150px' },
  btnBuscar: { backgroundColor: '#0a1f33', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', height: '37px' },

  tablaWrapper: { backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' },
  tabla: { width: '100%', borderCollapse: 'collapse' },
  filaHeader: { borderBottom: '2px solid #f1f1f1', textAlign: 'left', color: '#7f8c8d', fontSize: '0.85rem' },
  filaBody: { borderBottom: '1px solid #f1f1f1' },
  celda: { padding: '15px 10px', fontSize: '0.9rem' },
  
  tagAprobada: { backgroundColor: '#d4edda', color: '#155724', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold' },
  tagReprobada: { backgroundColor: '#f8d7da', color: '#721c24', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold' },
  tagNeutro: { backgroundColor: '#e2e3e5', color: '#383d41', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold' },
  
  btnAccion: { backgroundColor: 'transparent', border: '1px solid #b89241', color: '#b89241', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }
};

export default HistorialReportes;