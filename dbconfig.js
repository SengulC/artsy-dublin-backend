require('dotenv').config();

module.exports = {
    host: 'mariadb_2526-cs7025-group2',    
    port: 3306,  
    user: '2526-cs7025-group2',
    password: process.env.DB_PW,
    timezone: '+00:00',
    database: '2526-cs7025-group2_db',
    connectionLimit: 5,
    bigIntAsNumber: true // to fix bigint stuff
}
