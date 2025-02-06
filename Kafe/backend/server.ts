import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import logger from './utils/logger';

import registerRoute from './routes/register';
import loginRoute from './routes/login';
import menuRoutes from './routes/menu';
import chatBotRoutes from './routes/chatBot';
import paymentRoutes from './routes/payment';
import testRoute from './routes/test';
import orderRoute from './routes/orders';
import kValueRoute from './routes/kValues';
import MLModelRoute from './routes/MLModel';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Configure session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key', 
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
  }));

app.use(registerRoute);
app.use(loginRoute);
app.use(menuRoutes);
app.use(chatBotRoutes);
app.use(paymentRoutes);
app.use(testRoute);
app.use(orderRoute)
app.use(kValueRoute);
app.use(MLModelRoute);

app.get('/', (req, res) => {
    res.send('Kafe Aura API');
});


app.listen(PORT, () => {
    logger.info(`Server running on http://localhost:${PORT}`);
});
