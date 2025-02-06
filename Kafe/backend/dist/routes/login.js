"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = require("../utils/config");
const logger_1 = __importDefault(require("../utils/logger"));
const router = express_1.default.Router();
router.post('/login', (req, res) => {
    const { name, password, role } = req.body;
    if (role === 'admin') {
        const query = 'SELECT * FROM admin WHERE name = ? AND password = ?';
        config_1.db.query(query, [name, password], (err, results) => {
            if (err) {
                logger_1.default.error('Database error: ', err);
                return res.status(500).send({ success: false, message: 'Database error' });
            }
            if (results.length > 0) {
                logger_1.default.info('Logged in with valid Admin credentials');
                return res.send({ success: true, role: 'admin' });
            }
            else {
                logger_1.default.error('Invalid credentials');
                return res.status(401).send({ success: false, message: 'Invalid credentials' });
            }
        });
    }
    else if (role === 'customer') {
        const query = 'SELECT * FROM customer WHERE name = ? AND password = ?';
        config_1.db.query(query, [name, password], (err, results) => {
            if (err) {
                logger_1.default.error('Database error: ', err);
                return res.status(500).send({ success: false, message: 'Database error' });
            }
            if (results.length > 0) {
                logger_1.default.info('Logged in with valid Customer credentials');
                return res.send({ success: true, role: 'customer' });
            }
            else {
                logger_1.default.error('Invalid credentials');
                return res.status(401).send({ success: false, message: 'Invalid credentials' });
            }
        });
    }
    else {
        logger_1.default.error('Invalid role');
        return res.status(400).send({ success: false, message: 'Invalid role' });
    }
});
exports.default = router;
