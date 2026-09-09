# Bubbles Early Years School Platform 🎈🌱

A full-stack early childhood school platform built for **Bubbles Early Years School** (Ages 1–6). It combines a public-facing school website with an administrative and operational school management system and a PIN-protected Parent Portal.

---

## ✨ Features

### 1. 🌟 Public School Website
- **Branded Design System**: Curated color palette (Turquoise `#38D3C7`, Deep Forest Teal `#0B4E49`, Warm Coral `#F47767`, Cream `#FFF7EC`).
- **Interactive Photo & Moments Show**: Real campus photography, categories, slide controls, and fullscreen lightbox view.
- **Campus Tour & Enrollment**: Interactive modal with visit request form.
- **Age Path Journey**: Visual overview of curriculum from Toddlers (1–2) to Future Ready (5–6).
- **Learning Spaces & Activities**: Real-life highlights of classrooms, playgrounds, atelier art studios, and dining facilities.

### 2. 📱 Parent Portal
- **PIN Authentication**: Secure quick sign-in for registered families.
- **Daily Care Logs**: Real-time meals, naps, bathroom updates, and teacher notes.
- **Attendance History**: Visual check-in/check-out logs.
- **Activity Feed**: Photos and milestones shared by educators.

### 3. 🏫 School Management System (Admin & Staff)
- **Classroom Roster & Attendance Roll**: Real-time attendance check-in/out and roll calling.
- **Daily Care Logger**: Bulk and individual logging of snacks, hydration, nap duration, and mood.
- **Child & Family Profiles**: Complete student records, emergency contacts, authorized pickups, allergies, and immunization history.
- **Educator & Staff Management**: Role-based access control (Admin, Teacher, Support).

---

## 🚀 Tech Stack

- **Client**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Canvas Confetti.
- **Typography**: Google Fonts (Plus Jakarta Sans, Baloo 2, Nunito).
- **Server**: Node.js, Express, TypeScript, SQLite / Knex, JWT & PIN Auth.

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Hannaalexz/early-years-school-platform.git
   cd early-years-school-platform
   ```

2. **Install dependencies**:
   ```bash
   # Install client dependencies
   cd client
   npm install

   # Install server dependencies
   cd ../server
   npm install
   ```

3. **Start Development Servers**:
   ```bash
   # From client directory
   npm run dev

   # From server directory (in another terminal)
   npm run dev
   ```

4. **Open in Browser**:
   - Website & Portal: `http://localhost:5173`
   - API Server: `http://localhost:3000`

---

## 📄 License
Private & Proprietary — Bubbles Early Years School.
