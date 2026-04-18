import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config(); // Esto lee tu archivo .env

const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error conectando a PostgreSQL:', err.stack);
  } else {
    console.log('Conexión a PostgreSQL establecida correctamente');
  }
});

export default pool;