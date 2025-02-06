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
const express_1 = __importDefault(require("express"));
const config_1 = require("../utils/config");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const logger_1 = __importDefault(require("../utils/logger"));
const router = express_1.default.Router();
router.post('/saveMLModel', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filePath = path_1.default.join(__dirname, 'localstorage', 'output.pkl');
        console.log(filePath);
        // Check if the .pkl file exists
        if (!fs_1.default.existsSync(filePath)) {
            return res.status(404).json({ message: 'ML Model file not found.' });
        }
        // Read the .pkl file
        const modelBuffer = fs_1.default.readFileSync(filePath);
        // Get the current timestamp
        const currentDate = new Date();
        // Insert the model into the table
        const query = 'INSERT INTO TrainedMLmodel (date, model) VALUES (?, ?)';
        yield config_1.dbPromise.execute(query, [currentDate, modelBuffer]);
        // Close the connection
        yield config_1.dbPromise.end();
        logger_1.default.info("ML Model saved to database successfully");
        res.status(200).json({ message: 'ML Model saved to database successfully.' });
    }
    catch (error) {
        console.error('Error saving ML model to database:', error);
        logger_1.default.error('Error saving ML model to database:', error);
        res.status(500).json({ message: 'Failed to save ML model to database.' });
    }
}));
exports.default = router;
