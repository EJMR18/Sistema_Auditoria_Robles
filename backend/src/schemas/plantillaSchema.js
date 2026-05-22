import { z } from 'zod';

//esquema para validar cada pregunta individualmente
const preguntaSchema = z.object({
    texto_pregunta: z.string({
        required_error: "El texto de la pregunta es obligatorio"
    })
    .trim()
    .min(5, "La pregunta debe tener al menos 5 caracteres reales"),
    
    orden: z.number({
        required_error: "El orden es obligatorio"
    })
    .int()
    .positive("El orden debe ser un número entero positivo")
});

// esquema principal para la creacion de la plantilla
export const crearPlantillaSchema = z.object({
    codigo_plantilla: z.string({
        required_error: "El código de la plantilla es obligatorio"
    })
    .trim()
    .min(2, "El código es demasiado corto")
    .max(50, "El código no puede exceder los 50 caracteres")
    .regex(/^[a-zA-Z0-9-]+$/, "El código solo acepta letras, números y guiones (ej. AUD-001)"),

    nombre_plantilla: z.string({
        required_error: "El nombre de la plantilla es obligatorio"
    })
    .trim()
    .min(5, "El nombre de la plantilla es muy corto")
    .max(150, "El nombre no puede exceder los 150 caracteres"),
    
    descripcion: z.string().trim().optional(), 
    version: z.string().trim()
    .regex(/^\d+\.\d+$/, "La versión debe tener un formato válido como 1.0, 2.5, etc.")
    .optional(),
    
    // validamos que el campo preguntas sea un arreglo y que no quede vacio
    preguntas: z.array(preguntaSchema)
        .min(1, "Debes agregar al menos una pregunta a la plantilla")
        .refine((listaPreguntas) => {
            // solo los numeros de orden en un nuevo arreglo (ej. [1, 2, 2, 3])
            const ordenes = listaPreguntas.map(pregunta => pregunta.orden);     
            //un 'Set' en JavaScript elimina automáticamente los duplicados 
            const ordenesUnicos = new Set(ordenes);        
            //si el tamano original es igual al tamaño sin duplicados
            return ordenes.length === ordenesUnicos.size;
        }, {
            message: "Hay preguntas con el mismo número de orden. Cada pregunta debe tener un orden único."
        })
});