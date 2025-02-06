import express from 'express';
import { db } from '../utils/config';
import logger from '../utils/logger';

const router = express.Router();

// Register user route
router.post('/register', (req: any, res: any) => {
  const { name, phoneNumber, role, floorNumber, cabinNumber, password } = req.body;

  if (role === 'admin') {
    const query = 'INSERT INTO admin (name, phonenumber, password) VALUES (?, ?, ?)';
    db.query(query, [name, phoneNumber, password], (err) => {
      if (err) {
        logger.error('Failed to register admin: ', err);
        return res.status(500).json({ error: 'Failed to register admin' });
      }

      logger.info('Admin registered successfully');
      return res.status(200).json({ message: 'Admin registered successfully' });
    });
  } else if (role === 'customer') {
    const query = 'INSERT INTO customer (name, phonenumber, floorNumber, cabinNumber, password) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [name, phoneNumber, floorNumber, cabinNumber, password], (err) => {
      if (err) {
        logger.error('Failed to register customer: ', err);
        return res.status(500).json({ error: 'Failed to register customer' });
      }

      logger.info('Customer registered successfully');
      return res.status(200).json({ message: 'Customer registered successfully' });
    });
  } else {
    logger.error('Invalid role');
    return res.status(400).json({ error: 'Invalid role' });
  }
});

export default router;
