import { db } from '../utils/config';

const createAdminTable = `

delete from faiss_store

`;

db.query(createAdminTable, (err, result) => {
  if (err) {
    console.error('Error dropping admin table:', err);
  } else {
    console.log('deleted');
  }
  db.end(); // Close the database connection after execution
});
