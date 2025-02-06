import express from 'express';
import { dbPromise } from '../utils/config';
import fs from 'fs';
import path from 'path';
import logger from '../utils/logger';

const router = express.Router();

router.post('/saveMLModel', async (req: any, res: any) => {
    try {
        const filePath = path.join(__dirname, 'localstorage', 'output.pkl');
        console.log(filePath);

        // Check if the .pkl file exists
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'ML Model file not found.' });
        }

        // Read the .pkl file
        const modelBuffer = fs.readFileSync(filePath);

        // Get the current timestamp
        const currentDate = new Date();

        // Insert the model into the table
        const query = 'INSERT INTO TrainedMLmodel (date, model) VALUES (?, ?)';
        await dbPromise.execute(query, [currentDate, modelBuffer]);

        // Close the connection
        await dbPromise.end();

        logger.info("ML Model saved to database successfully");
        res.status(200).json({ message: 'ML Model saved to database successfully.' });
    } catch (error) {
        console.error('Error saving ML model to database:', error);
        logger.error('Error saving ML model to database:', error);
        res.status(500).json({ message: 'Failed to save ML model to database.' });
    }
});

export default router;