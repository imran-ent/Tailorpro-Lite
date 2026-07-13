# TailorPro - Full-Stack Tailoring Management Website

A modern, responsive, and professional tailoring management website built using the MERN stack (React, Node.js, Express.js, MongoDB).

## Features

- **User Landing Page**:
  - Hero section with clear call-to-actions.
  - About and Services sections detailing business features.
  - **Dynamic Available Dresses**: Fetched from MongoDB. Shows name, description, starting price, and uploaded image.
  - **Real-Time Order Tracking**: Lookup stitching progress (Pending/Done) instantly by entering a unique Customer ID.
- **Admin Dashboard**:
  - Secure login with JWT authentication (Admin only).
  - Business statistics panel (Total Dresses, Total Orders, Pending/Completed counts).
  - **Manage Dresses**: Create, update, or delete dress catalog styles (includes image upload handled via Multer).
  - **Manage Orders**: Register customer intakes, track phone numbers, and toggle order status (Pending/Done) which reflects instantly on the tracking portal.
- **Premium Design Layout**:
  - Modern forest-green, white, and mint-accent color scheme.
  - Smooth hover scaling, card elevations, custom loading spinners, and built-in custom animated toast notifications.

---

## Tech Stack

- **Frontend**: React.js, React Router v6, Axios, Context API (for Auth and Toast notifications)
- **Backend**: Node.js, Express.js, Multer (file upload), JSON Web Tokens (JWT), Bcrypt.js (password hashing)
- **Database**: MongoDB (via Mongoose ODM)

---

## Directory Structure

```text
TailorPro/
├── backend/
│   ├── config/db.js           # Database Mongoose connector
│   ├── controllers/           # API request controllers (auth, dresses, orders)
│   ├── middleware/            # JWT verification and Multer setup
│   ├── models/                # MongoDB Models (Admin, Dress, Order)
│   ├── routes/                # Express API routes
│   ├── uploads/               # Catalog image storage folder
│   ├── .env                   # Server environment configurations
│   ├── package.json           # Backend dependency log
│   ├── seed.js                # Database seeding script
│   └── server.js              # Entry execution script
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── api.js             # Shared Axios instance with JWT interceptors
    │   ├── components/        # Layout elements (Header, Footer, Sidebar, Timeline, Guards)
    │   ├── context/           # React Auth and Toast global context states
    │   ├── pages/             # Frontend Views (LandingPage, Login, Admin views)
    │   ├── App.css            # Layout/Component styles & CSS Keyframes
    │   ├── index.css          # Design variables, typography & resets
    │   ├── App.jsx            # Routing structure
    │   └── main.jsx           # Root DOM renderer
    ├── index.html
    └── package.json           # Frontend dependency log
```

---

## Prerequisites

- **Node.js** (v16+)
- **npm** (v7+)
- **MongoDB** (running locally on port `27017` or configured via an Atlas URI)

---

## Installation & Setup

### 1. Clone & Enter Directory
Open a terminal in the root workspace folder `TailorPro`.

### 2. Configure Backend
1. Go to the `backend/` directory:
   ```bash
   cd backend
   ```
2. The `.env` file is already created for you with default configurations:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/tailorpro
   JWT_SECRET=tailorpro_secret_key_2026_super_secure
   ```
3. Populate the database with default admin credentials, sample orders, and dress menu styles:
   ```bash
   npm run seed
   ```
   *This command will also create mock images under `backend/uploads/` so the website will display catalog thumbnails immediately.*

4. **Default Admin Login Credentials**:
   - **Email**: `admin@tailorpro.com`
   - **Password**: `admin123`

### 3. Start Backend Server
Run the following inside the `backend/` directory:
```bash
npm start
```
*The server will start on port `5000` and output `MongoDB Connected`.*

### 4. Setup Frontend
1. Open a new terminal in the `TailorPro` root directory and move to `frontend/`:
   ```bash
   cd frontend
   ```
2. Start the React development server:
   ```bash
   npm run dev
   ```
3. The terminal will output a local address (typically `http://localhost:5173`). Open it in your web browser.

---

## Backend REST API Reference

### Admin Authentication
- `POST /api/admin/login` - Public login. Returns JWT.
- `GET /api/admin/verify` - Protected. Validates token.

### Dresses Collection
- `GET /api/dresses` - Public list.
- `POST /api/dresses` - Protected (Admin only). Add new dress + upload image.
- `PUT /api/dresses/:id` - Protected (Admin only). Edit details + change image.
- `DELETE /api/dresses/:id` - Protected (Admin only). Remove dress from database & system storage.

### Orders Collection
- `GET /api/orders` - Protected (Admin only). List all orders.
- `POST /api/orders` - Protected (Admin only). Create a new order.
- `PUT /api/orders/:id` - Protected (Admin only). Update details/toggle status.
- `DELETE /api/orders/:id` - Protected (Admin only). Remove order.
- `GET /api/orders/track/:customerId` - Public. Fetch a single order status by Customer ID.
