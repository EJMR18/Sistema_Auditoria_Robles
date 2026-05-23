import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2, GripVertical } from 'lucide-react';
import api from '../api/axios'; // Instancia de Axios apuntando al puerto 3000

const FormularioPlantilla = () => {
  const navigate = useNavigate();

  // ==========================================
  // ESTADOS DEL FORMULARIO (ZOD SCHEMA)
  // ==========================================
  const [codigoPlantilla, setCodigoPlantilla] = useState('');
  const [nombrePlantilla, setNombrePlantilla] = useState('');
  const [version, setVersion] = useState('1.0'); // Formato regex: /^\d+\.\d+$/
  const [descripcion, setDescripcion] = useState('');
  
  // Lista de verificación interactiva (Inicia con un renglón vacío obligatorio)
  const [preguntas, setPreguntas] = useState([{ texto_pregunta: '' }]);
  
  const [errorForm, setErrorForm] = useState('');

  // ==========================================
  // MANEJO DINÁMICO DE PREGUNTAS
  // ==========================================
  
  // Sincroniza lo que escribe el usuario en cada renglón específico
  const handlePreguntaChange = (index, value) => {
  const nuevasPreguntas = [...preguntas];

  nuevasPreguntas[index] = {
    ...nuevasPreguntas[index],
    texto_pregunta: value,
    orden: Number(nuevasPreguntas[index].orden) || index + 1
  };

  setPreguntas(nuevasPreguntas);
};
  // Agrega un nuevo renglón incrementando el orden de forma correlativa automática
  const handleAgregarPregunta = () => {
    setPreguntas([
      ...preguntas,
      { texto_pregunta: '' }
    ]);
  };

  // Remueve un renglón y reestructura la numeración para que no queden saltos ni repetidos
  const handleEliminarPregunta = (index) => {
    // Validación preventiva coincidente con el .min(1) de tu Zod array
    if (preguntas.length === 1) {
      alert("La plantilla debe contener al menos una pregunta obligatoria.");
      return;
    }
    const filtradas = preguntas.filter((_, i) => i !== index);
    
    // Re-mapeo continuo: asegura que el orden sea secuencial y único (1, 2, 3...)
    const reordenadas = filtradas.map((p) => ({ ...p }));
    setPreguntas(reordenadas);
  };

  // ==========================================
  // ENVÍO DE PAYLOAD UNIFICADO AL BACKEND
  // ==========================================
  const handleGuardar = async (e) => {
    e.preventDefault();
    setErrorForm('');

    // Validaciones básicas de presencia en el Frontend antes de golpear la API
    if (!codigoPlantilla.trim() || !nombrePlantilla.trim()) {
      setErrorForm('El código y el nombre de la plantilla son obligatorios.');
      return;
    }

    // Limpieza de espacios en blanco y estructuración de preguntas
    const preguntasValidas = preguntas.map((p, index) => ({
  texto_pregunta: p.texto_pregunta.trim(),
  orden: Number(p.orden) || index + 1
}));

    // Validación equivalente al .min(5) de tu preguntaSchema de Zod
    if (preguntasValidas.some(p => p.texto_pregunta.length < 5)) {
      setErrorForm('Cada pregunta de verificación debe tener al menos 5 caracteres reales.');
      return;
    }

    // Construcción del Payload Exacto esperado por crearPlantillaSchema
    const payload = {
      codigo_plantilla: codigoPlantilla.trim(),
      nombre_plantilla: nombrePlantilla.trim(),
      descripcion: descripcion.trim(),
      version: version.trim(),
      preguntas: preguntasValidas
    };

    try {
      // Petición HTTP POST unificada para persistir la nueva versión de la plantilla
      await api.post('/plantillas', payload);
      
      // Redirección al listado principal tras el éxito de la operación
      navigate('/dashboard/plantillas');
    } catch (err) {
      // Captura y despliega los mensajes de error configurados en tu esquema de Zod en el back
      setErrorForm(err.response?.data?.mensaje || 'Error de validación con las reglas del servidor.');
    }
  };

  return (
    <div style={styles.container}>
      {/* BARRA SUPERIOR DE ACCIONES */}
      <div style={styles.topBar}>
        <div style={styles.header}>
          <button onClick={() => navigate('/dashboard/plantillas')} style={styles.btnAtras}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 style={styles.titulo}>Nueva Versión de Plantilla</h2>
            <p style={styles.subtitulo}>Template Form Builder</p>
          </div>
        </div>
        <button onClick={handleGuardar} style={styles.btnGuardar}>
          <Save size={18} style={{ marginRight: '8px' }} /> GUARDAR PLANTILLA
        </button>
      </div>

      {errorForm && <div style={styles.errorBox}>{errorForm}</div>}

      {/* METADATA GENERAL DE LA PLANTILLA */}
      <div style={styles.card}>
        <h3 style={styles.cardTitulo}>Información de la Plantilla</h3>
        <p style={styles.cardSubtitulo}>Template Metadata</p>
        
        <div style={styles.formGrid}>
          <div style={styles.formGroup}>
            <label style={styles.label}>CÓDIGO DE PLANTILLA</label>
            <input 
              type="text"
              placeholder="ej. AUD-001"
              value={codigoPlantilla}
              onChange={(e) => setCodigoPlantilla(e.target.value)}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>NOMBRE DE LA PLANTILLA</label>
            <input 
              type="text"
              placeholder="ej. Seguridad Industrial"
              value={nombrePlantilla}
              onChange={(e) => setNombrePlantilla(e.target.value)}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>VERSIÓN</label>
            <input 
              type="text"
              placeholder="1.0"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              style={styles.input}
            />
          </div>
        </div>

        <div style={{ ...styles.formGroup, marginTop: '15px' }}>
          <label style={styles.label}>DESCRIPCIÓN / ALCANCE DE AUDITORÍA</label>
          <textarea 
            placeholder="Opcional: Define el alcance general de esta versión..."
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            style={styles.textarea}
          />
        </div>
      </div>

      {/* CONSTRUCTOR DINÁMICO DE PREGUNTAS (CHECKLIST) */}
      <div style={styles.card}>
        <div style={styles.checklistHeader}>
          <div>
            <h3 style={styles.cardTitulo}>Lista de Verificación</h3>
            <p style={styles.cardSubtitulo}>Checklist Questions Builder</p>
          </div>
          <div style={styles.badgeContador}>
            {preguntas.length} {preguntas.length === 1 ? 'pregunta' : 'preguntas'}
          </div>
        </div>

        <div style={styles.preguntasContainer}>
          {preguntas.map((pregunta, index) => (
            <div key={index} style={styles.preguntaRow}>
              <div style={styles.gripIcon}>
                <GripVertical size={16} color="#94a3b8" />
              </div>
              <div style={styles.numeroBadge}>{index + 1}.</div>
              <input 
                type="text"
                placeholder="Ingrese la pregunta de verificación..."
                value={pregunta.texto_pregunta}
                onChange={(e) => handlePreguntaChange(index, e.target.value)}
                style={styles.inputPregunta}
              />
              <button 
                type="button" 
                onClick={() => handleEliminarPregunta(index)}
                style={styles.btnEliminarPregunta}
                title="Eliminar pregunta"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        <button type="button" onClick={handleAgregarPregunta} style={styles.btnAgregar}>
          <Plus size={16} style={{ marginRight: '5px' }} /> AGREGAR NUEVA PREGUNTA
        </button>
      </div>
    </div>
  );
};

// Estilos visuales del Mockup
const styles = {
  container: { padding: '20px' },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' },
  header: { display: 'flex', alignItems: 'center', gap: '15px' },
  btnAtras: { padding: '8px', border: '1px solid #e5e7eb', borderRadius: '4px', backgroundColor: '#f9fafb', cursor: 'pointer' },
  titulo: { margin: 0, fontSize: '22px', color: '#1f2937', fontWeight: 'bold' },
  subtitulo: { margin: 0, fontSize: '12px', color: '#9ca3af', letterSpacing: '0.5px' },
  btnGuardar: { backgroundColor: '#2d6a4f', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center' },
  errorBox: { padding: '12px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '6px', marginBottom: '20px', fontSize: '14px', borderLeft: '4px solid #ef4444' },
  card: { backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '24px', marginBottom: '25px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  cardTitulo: { margin: 0, fontSize: '18px', color: '#1e293b', fontWeight: '600' },
  cardSubtitulo: { margin: '2px 0 20px 0', fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '11px', fontWeight: 'bold', color: '#475569', letterSpacing: '0.3px' },
  input: { padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '14px', backgroundColor: '#f8fafc' },
  textarea: { padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '14px', backgroundColor: '#f8fafc', height: '70px', resize: 'none' },
  checklistHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  badgeContador: { backgroundColor: '#e2e8f0', color: '#475569', padding: '4px 12px', borderRadius: '4px', fontSize: '13px', fontWeight: '500' },
  preguntasContainer: { display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' },
  preguntaRow: { display: 'flex', alignItems: 'center', gap: '12px', width: '100%' },
  gripIcon: { display: 'flex', alignItems: 'center' },
  numeroBadge: { fontSize: '14px', color: '#94a3b8', width: '20px', textAlign: 'right' },
  inputPregunta: { flex: 1, padding: '12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '14px', backgroundColor: '#fff' },
  btnEliminarPregunta: { background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' },
  btnAgregar: { backgroundColor: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', padding: '10px 20px', borderRadius: '4px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }
};

export default FormularioPlantilla;