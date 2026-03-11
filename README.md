# PharmFlow – Pharmacy Management System

PharmFlow is a professional, production-ready pharmacy management platform designed to automate billing, inventory, and analytics for retail pharmacies.

## 🚀 Features

- **Secure Authentication**: JWT-based login with Role-Based Access Control (Admin, Pharmacist, Staff).
- **Interactive Dashboard**: Real-time insights, revenue charts, and critical stock alerts.
- **Inventory Management**: Complete CRUD for medicines with batch tracking and expiry monitoring.
- **Billing / POS**: High-speed digital billing system with automatic stock updates and printable receipts.
- **Suppliers**: Manage medicine suppliers and their contact details.
- **Reporting**: Daily sales and monthly revenue analytics.

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS, Chart.js, Lucide Icons, Framer Motion.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose).
- **State Management**: React Context API.

## 📦 Installation

### 1. Prerequisite
- Node.js installed.
- MongoDB running locally or a MongoDB Atlas connection string.

### 2. Setup Environment Variables
Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pharmflow
JWT_SECRET=your_secret_key
NODE_ENV=development
```

### 3. Install Dependencies
Run from the root directory:
```bash
npm run install-all
```

### 4. Seed Initial Data (Important)
Populate the database with an admin user and sample stock:
```bash
cd server
node seeder.js
```
**Default Credentials:**
- **Email**: admin@pharmflow.com
- **Password**: password123

## 🏃 Running the Application

Run both frontend and backend concurrently:
```bash
npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000

## 📂 Project Structure

```text
PharmFlow/
├── client/             # React Frontend
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── services/
├── server/             # Node.js Backend
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   └── routes/
└── package.json        # Root workspace scripts
```

## 🔒 Security Measures

- Bcrypt password hashing.
- Stateless JWT authentication.
- Request validation and sanitized headers.
- CORS protection.

---
