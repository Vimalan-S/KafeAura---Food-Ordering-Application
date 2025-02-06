import { spawn } from 'child_process';
import express from 'express';
import path from 'path';
import fs from 'fs';
import { dbPromise } from '../utils/config';
import logger from '../utils/logger';

const router = express.Router();

// Define the local storage directory
const LOCAL_STORAGE_DIR = path.join(__dirname, 'localstorage');

// Ensure the directory exists
if (!fs.existsSync(LOCAL_STORAGE_DIR)) {
    fs.mkdirSync(LOCAL_STORAGE_DIR);
}

router.post('/api/test', (req: any, res: any) => {
    const { array } = req.body;

    if (!Array.isArray(array)) {
        return res.status(400).json({ error: 'Invalid array input' });
    }

    const python = spawn('python', ['test.py']); // Adjust the path to your Python script

    python.stdin.write(JSON.stringify({ array }));
    python.stdin.end();

    let result = '';
    let errorOutput = '';

    python.stdout.on('data', (data) => {
        result += data.toString();
    });

    python.stderr.on('data', (data) => {
        errorOutput += data.toString();
    });

    python.on('close', (code) => {
        if (code !== 0) {
            console.error('Python Error:', errorOutput);
            logger.error('Python Error:', errorOutput);
            return res.status(500).json({ error: errorOutput.trim() });
        }

        const filePath = result.trim(); // File path returned by Python script

        // Check if the file exists
        if (fs.existsSync(filePath)) {
            const fileName = path.basename(filePath); // Extract file name
            const destinationPath = path.join(LOCAL_STORAGE_DIR, fileName);

            // Move the file to local storage
            fs.rename(filePath, destinationPath, (err) => {
                if (err) {
                    console.error('Error moving file:', err);
                    return res.status(500).json({ error: 'Failed to save the file to local storage' });
                }

                logger.info("File successfully saved to local storage to " + destinationPath);
                res.status(200).json({
                    message: 'File successfully saved to local storage',
                    filePath: destinationPath,
                });
            });
        } else {
            logger.error("File not found");
            res.status(500).json({ error: 'File not found' });
        }
    });
});

// New endpoint to get prediction using the latest model
router.post('/api/predict', async (req: any, res: any) => {
    try {
        // Fetch the most recent model from the database
        const [rows]: any[] = await dbPromise.execute(
            'SELECT model FROM TrainedMLmodel ORDER BY date DESC LIMIT 1'
        );

        if (!rows || rows.length === 0) {
            return res.status(404).json({ message: 'No ML model found in database.' });
        }

        // Save the model temporarily
        const tempModelPath = path.join(__dirname, 'localstorage', 'loaded_model.pkl');
        fs.writeFileSync(tempModelPath, rows[0].model);

        // Get the input data from request body
        const inputObj = req.body;

        // Spawn Python process
        const pythonProcess = spawn('python', ['predict.py']);

        // Send input data to Python script
        pythonProcess.stdin.write(JSON.stringify({
            model_path: tempModelPath,
            input_data: inputObj
        }));
        pythonProcess.stdin.end();

        let result = '';
        let error = '';

        // Collect data from Python script
        pythonProcess.stdout.on('data', (data) => {
            result += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            error += data.toString();
        });

        // Handle process completion
        pythonProcess.on('close', (code) => {
            // Clean up temporary file
            fs.unlinkSync(tempModelPath);

            if (code !== 0) {
                logger.error('Prediction failed: ', error);
                return res.status(500).json({ 
                    message: 'Prediction failed', 
                    error: error 
                });
            }

            try {
                // const prediction = JSON.parse(result);
                res.json({ result });
            } catch (e) {
                res.status(500).json({ 
                    message: 'Error parsing prediction result',
                    error: result 
                });
            }
        });

    } catch (error: any) {
        console.error('Error during prediction:', error);
        logger.error('Error during prediction:', error);
        res.status(500).json({ message: 'Prediction failed', error: error.message });
    }
});

export default router;
