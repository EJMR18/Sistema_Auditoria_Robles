import { Link, useNavigate } from 'react-router-dom';
import { logoutUsuario } from '../services/authServices';
import { Home, FileText, ClipboardList, Users, BarChart3, Briefcase } from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();

  // Recuperamos el objeto del usuario que guardaste en el login
  const data = sessionStorage.getItem('usuario');
  const usuarioActivo = data ? JSON.parse(data) : null;

  const handleLogout = () => {
    logoutUsuario(); // Limpia el sessionStorage
    navigate('/login');
  };

  return (
    <div style={styles.sidebar}>
      {/* SECCIÓN SUPERIOR: Logo y Links */}
      <div style={styles.topSection}>
        <div style={styles.logoContainer}>
          <h2 style={styles.logoText}>ROBLES</h2>
          <p style={styles.subText}>Panel Administrativo</p>
        </div>
        
        <nav style={styles.nav}>
          {/* Cambia tu bloque de enlaces por este: */}
<Link to="/dashboard" style={styles.link}>
  <div style={styles.iconContainer}>
    <Home size={20} />
    <span>Inicio</span>
  </div>
</Link>

<Link to="/dashboard/plantillas" style={styles.link}>
  <div style={styles.iconContainer}>
    <FileText size={20} />
    <span>Plantillas</span>
  </div>
</Link>

<Link to="/dashboard/auditorias" style={styles.link}>
  <div style={styles.iconContainer}>
    <ClipboardList size={20} />
    <span>Auditorías</span>
  </div>
</Link>

{/* Mostrar Usuarios y Empleados SOLO si el usuario es Administrador (id_rol === 1) */}
{usuarioActivo?.id_rol === 1 && (
  <>
    <Link to="/dashboard/usuarios" style={styles.link}>
      <div style={styles.iconContainer}>
        <Users size={20} />
        <span>Usuarios</span>
      </div>
    </Link>

    <Link to="/dashboard/empleados" style={styles.link}>
      <div style={styles.iconContainer}>
        <Briefcase size={20} />
        <span>Empleados</span>
      </div>
    </Link>
  </>
)}

<Link to="/dashboard/reportes" style={styles.link}>
  <div style={styles.iconContainer}>
    <BarChart3 size={20} />
    <span>Reportes</span>
  </div>
</Link>
        </nav>
      </div>

      {/* SECCIÓN INFERIOR: Perfil y Salida */}
      <div style={styles.footer}>
        <div style={styles.divisor}></div>
        
        {/* Identidad del usuario que se logueó */}
        <div style={styles.userProfile}>
          <div style={styles.userIcon}>👤</div>
          <div style={styles.userInfo}>
            <p style={styles.userName}>{usuarioActivo ? usuarioActivo.username : 'Invitado'}</p>
            <p style={styles.userRole}>
              {usuarioActivo?.id_rol === 1 ? 'Administrador' : 'Auditor'}
            </p>
          </div>
        </div>

        <button onClick={handleLogout} style={styles.logoutBtn}>
          <span style={{marginRight: '10px'}}>🚪</span>
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

const styles = {
  sidebar: {
    width: '260px',
    height: '100vh',
    backgroundColor: '#0a1f33',
    color: 'white',
    padding: '25px 15px',
    position: 'fixed',
    left: 0,
    top: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between', // EMPUJA el footer al fondo
    boxShadow: '2px 0 10px rgba(0,0,0,0.3)',
    boxSizing: 'border-box'
  },
  topSection: {
     display: 'flex', 
     flexDirection: 'column' 
    },
  logoContainer: {
     textAlign: 'center',
      marginBottom: '30px',
       borderBottom: '2px solid #b89241',
        paddingBottom: '15px'
       },
  logoText: {
     color: '#b89241',
      margin: 0,
       letterSpacing: '2px',
        fontSize: '1.6rem' 
      },
  subText: { 
    fontSize: '0.7rem',
     color: '#bdc3c7',
      margin: 0,
       textTransform: 'uppercase' 
      },
  nav: {
     display: 'flex',
      flexDirection: 'column', gap: '5px'
     },
  link: {
    color: '#ecf0f1',
    textDecoration: 'none',
    padding: '12px 15px',
    borderRadius: '8px',
    fontSize: '0.95rem',
    display: 'block',
    transition: '0.3s'
  },
  
  // NUEVOS ESTILOS PARA EL FOOTER
  footer: {
     width: '100%',
      paddingBottom: '10px' 
    },
  divisor: {
     height: '1px',
      backgroundColor: 'rgba(255,255,255,0.1)',
       marginBottom: '15px' 
      },
  userProfile: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px'
  },
  userIcon: {
    width: '35px',
    height: '35px',
    backgroundColor: 'rgba(184, 146, 65, 0.2)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #b89241'
  },
  userInfo: {
     display: 'flex',
      flexDirection: 'column' 
    },
  userName: { 
    margin: 0,
     fontSize: '0.85rem',
      fontWeight: 'bold',
       color: '#fff' 
      },
  userRole: {
     margin: 0,
      fontSize: '0.7rem',
       color: '#b89241'
       },
  logoutBtn: {
    width: '100%',
    backgroundColor: 'transparent',
    color: '#e74c3c',
    border: '1px solid #e74c3c',
    padding: '10px',
    cursor: 'pointer',
    borderRadius: '8px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
};

export default Sidebar;