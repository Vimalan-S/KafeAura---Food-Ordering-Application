// menu.routes.ts
import { Router } from 'express';
import {
    addDish,
    getAllMenuItems,
    getMenuItemsByCategory,
    updateMenuItem
  } from '../controllers/menuController';

const router = Router();

// Route to add a new dish
router.post('/admin/add-dish/meals', addDish);
router.post('/admin/add-dish/snacks', addDish);
router.post('/admin/add-dish/desserts', addDish);
router.post('/admin/add-dish/beverages', addDish);

// Route to get all menu items
router.get('/admin/get-menu', getAllMenuItems);

// Route to get menu items by category
router.get('/admin/get-menu/:category', getMenuItemsByCategory);

// Route to update a menu item
router.put('/admin/update-menu/:id', updateMenuItem);

export default router;
