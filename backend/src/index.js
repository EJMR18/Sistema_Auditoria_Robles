import express from 'express';
import cors from 'cors';
import pool from './config/db.js';
import usuarioRoutes from './routes/UsuarioRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); 
app.use(express.json()); 

app.use('/api/usuarios', usuarioRoutes);

app.get('/', (req, res) => {
    res.send('¡Servidor de Robles S.A. en línea y funcionando!');
});

app.listen(PORT, () => {
    console.log(`Servidor del SAR corriendo en http://localhost:${PORT} 🚀`);
});