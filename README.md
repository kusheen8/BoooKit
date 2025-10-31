🎯 Boookit - Adventure Experience Booking Platform
Boookit is a full-stack web application where users can browse and book adventure experiences. Built with modern web technologies for a seamless booking experience.
🔧 Built using React, TypeScript, Express, and MongoDB
🔗 Live Link
🌐 Live App – https://boookit-server.onrender.com
✨ Features

🔍 Browse adventure experiences
📅 Book experiences with date & time slots
💰 Apply promo codes for discounts
✅ Get booking confirmation with reference ID
📧 Receive email notifications
🎨 Responsive design with dark mode

🧰 Tech Stack
FrontendBackendDatabaseOthersReact + ViteNode.js + ExpressMongoDBTypeScript, Tailwind CSS, TanStack Query
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
├── client/           # React frontend
├── server/           # Express backend
├── db/              # Database schemas
└── package.json     # Root dependencies
🎯 How It Works

User browses available experiences
Selects date, time, and number of guests
Enters personal details at checkout
Applies promo code (optional)
Confirms booking and receives reference ID

👨‍💻 Author
Your Name
GitHub: @yourusername
