import axios from 'axios';

const api = axios.create({
    //punto de partda para las rutas de la api
  baseURL: '/api'
});

api.interceptors.request.use(config => {
  const token = sessionStorage.getItem('token');  
  //si encuentra el token se agrega a la cabecera
    if (token) {    
        config.headers['Authorization'] = `Bearer ${token}`;
    }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
