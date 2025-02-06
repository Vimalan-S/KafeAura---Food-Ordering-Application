import { db } from '../utils/config';

const viewTables = async () => {
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
      const [results] = await db.promise().query(query);
      console.log(`${name}:`);
      console.table(results);
    } catch (err) {
      console.error(`Error fetching data from ${name.toLowerCase()}:`, err);
    }
  }

  // Close the connection pool after all queries are completed
  db.end((err) => {
    if (err) {
      console.error('Error closing the database connection pool:', err);
    } else {
      console.log('Database connection pool closed successfully.');
    }
  });
};

viewTables();
