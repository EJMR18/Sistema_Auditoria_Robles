import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Calendar, Hash, Layers, HelpCircle } from 'lucide-react';
import api from '../api/axios'; 

const DetallePlantilla = () => {
  const { codigo } = useParams(); // Captura el código de la URL
  const navigate = useNavigate();
  
  const [plantilla, setPlantilla] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
// 1. Efecto para consultar la estructura de la plantilla al cargar la vista
  useEffect(() => {
    const obtenerDetalle = async () => {
      try {
        setLoading(true);
        // Pegamos al endpoint en SINGULAR que definimos en el index.js del back
        const res = await api.get(`/plantillas/${codigo}`);
        
        if (res.data && res.data.estado === 'exito') {
          setPlantilla(res.data.datos);
        }
      } catch (err) {
        console.error("Error al cargar el detalle:", err);
        setError(err.response?.data?.mensaje || 'No se pudo cargar el detalle de la plantilla.');
      } finally {
        setLoading(false);
      }
    };

    obtenerDetalle();
  }, [codigo]);
// Manejo de renderizado en estado de espera (Loading)
  if (loading) {
    return <div style={styles.centerCont}>Cargando estructura de la plantilla...</div>;
  }
// Intercepción preventiva en caso de códigos inválidos o errores de API
  if (error || !plantilla) {
    return (
      <div style={styles.container}>
        <button onClick={() => navigate('/dashboard/plantillas')} style={styles.btnAtras}>
          <ArrowLeft size={20} style={{ marginRight: '8px' }} /> Volver a Plantillas
        </button>
        <div style={styles.errorAlert}>{error || 'No se encontró la plantilla.'}</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* ENCABEZADO Y REGRESO */}
      <div style={styles.header}>
        <button onClick={() => navigate('/dashboard/plantillas')} style={styles.btnAtras}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 style={styles.titulo}>{plantilla.nombre_plantilla}</h2>
          <p style={styles.subtitulo}>Estructura Interna y Cuestionario Base</p>
        </div>
      </div>

      {/* TARJETA DE METADATOS GESTIONADOS */}
      <div style={styles.metaCard}>
        <div style={styles.metaItem}>
          <Hash size={18} color="#64748b" />
          <div>
            <span style={styles.metaLabel}>Código de Plantilla</span>
            <span style={styles.metaValue}>{plantilla.codigo_plantilla}</span>
          </div>
        </div>
        <div style={styles.metaItem}>
          <Layers size={18} color="#64748b" />
          <div>
            <span style={styles.metaLabel}>Versión Actual</span>
            <span style={styles.badgeVersion}>v{plantilla.version || '1.0'}</span>
          </div>
        </div>
        <div style={styles.metaItem}>
          <Calendar size={18} color="#64748b" />
          <div>
            <span style={styles.metaLabel}>Estado en Sistema</span>
            <span style={styles.badgeEstado}>Activa</span>
          </div>
        </div>
      </div>

      {/* DESCRIPCIÓN */}
      {plantilla.descripcion && (
        <div style={styles.descBox}>
          <h4 style={{ margin: '0 0 5px 0', color: '#475569', fontSize: '14px' }}>Descripción / Alcance:</h4>
          <p style={{ margin: 0, color: '#334155', fontSize: '14px', lineHeight: '1.5' }}>{plantilla.descripcion}</p>
        </div>
      )}

      {/* SECCIÓN DE PREGUNTAS REALES DESDE EL .BAK */}
      <h3 style={styles.seccionTitulo}>
        <FileText size={20} color="#1e293b" style={{ marginRight: '8px' }} />
        Preguntas Registradas ({plantilla.preguntas?.length || 0})
      </h3>

      <div style={styles.preguntasLista}>
        {!plantilla.preguntas || plantilla.preguntas.length === 0 ? (
          <p style={{ color: '#94a3b8', textAlign: 'center', padding: '20px' }}>Esta plantilla no contiene preguntas asociadas.</p>
        ) : (
          plantilla.preguntas
            .sort((a, b) => a.orden - b.orden) // Las ordenamos correlativamente
            .map((preg, idx) => (
              <div key={idx} style={styles.preguntaItem}>
                <div style={styles.numeroOrden}>
                  {preg.orden}
                </div>
                <div style={styles.preguntaTexto}>
                  {preg.texto_pregunta}
                </div>
                <HelpCircle size={16} color="#cbd5e1" />
              </div>
            ))
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '20px', backgroundColor: '#fff', borderRadius: '8px' },
  centerCont: { padding: '50px', textAlign: 'center', color: '#64748b', fontSize: '15px' },
  header: { display: 'flex', alignItems: 'center', marginBottom: '25px', gap: '15px' },
  btnAtras: { padding: '8px', border: '1px solid #e5e7eb', borderRadius: '4px', backgroundColor: '#f9fafb', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#374151' },
  titulo: { margin: 0, fontSize: '22px', color: '#1f2937', fontWeight: 'bold' },
  subtitulo: { margin: 0, fontSize: '12px', color: '#9ca3af' },
  errorAlert: { padding: '12px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '6px', marginTop: '15px' },
  
  metaCard: { display: 'flex', gap: '30px', padding: '15px 20px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', marginBottom: '20px', flexWrap: 'wrap' },
  metaItem: { display: 'flex', alignItems: 'center', gap: '10px' },
  metaLabel: { display: 'block', fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600' },
  metaValue: { display: 'block', fontSize: '14px', color: '#1e293b', fontWeight: 'bold' },
  badgeVersion: { display: 'inline-block', backgroundColor: '#e2e8f0', color: '#334155', padding: '2px 6px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', marginTop: '2px' },
  badgeEstado: { display: 'inline-block', backgroundColor: '#dcfce7', color: '#166534', padding: '2px 6px', borderRadius: '4px', fontSize: '12px', fontWeight: '600', marginTop: '2px' },
  
  descBox: { padding: '15px', borderLeft: '4px solid #cbd5e1', backgroundColor: '#fdfdfd', marginBottom: '25px', borderRadius: '0 4px 4px 0' },
  seccionTitulo: { display: 'flex', alignItems: 'center', fontSize: '16px', color: '#1e293b', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px', marginBottom: '15px' },
  preguntasLista: { display: 'flex', flexDirection: 'column', gap: '10px' },
  preguntaItem: { display: 'flex', alignItems: 'center', padding: '14px 16px', border: '1px solid #e2e8f0', borderRadius: '6px', backgroundColor: '#fff', gap: '15px', transition: 'all 0.2s' },
  numeroOrden: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', backgroundColor: '#1e293b', color: '#fff', borderRadius: '50%', fontSize: '12px', fontWeight: 'bold' },
  preguntaTexto: { flex: 1, color: '#1e293b', fontSize: '14px', fontWeight: '500' }
};

export default DetallePlantilla;