import { z } from 'zod';

export const crearAuditoriaSchema = z.object({
    tipo_auditoria: z.enum(['PLANTA', 'AREA', 'EMPLEADO'], {
        required_error: "El tipo_auditoria es obligatorio",
        invalid_type_error: "El tipo_auditoria debe ser 'PLANTA', 'AREA' o 'EMPLEADO'"
    }),
    
    id_plantilla: z.number({
        required_error: "El id_plantilla es obligatorio",
        invalid_type_error: "El id_plantilla debe ser un número"
    }).int({ 
        message: "El id_plantilla debe ser un número entero sin decimales" 
    }).positive({ 
        message: "El id_plantilla debe ser un número positivo" 
    }),
    id_auditor: z.number({
        required_error: "Debe asignar un auditor (id_auditor) para esta auditoría",
        invalid_type_error: "El id_auditor debe ser un número"
    }).int().positive(),
    id_planta: z.number({
        invalid_type_error: "El id_planta debe ser un número"
    }).int({ 
        message: "El id_planta debe ser un número entero" 
    }).positive().nullable().optional(),

    id_area: z.number({
        invalid_type_error: "El id_area debe ser un número"
    }).int({ 
        message: "El id_area debe ser un número entero" 
    }).positive().nullable().optional(),

    id_empleado_auditado: z.number({
        invalid_type_error: "El id_empleado_auditado debe ser un número"
    }).int({ 
        message: "El id_empleado_auditado debe ser un número entero" 
    }).positive().nullable().optional()

}).strict({
    message: "La petición contiene campos no permitidos o irreconocibles."
});