"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_session_1 = __importDefault(require("express-session"));
const logger_1 = __importDefault(require("./utils/logger"));
const register_1 = __importDefault(require("./routes/register"));
const login_1 = __importDefault(require("./routes/login"));
const menu_1 = __importDefault(require("./routes/menu"));
const chatBot_1 = __importDefault(require("./routes/chatBot"));
const payment_1 = __importDefault(require("./routes/payment"));
const test_1 = __importDefault(require("./routes/test"));
const orders_1 = __importDefault(require("./routes/orders"));
const kValues_1 = __importDefault(require("./routes/kValues"));
const MLModel_1 = __importDefault(require("./routes/MLModel"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
// Configure session middleware
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));
app.use(register_1.default);
app.use(login_1.default);
app.use(menu_1.default);
app.use(chatBot_1.default);
app.use(payment_1.default);
app.use(test_1.default);
app.use(orders_1.default);
app.use(kValues_1.default);
app.use(MLModel_1.default);
app.get('/', (req, res) => {
    res.send('Kafe Aura API');
});
app.listen(PORT, () => {
    logger_1.default.info(`Server running on http://localhost:${PORT}`);
});
