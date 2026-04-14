import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors()); 
app.use(express.json()); 

app.get('/', (req, res) => {
    res.send('¡Servidor de Robles S.A. en línea y funcionando!');
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});