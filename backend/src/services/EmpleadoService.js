import Empleado from '../models/Empleado.js';
import AppError from '../utils/AppError.js';

class EmpleadoService {
    static async crearEmpleado(datos, idCreador) {
        return await Empleado.crear(datos, idCreador);
    }

    static async listarEmpleados() {
        return await Empleado.obtenerTodos();
    }

    static async eliminarEmpleado(id_empleado) {
        const resultado = await Empleado.inhabilitar(id_empleado);
        if (!resultado) {
            throw new AppError('Empleado no encontrado o ya estaba inhabilitado.', 404);
        }
        return resultado;
    }
}

export default EmpleadoService;
