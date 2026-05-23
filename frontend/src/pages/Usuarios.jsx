import { useState, useEffect } from "react";
import api from "../api/axios";
import { usuarioService } from "../services/usuarioService";

const Usuarios= () => { 
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Estados para modales
  const [mostrarModalCrear, setMostrarModalCrear] = useState(false);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [errorGlobal, setErrorGlobal] = useState('');
  const [procesando, setProcesando] = useState(false);

  // Estados del formulario Crear
  const [nuevoUsuario, setNuevoUsuario] = useState({
    username: '',
    password: '',
    id_rol: 2, // Por defecto Auditor
    id_empleado: ''
  });

  // Estados del formulario Editar
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [editarDatos, setEditarDatos] = useState({
    password: '',
    estado_activo: true
  });

  const obtenerDatos = async () => {
    try {
      setCargando(true);
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

  useEffect(() => {
    obtenerDatos();
  }, []);

  // Handlers para Crear
  const handleCrearSubmit = async (e) => {
    e.preventDefault();
    setErrorGlobal('');
    setProcesando(true);
    try {
      const payload = {
        username: nuevoUsuario.username,
        password: nuevoUsuario.password,
        id_rol: Number(nuevoUsuario.id_rol),
        id_empleado: nuevoUsuario.id_empleado ? Number(nuevoUsuario.id_empleado) : null
      };
      
      await usuarioService.registrarUsuario(payload);
      setMostrarModalCrear(false);
      setNuevoUsuario({ username: '', password: '', id_rol: 2, id_empleado: '' });
      obtenerDatos();
    } catch (error) {
      setErrorGlobal(error.response?.data?.mensaje || 'Error al crear el usuario');
    } finally {
      setProcesando(false);
    }
  };

  // Handlers para Editar
  const abrirModalEditar = (usuario) => {
    setUsuarioEditando(usuario);
    setEditarDatos({
      password: '',
      estado_activo: usuario.estado_activo
    });
    setMostrarModalEditar(true);
    setErrorGlobal('');
  };

  const handleEditarSubmit = async (e) => {
    e.preventDefault();
    setErrorGlobal('');
    setProcesando(true);
    try {
      const payload = {};
      if (editarDatos.password.trim() !== '') {
        payload.password = editarDatos.password;
      }
      payload.estado_activo = editarDatos.estado_activo;
      
      await usuarioService.actualizarUsuario(usuarioEditando.uuid_usuario, payload);
      setMostrarModalEditar(false);
      obtenerDatos();
    } catch (error) {
      setErrorGlobal(error.response?.data?.mensaje || 'Error al actualizar el usuario');
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* 1. ENCABEZADO */}
      <header style={styles.header}>
        <div>
          <h1 style={styles.titulo}>Gestión de Usuarios</h1>
          <p style={styles.subtitulo}>Administración de cuentas y accesos de Robles</p>
        </div>
        <button style={styles.btnNuevo} onClick={() => setMostrarModalCrear(true)}>+ Nuevo Usuario</button>
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
        {errorGlobal && <div style={{color: 'red', marginBottom: '15px'}}>{errorGlobal}</div>}
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
                      <button style={styles.btnAccion} onClick={() => abrirModalEditar(u)}>Editar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 4. MODAL CREAR USUARIO */}
      {mostrarModalCrear && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3 style={{ color: '#0a1f33', marginTop: 0, marginBottom: '20px' }}>Crear Nuevo Usuario</h3>
            {errorGlobal && <div style={{ color: '#721c24', backgroundColor: '#f8d7da', padding: '10px', borderRadius: '6px', marginBottom: '15px', fontSize: '0.9rem' }}>{errorGlobal}</div>}
            <form onSubmit={handleCrearSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#0a1f33', fontWeight: '500', fontSize: '0.9rem' }}>Username:</label>
                <input 
                  type="text" 
                  value={nuevoUsuario.username} 
                  onChange={(e) => setNuevoUsuario({...nuevoUsuario, username: e.target.value})} 
                  style={styles.input} 
                  required 
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#0a1f33', fontWeight: '500', fontSize: '0.9rem' }}>Contraseña:</label>
                <input 
                  type="password" 
                  value={nuevoUsuario.password} 
                  onChange={(e) => setNuevoUsuario({...nuevoUsuario, password: e.target.value})} 
                  style={styles.input} 
                  required 
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#0a1f33', fontWeight: '500', fontSize: '0.9rem' }}>Rol:</label>
                <select 
                  value={nuevoUsuario.id_rol} 
                  onChange={(e) => setNuevoUsuario({...nuevoUsuario, id_rol: e.target.value})} 
                  style={styles.input}
                >
                  <option value={1}>Administrador</option>
                  <option value={2}>Auditor</option>
                </select>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#0a1f33', fontWeight: '500', fontSize: '0.9rem' }}>ID Empleado Asignado (Opcional):</label>
                <input 
                  type="number" 
                  value={nuevoUsuario.id_empleado} 
                  onChange={(e) => setNuevoUsuario({...nuevoUsuario, id_empleado: e.target.value})} 
                  style={styles.input} 
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setMostrarModalCrear(false)} style={styles.btnCancelar}>Cancelar</button>
                <button type="submit" disabled={procesando} style={styles.btnGuardar}>{procesando ? 'Guardando...' : 'Guardar Usuario'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. MODAL EDITAR USUARIO */}
      {mostrarModalEditar && usuarioEditando && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3 style={{ color: '#0a1f33', marginTop: 0, marginBottom: '20px' }}>Editar Usuario: <span style={{ color: '#b89241' }}>{usuarioEditando.username}</span></h3>
            {errorGlobal && <div style={{ color: '#721c24', backgroundColor: '#f8d7da', padding: '10px', borderRadius: '6px', marginBottom: '15px', fontSize: '0.9rem' }}>{errorGlobal}</div>}
            <form onSubmit={handleEditarSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#0a1f33', fontWeight: '500', fontSize: '0.9rem' }}>Nueva Contraseña (dejar en blanco para no cambiar):</label>
                <input 
                  type="password" 
                  value={editarDatos.password} 
                  onChange={(e) => setEditarDatos({...editarDatos, password: e.target.value})} 
                  style={styles.input} 
                />
              </div>
              <div style={{ marginBottom: '25px', backgroundColor: '#f4f7f6', padding: '15px', borderRadius: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#0a1f33', fontWeight: '500', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={editarDatos.estado_activo} 
                    onChange={(e) => setEditarDatos({...editarDatos, estado_activo: e.target.checked})}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  Cuenta Activa en el Sistema
                </label>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setMostrarModalEditar(false)} style={styles.btnCancelar}>Cancelar</button>
                <button type="submit" disabled={procesando} style={styles.btnGuardar}>{procesando ? 'Actualizando...' : 'Actualizar Usuario'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

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
    outline: 'none',
    boxSizing: 'border-box'
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

export default Usuarios;