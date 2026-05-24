import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auditoriaService } from '../services/auditoriaService';
import plantillaService from '../services/plantillaService';
import { usuarioService } from '../services/usuarioService';
import { empleadoService } from '../services/empleadoService';
import { estructuraService } from '../services/estructuraService';
import { ArrowLeft, Save } from 'lucide-react';

const FormularioAuditoria = () => {
  const navigate = useNavigate();

  const [tipoAuditoria, setTipoAuditoria] = useState('PLANTA');
  const [idPlantilla, setIdPlantilla] = useState('');
  const [idAuditor, setIdAuditor] = useState('');
  const [idPlanta, setIdPlanta] = useState('');
  const [idArea, setIdArea] = useState('');
  const [idEmpleadoAuditado, setIdEmpleadoAuditado] = useState('');

  const [plantillas, setPlantillas] = useState([]);
  const [auditores, setAuditores] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [plantas, setPlantas] = useState([]);
  const [areas, setAreas] = useState([]);
  const [errorForm, setErrorForm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [dataPlantillas, dataUsuarios, dataEmpleados, dataPlantas, dataAreas] = await Promise.all([
          plantillaService.obtenerPlantillas(),
          usuarioService.obtenerUsuarios(),
          empleadoService.obtenerEmpleados(),
          estructuraService.obtenerPlantas(),
          estructuraService.obtenerAreas()
        ]);
        setPlantillas(dataPlantillas || []);
        setEmpleados(dataEmpleados || []);
        setPlantas(dataPlantas || []);
        setAreas(dataAreas || []);
        
        // Filtrar solo los usuarios que son auditores (id_rol === 2)
        if (dataUsuarios && dataUsuarios.data) {
          const listaAuditores = dataUsuarios.data.filter(u => u.id_rol === 2 && u.estado_activo);
          setAuditores(listaAuditores);
        }
      } catch (err) {
        console.error("Error al cargar datos:", err);
      }
    };
    cargarDatos();
  }, []);

  const handleGuardar = async (e) => {
    e.preventDefault();
    setErrorForm('');

    if (!idPlantilla || !idAuditor) {
      setErrorForm('La plantilla y el ID del auditor son obligatorios.');
      return;
    }

    if (tipoAuditoria === 'PLANTA' && !idPlanta) {
      setErrorForm('Para una auditoría de PLANTA debe ingresar el ID de la Planta.');
      return;
    }
    
    if (tipoAuditoria === 'AREA' && (!idPlanta || !idArea)) {
      setErrorForm('Para una auditoría de ÁREA debe ingresar el ID de Planta y el ID de Área.');
      return;
    }

    if (tipoAuditoria === 'EMPLEADO' && (!idPlanta || !idArea || !idEmpleadoAuditado)) {
      setErrorForm('Para una auditoría de EMPLEADO debe ingresar el ID de Planta, Área y Empleado.');
      return;
    }

    const payload = {
      tipo_auditoria: tipoAuditoria,
      id_plantilla: Number(idPlantilla),
      id_auditor: Number(idAuditor)
    };

    if (tipoAuditoria === 'PLANTA') {
      payload.id_planta = Number(idPlanta);
    } else if (tipoAuditoria === 'AREA') {
      payload.id_planta = Number(idPlanta);
      payload.id_area = Number(idArea);
    } else if (tipoAuditoria === 'EMPLEADO') {
      payload.id_planta = Number(idPlanta);
      payload.id_area = Number(idArea);
      payload.id_empleado_auditado = Number(idEmpleadoAuditado);
    }

    try {
      setLoading(true);
      await auditoriaService.crearAuditoria(payload);
      navigate('/dashboard/auditorias');
    } catch (err) {
      setErrorForm(err.response?.data?.mensaje || 'Error al planificar la auditoría.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <div style={styles.header}>
          <button onClick={() => navigate('/dashboard/auditorias')} style={styles.btnAtras}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 style={styles.titulo}>Planificar Auditoría</h2>
            <p style={styles.subtitulo}>Nueva Ejecución</p>
          </div>
        </div>
        <button onClick={handleGuardar} disabled={loading} style={styles.btnGuardar}>
          <Save size={18} style={{ marginRight: '8px' }} /> {loading ? 'GUARDANDO...' : 'GUARDAR AUDITORÍA'}
        </button>
      </div>

      {errorForm && <div style={styles.errorBox}>{errorForm}</div>}

      <div style={styles.card}>
        <h3 style={styles.cardTitulo}>Datos de la Auditoría</h3>
        
        <div style={styles.formGrid}>
          <div style={styles.formGroup}>
            <label style={styles.label}>TIPO DE AUDITORÍA</label>
            <select 
              value={tipoAuditoria}
              onChange={(e) => {
                setTipoAuditoria(e.target.value);
                setIdPlanta('');
                setIdArea('');
                setIdEmpleadoAuditado('');
              }}
              style={styles.input}
            >
              <option value="PLANTA">Planta</option>
              <option value="AREA">Área</option>
              <option value="EMPLEADO">Empleado</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>PLANTILLA</label>
            <select 
              value={idPlantilla}
              onChange={(e) => setIdPlantilla(e.target.value)}
              style={styles.input}
            >
              <option value="">-- Seleccione una plantilla --</option>
              {plantillas.map(p => (
                <option key={p.id_plantilla} value={p.id_plantilla}>
                  {p.codigo_plantilla} - {p.nombre_plantilla}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>ID AUDITOR ASIGNADO</label>
            <select 
              value={idAuditor}
              onChange={(e) => setIdAuditor(e.target.value)}
              style={styles.input}
            >
              <option value="">-- Seleccione un auditor --</option>
              {auditores.map(a => (
                <option key={a.id_usuario} value={a.id_usuario}>
                  {a.username} (ID: {a.id_usuario})
                </option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>ID PLANTA</label>
            <select 
              value={idPlanta}
              onChange={(e) => {
                setIdPlanta(e.target.value);
                setIdArea(''); // Reset area if planta changes
                setIdEmpleadoAuditado(''); // Reset empleado as well
              }}
              style={styles.input}
            >
              <option value="">-- Seleccione una planta --</option>
              {plantas.map(planta => (
                <option key={planta.id_planta} value={planta.id_planta}>
                  {planta.nombre_planta} (ID: {planta.id_planta})
                </option>
              ))}
            </select>
          </div>

          {(tipoAuditoria === 'AREA' || tipoAuditoria === 'EMPLEADO') && (
            <div style={styles.formGroup}>
              <label style={styles.label}>ID ÁREA</label>
              <select 
                value={idArea}
                onChange={(e) => {
                  setIdArea(e.target.value);
                  setIdEmpleadoAuditado(''); // Reset empleado if area changes
                }}
                style={styles.input}
              >
                <option value="">-- Seleccione un área --</option>
                {areas
                  .filter(area => !idPlanta || String(area.id_planta) === String(idPlanta))
                  .map(area => (
                  <option key={area.id_area} value={area.id_area}>
                    {area.nombre_area} (ID: {area.id_area})
                  </option>
                ))}
              </select>
            </div>
          )}

          {tipoAuditoria === 'EMPLEADO' && (
            <div style={styles.formGroup}>
              <label style={styles.label}>EMPLEADO AUDITADO</label>
              <select 
                value={idEmpleadoAuditado}
                onChange={(e) => setIdEmpleadoAuditado(e.target.value)}
                style={styles.input}
              >
                <option value="">-- Seleccione un empleado --</option>
                {empleados
                  .filter(emp => !idArea || String(emp.id_area) === String(idArea))
                  .map(emp => (
                  <option key={emp.id_empleado} value={emp.id_empleado}>
                    {emp.nombre_completo} (Área: {emp.id_area})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
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
  btnGuardar: { backgroundColor: '#b89241', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: 'bold', display: 'flex', alignItems: 'center', cursor: 'pointer' },
  errorBox: { backgroundColor: '#fef2f2', color: '#991b1b', padding: '12px', borderRadius: '6px', marginBottom: '20px', border: '1px solid #f87171' },
  card: { backgroundColor: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  cardTitulo: { margin: '0 0 5px 0', color: '#0f172a', fontSize: '1.1rem' },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' },
  formGroup: { display: 'flex', flexDirection: 'column' },
  label: { marginBottom: '8px', fontSize: '0.85rem', fontWeight: '600', color: '#475569' },
  input: { padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.95rem', outline: 'none' }
};

export default FormularioAuditoria;
