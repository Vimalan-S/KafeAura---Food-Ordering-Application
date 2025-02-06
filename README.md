# KAFE AURA - Food Ordering Application

KAFE AURA is a full-stack food ordering application built with **Angular (Frontend)**, **ExpressJS (Backend)**, and **MySQL (Database)**. The application features two modules: **Admin** and **Customer**, each designed to streamline the food ordering process while incorporating advanced features like **AI-powered chatbots**, **bilingual localization**, and **secure payment integration**.

![Customer Homepage](https://github.com/Vimalan-S/KafeAura---Food-Ordering-Application/blob/6b2e6af9efb4844aea28ddcc7c411f78685d54ec/Kafe/screenshots/Customer%20Homepage.jpg)

---

## Features

### 1. **Admin Module**
![Admin Homepage](https://github.com/Vimalan-S/KafeAura---Food-Ordering-Application/blob/6d2bb3fad7e1686f68ecc74568f74b38e0cbe827/Kafe/screenshots/Admin%20Homepage.jpg)
   - **CRUD Operations on Menu**: Add, update, and delete dishes from the menu.
   - **Order Management**: View current orders and all past orders.
   - **Bilingual Localization**: Supports **English** and **Tamil** by managing `KValues` for each text used in the application.
![Language localization](https://github.com/Vimalan-S/KafeAura---Food-Ordering-Application/blob/6d2bb3fad7e1686f68ecc74568f74b38e0cbe827/Kafe/screenshots/Language%20Localization.jpg)

### 2. **Customer Module**
   - **Place Orders**: Customers can place orders and specify pickup times.
   - **Order History**: View past orders.
   - **Language Localization**: Switch between **English** and **Tamil** for a seamless user experience.
![Tamil content](https://github.com/Vimalan-S/KafeAura---Food-Ordering-Application/blob/6d2bb3fad7e1686f68ecc74568f74b38e0cbe827/Kafe/screenshots/Tamil%20text%20on%20Customer%20homepage.jpg)
   - **AI Chatbot**: Ask queries about the menu using a **Google Gemini AI-powered chatbot** backed by **FAISS (Facebook AI Similarity Search)** for efficient responses.
![AI Chatbot](https://github.com/Vimalan-S/KafeAura---Food-Ordering-Application/blob/6d2bb3fad7e1686f68ecc74568f74b38e0cbe827/Kafe/screenshots/AI%20Chatbot.jpg)
---

## Technologies Used

- **Frontend**: Angular
- **Backend**: ExpressJS
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens)
- **Payment Integration**: Stripe
- **AI Chatbot**: Google Gemini AI with FAISS for similarity search
- **APIs**: 
  - **Calorie Ninjas API** for nutritional information.
![Nutrition data](https://github.com/Vimalan-S/KafeAura---Food-Ordering-Application/blob/6d2bb3fad7e1686f68ecc74568f74b38e0cbe827/Kafe/screenshots/Nutrition%20for%20each%20Dish.jpg)
  - **Weather API** for additional contextual features.
- **Localization**: Bilingual support (English/Tamil) using Google Gemini API.

---

## Key Highlights

- **Secure Authentication**: JWT-based authentication for secure user sessions.
- **Scalable Architecture**: Follows **SDLC**, **SOLID**, and **DRY principles** for clean, maintainable, and professional code.
- **AI Integration**: Leverages Google Gemini AI and FAISS for an intelligent chatbot to answer menu-related queries.
- **Bilingual Support**: Seamless language switching between English and Tamil for a localized user experience.
- **Payment Simulation**: Stripe integration for simulating payment transactions.
