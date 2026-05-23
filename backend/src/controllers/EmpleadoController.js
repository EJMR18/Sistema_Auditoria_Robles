import EmpleadoService from '../services/EmpleadoService.js';

export const crearEmpleado = async (req, res, next) => {
    try {
        const idCreador = req.usuario.id_usuario;
        const resultado = await EmpleadoService.crearEmpleado(req.body, idCreador);
        res.status(201).json({
            estado: 'exito',
            mensaje: 'Empleado registrado correctamente.',
            datos: resultado
        });
    } catch (error) {
        next(error);
    }
};

export const obtenerEmpleados = async (req, res, next) => {
    try {
        const empleados = await EmpleadoService.listarEmpleados();
        res.status(200).json({
            estado: 'exito',
            cantidad: empleados.length,
            datos: empleados
        });
    } catch (error) {
        next(error);
    }
};

export const eliminarEmpleado = async (req, res, next) => {
    try {
        const { id } = req.params;
        const resultado = await EmpleadoService.eliminarEmpleado(id);
        res.status(200).json({
            estado: 'exito',
            mensaje: 'Empleado inhabilitado (eliminación virtual) correctamente.',
            datos: resultado
        });
    } catch (error) {
        next(error);
    }
};
