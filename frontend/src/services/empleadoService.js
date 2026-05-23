import api from "../api/axios";

export const empleadoService = {
  obtenerEmpleados: async () => {
    const response = await api.get('/empleado');
    return response.data.datos;
  },

  crearEmpleado: async (datos) => {
    const response = await api.post('/empleado', datos);
    return response.data;
  },

  eliminarEmpleado: async (id) => {
    const response = await api.delete(`/empleado/${id}`);
    return response.data;
  }
};
