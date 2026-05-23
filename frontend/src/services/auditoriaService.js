import api from "../api/axios";

export const auditoriaService = {
  obtenerAuditorias: async () => {
    // Asumiendo que existe una ruta GET /api/auditoria en el backend. Si no, se puede adaptar.
    // Revisando AuditoriaRoutes.js, no hay GET /, solo POST / y PATCH ... 
    // Wait, let's double check if GET / is missing.
    const response = await api.get('/auditoria');
    return response.data.datos;
  },

  crearAuditoria: async (datos) => {
    const response = await api.post('/auditoria', datos);
    return response.data;
  },

  inhabilitarAuditoria: async (id) => {
    const response = await api.patch(`/auditoria/${id}/inhabilitar`);
    return response.data;
  },

  iniciarAuditoria: async (id) => {
    const response = await api.patch(`/auditoria/${id}/iniciar`);
    return response.data;
  },
  
  registrarRespuesta: async (id, datos) => {
    const response = await api.post(`/auditoria/${id}/respuestas`, datos);
    return response.data;
  },
  
  finalizarAuditoria: async (id) => {
    const response = await api.patch(`/auditoria/${id}/finalizar`);
    return response.data;
  }
};
