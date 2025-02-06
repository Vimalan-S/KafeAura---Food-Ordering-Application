import express from 'express';
import { dbPromise, db } from '../utils/config';
import logger from '../utils/logger';
const router = express.Router();

router.post('/orders', async (req, res) => {
    const { cart, selectedTime, weatherData, totalAmount, deliveryType} = req.body;

    const foods = cart.map((obj: any) => obj.dishiId);
    const timeSlot = getTimeSlot(selectedTime);
    const day = new Date().getDay(); 
    const estimatedPrepTime = cart.reduce(
      (total:any, item:any) => total + item.preparationTime,
      0
    );

    const query = `
      INSERT INTO orders (
        customerId, foods, totalPrice, status, bookedTimeSlot, pickupTime, day, 
        feelslike_c, feelslike_f, heatindex_c, heatindex_f, cloud, precip_mm, estimatedPrepTime, text, deliveryType
      ) VALUES (?, ?, ?, 'processing', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
  
    const values = [
      1, JSON.stringify(foods), totalAmount, timeSlot, selectedTime, day,
      weatherData.feelslike_c, weatherData.feelslike_f, weatherData.heatindex_c, 
      weatherData.heatindex_f, weatherData.cloud, weatherData.precip_mm, estimatedPrepTime, weatherData?.condition?.text, deliveryType
    ];
  
    try {
      await db.execute(query, values);
      res.status(201).send({ message: 'Order created successfully' });
    } catch (error) {
      res.status(500).send({ error: 'Failed to create order' });
    }
  });

  function getTimeSlot(timeString: string): number {
    // Extract hours and minutes from the time string
    const [hours, minutes] = timeString.split(':').map(Number);
  
    // Determine the time slot
    if (hours >= 21 || hours < 9) {
      return 0; // Time outside the specified slots
    } else if (hours >= 9 && hours < 12) {
      return 1; // 9 AM to 12 PM
    } else if (hours >= 12 && hours < 15) {
      return 2; // 12 PM to 3 PM
    } else if (hours >= 15 && hours < 19) {
      return 3; // 3 PM to 7 PM
    } else if (hours >= 19 && hours < 22) {
      return 4; // 7 PM to 10 PM
    } else {
      return 0; // Default case
    }
  }

  router.get('/pendingOrders', async (req, res) => {
    
    const query = `
      SELECT * FROM orders WHERE status = 'processing'
    `;
  
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching Pending Orders:', err);
        logger.error('Error fetching Pending Orders:', err);
        return res.status(500).json({ message: 'Failed to fetch Pending Orders', error: err });
      }

      logger.info("Fetched Pending Orders");
      res.status(200).json(results);
    });
  });

  router.put('/orders/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
  
    try {
      await dbPromise.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
      res.status(200).json({ message: 'Order updated successfully!' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update order' });
    }
  });

  router.get('/foodNames', async (req, res) => {
    
    const query = `
      SELECT dishiId, dishName FROM menu
    `;
  
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching Food names:', err);
        return res.status(500).json({ message: 'Failed to fetch Food names', error: err });
      }
      res.status(200).json(results);
    });
  });

  router.get('/orders', async (req, res) => {
    
    const query = `
      SELECT * FROM orders where status != 'processing'
    `;
  
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching all Orders:', err);
        logger.error('Error fetching all Orders:', err);
        return res.status(500).json({ message: 'Failed to fetch all Orders', error: err });
      }

      logger.info('Fetched all Orders other than processing');
      res.status(200).json(results);
    });
  });

  router.get('/orders/:customerId', async (req, res) => {
    const customerId = req.params.customerId;

    const query = `
      SELECT * FROM orders WHERE customerId = ? AND status IN ('delivered', 'cancelled') ORDER BY id DESC
    `;
  
    db.query(query, [customerId], (err, results) => {
      if (err) {
        console.error('Error fetching Order details based on CustomerID:', err);
        return res.status(500).json({ message: 'Failed to fetch Order details based on CustomerID', error: err });
      }
      res.status(200).json(results);
    });
  });

  router.get('/customerDetails', async (req, res) => {

    const query = `
      SELECT * FROM customer
    `;
  
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching Customer details:', err);
        return res.status(500).json({ message: 'Failed to fetch Customer details', error: err });
      }
      res.status(200).json(results);
    });
  });


  export default router;
  