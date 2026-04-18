import Usuario from '../models/Usuario.js';

class UsuarioController {
    //metodo para obtener todos los usuarios
    static async obtenerTodos(req, res) {
        //req= request, res=response
        try {
            const listaUsuarios = await Usuario.obtenerTodosLosUsuarios();
            
            res.json({
                exito: true,
                mensaje: listaUsuarios.lenght,
                data: listaUsuarios
            });
        } catch (error) {
            console.error("Error en obtenerTodos:", error);
            res.status(500).json({ error: "Error Interno del servidor"});
        }
    }
}
export default UsuarioController;