import api from "../api/axios.js";

export const loginUsuario = async (username, password) => {
    try{
        //mandamos a la ruta de node
        const respuesta = await api.post('/usuarios/login', { username, password });    

        //si el servidor nos da el token
        if(respuesta.data.token){
            //guardamos e; token y los datos datos del ususario
            sessionStorage.setItem('token', respuesta.data.token);
            sessionStorage.setItem('usuario', JSON.stringify(respuesta.data.data));
        }
        return respuesta.data;
    }catch(error){
        console.error("🕵️‍♂️ EL ERROR REAL DE AXIOS ES:", error);

        if(error.response && error.response.data){
            throw error.response.data;
        }else{
            throw { mensaje: 'Error de conexion con el servidor' };
        }
    }
};

export const logoutUsuario = () => {
    //sacamos el token y los datos del usuario
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('usuario');
};