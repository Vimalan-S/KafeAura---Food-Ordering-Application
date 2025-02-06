import mysql from 'mysql2';

export const db = mysql.createPool({
    host: 'bzaauyyonfzbxdizcq6t-mysql.services.clever-cloud.com',
    user: 'uevur9oahbuppuym',
    password: 'kFC2qEt6iG6HfCDerKfh',
    database: 'bzaauyyonfzbxdizcq6t',
    port: 3306,
    ssl: { rejectUnauthorized: false } ,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

// Convert the connection to a promise-based interface
export const dbPromise = db.promise();

