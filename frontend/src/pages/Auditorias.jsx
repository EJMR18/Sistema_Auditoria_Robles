import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auditoriaService } from '../services/auditoriaService';
import { ClipboardList, Plus, Search, Trash2, Eye, Check, CheckCircle, XCircle } from 'lucide-react';

const Auditorias = () => {
  const navigate = useNavigate();
  const [auditorias, setAuditorias] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorGlobal, setErrorGlobal] = useState('');

  // Usuario activo para validar roles
  const usuarioData = sessionStorage.getItem('usuario');
  const usuarioActivo = usuarioData ? JSON.parse(usuarioData) : null;
  const esAdmin = usuarioActivo?.id_rol === 1;

  const cargarAuditorias = async () => {
    try {
      setLoading(true);
      const datos = await auditoriaService.obtenerAuditorias();
      setAuditorias(datos || []);
      setErrorGlobal('');
    } catch (err) {
      setErrorGlobal(err.mensaje || 'Error al cargar las auditorías.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarAuditorias();
  }, []);

  const handleInhabilitar = async (id, codigo) => {
    if (window.confirm(`¿Estás seguro de que deseas inhabilitar la auditoría "${codigo}"?`)) {
      try {
        await auditoriaService.inhabilitarAuditoria(id);
        cargarAuditorias();
      } catch (err) {
        alert(err.mensaje || 'No se pudo inhabilitar la auditoría.');
      }
    }
  };

  const handleIniciar = async (id, codigo) => {
    if (window.confirm(`¿Estás seguro de que deseas habilitar y poner en proceso la auditoría "${codigo}"?`)) {
      try {
        await auditoriaService.iniciarAuditoria(id);
        cargarAuditorias();
      } catch (err) {
        alert(err.mensaje || 'No se pudo habilitar la auditoría.');
      }
    }
  };

  const handleDeshabilitar = async (id, codigo) => {
    if (window.confirm(`¿Estás seguro de que deseas quitar el check (revertir a Creada) a la auditoría "${codigo}"?`)) {
      try {
        await auditoriaService.deshabilitarAuditoriaRevertir(id);
        cargarAuditorias();
      } catch (err) {
        alert(err.mensaje || 'No se pudo deshabilitar la auditoría.');
      }
    }
  };

  const handleFinalizar = async (id, codigo) => {
    if (window.confirm(`¿Estás seguro de que deseas finalizar la auditoría "${codigo}"?`)) {
      try {
        await auditoriaService.finalizarAuditoria(id);
        cargarAuditorias();
      } catch (err) {
        alert(err.mensaje || 'No se pudo finalizar la auditoría.');
      }
    }
  };

  const auditoriasFiltradas = auditorias.filter(a =>
    (a.codigo_auditoria || '').toLowerCase().includes(busqueda.toLowerCase()) ||
    (a.estado || '').toLowerCase().includes(busqueda.toLowerCase())
  );

  const getEstadoBadge = (estado) => {
    switch (estado) {
        case 'CREADA': return styles.badgeCreada;
        case 'EN_PROCESO': return styles.badgeProceso;
        case 'FINALIZADA': return styles.badgeFinalizada;
        case 'ABORTADA': return styles.badgeAbortada;
        default: return styles.badgeCreada;
    }
  };

  return (
    <div style={styles.container}>
      {/* ENCABEZADO */}
      <header style={styles.header}>
        <div>
          <h2 style={styles.titulo}>Gestión de Auditorías</h2>
          <p style={styles.subtitulo}>Planeación y Ejecución</p>
        </div>
      </header>

      {/* TARJETAS DE RESUMEN */}
      <div style={styles.gridCards}>
        <div style={styles.card}>
          <div style={{fontSize: '2rem'}}>📋</div>
          <h3 style={styles.cardValue}>{auditorias.length}</h3>
          <p style={styles.cardLabel}>Auditorías Totales</p>
        </div>
        <div style={styles.card}>
          <div style={{fontSize: '2rem'}}>⏳</div>
          <h3 style={styles.cardValue}>
            {auditorias.filter(a => a.estado === 'EN_PROCESO').length}
          </h3>
          <p style={styles.cardLabel}>En Proceso</p>
        </div>
      </div>

      {errorGlobal && <div style={{ color: '#721c24', backgroundColor: '#f8d7da', padding: '10px', borderRadius: '6px', marginBottom: '15px' }}>{errorGlobal}</div>}

      {/* BARRA DE ACCIONES */}
      <div style={styles.actionsBar}>
        <div style={styles.searchContainer}>
          <Search size={18} style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar por código o estado..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={styles.inputBuscar}
          />
        </div>
        
        {/* Solo el admin debería poder planificar una auditoría */}
        {esAdmin && (
          <button onClick={() => navigate('/dashboard/auditorias/crear')} style={styles.btnCrear}>
            <Plus size={18} style={{ marginRight: '5px' }} /> PLANIFICAR AUDITORÍA
          </button>
        )}
      </div>

      {/* TABLA DE GESTIÓN */}
      <div style={styles.tableContainer}>
        {loading ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>Cargando auditorías...</div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>CÓDIGO</th>
                <th style={styles.th}>TIPO</th>
                <th style={styles.th}>ESTADO</th>
                <th style={styles.th}>FECHA INICIO</th>
                <th style={styles.th}>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {auditoriasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#94a3b8' }}>
                    No se encontraron auditorías activas.
                  </td>
                </tr>
              ) : (
                auditoriasFiltradas.map(a => (
                  <tr key={a.id_auditoria} style={styles.tr}>
                    <td style={styles.tdCodigo}>{a.codigo_auditoria}</td>
                    <td style={styles.tdNombre}>{a.tipo_auditoria}</td>
                    <td style={styles.td}>
                      <span style={{...styles.badgeBase, ...getEstadoBadge(a.estado)}}>
                        {a.estado}
                      </span>
                    </td>
                    <td style={styles.td}>{a.fecha_inicio ? new Date(a.fecha_inicio).toLocaleDateString() : 'No iniciada'}</td>
                    <td style={styles.tdAcciones}>
                      
                      {/* ACCIONES DEL AUDITOR/ADMIN DEPENDIENDO DEL ESTADO */}
                      {a.estado === 'CREADA' && (
                         <button style={styles.actionBtnPrimary} onClick={() => handleIniciar(a.id_auditoria, a.codigo_auditoria)} title="Habilitar Auditoría">
                           <Check size={16} />
                         </button>
                      )}
                      
                      {a.estado === 'EN_PROCESO' && (
                         <button style={styles.actionBtnWarning} onClick={() => handleDeshabilitar(a.id_auditoria, a.codigo_auditoria)} title="Deshabilitar Auditoría (Revertir)">
                           <XCircle size={16} />
                         </button>
                      )}
                      
                      {a.estado === 'EN_PROCESO' && !esAdmin && (
                         <>
                           <button style={styles.actionBtnSecondary} onClick={() => navigate(`/dashboard/auditorias/${a.id_auditoria}/ejecutar`)} title="Evaluar Preguntas">
                             <Eye size={16} />
                           </button>
                           <button style={styles.actionBtnSuccess} onClick={() => handleFinalizar(a.id_auditoria, a.codigo_auditoria)} title="Finalizar Auditoría">
                             <CheckCircle size={16} />
                           </button>
                         </>
                      )}

                      {/* ELIMINAR SOLO ADMIN */}
                      {esAdmin && a.estado === 'CREADA' && (
                        <button style={styles.actionBtnDanger} onClick={() => handleInhabilitar(a.id_auditoria, a.codigo_auditoria)} title="Inhabilitar">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '20px', backgroundColor: '#fff', borderRadius: '8px' },
  header: { display: 'flex', alignItems: 'center', marginBottom: '25px', gap: '15px' },
  btnAtras: { padding: '8px', border: '1px solid #e5e7eb', borderRadius: '4px', backgroundColor: '#f9fafb', cursor: 'pointer', display: 'flex', alignItems: 'center' },
  titulo: { margin: 0, fontSize: '22px', color: '#1f2937', fontWeight: 'bold' },
  subtitulo: { margin: 0, fontSize: '12px', color: '#9ca3af' },

  gridCards: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' },
  card: { backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', textAlign: 'center' },
  cardValue: { fontSize: '1.5rem', margin: '10px 0 5px 0', color: '#1f2937' },
  cardLabel: { color: '#64748b', fontSize: '0.9rem', margin: 0 },
  
  actionsBar: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: '20px', 
    gap: '20px',
    width: '100%' 
  },
  searchContainer: { 
    position: 'relative', 
    flex: 1,
    maxWidth: '500px'
  },
  searchIcon: { position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' },
  inputBuscar: { width: '100%', padding: '10px 10px 10px 40px', border: '1px solid #cbd5e1', borderRadius: '4px', backgroundColor: '#f8fafc', fontSize: '14px' },
  
  btnCrear: { backgroundColor: '#d97706', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' },
  
  tableContainer: { border: '1px solid #e2e8f0', borderRadius: '6px', overflow: 'hidden', backgroundColor: '#fff' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' },
  th: { backgroundColor: '#f1f5f9', color: '#475569', padding: '12px 16px', fontWeight: 'bold', fontSize: '12px', borderBottom: '1px solid #e2e8f0' },
  tr: { borderBottom: '1px solid #f1f5f9' },
  td: { padding: '14px 16px', color: '#334155' },
  tdCodigo: { padding: '14px 16px', color: '#475569', fontWeight: '500' },
  tdNombre: { padding: '14px 16px', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '10px' },
  tdAcciones: { padding: '14px 16px', display: 'flex', gap: '8px' },
  
  badgeBase: { padding: '2px 8px', borderRadius: '4px', fontSize: '12px', border: '1px solid #cbd5e1' },
  badgeCreada: { backgroundColor: '#f1f5f9', color: '#475569' },
  badgeProceso: { backgroundColor: '#fef3c7', color: '#d97706', borderColor: '#fde68a' },
  badgeFinalizada: { backgroundColor: '#dcfce7', color: '#166534', borderColor: '#bbf7d0' },
  badgeAbortada: { backgroundColor: '#fee2e2', color: '#991b1b', borderColor: '#fecaca' },
  
  actionBtnPrimary: { background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#0284c7' },
  actionBtnSecondary: { background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#7e22ce' },
  actionBtnSuccess: { padding: '6px', backgroundColor: '#dcfce7', color: '#16a34a', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' },
  actionBtnDanger: { padding: '6px', backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' },
  actionBtnWarning: { padding: '6px', backgroundColor: '#fef3c7', color: '#d97706', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' },
};

export default Auditorias;
