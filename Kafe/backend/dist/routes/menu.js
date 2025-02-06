"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// menu.routes.ts
const express_1 = require("express");
const menuController_1 = require("../controllers/menuController");
const router = (0, express_1.Router)();
// Route to add a new dish
router.post('/admin/add-dish/meals', menuController_1.addDish);
router.post('/admin/add-dish/snacks', menuController_1.addDish);
router.post('/admin/add-dish/desserts', menuController_1.addDish);
router.post('/admin/add-dish/beverages', menuController_1.addDish);
// Route to get all menu items
router.get('/admin/get-menu', menuController_1.getAllMenuItems);
// Route to get menu items by category
router.get('/admin/get-menu/:category', menuController_1.getMenuItemsByCategory);
// Route to update a menu item
router.put('/admin/update-menu/:id', menuController_1.updateMenuItem);
exports.default = router;
