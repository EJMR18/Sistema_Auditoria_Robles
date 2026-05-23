import { z } from 'zod';

export const empleadoSchema = z.object({
    nombre_completo: z.string({
        required_error: "El nombre completo del empleado es obligatorio"
    }).trim().min(3, "El nombre debe tener al menos 3 caracteres").max(150, "El nombre no puede exceder los 150 caracteres"),
    cargo: z.string().trim().optional(),
    id_area: z.number().int().positive().optional()
});
