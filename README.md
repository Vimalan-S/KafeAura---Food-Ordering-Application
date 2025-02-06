# KAFE AURA - Food Ordering Application

KAFE AURA is a full-stack food ordering application built with **Angular (Frontend)**, **ExpressJS (Backend)**, and **MySQL (Database)**. The application features two modules: **Admin** and **Customer**, each designed to streamline the food ordering process while incorporating advanced features like **AI-powered chatbots**, **bilingual localization**, and **secure payment integration**.

![Customer Homepage]([screenshots/my-screenshot.png](https://github.com/Vimalan-S/KafeAura---Food-Ordering-Application/blob/main/Kafe/screenshots/Customer%20Homepage.jpg))

---

## Features

### 1. **Admin Module**
   - **CRUD Operations on Menu**: Add, update, and delete dishes from the menu.
   - **Order Management**: View current orders and all past orders.
   - **Bilingual Localization**: Supports **English** and **Tamil** by managing `KValues` for each text used in the application.

### 2. **Customer Module**
   - **Place Orders**: Customers can place orders and specify pickup times.
   - **Order History**: View past orders.
   - **Language Localization**: Switch between **English** and **Tamil** for a seamless user experience.
   - **AI Chatbot**: Ask queries about the menu using a **Google Gemini AI-powered chatbot** backed by **FAISS (Facebook AI Similarity Search)** for efficient responses.

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
  - **Weather API** for additional contextual features.
- **Localization**: Bilingual support (English/Tamil) using Google Gemini API.

---

## Key Highlights

- **Secure Authentication**: JWT-based authentication for secure user sessions.
- **Scalable Architecture**: Follows **SDLC**, **SOLID**, and **DRY principles** for clean, maintainable, and professional code.
- **AI Integration**: Leverages Google Gemini AI and FAISS for an intelligent chatbot to answer menu-related queries.
- **Bilingual Support**: Seamless language switching between English and Tamil for a localized user experience.
- **Payment Simulation**: Stripe integration for simulating payment transactions.
