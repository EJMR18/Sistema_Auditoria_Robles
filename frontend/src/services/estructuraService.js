import api from "../api/axios";

export const estructuraService = {
  obtenerPlantas: async () => {
    const response = await api.get('/estructura/plantas');
    return response.data.datos;
  },

  obtenerAreas: async () => {
    const response = await api.get('/estructura/areas');
    return response.data.datos;
  }
};
