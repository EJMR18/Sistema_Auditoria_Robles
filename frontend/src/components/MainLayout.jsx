import { Outlet } from 'react-router-dom'; // 1. IMPORTAMOS EL OUTLET
import Sidebar from './Sidebar';

const MainLayout = () => { // Quitamos el { children } de aquí
  return (
    <div style={styles.container}>
      {/* 1. LLAMAMOS AL SIDEBAR */}
      <Sidebar />

      {/* 2. ÁREA DE CONTENIDO DINÁMICO */}
      <main style={styles.mainContent}>
        <Outlet /> {/* 2. CAMBIAMOS {children} POR <Outlet /> */}
      </main>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex', 
    minHeight: '100vh',
    backgroundColor: '#f4f7f6' 
  },
  mainContent: {
    flex: 1, 
    marginLeft: '260px', 
    padding: '30px',
    transition: 'margin-left 0.3s ease'
  }
};

export default MainLayout;