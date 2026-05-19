import Auditoria from '../models/Auditoria.js';
import AppError from '../utils/AppError.js';
import { ROLES } from '../constant/roles.js';

class AuditoriaServices {
    static async crearAuditoria(datosAuditoria, creado_por) {
        const { 
            tipo_auditoria, 
            id_plantilla, 
            id_planta, 
            id_area, 
            id_empleado_auditado,
            id_auditor 
        } = datosAuditoria;
        //validacion de Plantilla Activa
        const plantillaActiva = await Auditoria.validarPlantillaActiva(id_plantilla);
        if (!plantillaActiva) {
            throw new AppError('La plantilla seleccionada no existe o se encuentra inhabilitada.', 404);
        }
        //Validaciones de estructura segun el tipo de auditorias
        if (tipo_auditoria === 'PLANTA') {
            if (id_planta == null || id_area != null || id_empleado_auditado != null) {
                throw new AppError('Para una auditoría de tipo PLANTA, solo debe registrarse el ID de la planta.', 400);
            }
        } else if (tipo_auditoria === 'AREA') {
            if (id_planta == null || id_area == null || id_empleado_auditado != null) {
                throw new AppError('Para una auditoría de tipo AREA, se requiere la planta y el área correspondientes.', 400);
            }
        } else if (tipo_auditoria === 'EMPLEADO') {
            if (id_planta == null || id_area == null || id_empleado_auditado == null) {
                throw new AppError('Para una auditoría de tipo EMPLEADO, se deben especificar obligatoriamente planta, área y empleado.', 400);
            }
        }
        //Validacion de Jerarquia e Integridad Referencial
        if (id_area != null) {
            const areaCoherente = await Auditoria.validarAreaEnPlanta(id_area, id_planta);
            if (!areaCoherente) {
                throw new AppError('El área especificada no pertenece a la planta seleccionada.', 400);
            }
        }
        if (id_empleado_auditado != null) {
            const empleadoCoherente = await Auditoria.validarEmpleadoEnArea(id_empleado_auditado, id_area);
            if (!empleadoCoherente) {
                throw new AppError('El empleado especificado no pertenece al área seleccionada.', 400);
            }
        }
        //Validacion del Rol del Auditor asignado
        const esAuditor = await Auditoria.validarUsuarioConRol(id_auditor, ROLES.AUDITOR);
        if (!esAuditor) {
            throw new AppError('El usuario asignado no existe, está inhabilitado o no tiene el rol de AUDITOR.', 400);
        }
        const codigoGenerado = `AUD-${Date.now()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
        const datosSeguros = {
            ...datosAuditoria,
            codigo_auditoria: codigoGenerado,
            creado_por
        };
        const nuevaAuditoria = await Auditoria.crear(datosSeguros);
        return nuevaAuditoria;
    }
}
export default AuditoriaServices;