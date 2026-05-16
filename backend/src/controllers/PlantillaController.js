import PlantillaServices from '../services/PlantillaService.js';

export const crearPlantilla = async (req, res, next) => {
    try {
        const idCreador = req.usuario.id_usuario; 
        const resultado = await PlantillaServices.crearPlantillaNueva(req.body, idCreador);
        res.status(201).json({
            estado: 'exito',
            mensaje: 'La plantilla y sus preguntas han sido registradas correctamente.',
            datos: resultado
        });
    } catch (error) {
        next(error);
    }
};

export const obtenerPlantillas = async (req, res, next) => {
    try {
        const plantillas = await PlantillaServices.listarPlantillas();

        res.status(200).json({
            estado: 'exito',
            cantidad: plantillas.length, 
            datos: plantillas
        });

    } catch (error) {
        next(error); 
    }
};

export const obtenerPlantillaDetalle = async (req, res, next) => {
    try {
        //sacamos el codigo
        const { codigo } = req.params; 
        
        const plantilla = await PlantillaServices.obtenerPlantillaPorCodigo(codigo);
        //si es null
        if (!plantilla) {
            return res.status(404).json({
                estado: 'error',
                mensaje: `No se encontró ninguna plantilla activa con el codigo: ${codigo}`
            });
        }
        res.status(200).json({
            estado: 'exito',
            datos: plantilla
        });

    } catch (error) {
        next(error); 
    }
};