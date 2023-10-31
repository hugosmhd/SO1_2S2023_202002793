import mysql from 'mysql2';

const connection = mysql.createConnection({
  host: '34.170.104.70',
  user: 'root',
  password: 'so1_usac_202002793__@',
  database: 'so1_base2',
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