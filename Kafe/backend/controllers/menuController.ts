// menu.controller.ts
import { Request, Response } from 'express';
import { db } from '../utils/config'; // MySQL connection setup
import axios from 'axios';
import logger from '../utils/logger';

const CALORIE_NINJAS_API_KEY = '5A9QIWLZehIGL0aAsOcNIw==6C0gjOwlB656qKa6'; 

export const addDish = async (req: Request, res: Response) => {
  const { dishName, dishCategory, dishDescription, preparationTime, price, currentlyAvailable, availableSlot, images } = req.body;

  try {
    // Fetch nutritional details using CalorieNinjas API
    const nutritionResponse = await axios.get(`https://api.calorieninjas.com/v1/nutrition?query=${dishName}`, {
      headers: { 'X-Api-Key': CALORIE_NINJAS_API_KEY },
    });

    const nutritionData = nutritionResponse.data.items[0] || {};

    // Extract relevant nutritional fields
    const {
      calories = 0,
      serving_size_g = 0,
      fat_total_g = 0,
      fat_saturated_g = 0,
      protein_g = 0,
      sodium_mg = 0,
      potassium_mg = 0,
      cholesterol_mg = 0,
      carbohydrates_total_g = 0,
      fiber_g = 0,
      sugar_g = 0,
    } = nutritionData;

    // Construct SQL query to insert new dish into 'menu' table
    const query = `
      INSERT INTO menu (dishName, dishCategory, dishDescription, preparationTime, price, currentlyAvailable, availableSlot, images,
        calories, serving_size_g, fat_total_g, fat_saturated_g, protein_g, sodium_mg, potassium_mg, cholesterol_mg, carbohydrates_total_g, fiber_g, sugar_g)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // Execute the query to insert the data into the database
    db.query(
      query,
      [
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
      ],
      (err, result) => {
        if (err) {
          console.error('Error adding dish:', err);
          logger.error("Error adding dish: ", err);
          return res.status(500).json({ message: 'Failed to add dish', error: err });
        }
        logger.info("Dish added successfully: ", result);
        res.status(200).json({ message: 'Dish added successfully', result });
      }
    );
  } catch (error) {
    console.error('Error fetching nutritional details or adding dish:', error);
    logger.error("Error fetching nutritional details or adding dish: ", error);
    res.status(500).json({ message: 'Failed to add dish', error });
  }
};

export const getAllMenuItems = (req: Request, res: Response) => {
  const query = 'SELECT * FROM menu';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching menu items:', err);
      return res.status(500).json({ message: 'Failed to fetch menu items', error: err });
    }
    logger.info("Fetched all Menu items");
    res.status(200).json(results);
  });
};


export const getMenuItemsByCategory = (req: Request, res: Response) => {
  const { category } = req.params;
  const query = 'SELECT * FROM menu WHERE dishCategory = ?';
  db.query(query, [category], (err, results) => {
    if (err) {
      console.error('Error fetching menu items by category:', err);
      logger.error('Error fetching menu items by category:', err);
      return res.status(500).json({ message: 'Failed to fetch menu items by category', error: err });
    }

    logger.info("Fetched Menu items by category: ", category);
    res.status(200).json(results);
  });
};


export const updateMenuItem = (req: Request, res: Response) => {
  const { id } = req.params;
  const { dishName, dishCategory, dishDescription, preparationTime, price, currentlyAvailable, availableSlot, images } = req.body;

  const query = `
    UPDATE menu
    SET dishName = ?, dishCategory = ?, dishDescription = ?, preparationTime = ?, price = ?, currentlyAvailable = ?, availableSlot = ?, images = ?
    WHERE dishiId = ?
  `;

  db.query(query, [dishName, dishCategory, dishDescription, preparationTime, price, currentlyAvailable, JSON.stringify(availableSlot), JSON.stringify(images), id], (err, result) => {
    if (err) {
      console.error('Error updating menu item:', err);
      logger.error('Error updating menu item:', err);
      return res.status(500).json({ message: 'Failed to update menu item', error: err });
    }

    logger.info('Menu item updated successfully', result);
    res.status(200).json({ message: 'Menu item updated successfully', result });
  });
};


