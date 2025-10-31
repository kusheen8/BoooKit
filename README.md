no like the # give that and all not booking the adventaure 🎯 Boookit - Adventure Experience Booking Platform
Boookit is a full-stack web application where users can browse and book adventure experiences like kayaking, hiking, and more. Built with modern web technologies for a seamless booking experience.
🔧 Built using React, TypeScript, Express, and MongoDB
🔗 Live Link
🌐 Live App – https://boookit-server.onrender.com
✨ Features

🔍 Browse and search adventure experiences
📅 Book experiences with date & time slots
💰 Apply promo codes for discounts
✅ Get booking confirmation with unique reference ID
📧 Receive email notifications
🎨 Responsive design with smooth animations
🌙 Dark mode support

🧰 Tech Stack
FrontendBackendDatabaseOthersReact + ViteNode.js + ExpressMongoDB AtlasTypeScript, Tailwind CSS, TanStack Query, Wouter
🚀 Local Setup Instructions
1. Clone the repository
bashgit clone https://github.com/yourusername/boookit.git
cd boookit
2. Install dependencies
bashnpm install
3. Setup environment variables
Create a .env file in the root directory:
envMONGODB_URI=your_mongodb_connection_string
PORT=5000
NODE_ENV=development
4. Run the application
bashnpm run dev
This will start:

Frontend: http://localhost:5173
Backend: http://localhost:5000

5. Build for production
bashnpm run build
npm start
📁 Project Structure
boookit/
├── client/           # React frontend (TypeScript + Tailwind)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── lib/
├── server/           # Express backend
│   ├── routes/
│   └── index.ts
├── db/              # Database schemas
└── package.json     # Root dependencies
🎯 How It Works

User browses available experiences
Selects date, time, and number of guests
Enters personal details at checkout
Applies promo code (optional)
Confirms booking and receives confirmation with reference ID

📝 API Endpoints

GET /api/experiences - List all experiences
GET /api/experiences/:id - Get experience details
POST /api/bookings - Create new booking
GET /api/bookings/:id - Get booking details
POST /api/promo/validate - Validate promo code

👨‍💻 Author
Kusheen
GitHub: https://github.com/kusheen8
