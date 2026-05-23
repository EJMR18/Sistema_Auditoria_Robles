import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Plus, FileText, Pencil, Trash2, Eye, X, CornerDownRight } from 'lucide-react';
import plantillaService from '../services/plantillaService';

const Plantillas = () => {
  const navigate = useNavigate();
  
  // Estados de datos
  const [plantillas, setPlantillas] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorGlobal, setErrorGlobal] = useState('');

  /*// Estado para controlar la apertura del Modal de creación
  const [mostrarModal, setMostrarModal] = useState(false);*/

  // Estados del Formulario (Campos del Zod Schema)
  const [codigoPlantilla, setCodigoPlantilla] = useState('');
  const [nombrePlantilla, setNombrePlantilla] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [version, setVersion] = useState('1.0'); // Valor inicial por defecto
  
  // Estado para el listado de preguntas dentro del formulario
  const [preguntas, setPreguntas] = useState([]);
  const [nuevaPreguntaTexto, setNuevaPreguntaTexto] = useState('');

  // Errores específicos del formulario
  const [errorFormulario, setErrorFormulario] = useState('');

  // Usuario activo para validar roles
  const usuarioData = sessionStorage.getItem('usuario');
  const usuarioActivo = usuarioData ? JSON.parse(usuarioData) : null;
  const esAdmin = usuarioActivo?.id_rol === 1;

  // 1. Cargar las plantillas reales al montar el componente
  const cargarPlantillas = async () => {
    try {
      setLoading(true);
      const datos = await plantillaService.obtenerPlantillas();

    console.log("DATOS DEL BACKEND:", datos);

    setPlantillas(datos || []);
      setPlantillas(datos || []);
      setErrorGlobal('');
    } catch (err) {
      setErrorGlobal(err.mensaje || 'Error al cargar las plantillas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPlantillas();
  }, []);

  // 2. Función para agregar una pregunta a la lista temporal en el frontend
  const handleAgregarPreguntaALista = (e) => {
    e.preventDefault();
    if (!nuevaPreguntaTexto.trim()) return;
    if (nuevaPreguntaTexto.trim().length < 5) {
      setErrorFormulario('La pregunta debe tener al menos 5 caracteres reales.');
      return;
    }

    // El orden es el índice de la lista + 1 de forma automática
    const nuevaPregunta = {
      texto_pregunta: nuevaPreguntaTexto.trim(),
      orden: preguntas.length + 1
    };

    setPreguntas([...preguntas, nuevaPregunta]);
    setNuevaPreguntaTexto('');
    setErrorFormulario('');
  };

  // 3. Enviar todo el payload unificado al backend
  const handleGuardarPlantilla = async (e) => {
    e.preventDefault();
    setErrorFormulario('');

    // Validaciones básicas del frontend antes de golpear el back
    if (!codigoPlantilla || !nombrePlantilla) {
      setErrorFormulario('El código y el nombre de la plantilla son obligatorios.');
      return;
    }
    if (preguntas.length === 0) {
      setErrorFormulario('Debes agregar al menos una pregunta a la plantilla antes de guardarla.');
      return;
    }

    const payload = {
      codigo_plantilla: codigoPlantilla,
      nombre_plantilla: nombrePlantilla,
      descripcion: descripcion,
      version: version,
      preguntas: preguntas
    };

    try {
      await plantillaService.crearPlantilla(payload);
      // Resetear estados y cerrar modal
      setMostrarModal(false);
      setCodigoPlantilla('');
      setNombrePlantilla('');
      setDescripcion('');
      setVersion('1.0');
      setPreguntas([]);
      // Recargar la tabla
      cargarPlantillas();
    } catch (err) {
      setErrorFormulario(err.mensaje || 'Ocurrió un error de validación en el backend.');
    }
  };

  // 4. Inhabilitar plantilla (Botón basurero)
  const handleInhabilitar = async (codigo, nombre) => {
    if (window.confirm(`¿Estás seguro de que deseas inhabilitar la plantilla "${nombre}"?`)) {
      try {
        await plantillaService.inhabilitarPlantilla(codigo);
        cargarPlantillas();
      } catch (err) {
        alert(err.mensaje || 'No se pudo inhabilitar la plantilla.');
      }
    }
  };

  // Filtrador del Buscador de tu diseño
  console.log("PLANTILLAS:", plantillas);

const plantillasFiltradas = (plantillas || []).filter(p =>
  (p.nombre_plantilla || '').toLowerCase().includes(busqueda.toLowerCase()) ||
  (p.codigo_plantilla || '').toLowerCase().includes(busqueda.toLowerCase())
);

  return (
    <div style={styles.container}>
      
      {/* ENCABEZADO */}
      <div style={styles.header}>
        <button onClick={() => navigate('/dashboard')} style={styles.btnAtras}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 style={styles.titulo}>Gestión de Plantillas</h2>
          <p style={styles.subtitulo}>Template Management System</p>
        </div>
      </div>

      {errorGlobal && <div style={styles.errorAlert}>{errorGlobal}</div>}

      {/* BARRA DE ACCIONES */}
      <div style={styles.actionsBar}>
        <div style={styles.searchContainer}>
          <Search size={18} style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar plantillas..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={styles.inputBuscar}
          />
        </div>
        {esAdmin && (
          <button onClick={() => navigate('/dashboard/plantillas/crear')} style={styles.btnCrear}>
            <Plus size={18} style={{ marginRight: '5px' }} /> CREAR NUEVA PLANTILLA
          </button>
        )}
      </div>

      {/* TABLA DE GESTIÓN */}
      <div style={styles.tableContainer}>
        {loading ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>Cargando plantillas...</div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>CÓDIGO</th>
                <th style={styles.th}>NOMBRE</th>
                <th style={styles.th}>VERSIÓN</th>
                <th style={styles.th}>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {plantillasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: '#94a3b8' }}>
                    No se encontraron plantillas activas.
                  </td>
                </tr>
              ) : (
                plantillasFiltradas.map((plantilla) => (
                  <tr key={plantilla.codigo_plantilla} style={styles.tr}>
                    <td style={styles.tdCodigo}>{plantilla.codigo_plantilla}</td>
                    <td style={styles.tdNombre}>
                      <FileText size={18} style={styles.iconHoja} />
                      <span 
                        style={styles.nombreLink}
                        onClick={() => navigate(`/dashboard/plantillas/${plantilla.codigo_plantilla}`)}
                      >
                        {plantilla.nombre_plantilla}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.badgeVersion}>{plantilla.version || '1.0'}</span>
                    </td>
                    <td style={styles.tdAcciones}>
                      <button 
                        style={styles.actionBtn} 
                        title="Ver Preguntas" 
                        onClick={() => navigate(`/dashboard/plantillas/${plantilla.codigo_plantilla}`)}
                      >
                        <Eye size={16} color="#0056b3" />
                      </button>
                      
                      {esAdmin && (
                        <button 
                          style={styles.actionBtn} 
                          title="Inhabilitar"
                          onClick={() => handleInhabilitar(plantilla.codigo_plantilla, plantilla.nombre_plantilla)}
                        >
                          <Trash2 size={16} color="#ef4444" />
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

// Estilos extendidos para acoplar el mockup y el modal
const styles = {
  container: { padding: '20px', backgroundColor: '#fff', borderRadius: '8px' },
  header: { display: 'flex', alignItems: 'center', marginBottom: '25px', gap: '15px' },
  btnAtras: { padding: '8px', border: '1px solid #e5e7eb', borderRadius: '4px', backgroundColor: '#f9fafb', cursor: 'pointer', display: 'flex', alignItems: 'center' },
  titulo: { margin: 0, fontSize: '22px', color: '#1f2937', fontWeight: 'bold' },
  subtitulo: { margin: 0, fontSize: '12px', color: '#9ca3af' },
  
  // 🛠️ FIX DE LA BARRA DE ACCIONES: Empuja los elementos a las esquinas
  actionsBar: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: '20px', 
    gap: '20px',
    width: '100%' 
  },
  
  // 🛠️ FIX DEL BUSCADOR: Ocupa el espacio libre de forma fluida
  searchContainer: { 
    position: 'relative', 
    flex: 1,
    maxWidth: '500px' // Evita que se estire exageradamente en monitores anchos
  },
  
  searchIcon: { position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' },
  inputBuscar: { width: '100%', padding: '10px 10px 10px 40px', border: '1px solid #cbd5e1', borderRadius: '4px', backgroundColor: '#f8fafc', fontSize: '14px' },
  
  // Aseguramos que el botón mantenga su tamaño de contenido sin colapsar
  btnCrear: { backgroundColor: '#d97706', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' },
  
  tableContainer: { border: '1px solid #e2e8f0', borderRadius: '6px', overflow: 'hidden', backgroundColor: '#fff' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' },
  th: { backgroundColor: '#f1f5f9', color: '#475569', padding: '12px 16px', fontWeight: 'bold', fontSize: '12px', borderBottom: '1px solid #e2e8f0' },
  tr: { borderBottom: '1px solid #f1f5f9' },
  td: { padding: '14px 16px', color: '#334155' },
  tdCodigo: { padding: '14px 16px', color: '#475569', fontWeight: '500' },
  tdNombre: { padding: '14px 16px', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '10px' },
  iconHoja: { color: '#64748b', backgroundColor: '#f1f5f9', padding: '4px', borderRadius: '4px' },
  nombreLink: { cursor: 'pointer', fontWeight: '500', color: '#1e293b' },
  badgeVersion: { backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', color: '#64748b' },
  tdAcciones: { padding: '14px 16px' },
  actionBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: '4px', marginRight: '8px' },
  errorAlert: { padding: '12px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '6px', marginBottom: '15px', fontSize: '14px' },
  errorAlertForm: { padding: '10px', backgroundColor: '#fff5f5', color: '#c53030', borderLeft: '4px solid #c53030', marginBottom: '15px', fontSize: '13px' },
  
  // Estilos del Modal
  //modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' },
  //modalContent: { backgroundColor: '#fff', width: '100%', maxWidth: '550px', borderRadius: '8px', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' },
  //modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' },
  //btnCerrarModal: { background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' },
  form: { display: 'flex', flexDirection: 'column', gap: '12px' },
  row: { display: 'flex', gap: '15px' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 },
  label: { fontSize: '13px', fontWeight: '500', color: '#475569' },
  inputForm: { padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '14px', width: '100%' },
  btnAgregarPregunta: { backgroundColor: '#1e293b', color: '#fff', border: 'none', padding: '0 15px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' },
  listaPreguntasContenedor: { border: '1px solid #e2e8f0', borderRadius: '4px', padding: '8px', maxHeight: '150px', overflowY: 'auto', backgroundColor: '#f8fafc' },
  itemPregunta: { display: 'flex', alignItems: 'center', padding: '6px 4px', borderBottom: '1px solid #f1f5f9', fontSize: '13px' },
  btnEliminarPreguntaLista: { background: 'none', border: 'none', color: '#ef4444', fontSize: '11px', cursor: 'pointer', marginLeft: '10px' },
  //modalFooter: { display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px', borderTop: '1px solid #f1f5f9', paddingTop: '15px' },
  //btnCancelar: { backgroundColor: '#fff', border: '1px solid #cbd5e1', color: '#475569', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' },
  btnGuardarFinal: { backgroundColor: '#16a34a', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: '500', fontSize: '13px' }
};

export default Plantillas;