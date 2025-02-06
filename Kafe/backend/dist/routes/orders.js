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
const logger_1 = __importDefault(require("../utils/logger"));
const router = express_1.default.Router();
router.post('/orders', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { cart, selectedTime, weatherData, totalAmount, deliveryType } = req.body;
    const foods = cart.map((obj) => obj.dishiId);
    const timeSlot = getTimeSlot(selectedTime);
    const day = new Date().getDay();
    const estimatedPrepTime = cart.reduce((total, item) => total + item.preparationTime, 0);
    const query = `
      INSERT INTO orders (
        customerId, foods, totalPrice, status, bookedTimeSlot, pickupTime, day, 
        feelslike_c, feelslike_f, heatindex_c, heatindex_f, cloud, precip_mm, estimatedPrepTime, text, deliveryType
      ) VALUES (?, ?, ?, 'processing', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
        1, JSON.stringify(foods), totalAmount, timeSlot, selectedTime, day,
        weatherData.feelslike_c, weatherData.feelslike_f, weatherData.heatindex_c,
        weatherData.heatindex_f, weatherData.cloud, weatherData.precip_mm, estimatedPrepTime,
        (_a = weatherData === null || weatherData === void 0 ? void 0 : weatherData.condition) === null || _a === void 0 ? void 0 : _a.text,
        deliveryType
    ];
    try {
        yield config_1.db.execute(query, values);
        res.status(201).send({ message: 'Order created successfully' });
    }
    catch (error) {
        res.status(500).send({ error: 'Failed to create order' });
    }
}));
function getTimeSlot(timeString) {
    // Extract hours and minutes from the time string
    const [hours, minutes] = timeString.split(':').map(Number);
    // Determine the time slot
    if (hours >= 21 || hours < 9) {
        return 0; // Time outside the specified slots
    }
    else if (hours >= 9 && hours < 12) {
        return 1; // 9 AM to 12 PM
    }
    else if (hours >= 12 && hours < 15) {
        return 2; // 12 PM to 3 PM
    }
    else if (hours >= 15 && hours < 19) {
        return 3; // 3 PM to 7 PM
    }
    else if (hours >= 19 && hours < 22) {
        return 4; // 7 PM to 10 PM
    }
    else {
        return 0; // Default case
    }
}
router.get('/pendingOrders', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `
      SELECT * FROM orders WHERE status = 'processing'
    `;
    config_1.db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching Pending Orders:', err);
            logger_1.default.error('Error fetching Pending Orders:', err);
            return res.status(500).json({ message: 'Failed to fetch Pending Orders', error: err });
        }
        logger_1.default.info("Fetched Pending Orders");
        res.status(200).json(results);
    });
}));
router.put('/orders/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status } = req.body;
    try {
        yield config_1.dbPromise.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
        res.status(200).json({ message: 'Order updated successfully!' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update order' });
    }
}));
router.get('/foodNames', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `
      SELECT dishiId, dishName FROM menu
    `;
    config_1.db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching Food names:', err);
            return res.status(500).json({ message: 'Failed to fetch Food names', error: err });
        }
        res.status(200).json(results);
    });
}));
router.get('/orders', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `
      SELECT * FROM orders where status != 'processing'
    `;
    config_1.db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching all Orders:', err);
            logger_1.default.error('Error fetching all Orders:', err);
            return res.status(500).json({ message: 'Failed to fetch all Orders', error: err });
        }
        logger_1.default.info('Fetched all Orders other than processing');
        res.status(200).json(results);
    });
}));
router.get('/orders/:customerId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customerId = req.params.customerId;
    const query = `
      SELECT * FROM orders WHERE customerId = ? AND status IN ('delivered', 'cancelled') ORDER BY id DESC
    `;
    config_1.db.query(query, [customerId], (err, results) => {
        if (err) {
            console.error('Error fetching Order details based on CustomerID:', err);
            return res.status(500).json({ message: 'Failed to fetch Order details based on CustomerID', error: err });
        }
        res.status(200).json(results);
    });
}));
router.get('/customerDetails', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `
      SELECT * FROM customer
    `;
    config_1.db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching Customer details:', err);
            return res.status(500).json({ message: 'Failed to fetch Customer details', error: err });
        }
        res.status(200).json(results);
    });
}));
exports.default = router;
