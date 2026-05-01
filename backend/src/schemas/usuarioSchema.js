import { z } from 'zod';

//molde para el login
export const loginSchema = z.object({
    username: z.string({
        required_error: 'El nombre de usuario es requerido',
        invalid_type_error: 'El nombre de usuario debe ser texto'
    })
    .trim()
    .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
    .max(50, 'El nombre de usuario no puede tener más de 50 caracteres'),

    password: z.string({
        required_error: "La contraseña es obligatoria"
    }).min(1, "La contraseña no puede estar vacia")
});

// moldee para el registro
export const registroSchema = z.object({
    id_rol: z.number({
        required_error: "El rol es obligatorio",
        invalid_type_error: "El rol debe ser un número"
    }).int().positive("El rol debe ser válido"),

    id_empleado: z.number({
        invalid_type_error: "El ID del empleado debe ser un número"
    }).int().positive().nullable().optional(),

    username: z.string({
        required_error: "El nombre de usuario es obligatorio"
    }).trim()
    .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
    .max(50, "El nombre de usuario no puede tener más de 50 caracteres"),

    password: z.string({
        required_error: "La contraseña es obligatoria"
    }).min(6, "La contraseña debe tener al menos 6 caracteres")
});