import api from "../api/axios.js";

export const loginUsuario = async (username, password) => {
    try {

        const respuesta = await api.post('/usuarios/login', {
            username,
            password
        });

        if (respuesta.data.token) {
            sessionStorage.setItem('token', respuesta.data.token);
            sessionStorage.setItem('usuario', JSON.stringify(respuesta.data.data));
        }

        return respuesta.data;

    } catch (error) {

        console.error("🕵️‍♂️ EL ERROR REAL DE AXIOS ES:", error);

        if (error.response && error.response.data) {
            throw error.response.data;
        } else {
            throw { mensaje: 'Error de conexion con el servidor' };
        }
    }
};
export const logoutUsuario = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('usuario');
};