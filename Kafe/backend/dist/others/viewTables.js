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
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../utils/config");
const viewTables = () => __awaiter(void 0, void 0, void 0, function* () {
    const queries = [
        { name: 'Admin Table', query: 'SELECT * FROM admin;' },
        { name: 'Customer Table', query: 'SELECT * FROM customer;' },
        { name: 'Menu Table', query: 'SELECT * FROM menu;' },
        { name: 'Orders Table', query: 'SELECT * FROM orders;' },
        { name: 'FAISS Table', query: 'SELECT * FROM faiss_store;' },
        { name: 'kValues Table', query: 'SELECT * FROM kValues;' },
        { name: 'MLModels Table', query: 'SELECT * FROM TrainedMLmodel;' },
    ];
    for (const { name, query } of queries) {
        try {
            const [results] = yield config_1.db.promise().query(query);
            console.log(`${name}:`);
            console.table(results);
        }
        catch (err) {
            console.error(`Error fetching data from ${name.toLowerCase()}:`, err);
        }
    }
    // Close the connection pool after all queries are completed
    config_1.db.end((err) => {
        if (err) {
            console.error('Error closing the database connection pool:', err);
        }
        else {
            console.log('Database connection pool closed successfully.');
        }
    });
});
viewTables();
