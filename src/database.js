const mysql = require('mysql'); //se añade modulo de mysql de node 
const {promisify} = require('util'); //Sirve para que pool pueda soportar promesas y funcionar asincronamente
const {database} = require('./keys.js'); //Se pide el usuario de la base de datos, nombre, y contraseña

const pool= mysql.createPool(database); //Se crea una constante con los datos del usuario para crear una piscina de conexiones

pool.getConnection((err, connection)=>{  //estableciendo y verificando la conexión con el servidor MySQL
    if(err){
        if (err.code=== 'PROTOCOL_CONNECTION_LOST'){
            console.error('DATABASE CONNECTION WAS CLOSED');
        }
        if(err.code === 'ER_CON_COUNT_ERROR'){
            console.error('DATABASE HAS TO MANY CONNECTIONS');
        }
        if(err.code === 'ECONNREFUSED'){
            console.error('DATABASE CONNECTION WAS REFUSED');
        }
    }
    if(connection) connection.release(); //Verifica que la conexión haya sido exitosa, mandando un mensaje relacionado
    console.log('DB is Connected');
    return;
});
//Promisify query convertir querys a promesas 
pool.query = promisify(pool.query); //Hace que las query mandadas a la pool se puedan hacer promesas
module.exports = pool;