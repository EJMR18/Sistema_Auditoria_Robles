import React, { useState, useEffect } from 'react';
import { empleadoService } from '../services/empleadoService';
import { estructuraService } from '../services/estructuraService';
import { Users, Shield, CheckCircle, Search, Plus } from 'lucide-react';

const Empleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [areas, setAreas] = useState([]);
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [cargo, setCargo] = useState('');
  const [idArea, setIdArea] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    cargarEmpleados();
    cargarAreas();
  }, []);

  const cargarAreas = async () => {
    try {
      const dataAreas = await estructuraService.obtenerAreas();
      setAreas(dataAreas || []);
    } catch (err) {
      console.error('Error al cargar áreas', err);
    }
  };

  const cargarEmpleados = async () => {
    try {
      setLoading(true);
      const data = await empleadoService.obtenerEmpleados();
      setEmpleados(data || []);
    } catch (err) {
      setError('Error al cargar la lista de empleados');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

 const handleCrear = async (e) => {
  e.preventDefault();

  if (!nombreCompleto.trim())
    return setError('El nombre completo es obligatorio');

  if (!idArea)
    return setError('Debe seleccionar un área de la lista');

  try {
    setLoading(true);
    setError('');

    await empleadoService.crearEmpleado({
      nombre_completo: nombreCompleto.trim(),
      cargo: cargo.trim(),
      id_area: Number(idArea)
    });

    setNombreCompleto('');
    setCargo('');
    setIdArea('');
    setMostrarModal(false);

    cargarEmpleados();

  } catch (err) {
    setError(
      err.response?.data?.mensaje ||
      'Error al registrar al empleado'
    );
  } finally {
    setLoading(false);
  }
};

  const handleEliminar = async (id_empleado) => {
    if (!window.confirm('¿Estás seguro de inhabilitar a este empleado? Esta acción es una eliminación virtual.')) return;
    try {
      setLoading(true);
      await empleadoService.eliminarEmpleado(id_empleado);
      cargarEmpleados();
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al inhabilitar empleado');
    } finally {
      setLoading(false);
    }
  };

  const empleadosFiltrados = empleados.filter(emp =>
    (emp.nombre_completo || '').toLowerCase().includes(busqueda.toLowerCase()) ||
    (emp.cargo || '').toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div style={styles.container}>
      {/* ENCABEZADO */}
      <header style={styles.header}>
        <div>
          <h1 style={styles.titulo}>Gestión de Empleados</h1>
          <p style={styles.subtitulo}>Administración del personal de Robles</p>
        </div>
        <button style={styles.btnNuevo} onClick={() => setMostrarModal(true)}>
          <Plus size={18} style={{ marginRight: '5px' }} /> Nuevo Empleado
        </button>
      </header>

      {/* TARJETAS DE RESUMEN */}
      <div style={styles.gridCards}>
        <div style={styles.card}>
          <div style={{fontSize: '2rem'}}>👥</div>
          <h3 style={styles.cardValue}>{empleados.length}</h3>
          <p style={styles.cardLabel}>Total Empleados</p>
        </div>
        <div style={styles.card}>
          <div style={{fontSize: '2rem'}}>✅</div>
          <h3 style={styles.cardValue}>
            {empleados.length}
          </h3>
          <p style={styles.cardLabel}>Activos</p>
        </div>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}

 {/* MODAL DE CREACIÓN */}
{mostrarModal && (
  <div style={styles.modalOverlay}>
    <div style={styles.modalContent}>
      <h3>Registrar Nuevo Empleado</h3>

      <form onSubmit={handleCrear}>

        <div style={{ marginBottom: '15px' }}>
          <label
            style={{
              display: 'block',
              marginBottom: '5px',
              color: '#0a1f33'
            }}
          >
            Nombre Completo:
          </label>

          <input
            type="text"
            value={nombreCompleto}
            onChange={(e) => setNombreCompleto(e.target.value)}
            style={styles.input}
            placeholder="Ej. Juan Pérez"
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label
            style={{
              display: 'block',
              marginBottom: '5px',
              color: '#0a1f33'
            }}
          >
            Cargo:
          </label>

          <input
            type="text"
            value={cargo}
            onChange={(e) => setCargo(e.target.value)}
            style={styles.input}
            placeholder="Ej. Operador"
          />
        </div>

        {/* CAMPO DE ÁREA ACTUALIZADO A DESPLEGABLE */}
        <div style={{ marginBottom: '15px' }}>
          <label
            style={{
              display: 'block',
              marginBottom: '5px',
              color: '#0a1f33'
            }}
          >
            Área Asignada:
          </label>

          <select
            value={idArea}
            onChange={(e) => setIdArea(e.target.value)}
            style={styles.input}
            required
          >
            <option value="">-- Seleccione un Área --</option>
            {areas.map((area) => (
              <option key={area.id_area} value={area.id_area}>
                {area.nombre_area}
              </option>
            ))}
          </select>
        </div>

        {/* CAMPO DE PLANTA DE LECTURA */}
        <div style={{ marginBottom: '15px' }}>
          <label
            style={{
              display: 'block',
              marginBottom: '5px',
              color: '#0a1f33'
            }}
          >
            Planta Correspondiente:
          </label>

          <input
            type="text"
            value={idArea ? (areas.find(a => String(a.id_area) === String(idArea))?.nombre_planta || 'Planta no encontrada') : ''}
            style={{...styles.input, backgroundColor: '#f1f5f9', color: '#64748b', cursor: 'not-allowed', fontWeight: 'bold' }}
            readOnly
            placeholder="Seleccione un área primero"
          />
        </div>

        <div
          style={{
            display: 'flex',
            gap: '10px',
            justifyContent: 'flex-end'
          }}
        >
          <button
            type="button"
            onClick={() => setMostrarModal(false)}
            style={styles.btnCancelar}
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={loading}
            style={styles.btnGuardar}
          >
            {loading ? 'Guardando...' : 'Registrar'}
          </button>

        </div>
      </form>
    </div>
  </div>
)}

      {/* BARRA DE BÚSQUEDA Y TABLA */}
      <div style={styles.tablaWrapper}>
        <div style={styles.actionsBar}>
          <h3 style={{color: '#0a1f33', margin: 0}}>Listado de Personal</h3>
          <div style={styles.searchContainer}>
            <Search size={18} color="#7f8c8d" />
            <input 
              type="text" 
              placeholder="Buscar empleado o cargo..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              style={styles.searchInput}
            />
          </div>
        </div>

        {loading && empleados.length === 0 ? (
          <p>Cargando personal...</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.tabla}>
              <thead>
                <tr style={styles.filaHeader}>
                  <th>ID</th>
                  <th>Nombre Completo</th>
                  <th>Cargo</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {empleadosFiltrados.map(emp => (
                  <tr key={emp.id_empleado} style={styles.filaBody}>
                    <td style={styles.celda}>{emp.id_empleado}</td>
                    <td style={styles.celda}><strong>{emp.nombre_completo}</strong></td>
                    <td style={styles.celda}>{emp.cargo || 'S/A'}</td>
                    <td style={styles.celda}>
                        <button 
                          onClick={() => handleEliminar(emp.id_empleado)}
                          style={styles.btnAccionDanger}
                        >
                            Inhabilitar
                        </button>
                    </td>
                  </tr>
                ))}
                {empleadosFiltrados.length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ padding: '15px', textAlign: 'center', color: '#7f8c8d' }}>
                      No hay empleados activos que coincidan con la búsqueda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
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
    display: 'flex',
    alignItems: 'center',
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
    color: '#7f8c8d',
    fontSize: '0.9rem',
    margin: 0
  },
  tablaWrapper: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
  },
  actionsBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#f4f7f6',
    padding: '8px 15px',
    borderRadius: '8px',
    width: '300px'
  },
  searchInput: {
    border: 'none',
    backgroundColor: 'transparent',
    outline: 'none',
    marginLeft: '10px',
    width: '100%'
  },
  tabla: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left'
  },
  filaHeader: {
    borderBottom: '2px solid #eee',
    color: '#7f8c8d'
  },
  filaBody: {
    borderBottom: '1px solid #eee',
    transition: 'background-color 0.2s'
  },
  celda: {
    padding: '15px 10px',
    color: '#0a1f33'
  },
  btnAccionDanger: {
    backgroundColor: '#ffe5e5',
    color: '#d63031',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '0.85rem'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    width: '400px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    outline: 'none'
  },
  btnGuardar: {
    backgroundColor: '#b89241',
    color: 'white',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  btnCancelar: {
    backgroundColor: '#eee',
    color: '#333',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold'
  }
};

export default Empleados;
