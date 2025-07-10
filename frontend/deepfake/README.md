# 🔍 Deepfake Detection Web App (Frontend)

This is the React frontend for the **Deepfake Detection** project, built using **Create React App**, **Tailwind CSS**, **React Router**, and **Axios**. It allows users to upload videos and see AI-powered predictions on whether the video is real or fake.

---

## ⚙️ Getting Started

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### 📦 Prerequisites

- Node.js v14+
- Backend server running (see `/backend` folder)
- `.env` or Context setup with your backend `host` URL

---

## 🚀 Available Scripts

In the `frontend` project directory, you can run:

### `npm install`

Install all dependencies.

---

### `npm start`

Runs the app in development mode.  
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload on changes. You’ll see lint errors and updates in the console.

---

### `npm run build`

Builds the app for production to the `build/` folder.  
It correctly bundles React in production mode and optimizes performance.

---

## 🧠 Features

- 🔐 JWT-based login system
- 📤 Video upload using file input
- 🎞️ Live preview of uploaded video
- 🧠 Sends video to backend for ML model prediction
- ✅ Displays:
  - `Real` or `Fake` label
  - Confidence score (e.g. `87.95%`)
- 📊 History section for previous uploads
- 🌈 Clean responsive UI with **Tailwind CSS**
- 🍞 Toast notifications using `react-toastify`

---

## 🧱 Folder Structure

frontend/
├── public/
├── src/
│ ├── pages/ # HomePage, LoginPage, etc.
│ ├── context/ # hostContext.js (backend URL)
│ ├── components/ # Reusable UI components
│ ├── App.js # Main router
│ └── index.js
├── .gitignore
├── package.json
└── README.md


---

## 🔐 Authentication Flow

- User registers or logs in to get JWT
- Token is saved in `localStorage` as `Authtoken`
- Protected routes like video upload or history require `Authorization: Bearer <token>`

---

## 📤 Video Upload Flow

1. User clicks "Upload Video"
2. A local preview plays immediately using `URL.createObjectURL`
3. Video is sent to backend using `FormData`
4. Backend returns:
   ```json
   {
     "label": "Real",
     "confidence": 69.99,
     "score": 0.6999,
     "video": "1752083691901.mp4"
   }

