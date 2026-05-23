import api from "../api/axios";

export const usuarioService = {
  obtenerUsuarios: async () => {
    const response = await api.get('/usuarios');
    return response.data;
  },

  registrarUsuario: async (datos) => {
    const response = await api.post('/usuarios/registro', datos);
    return response.data;
  },

  actualizarUsuario: async (uuid, datos) => {
    const response = await api.patch(`/usuarios/${uuid}`, datos);
    return response.data;
  }
};
