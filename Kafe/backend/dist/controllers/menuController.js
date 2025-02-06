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
exports.updateMenuItem = exports.getMenuItemsByCategory = exports.getAllMenuItems = exports.addDish = void 0;
const config_1 = require("../utils/config"); // MySQL connection setup
const axios_1 = __importDefault(require("axios"));
const logger_1 = __importDefault(require("../utils/logger"));
const CALORIE_NINJAS_API_KEY = '5A9QIWLZehIGL0aAsOcNIw==6C0gjOwlB656qKa6';
const addDish = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { dishName, dishCategory, dishDescription, preparationTime, price, currentlyAvailable, availableSlot, images } = req.body;
    try {
        // Fetch nutritional details using CalorieNinjas API
        const nutritionResponse = yield axios_1.default.get(`https://api.calorieninjas.com/v1/nutrition?query=${dishName}`, {
            headers: { 'X-Api-Key': CALORIE_NINJAS_API_KEY },
        });
        const nutritionData = nutritionResponse.data.items[0] || {};
        // Extract relevant nutritional fields
        const { calories = 0, serving_size_g = 0, fat_total_g = 0, fat_saturated_g = 0, protein_g = 0, sodium_mg = 0, potassium_mg = 0, cholesterol_mg = 0, carbohydrates_total_g = 0, fiber_g = 0, sugar_g = 0, } = nutritionData;
        // Construct SQL query to insert new dish into 'menu' table
        const query = `
      INSERT INTO menu (dishName, dishCategory, dishDescription, preparationTime, price, currentlyAvailable, availableSlot, images,
        calories, serving_size_g, fat_total_g, fat_saturated_g, protein_g, sodium_mg, potassium_mg, cholesterol_mg, carbohydrates_total_g, fiber_g, sugar_g)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
        // Execute the query to insert the data into the database
        config_1.db.query(query, [
            dishName,
            dishCategory,
            dishDescription,
            preparationTime,
            price,
            currentlyAvailable,
            JSON.stringify(availableSlot),
            JSON.stringify(images),
            calories,
            serving_size_g,
            fat_total_g,
            fat_saturated_g,
            protein_g,
            sodium_mg,
            potassium_mg,
            cholesterol_mg,
            carbohydrates_total_g,
            fiber_g,
            sugar_g,
        ], (err, result) => {
            if (err) {
                console.error('Error adding dish:', err);
                logger_1.default.error("Error adding dish: ", err);
                return res.status(500).json({ message: 'Failed to add dish', error: err });
            }
            logger_1.default.info("Dish added successfully: ", result);
            res.status(200).json({ message: 'Dish added successfully', result });
        });
    }
    catch (error) {
        console.error('Error fetching nutritional details or adding dish:', error);
        logger_1.default.error("Error fetching nutritional details or adding dish: ", error);
        res.status(500).json({ message: 'Failed to add dish', error });
    }
});
exports.addDish = addDish;
const getAllMenuItems = (req, res) => {
    const query = 'SELECT * FROM menu';
    config_1.db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching menu items:', err);
            return res.status(500).json({ message: 'Failed to fetch menu items', error: err });
        }
        logger_1.default.info("Fetched all Menu items");
        res.status(200).json(results);
    });
};
exports.getAllMenuItems = getAllMenuItems;
const getMenuItemsByCategory = (req, res) => {
    const { category } = req.params;
    const query = 'SELECT * FROM menu WHERE dishCategory = ?';
    config_1.db.query(query, [category], (err, results) => {
        if (err) {
            console.error('Error fetching menu items by category:', err);
            logger_1.default.error('Error fetching menu items by category:', err);
            return res.status(500).json({ message: 'Failed to fetch menu items by category', error: err });
        }
        logger_1.default.info("Fetched Menu items by category: ", category);
        res.status(200).json(results);
    });
};
exports.getMenuItemsByCategory = getMenuItemsByCategory;
const updateMenuItem = (req, res) => {
    const { id } = req.params;
    const { dishName, dishCategory, dishDescription, preparationTime, price, currentlyAvailable, availableSlot, images } = req.body;
    const query = `
    UPDATE menu
    SET dishName = ?, dishCategory = ?, dishDescription = ?, preparationTime = ?, price = ?, currentlyAvailable = ?, availableSlot = ?, images = ?
    WHERE dishiId = ?
  `;
    config_1.db.query(query, [dishName, dishCategory, dishDescription, preparationTime, price, currentlyAvailable, JSON.stringify(availableSlot), JSON.stringify(images), id], (err, result) => {
        if (err) {
            console.error('Error updating menu item:', err);
            logger_1.default.error('Error updating menu item:', err);
            return res.status(500).json({ message: 'Failed to update menu item', error: err });
        }
        logger_1.default.info('Menu item updated successfully', result);
        res.status(200).json({ message: 'Menu item updated successfully', result });
    });
};
exports.updateMenuItem = updateMenuItem;
