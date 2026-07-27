# VynexTee 👕👜

A premium, modern MERN stack e-commerce platform for curated t-shirts and bags. Built with a focus on high-end design, micro-animations, and a seamless user experience.

## 🚀 Tech Stack

**Frontend:**
- React (Vite)
- Zustand (State management)
- Tailwind CSS (Styling)
- React Router DOM (Routing)
- Lucide React (Icons)
- React Hot Toast (Notifications)

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose (Database & ODM)
- JSON Web Token (JWT) & bcryptjs (Authentication & Security)
- Cloudinary & Multer (Image uploads)

## ✨ Features

- **Authentication & Roles:** Secure JWT-based login and registration. Supports both `user` and `admin` roles.
- **Product Catalog:** Browse products with category filtering (T-shirts, Bags) and responsive grid layouts.
- **Shopping Cart:** Persistent cart using Zustand and localStorage. Add, remove, and update quantities seamlessly.
- **Checkout Flow:** Collect shipping information and create orders securely tied to the user's account.
- **User Profile:** View account details and a real-time history of past orders with status badges.
- **Admin Dashboard:** Fully protected area for admins to:
  - Create, view, and delete products.
  - Upload product images directly to Cloudinary.
  - View all customer orders and update their shipping status (Pending, Shipped, Delivered, Cancelled).
- **AI Shopping Assistant:** Intelligent chatbot using LangChain RAG with Google Gemini (`gemini-2.5-flash`), FastAPI, and Chroma vector DB.

## 🤖 AI Shopping Assistant

VynexTee includes a basic AI shopping assistant chatbot built as a separate Python microservice using **FastAPI**, **LangChain**, and **Chroma** (RAG over the product catalog with Google Gemini Free Tier).

### Architecture

```
React frontend (ChatWidget)
      │  POST /api/chat  { message, history }
      ▼
Express server (thin proxy route, port 5000)
      │  POST http://localhost:8000/chat
      ▼
FastAPI + LangChain microservice (port 8000)
      │  RAG: Chroma retriever over product catalog
      │  Catalog source: GET http://localhost:5000/api/products
      ▼
Gemini (free tier)
```

### Setup & Running the Chatbot Microservice

1. **Navigate to the chatbot service directory:**
   ```bash
   cd chatbot-service
   ```

2. **Create and activate a Python virtual environment:**
   ```bash
   # On Windows:
   python -m venv venv
   .\venv\Scripts\activate

   # On macOS/Linux:
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables:**
   Create a `.env` file inside `chatbot-service/` (do not commit your API key):
   ```env
   GOOGLE_API_KEY=your_google_gemini_api_key_here
   EXPRESS_API_URL=http://localhost:5000
   ```

5. **Start the microservice:**
   ```bash
   uvicorn main:app --reload --port 8000
   ```

When started for the first time, the service will automatically fetch the product catalog from the Express API (`http://localhost:5000/api/products`) and embed the products into a local Chroma vector store (`chatbot-service/chroma_db/`). You can also manually refresh the vector store at any time by calling `POST http://localhost:8000/refresh`.

## 📁 Folder Structure

The repository is organized into three main workspaces:

- `frontend/` - Contains the React Vite application.
- `server/` - Contains the Node.js / Express backend API.
- `chatbot-service/` - Contains the Python FastAPI + LangChain chatbot microservice.

## 🛠️ Local Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd VynexTee
   ```

2. **Install Dependencies:**
   Open two terminal windows.
   ```bash
   # Terminal 1: Frontend
   cd frontend
   npm install

   # Terminal 2: Backend
   cd server
   npm install
   ```

3. **Environment Variables:**
   Create a `.env` file in both `frontend` and `server` directories.

   **frontend/.env:**
   ```env
   VITE_API_BASE_URL
   ```

   **server/.env:**
   ```env
   PORT
   MONGO_URI
   JWT_SECRET
   CLOUDINARY_CLOUD_NAME
   CLOUDINARY_API_KEY
   CLOUDINARY_API_SECRET
   CLIENT_URL
   ```

4. **Run the Development Servers:**
   ```bash
   # Terminal 1: Frontend
   cd frontend
   npm run dev

   # Terminal 2: Backend
   cd server
   npm run dev
   ```

## 🎥 Demo

<screenshot/GIF here>