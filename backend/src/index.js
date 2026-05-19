import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pool from './config/db.js';
import usuarioRoutes from './routes/UsuarioRoutes.js';
import dashboardRoutes from './routes/DashboardRoutes.js';
import errorHandler from './middlewares/errorHandler.js';
import plantillaRoutes from './routes/PlantillaRoutes.js';
import auditoriaRoutes from './routes/AuditoriaRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); 
app.use(express.json()); 

//=========Rutas===========
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/plantilla', plantillaRoutes);
app.use('/api/auditoria', auditoriaRoutes);

app.get('/', (req, res) => {
    res.send('¡Servidor de Robles S.A. en línea y funcionando!');
});

app.use(errorHandler); // Middleware de manejo de errores
//===================Encendido del Servidor========================
app.listen(PORT, () => {
    console.log(`Servidor del SAR corriendo en http://localhost:${PORT} 🚀`);
});
