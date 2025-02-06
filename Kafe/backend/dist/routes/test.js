"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const config_1 = require("../utils/config");
const logger_1 = __importDefault(require("../utils/logger"));
const router = express_1.default.Router();
// Define the local storage directory
const LOCAL_STORAGE_DIR = path_1.default.join(__dirname, 'localstorage');
// Ensure the directory exists
if (!fs_1.default.existsSync(LOCAL_STORAGE_DIR)) {
    fs_1.default.mkdirSync(LOCAL_STORAGE_DIR);
}
router.post('/api/test', (req, res) => {
    const { array } = req.body;
    if (!Array.isArray(array)) {
        return res.status(400).json({ error: 'Invalid array input' });
    }
    const python = (0, child_process_1.spawn)('python', ['test.py']); // Adjust the path to your Python script
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
            logger_1.default.error('Python Error:', errorOutput);
            return res.status(500).json({ error: errorOutput.trim() });
        }
        const filePath = result.trim(); // File path returned by Python script
        // Check if the file exists
        if (fs_1.default.existsSync(filePath)) {
            const fileName = path_1.default.basename(filePath); // Extract file name
            const destinationPath = path_1.default.join(LOCAL_STORAGE_DIR, fileName);
            // Move the file to local storage
            fs_1.default.rename(filePath, destinationPath, (err) => {
                if (err) {
                    console.error('Error moving file:', err);
                    return res.status(500).json({ error: 'Failed to save the file to local storage' });
                }
                logger_1.default.info("File successfully saved to local storage to " + destinationPath);
                res.status(200).json({
                    message: 'File successfully saved to local storage',
                    filePath: destinationPath,
                });
            });
        }
        else {
            logger_1.default.error("File not found");
            res.status(500).json({ error: 'File not found' });
        }
    });
});
// New endpoint to get prediction using the latest model
router.post('/api/predict', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch the most recent model from the database
        const [rows] = yield config_1.dbPromise.execute('SELECT model FROM TrainedMLmodel ORDER BY date DESC LIMIT 1');
        if (!rows || rows.length === 0) {
            return res.status(404).json({ message: 'No ML model found in database.' });
        }
        // Save the model temporarily
        const tempModelPath = path_1.default.join(__dirname, 'localstorage', 'loaded_model.pkl');
        fs_1.default.writeFileSync(tempModelPath, rows[0].model);
        // Get the input data from request body
        const inputObj = req.body;
        // Spawn Python process
        const pythonProcess = (0, child_process_1.spawn)('python', ['predict.py']);
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
            fs_1.default.unlinkSync(tempModelPath);
            if (code !== 0) {
                logger_1.default.error('Prediction failed: ', error);
                return res.status(500).json({
                    message: 'Prediction failed',
                    error: error
                });
            }
            try {
                // const prediction = JSON.parse(result);
                res.json({ result });
            }
            catch (e) {
                res.status(500).json({
                    message: 'Error parsing prediction result',
                    error: result
                });
            }
        });
    }
    catch (error) {
        console.error('Error during prediction:', error);
        logger_1.default.error('Error during prediction:', error);
        res.status(500).json({ message: 'Prediction failed', error: error.message });
    }
}));
exports.default = router;
