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
//inhabilitar
export const idAuditoriaSchema = z.object({
    id: z.coerce.number({
        required_error: 'El ID de la auditoría es obligatorio',
        invalid_type_error: 'El ID debe ser un número válido'
    })
    .int({
        message:'El ID debe ser un número entero'
    })
    .positive({
        message:'El ID debe ser un número positivo'
    })
}).strict();

export const actualizarAuditoriaSchema = z.object({
    id_plantilla: z.number({
        required_error: "El id_plantilla es obligatorio",
        invalid_type_error: "El id_plantilla debe ser un número"
    }).int({
        message: "El id_plantilla debe ser un número entero"
    }).positive({
        message: "El id_plantilla debe ser un número positivo"
    }),
    id_auditor: z.number({
        required_error: "El id_auditor es obligatorio",
        invalid_type_error: "El id_auditor debe ser un número"
    }).int({
        message: "El id_auditor debe ser un número entero"
    }).positive({
        message: "El id_auditor debe ser un número positivo"
    })
}).strict({
    message: "La petición contiene campos no permitidos."
});

export const registrarRespuestaSchema = z.object({
    id_pregunta: z.number({
        required_error: "El id_pregunta es obligatorio",
        invalid_type_error: "El id_pregunta debe ser un número"
    }).int({
        message: "El id_pregunta debe ser un número entero"
    }).positive({
        message: "El id_pregunta debe ser un número positivo"
    }),
    valor_respuesta: z.enum(['SI', 'NO', 'NA'], {
        required_error: "El valor_respuesta es obligatorio",
        invalid_type_error: "El valor_respuesta debe ser 'SI', 'NO' o 'NA'"
    }),
    observacion: z.object({
        descripcion: z.string()
            .trim()
            .min(1, "La descripción no puede estar vacía")
            .optional(),
        criticidad: z.enum(['BAJA', 'MEDIA', 'ALTA', 'CRITICA'], {
            invalid_type_error: "Criticidad no válida"
        }).optional()
    })
    .strict()
    .refine(
        data => !data.criticidad || !!data.descripcion,
        {
            message: 'Si se especifica criticidad, es obligatorio incluir una descripción.',
            path: ['descripcion']
        }
    )
    .refine(
        data => !!data.descripcion || !!data.criticidad,
        {
            message: 'La observación no puede estar vacía.'
        }
    )
    .optional()
}).strict({
    message: "La petición contiene campos no permitidos."
});