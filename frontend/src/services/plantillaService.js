import api from "../api/axios";

const plantillaService = {

  obtenerPlantillas: async () => {
  const response = await api.get('/plantillas');
  return response.data.datos;
},

  obtenerPlantillaPorCodigo: async (codigo) => {
    const response = await api.get(`/plantillas/${codigo}`);
    return response.data;
  },

  crearPlantilla: async (datos) => {
    const response = await api.post('/plantillas', datos);
    return response.data;
  },

  inhabilitarPlantilla: async (codigo) => {
    const response = await api.delete(`/plantillas/${codigo}`);
    return response.data;
  }
};

export default plantillaService;