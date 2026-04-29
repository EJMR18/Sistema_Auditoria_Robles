import express from 'express';
import { verificarToken } from '../middlewares/auth.js';

const router = express.Router();

router.use(verificarToken);

router.get('/principal', (req, res) => {
    res.status(200).json({
        exito: true,
        mensaje: "Acceso permitido al dashboard principal",
        datosExtraidosDelToken: {
            uuid_usuario: req.usuario.uuid_usuario,
            id_rol: req.usuario.id_rol
        }
    });
});

export default router;