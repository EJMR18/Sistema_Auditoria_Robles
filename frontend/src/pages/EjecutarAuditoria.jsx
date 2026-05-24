import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { auditoriaService } from '../services/auditoriaService';
import plantillaService from '../services/plantillaService';
import { ArrowLeft, CheckCircle, Save } from 'lucide-react';

const EjecutarAuditoria = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [auditoria, setAuditoria] = useState(null);
  const [plantilla, setPlantilla] = useState(null);
  const [preguntas, setPreguntas] = useState([]);
  
  const [respuestasGuardadas, setRespuestasGuardadas] = useState({});
  const [respuestaActual, setRespuestaActual] = useState('SI');
  const [observacionDesc, setObservacionDesc] = useState('');
  const [observacionCrit, setObservacionCrit] = useState('');

  const [loading, setLoading] = useState(true);
  const [errorGlobal, setErrorGlobal] = useState('');

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        // 1. Obtener la auditoria
        const auditorias = await auditoriaService.obtenerAuditorias();
        const aud = auditorias.find(a => String(a.id_auditoria) === String(id));
        if (!aud) {
          setErrorGlobal('No se encontró la auditoría o no tienes permisos.');
          return;
        }
        setAuditoria(aud);

        // 2. Obtener plantillas para encontrar el codigo
        const plantillas = await plantillaService.obtenerPlantillas();
        const planResumen = plantillas.find(p => p.id_plantilla === aud.id_plantilla);
        if (!planResumen) {
          setErrorGlobal('No se encontró la plantilla asociada a esta auditoría.');
          return;
        }

        // 3. Obtener el detalle de la plantilla (con sus preguntas)
        const planDetalle = await plantillaService.obtenerPlantillaPorCodigo(planResumen.codigo_plantilla);
        setPlantilla(planDetalle.datos);
        setPreguntas(planDetalle.datos.preguntas || []);

      } catch (err) {
        setErrorGlobal('Error al cargar datos para la ejecución.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, [id]);

  const handleResponder = async (idPregunta) => {
    try {
      setErrorGlobal('');
      const payload = {
        id_pregunta: Number(idPregunta),
        valor_respuesta: respuestaActual
      };

      if (observacionDesc) {
        payload.observacion = {
          descripcion: observacionDesc
        };
        if (observacionCrit) {
          payload.observacion.criticidad = observacionCrit;
        }
      }

      await auditoriaService.registrarRespuesta(id, payload);
      
      setRespuestasGuardadas(prev => ({
        ...prev,
        [idPregunta]: true
      }));

      // Reset fields for the next question
      setRespuestaActual('SI');
      setObservacionDesc('');
      setObservacionCrit('');
      
    } catch (err) {
      setErrorGlobal(err.response?.data?.mensaje || 'Error al registrar la respuesta.');
    }
  };

  const handleFinalizar = async () => {
    if (window.confirm('¿Deseas finalizar la auditoría? Asegúrate de haber respondido las preguntas.')) {
      try {
        await auditoriaService.finalizarAuditoria(id);
        navigate('/dashboard/auditorias');
      } catch (err) {
        setErrorGlobal(err.response?.data?.mensaje || 'Error al finalizar la auditoría.');
      }
    }
  };

  if (loading) return <div style={styles.container}>Cargando ejecución...</div>;
  if (errorGlobal && !auditoria) return <div style={styles.container}>{errorGlobal}</div>;

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <div style={styles.header}>
          <button onClick={() => navigate('/dashboard/auditorias')} style={styles.btnAtras}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 style={styles.titulo}>Ejecutar Auditoría: {auditoria?.codigo_auditoria}</h2>
            <p style={styles.subtitulo}>Plantilla: {plantilla?.nombre_plantilla}</p>
          </div>
        </div>
        <button onClick={handleFinalizar} style={styles.btnFinalizar}>
          <CheckCircle size={18} style={{ marginRight: '8px' }} /> FINALIZAR AUDITORÍA
        </button>
      </div>

      {errorGlobal && <div style={styles.errorBox}>{errorGlobal}</div>}

      <div style={styles.preguntasList}>
        {preguntas.map((p, index) => {
          const yaRespondida = respuestasGuardadas[p.id_pregunta];

          return (
            <div key={p.id_pregunta} style={styles.cardPregunta}>
              <div style={styles.preguntaHeader}>
                <span style={styles.numeroPregunta}>{index + 1}</span>
                <p style={styles.textoPregunta}>{p.texto_pregunta}</p>
                {yaRespondida && (
                  <span style={styles.badgeRespondida}>Respondida</span>
                )}
              </div>

              {!yaRespondida && (
                <div style={styles.respuestaForm}>
                  <div style={styles.formRow}>
                    <label style={styles.label}>Respuesta:</label>
                    <select 
                      value={respuestaActual}
                      onChange={(e) => setRespuestaActual(e.target.value)}
                      style={styles.select}
                    >
                      <option value="SI">SI</option>
                      <option value="NO">NO</option>
                      <option value="NA">N/A</option>
                    </select>
                  </div>

                  <div style={styles.formRow}>
                    <label style={styles.label}>Observación (Opcional):</label>
                    <input 
                      type="text"
                      placeholder="Detalle de la observación"
                      value={observacionDesc}
                      onChange={(e) => setObservacionDesc(e.target.value)}
                      style={styles.input}
                    />
                  </div>

                  {observacionDesc && (
                    <div style={styles.formRow}>
                      <label style={styles.label}>Criticidad (Opcional):</label>
                      <select 
                        value={observacionCrit}
                        onChange={(e) => setObservacionCrit(e.target.value)}
                        style={styles.select}
                      >
                        <option value="">Ninguna</option>
                        <option value="BAJA">BAJA</option>
                        <option value="MEDIA">MEDIA</option>
                        <option value="ALTA">ALTA</option>
                        <option value="CRITICA">CRÍTICA (Abortará auditoría)</option>
                      </select>
                    </div>
                  )}

                  <button 
                    onClick={() => handleResponder(p.id_pregunta)}
                    style={styles.btnGuardarRespuesta}
                  >
                    <Save size={16} style={{ marginRight: '5px' }} /> Guardar Respuesta
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '30px', backgroundColor: '#f4f7f6', minHeight: '100vh' },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  header: { display: 'flex', alignItems: 'center', gap: '15px' },
  btnAtras: { background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', padding: '8px', borderRadius: '50%', ':hover': { backgroundColor: '#e2e8f0' } },
  titulo: { margin: 0, color: '#0f172a', fontSize: '1.5rem', fontWeight: 'bold' },
  subtitulo: { margin: 0, color: '#64748b', fontSize: '0.9rem' },
  btnFinalizar: { backgroundColor: '#10b981', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: 'bold', display: 'flex', alignItems: 'center', cursor: 'pointer' },
  errorBox: { backgroundColor: '#fef2f2', color: '#991b1b', padding: '12px', borderRadius: '6px', marginBottom: '20px', border: '1px solid #f87171' },
  preguntasList: { display: 'flex', flexDirection: 'column', gap: '15px' },
  cardPregunta: { backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  preguntaHeader: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' },
  numeroPregunta: { backgroundColor: '#0f172a', color: 'white', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' },
  textoPregunta: { margin: 0, fontSize: '1.05rem', color: '#1e293b', flex: 1 },
  badgeRespondida: { backgroundColor: '#dcfce7', color: '#166534', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' },
  respuestaForm: { backgroundColor: '#f8fafc', padding: '15px', borderRadius: '6px', border: '1px solid #e2e8f0' },
  formRow: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' },
  label: { minWidth: '150px', fontWeight: '600', color: '#475569', fontSize: '0.9rem' },
  select: { padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1', flex: 1, maxWidth: '200px' },
  input: { padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1', flex: 1 },
  btnGuardarRespuesta: { backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', fontWeight: 'bold', display: 'flex', alignItems: 'center', cursor: 'pointer', marginTop: '10px' }
};

export default EjecutarAuditoria;
