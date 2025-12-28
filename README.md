🚗 Vehicle Rental System – Backend API
vercel:https://vehicles-second.vercel.app/

A Node.js + TypeScript based backend API for managing a vehicle rental system with authentication, role-based authorization, bookings, and availability tracking.

📌 Features

🔐 JWT-based Authentication (Admin & Customer roles)

👤 User Management (Admin & Customer)

🚘 Vehicle Management (CRUD with availability)

📅 Booking Management

Vehicle availability check

Automatic price calculation

Booking cancel & return handling

🧱 Modular Architecture (Routes → Controllers → Services)

🗄️ PostgreSQL Database

🛠️ Technology Stack

Node.js

TypeScript

Express.js

PostgreSQL

bcryptjs – Password hashing

jsonwebtoken (JWT) – Authentication

pg – PostgreSQL client

📂 Project Structure
src/
│
├── config/
│   ├── db.ts
│   └── index.ts
│
├── middleware/
│   ├── auth.ts
│   └── logger.ts
│
├── modules/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.routes.ts
│   │
│   ├── user/
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   └── user.routes.ts
│   │
│   ├── vehicle/
│   │   ├── vehicle.controller.ts
│   │   ├── vehicle.service.ts
│   │   └── vehicle.routes.ts
│   │
│   └── booking/
│       ├── booking.controller.ts
│       ├── booking.service.ts
│       └── booking.routes.ts
│
├── utils/
│   └── password.ts
│
├── app.ts
└── server.ts

⚙️ Environment Variables

Create a .env file in the root directory:

PORT=5000

CONNECTION_STR=postgresql://username:password@host/database?sslmode=require

JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

🗄️ Database Schema
Users
Field	Type	Notes
id	SERIAL	Primary Key
name	TEXT	Required
email	TEXT	Unique, lowercase
password	TEXT	Hashed
phone	TEXT	Required
role	TEXT	admin / customer
Vehicles
Field	Type	Notes
id	SERIAL	Primary Key
vehicle_name	TEXT	Required
type	TEXT	car / bike / van / SUV
registration_number	TEXT	Unique
daily_rent_price	NUMERIC	Positive
availability_status	TEXT	available / booked
Bookings
Field	Type	Notes
id	SERIAL	Primary Key
customer_id	INT	FK → users
vehicle_id	INT	FK → vehicles
rent_start_date	DATE	Required
rent_end_date	DATE	Must be after start
total_price	NUMERIC	Calculated
status	TEXT	active / cancelled / returned
🔐 Authentication & Authorization
Roles

Admin

Manage users

Manage vehicles

View & update all bookings

Customer

Register & login

View vehicles

Create & manage own bookings

Authentication Flow

Password hashed using bcryptjs

Login returns a JWT token

Token must be sent via header:

Authorization: Bearer <token>


Role-based access enforced using middleware

🌐 API Endpoints
Auth
Method	Endpoint	Access
POST	/api/v1/auth/signup	Public
POST	/api/v1/auth/signin	Public
Vehicles
Method	Endpoint	Access
POST	/api/v1/vehicles	Admin
GET	/api/v1/vehicles	Public
GET	/api/v1/vehicles/:id	Public
PUT	/api/v1/vehicles/:id	Admin
DELETE	/api/v1/vehicles/:id	Admin
Users
Method	Endpoint	Access
GET	/api/v1/users	Admin
PUT	/api/v1/users/:id	Admin / Own
DELETE	/api/v1/users/:id	Admin
Bookings
Method	Endpoint	Access
POST	/api/v1/bookings	Admin / Customer
GET	/api/v1/bookings	Role-based
PUT	/api/v1/bookings/:id	Role-based
💰 Price Calculation Logic
total_price = daily_rent_price × number_of_days


Calculated in booking.service.ts

Vehicle status updated automatically

▶️ Run the Project
npm install
npm run dev


Server will start at:

http://localhost:5000
