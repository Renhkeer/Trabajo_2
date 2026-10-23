const sql = require('mssql/msnodesqlv8');

const config = {
  // Usamos una cadena de conexión directa para forzar el controlador de Windows
  connectionString: 'Driver={SQL Server};Server=localhost\\SQLEXPRESS;Database=biblioteca_db;Trusted_Connection=yes;'
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('Conectado a SQL Server (Autenticación de Windows)');
    return pool;
  })
  .catch(err => console.error('Error de conexión a la BD: ', err));

module.exports = {
  sql, poolPromise
};