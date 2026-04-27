import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUsuario } from '../services/authServices';

//memoria del componente
const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    //para cambiar de pagina despues de iniciar sesion
    const navigate = useNavigate();
    //al hacer clic en el boton de iniciar sesion
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            //mandamos a la funcion de loginUsuario que se conecta con el backend
            await loginUsuario(username, password);
            //redirigimos al panel de control
            navigate("/dashboard");
        }
         catch (err) {
            setError(err.mensaje || "Error al intentar iniciar sesión");
        }
    };
    return (
        <div style={{ padding: '50px', maxWidth: '400px', margin: '0 auto' }}>
            <h2>Ingreso al Sistema Robles</h2>
            
            {}
            {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label>Usuario:</label>
                    <input 
                        type="text" 
                        value={username}
                        // cada vez que se teclea se guarda en memoria
                        onChange={(e) => setUsername(e.target.value)} 
                        required 
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label>Contraseña:</label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#0056b3', color: 'white' }}>
                    Entrar al Sistema
                </button>
            </form>
        </div>
    );
};

export default Login;
