import express from 'express';
import { db } from '../utils/config';
import logger from '../utils/logger';

const router = express.Router();

router.post('/login', (req: any, res:any) => {
  const { name, password, role } = req.body;

  if (role === 'admin') {
    const query = 'SELECT * FROM admin WHERE name = ? AND password = ?';
    db.query(query, [name, password], (err, results:any) => {
      if (err) {
        logger.error('Database error: ', err);
        return res.status(500).send({ success: false, message: 'Database error' });
      }
      if (results.length > 0) {
        logger.info('Logged in with valid Admin credentials');
        return res.send({ success: true, role: 'admin' });
      } else {
        logger.error('Invalid credentials');
        return res.status(401).send({ success: false, message: 'Invalid credentials' });
      }
    });
  } else if (role === 'customer') {
    const query = 'SELECT * FROM customer WHERE name = ? AND password = ?';
    db.query(query, [name, password], (err, results:any) => {
      if (err) {
        logger.error('Database error: ', err);
        return res.status(500).send({ success: false, message: 'Database error' });
      }
      if (results.length > 0) {
        logger.info('Logged in with valid Customer credentials');
        return res.send({ success: true, role: 'customer' });
      } else {
        logger.error('Invalid credentials');
        return res.status(401).send({ success: false, message: 'Invalid credentials' });
      }
    });
  } else {
    logger.error('Invalid role');
    return res.status(400).send({ success: false, message: 'Invalid role' });
  }
});

export default router;
