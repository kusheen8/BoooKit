# 🎯 **Boookit – Adventure Experience Booking Platform**

---

**Boookit** is a **full-stack web application** where users can **browse and book adventure experiences** like **kayaking, hiking**, and more.
Built with **modern web technologies** for a seamless and responsive booking experience.

---

## 🔧 **Overview**

| Section            | Description                                                                |
| ------------------ | -------------------------------------------------------------------------- |
| 🌍 **Live App**    | [https://boookit-server.onrender.com](https://boookit-server.onrender.com) |
| 💻 **Frontend**    | React (Vite) + TypeScript + Tailwind CSS                                   |
| ⚙️ **Backend**     | Node.js + Express                                                          |
| 🧠 **Database**    | MongoDB Atlas                                                              |
| 🧰 **Other Tools** | TanStack Query, Wouter, Zod Validation                                     |

---

## ✨ **Features**

|  🔹 | Feature                  | Description                                |
| :-: | ------------------------ | ------------------------------------------ |
|  🔍 | **Browse & Search**      | Explore curated adventure experiences      |
|  📅 | **Book Experiences**     | Choose date, time slots, and guests easily |
|  💰 | **Apply Promo Codes**    | Enjoy discounts using promo codes          |
|  ✅  | **Booking Confirmation** | Receive a unique booking reference ID      |
|  📧 | **Email Notifications**  | Get confirmation emails instantly          |
|  🎨 | **Responsive Design**    | Works beautifully on all devices           |
|  🌙 | **Dark Mode**            | Elegant dark theme support                 |

---

## 🧩 **Tech Stack Summary**

| Category             | Technologies                             |
| -------------------- | ---------------------------------------- |
| **Frontend**         | React + TypeScript + Tailwind CSS + Vite |
| **Backend**          | Express + Node.js                        |
| **Database**         | MongoDB Atlas                            |
| **State Management** | TanStack Query                           |
| **Routing**          | Wouter                                   |
| **Validation**       | Zod                                      |

---

## 🚀 **Local Setup Guide**

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/boookit.git
cd boookit
```

---

### 2️⃣ Install Dependencies

```bash
npm install
```

---

### 3️⃣ Setup Environment Variables

Create a `.env` file in the **root directory** and add:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
NODE_ENV=development
```

---

### 4️⃣ Run the Application

```bash
npm run dev
```

📍 This will start:

* **Frontend:** [http://localhost:5173](http://localhost:5173)
* **Backend:** [http://localhost:5000](http://localhost:5000)

---

### 5️⃣ Build for Production

```bash
npm run build
npm start
```

---

## 📁 **Project Structure**

```bash
boookit/
├── client/            # React frontend (TypeScript + Tailwind)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── lib/
├── server/            # Express backend
│   ├── routes/
│   └── index.ts
├── db/                # Database schemas
└── package.json       # Root dependencies
```

---

## 🎯 **How It Works**

1. 🧭 User browses available experiences
2. 📆 Selects date, time, and number of guests
3. 🧾 Enters personal details at checkout
4. 💸 Applies promo code *(optional)*
5. 🎟️ Confirms booking and receives confirmation with unique reference ID

---

## 📝 **API Endpoints**

| Method   | Endpoint               | Description            |
| -------- | ---------------------- | ---------------------- |
| **GET**  | `/api/experiences`     | List all experiences   |
| **GET**  | `/api/experiences/:id` | Get experience details |
| **POST** | `/api/bookings`        | Create a new booking   |
| **GET**  | `/api/bookings/:id`    | Get booking details    |
| **POST** | `/api/promo/validate`  | Validate promo code    |

---

## 👨‍💻 **Author**

**Kusheen Dhar**
🔗 [GitHub – kusheen8](https://github.com/kusheen8)

---

## 💫 **Thank You for Visiting Boookit!**

If you liked this project, please consider ⭐ **starring** the repo on GitHub!
It helps support further open-source adventure projects 🌊⛰️

---

Would you like me to add **“📸 Screenshots”** and **“📜 License”** sections (stylized like this) so it looks 100% complete for GitHub’s trending section?

