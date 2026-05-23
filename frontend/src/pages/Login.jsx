import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUsuario } from '../services/authServices';
import { Lock, User } from 'lucide-react';
import loginImage from '../assets/login.jpeg';

//memoria del componente
const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    //para cambiar de pagina despues de iniciar sesion
    const navigate = useNavigate();

    //al hacer clic en el boton de iniciar sesion
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            //mandamos a la funcion de loginUsuario que se conecta con el backend
            await loginUsuario(username, password);
            //redirigimos al panel de control
            navigate("/dashboard");
        }
         catch (err) {
            setError(err.mensaje || "Error al intentar iniciar sesión");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.pageContainer}>
            <div style={styles.card}>
                {/* Lado de la Imagen */}
                <div style={styles.imageContainer}>
                    <div style={styles.imageOverlay}>
                        <h1 style={styles.imageTitle}>ROBLES</h1>
                        <p style={styles.imageSubtitle}>Sistema de Auditoría y Gestión</p>
                    </div>
                </div>

                {/* Lado del Formulario */}
                <div style={styles.formContainer}>
                    <div style={styles.formContent}>
                        <div style={styles.header}>
                            <h2 style={styles.titulo}>Bienvenido</h2>
                            <p style={styles.subtitulo}>Ingresa tus credenciales para continuar</p>
                        </div>

                        {error && (
                            <div style={styles.errorAlert}>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} style={styles.form}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Usuario:</label>
                                <div style={styles.inputWrapper}>
                                    <User size={18} style={styles.inputIcon} />
                                    <input 
                                        type="text" 
                                        value={username}
                                        // cada vez que se teclea se guarda en memoria
                                        onChange={(e) => setUsername(e.target.value)} 
                                        required 
                                        placeholder="Ej. admin"
                                        style={styles.input}
                                    />
                                </div>
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Contraseña:</label>
                                <div style={styles.inputWrapper}>
                                    <Lock size={18} style={styles.inputIcon} />
                                    <input 
                                        type="password" 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)} 
                                        required 
                                        placeholder="••••••••"
                                        style={styles.input}
                                    />
                                </div>
                            </div>

                            <button type="submit" disabled={loading} style={styles.btnSubmit}>
                                {loading ? 'Iniciando sesión...' : 'Entrar al Sistema'}
                            </button>
                        </form>
                        
                        <div style={styles.footerText}>
                            <p>© {new Date().getFullYear()} Robles S.A. Todos los derechos reservados.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    pageContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f4f7f6',
        padding: '20px'
    },
    card: {
        display: 'flex',
        width: '100%',
        maxWidth: '900px',
        backgroundColor: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        minHeight: '500px'
    },
    imageContainer: {
        flex: 1,
        backgroundImage: `url(${loginImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        display: 'flex'
    },
    imageOverlay: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(10, 31, 51, 0.75)', // Azul oscuro institucional #0a1f33 con opacidad
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        padding: '30px',
        textAlign: 'center'
    },
    imageTitle: {
        fontSize: '3rem',
        letterSpacing: '3px',
        margin: '0 0 10px 0',
        color: '#b89241' // Dorado institucional
    },
    imageSubtitle: {
        fontSize: '1.2rem',
        margin: 0,
        fontWeight: '300'
    },
    formContainer: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px'
    },
    formContent: {
        width: '100%',
        maxWidth: '350px'
    },
    header: {
        marginBottom: '30px',
        textAlign: 'center'
    },
    titulo: {
        color: '#0a1f33',
        fontSize: '2rem',
        margin: '0 0 5px 0'
    },
    subtitulo: {
        color: '#7f8c8d',
        margin: 0,
        fontSize: '0.9rem'
    },
    errorAlert: {
        backgroundColor: '#f8d7da',
        color: '#721c24',
        padding: '12px',
        borderRadius: '6px',
        marginBottom: '20px',
        fontSize: '0.85rem',
        textAlign: 'center',
        border: '1px solid #f5c6cb'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    },
    label: {
        color: '#0a1f33',
        fontWeight: 'bold',
        fontSize: '0.9rem'
    },
    inputWrapper: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center'
    },
    inputIcon: {
        position: 'absolute',
        left: '12px',
        color: '#9ca3af'
    },
    input: {
        width: '100%',
        padding: '12px 12px 12px 40px',
        border: '1px solid #cbd5e1',
        borderRadius: '6px',
        fontSize: '1rem',
        outline: 'none',
        transition: 'border-color 0.3s',
        boxSizing: 'border-box'
    },
    btnSubmit: {
        backgroundColor: '#b89241',
        color: 'white',
        border: 'none',
        padding: '12px',
        borderRadius: '6px',
        fontSize: '1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        marginTop: '10px',
        transition: 'background-color 0.3s'
    },
    footerText: {
        marginTop: '40px',
        textAlign: 'center',
        color: '#9ca3af',
        fontSize: '0.75rem'
    }
};

export default Login;
