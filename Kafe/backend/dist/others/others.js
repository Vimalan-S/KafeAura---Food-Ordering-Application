"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../utils/config");
const createAdminTable = `

delete from faiss_store

`;
config_1.db.query(createAdminTable, (err, result) => {
    if (err) {
        console.error('Error dropping admin table:', err);
    }
    else {
        console.log('deleted');
    }
    config_1.db.end(); // Close the database connection after execution
});
