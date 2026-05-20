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
    // Inhabilitar una auditoría planificada
    static async inhabilitarAuditoria(id_auditoria, inhabilitado_por) {
        //buscamos si la auditoría existe y esta activa
        const auditoria = await Auditoria.buscarPorId(id_auditoria);
        if (auditoria == null) {
            throw new AppError('La auditoría solicitada no fue encontrada.', 404);
        }
        //solo se permite la cancelacion si la auditoria no ha iniciado
        if (auditoria.estado !== 'CREADA') {
            throw new AppError(`No se puede inhabilitar la auditoría porque ya se encuentra en estado '${auditoria.estado}'.`, 400);
        }
        //ejecucion del borrado logico en la BD
        const auditoriaInhabilitada = await Auditoria.inhabilitar(id_auditoria, inhabilitado_por);
        //proteccion contra Condiciones de Carrera
        if (auditoriaInhabilitada == null) {
            throw new AppError('No fue posible inhabilitar la auditoría.', 409);
        }
        return auditoriaInhabilitada;
    }
  //modificar una auditoria planificada
    static async actualizarAuditoria(id_auditoria, datos, actualizado_por) {
        const { id_plantilla, id_auditor } = datos;
        //buscamos la auditoria
        const auditoria = await Auditoria.buscarPorId(id_auditoria);
        if (auditoria == null) {
            throw new AppError('No se ha podido actualizar la auditoría.', 404);
        }
        //validacion de Estado
        if (auditoria.estado !== 'CREADA') {
            throw new AppError(`No se puede modificar la auditoría porque ya se encuentra en estado '${auditoria.estado}'.`, 400);
        }
        const plantillaCambio = Number(auditoria.id_plantilla) !== id_plantilla;
        const auditorCambio = Number(auditoria.id_auditor) !== id_auditor;
        if (!plantillaCambio && !auditorCambio) {
            throw new AppError('No se detectaron cambios en la plantilla ni en el auditor para actualizar.', 400);
        }
        if (plantillaCambio) {
            const plantillaActiva = await Auditoria.validarPlantillaActiva(id_plantilla);
            if (!plantillaActiva) {
                throw new AppError('La plantilla seleccionada no existe o se encuentra inhabilitada.', 404);
            }
        }
        //validar si el nuevo Auditor es valido
        if (auditorCambio) {
            const esAuditor = await Auditoria.validarUsuarioConRol(id_auditor, ROLES.AUDITOR);
            if (!esAuditor) {
                throw new AppError('El usuario asignado no existe, está inhabilitado o no tiene el rol de AUDITOR.', 400);
            }
        }
        const auditoriaActualizada = await Auditoria.actualizarAuditoria(id_auditoria, datos, actualizado_por);
        //proteccion contra Condiciones de Carrera
        if (auditoriaActualizada == null) {
            throw new AppError('No fue posible actualizar la auditoría. Es posible que haya sido modificada por otro proceso.', 409);
        }
        return auditoriaActualizada;
    }
    //iniciar la ejecucion de auditoria
    static async iniciarAuditoria(id_auditoria, id_usuario_peticion) {
        const auditoria = await Auditoria.buscarPorId(id_auditoria);
        if (auditoria === null) {
            throw new AppError('La auditoría solicitada no existe o ha sido inhabilitada.', 404);
        }
        if (auditoria.estado !== 'CREADA') {
            throw new AppError(`La auditoría no puede iniciarse porque se encuentra en estado '${auditoria.estado}'.`, 400);
        }
        if (Number(auditoria.id_auditor) !== Number(id_usuario_peticion)) {
            throw new AppError('Solo el auditor asignado puede iniciar esta auditoría.', 403);
        }
        //ejecutar update
        const auditoriaIniciada = await Auditoria.iniciarAuditoria(id_auditoria);
        //validacion contra Condiciones de Carrera
        if (auditoriaIniciada == null) {
            throw new AppError('La auditoría ya no se encuentra disponible para iniciar.', 409);
        }
        return auditoriaIniciada;
    }
}
export default AuditoriaServices;