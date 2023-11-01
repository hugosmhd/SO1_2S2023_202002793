import dotenv from 'dotenv';
import mysql from 'mysql2';

dotenv.config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: '3306'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting: ' + err);
    return;
  }

  console.log('Connected to MySQL');
});

export { connection };