"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = require("../utils/config");
const logger_1 = __importDefault(require("../utils/logger"));
const router = express_1.default.Router();
// Register user route
router.post('/register', (req, res) => {
    const { name, phoneNumber, role, floorNumber, cabinNumber, password } = req.body;
    if (role === 'admin') {
        const query = 'INSERT INTO admin (name, phonenumber, password) VALUES (?, ?, ?)';
        config_1.db.query(query, [name, phoneNumber, password], (err) => {
            if (err) {
                logger_1.default.error('Failed to register admin: ', err);
                return res.status(500).json({ error: 'Failed to register admin' });
            }
            logger_1.default.info('Admin registered successfully');
            return res.status(200).json({ message: 'Admin registered successfully' });
        });
    }
    else if (role === 'customer') {
        const query = 'INSERT INTO customer (name, phonenumber, floorNumber, cabinNumber, password) VALUES (?, ?, ?, ?, ?)';
        config_1.db.query(query, [name, phoneNumber, floorNumber, cabinNumber, password], (err) => {
            if (err) {
                logger_1.default.error('Failed to register customer: ', err);
                return res.status(500).json({ error: 'Failed to register customer' });
            }
            logger_1.default.info('Customer registered successfully');
            return res.status(200).json({ message: 'Customer registered successfully' });
        });
    }
    else {
        logger_1.default.error('Invalid role');
        return res.status(400).json({ error: 'Invalid role' });
    }
});
exports.default = router;
