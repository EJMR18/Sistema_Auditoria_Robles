import { z } from 'zod';

const validarFechaEstricta = (fecha) => {
    const d = new Date(fecha);
    return !isNaN(d.getTime()) && d.toISOString().slice(0, 10) === fecha;
};
export const filtroReportesSchema = z.object({
    fecha_inicio: z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato YYYY-MM-DD')
        .refine(validarFechaEstricta, {
            message: 'fecha_inicio no es una fecha válida en el calendario.'
        })
        .optional(),
    fecha_fin: z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato YYYY-MM-DD')
        .refine(validarFechaEstricta, {
            message: 'fecha_fin no es una fecha válida en el calendario.'
        })
        .optional(),
    id_planta: z.string()
        .regex(/^\d+$/, 'El id_planta debe ser numérico')
        .transform(Number)
        .refine(value => value > 0, {
            message: 'El id_planta debe ser un número positivo'
        })
        .optional(),
    id_area: z.string()
        .regex(/^\d+$/, 'El id_area debe ser numérico')
        .transform(Number)
        .refine(value => value > 0, {
            message: 'El id_area debe ser un número positivo'
        })
        .optional(),
    estado: z.enum(['FINALIZADA', 'ABORTADA'], {
        errorMap: () => ({
            message: "El estado del reporte solo puede ser 'FINALIZADA' o 'ABORTADA'."
        })
    }).optional()
})
//o ambas fechas vienen, o ninguna
.refine(
    data =>
        (!data.fecha_inicio && !data.fecha_fin) ||
        (data.fecha_inicio && data.fecha_fin),
    {
        message: 'Debe enviar fecha_inicio y fecha_fin juntas para aplicar el filtro de tiempo.',
        path: ['fecha_fin']
    }
)
//orden cronologico logico
.refine(
    data =>
        !data.fecha_inicio ||
        !data.fecha_fin ||
        data.fecha_inicio <= data.fecha_fin,
    {
        message: 'La fecha_inicio no puede ser mayor que la fecha_fin.',
        path: ['fecha_fin']
    }
);