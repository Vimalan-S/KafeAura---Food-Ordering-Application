"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../utils/config");
const createAdminTable = `
CREATE TABLE IF NOT EXISTS admin (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phonenumber VARCHAR(15) NOT NULL,
  address VARCHAR(255),
  password VARCHAR(255) NOT NULL
);
`;
config_1.db.query(createAdminTable, (err, result) => {
    if (err) {
        console.error('Error creating admin table:', err);
    }
    else {
        console.log('Admin table created or already exists:');
    }
    // db.end(); // Close the database connection after execution
});
const createCustomerTable = `
CREATE TABLE IF NOT EXISTS customer (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phonenumber VARCHAR(15) NOT NULL,
  address VARCHAR(255),
  password VARCHAR(255) NOT NULL,
  floorNumber INT(50),
  cabinNumber INT(100)
);
`;
config_1.db.query(createCustomerTable, (err, result) => {
    if (err) {
        console.error('Error creating Customer table:', err);
    }
    else {
        console.log('Customer table created or already exists:');
    }
    // db.end(); // Close the database connection after execution
});
const createMenuTable = `
CREATE TABLE IF NOT EXISTS menu (
  dishiId INT AUTO_INCREMENT PRIMARY KEY,
  dishName VARCHAR(255) NOT NULL,
  dishCategory ENUM('snacks', 'meal', 'dessert', 'beverages') NOT NULL,
  dishDescription TEXT,
  preparationTime INT,  -- Time in minutes (for example)
  price DECIMAL(10, 2),  -- Price in decimal (up to 10 digits, 2 decimal places)
  currentlyAvailable TINYINT(1) DEFAULT 1,  -- 1 = available, 0 = not available
  availableSlot JSON,
  images JSON,  -- Store image URLs or base64-encoded image data (JSON format)
  calories INT DEFAULT 0,
  serving_size_g DECIMAL(10, 2) DEFAULT 0,
  fat_total_g DECIMAL(10, 2) DEFAULT 0,
  fat_saturated_g DECIMAL(10, 2) DEFAULT 0,
  protein_g DECIMAL(10, 2) DEFAULT 0,
  sodium_mg INT DEFAULT 0,
  potassium_mg INT DEFAULT 0,
  cholesterol_mg INT DEFAULT 0,
  carbohydrates_total_g DECIMAL(10, 2) DEFAULT 0,
  fiber_g DECIMAL(10, 2) DEFAULT 0,
  sugar_g DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Timestamp when the record is created
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP  -- Timestamp for updates
);
`;
config_1.db.query(createMenuTable, (err, result) => {
    if (err) {
        console.error('Error creating Menu table:', err);
    }
    else {
        console.log('Menu table created or already exists:');
    }
    // db.end(); // Close the database connection after execution
});
const createOrdersTable = `
    CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customerId INT NOT NULL,
    foods JSON,
    totalPrice DECIMAL(10, 2),
    status ENUM('pending', 'processing', 'delivered', 'cancelled') NOT NULL DEFAULT 'pending',
    bookedTimeSlot INT,
    pickupTime VARCHAR(8),
    day INT,
    feelslike_c DECIMAL(10, 2),
    feelslike_f DECIMAL(10, 2),
    heatindex_c DECIMAL(10, 2),
    heatindex_f DECIMAL(10, 2),
    cloud DECIMAL(10, 2),
    precip_mm DECIMAL(10, 2),
    estimatedPrepTime INT,
    text VARCHAR(30),
    deliveryType ENUM('DineIn', 'CabinDelivery') NOT NULL DEFAULT 'DineIn'
  
    FOREIGN KEY (customerId) REFERENCES customer(id)
  );
`;
config_1.db.query(createOrdersTable, (err, result) => {
    console.log('Orders created:', result);
    if (err) {
        console.error('Error creating Orders table:', err);
    }
    else {
        console.log('Orders table created or already exists:');
    }
    // db.end(); // Close the database connection after execution
});
const createFAISSStoreTable = `
    CREATE TABLE IF NOT EXISTS faiss_store (
    id INT AUTO_INCREMENT PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    index_data LONGBLOB NOT NULL,
    metadata JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;
config_1.db.query(createFAISSStoreTable, (err, result) => {
    console.log('Result created:', result);
    if (err) {
        console.error('Error creating FAISS table:', err);
    }
    else {
        console.log('FAISS table created or already exists:');
    }
    // db.end(); // Close the database connection after execution
});
const createkValueTable = `
    CREATE TABLE IF NOT EXISTS kValues (
      kValue VARCHAR(255) PRIMARY KEY,
      en TEXT NOT NULL,
      tam TEXT
    );
`;
config_1.db.query(createkValueTable, (err, result) => {
    console.log('kValues Table created:', result);
    if (err) {
        console.error('Error creating kValues table:', err);
    }
    else {
        console.log('kValues table created or already exists:');
    }
    // db.end(); // Close the database connection after execution
});
const createMLTable = `
    CREATE TABLE TrainedMLmodel (
      date DATETIME PRIMARY KEY,
      model LONGBLOB
    );
`;
config_1.db.query(createMLTable, (err, result) => {
    console.log('MLModels Table created:', result);
    if (err) {
        console.error('Error creating MLModels table:', err);
    }
    else {
        console.log('MLModels table created or already exists:');
    }
    config_1.db.end(); // Close the database connection after execution
});
