"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbPromise = exports.db = void 0;
const mysql2_1 = __importDefault(require("mysql2"));
exports.db = mysql2_1.default.createPool({
    host: 'bzaauyyonfzbxdizcq6t-mysql.services.clever-cloud.com',
    user: 'uevur9oahbuppuym',
    password: 'kFC2qEt6iG6HfCDerKfh',
    database: 'bzaauyyonfzbxdizcq6t',
    port: 3306,
    ssl: { rejectUnauthorized: false },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});
// Convert the connection to a promise-based interface
exports.dbPromise = exports.db.promise();
