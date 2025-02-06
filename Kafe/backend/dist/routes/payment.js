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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const stripe_1 = __importDefault(require("stripe"));
const router = express_1.default.Router();
const stripe = new stripe_1.default('sk_test_51QbWqUQQSH4dR5LjMGNupdlp4ke7jSr2ZiEC7ESRFCKjpsR6HAyOvsvzF5P0Kiwi7q0BG1itNMJp450YgtWnE7c300s9hEZExs', { apiVersion: "2024-12-18.acacia" });
router.post('/create-payment-intent', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        var { amount } = req.body;
        const paymentIntent = yield stripe.paymentIntents.create({
            amount, // Amount in the smallest currency unit (e.g., cents for USD)
            currency: 'inr',
            payment_method_types: ['card'],
            payment_method: 'pm_card_visa',
        });
        res.status(200).json({ clientSecret: paymentIntent.client_secret });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}));
exports.default = router;
