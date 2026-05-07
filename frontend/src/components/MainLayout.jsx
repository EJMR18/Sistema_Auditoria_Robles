import Sidebar from './Sidebar';

const MainLayout = ({ children }) => {
  return (
    <div style={styles.container}>
      {/* 1. LLAMAMOS AL SIDEBAR */}
      <Sidebar />

      {/* 2. ÁREA DE CONTENIDO DINÁMICO */}
      <main style={styles.mainContent}>
        {children}
      </main>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex', // Esto pone el Sidebar y el Main uno al lado del otro
    minHeight: '100vh',
    backgroundColor: '#f4f7f6' // Un gris muy claro para que resalte el blanco de las tablas
  },
  mainContent: {
    flex: 1, // Esto le dice al contenido que ocupe todo el espacio sobrante
    marginLeft: '260px', // IMPORTANTE: Debe ser el mismo ancho que el Sidebar para que no se traslapen
    padding: '30px',
    transition: 'margin-left 0.3s ease'
  }
};

export default MainLayout;