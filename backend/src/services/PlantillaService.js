import Plantilla from '../models/Plantilla.js';
import AppError from '../utils/AppError.js';

class PlantillaServices {  
    static async crearPlantillaNueva(datos, idCreador) {
        // destructuracion
        const { preguntas, ...datosPlantilla } = datos;

        datosPlantilla.codigo_plantilla = datosPlantilla.codigo_plantilla.trim().toUpperCase();

        try {
            //llamada al modelo
            const resultado = await Plantilla.crearConPreguntas(
                datosPlantilla,
                preguntas,
                idCreador
            );
            return resultado;        
        } catch (error) {
            if (error.code === '23505') {          
                if (error.constraint === 'sar_plantillas_codigo_plantilla_key') {
                    throw new AppError('El código de plantilla ya está registrado. Intenta con otro.', 400);
                }         
                if (error.constraint === 'sar_preguntas_plantillas_id_plantilla_orden_key') {
                    throw new AppError('Hay preguntas con el mismo número de orden. Deben ser únicos.', 400);
                }
                throw new AppError('Error de duplicidad en los datos enviados.', 400);
            }        
            //dejamos que el Global Error Handler lo maneje
            throw error;
        }
    }

    static async listarPlantillas() {
        const plantillas = await Plantilla.obtenerTodas();
        return plantillas;
    }

    static async obtenerPlantillaPorCodigo(codigo) {
        const plantilla = await Plantilla.obtenerPorCodigo(codigo);
        return plantilla; 
    }

    static async inhabilitarPlantilla(codigo_plantilla, id_usuario) {
        const resultado = await Plantilla.inhabilitarPlantilla(codigo_plantilla, id_usuario);
        return resultado; 
    }
}
export default PlantillaServices;