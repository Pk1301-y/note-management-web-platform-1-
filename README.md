<<<<<<< HEAD
# note-management-web-platform-1-
=======
# 📓 NoteVault — Academic & Personal Notes Platform

A modern, fullstack web application for creating, editing, deleting, searching, tagging, and organizing academic or personal notes. Built with **Next.js (App Router)**, **React**, **TypeScript**, **Tailwind CSS**, and **MySQL** via **Drizzle ORM**.

---

## ✨ Features

- 🔐 **Authentication & Security**
  - User registration and login with encrypted passwords (`bcryptjs`).
  - Secure stateless JWT session stored in HTTP-only cookies (`jose`).
  - Next.js middleware protecting private routes (`/dashboard`, `/notes`, `/categories`, etc.).

- 📝 **Full Note Management (CRUD)**
  - Create rich notes with title, detailed content, categories, and tags.
  - View individual note details with formatted content and metadata.
  - Edit existing notes with pre-filled forms.
  - Delete notes with confirmation prompts.

- 📌 **Pin Important Notes**
  - Pin crucial notes with a single click.
  - Dedicated **Pinned Notes** view (`/pinned`) to easily access top-priority notes.
  - Pinned notes highlighted with badges across all views.

- 📂 **Categories Management**
  - Organize notes by custom academic subjects or personal categories.
  - Customize each category with colorful palettes and intuitive icons (📚, 🔬, 💻, 🎨, etc.).
  - View live note counts per category.
  - Filter notes instantly by category.

- 🏷️ **Tagging & Fast Search**
  - Tag notes with comma-separated keywords (e.g., `#physics`, `#lecture-1`, `#exam`).
  - Full-text search across titles and note contents.
  - Clickable tag badges for instant one-click filtering.

- 📊 **Interactive Dashboard**
  - Live statistics: Total notes count, pinned notes, and categories.
  - Quick action shortcuts (Create Note, Manage Categories, Browse Notes).
  - Lists of recently updated notes and categories.

- 👤 **User Profile**
  - View account details and summary statistics.
  - Update user name and bio.
  - Secure password change functionality.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 16 (App Router)** | Fullstack React framework & API routes |
| **React 19** | Modern UI components |
| **TypeScript** | Type safety across frontend and backend |
| **Tailwind CSS 4** | Styling & modern responsive design |
| **MySQL / MariaDB** | Relational database storage |
| **Drizzle ORM** | Type-safe SQL schema & query builder |
| **Jose & Bcryptjs** | JWT authentication & password hashing |

---

## 📂 Project Structure

```text
├── src/
│   ├── app/
│   │   ├── (app)/                  # Authenticated app routes (shares Navbar layout)
│   │   │   ├── dashboard/page.tsx  # Dashboard with stats & recent notes
│   │   │   ├── notes/
│   │   │   │   ├── page.tsx        # All Notes with search & tag filters
│   │   │   │   ├── create/page.tsx # Create Note form
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx    # Note detail view
│   │   │   │       └── edit/page.tsx# Edit Note form
│   │   │   ├── categories/page.tsx # Categories manager with color/icon picker
│   │   │   ├── pinned/page.tsx     # Pinned notes view
│   │   │   ├── profile/page.tsx    # User profile & password management
│   │   │   └── layout.tsx          # App shell with navigation bar
│   │   ├── api/                    # Backend REST API routes
│   │   │   ├── auth/               # register, login, logout, me
│   │   │   ├── notes/              # CRUD, search, [id], pin, pinned
│   │   │   ├── categories/         # CRUD, note counts
│   │   │   ├── profile/            # user profile & stats
│   │   │   ├── stats/              # dashboard metrics
│   │   │   └── health/             # health check endpoint
│   │   ├── login/page.tsx          # Login page
│   │   ├── register/page.tsx       # Sign up page
│   │   ├── not-found.tsx           # Custom 404 page
│   │   ├── globals.css             # Tailwind styling
│   │   ├── layout.tsx              # Root HTML layout
│   │   └── page.tsx                # Landing page
│   ├── components/
│   │   ├── Navbar.tsx              # Responsive navigation header
│   │   └── NoteCard.tsx            # Note display card with actions
│   ├── db/
│   │   ├── index.ts                # MySQL database connection pool
│   │   └── schema.ts               # Drizzle MySQL tables & relations
│   ├── lib/
│   │   └── auth.ts                 # JWT signing, verification & cookie helpers
│   └── middleware.ts               # Route protection & redirection
├── drizzle.config.json             # Drizzle kit configuration
├── package.json
├── tsconfig.json
└── .env                            # Environment variables (create this)
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18.17 or higher)
- [MySQL Server](https://dev.mysql.com/downloads/mysql/) or [XAMPP](https://www.apachefriends.org/) running locally on port 3306

---

### Step 1: Clone or Download the Project

Open the project folder in **VS Code**:

```bash
cd notevault
code .
```

---

### Step 2: Install Node Dependencies

Open the terminal in VS Code (`Ctrl + ~` or **Terminal** → **New Terminal**) and run:

```bash
npm install
```

---

### Step 3: Create the MySQL Database & Tables

Open **MySQL Command Line Client** or **MySQL Workbench** and execute the following SQL script:

```sql
CREATE DATABASE IF NOT EXISTS app_db;

USE app_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    avatar TEXT,
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    color VARCHAR(7) DEFAULT '#6366f1' NOT NULL,
    icon VARCHAR(50) DEFAULT '📁' NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Notes table
CREATE TABLE IF NOT EXISTS notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL DEFAULT '',
    user_id INT NOT NULL,
    category_id INT,
    is_pinned BOOLEAN DEFAULT FALSE NOT NULL,
    tags TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);
```

To confirm the tables are ready, run:
```sql
SHOW TABLES;
```
*(You should see `categories`, `notes`, and `users`)*.

---

### Step 4: Configure Environment Variables

Create a file named `.env` in the **root** of the project (next to `package.json`):

```env
DATABASE_URL=mysql://root:YOUR_PASSWORD@127.0.0.1:3306/app_db
JWT_SECRET=notevault-secret-key-change-in-production-12345
```

> ⚠️ Replace `YOUR_PASSWORD` with your actual MySQL root password.
> - If your password is `root123`: `mysql://root:root123@127.0.0.1:3306/app_db`
> - If you use XAMPP (no password by default): `mysql://root@127.0.0.1:3306/app_db`

---

### Step 5: (Optional) Push Schema with Drizzle

You can also let Drizzle verify and sync the schema:

```bash
npx drizzle-kit push
```

---

### Step 6: Start the Development Server

```bash
npm run dev
```

The terminal will display:
```text
▲ Next.js 16.x.x
- Local: http://localhost:3000
```

Open your browser and navigate to:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🌐 Application Pages & Routes

| Page | URL | Description |
|------|-----|-------------|
| **Landing** | `http://localhost:3000/` | Hero section, feature showcases, CTA |
| **Register** | `http://localhost:3000/register` | Create a new user account |
| **Login** | `http://localhost:3000/login` | Sign in with email and password |
| **Dashboard** | `http://localhost:3000/dashboard` | Notes count overview, pinned count, recent items |
| **All Notes** | `http://localhost:3000/notes` | Searchable & filterable notes grid |
| **Create Note** | `http://localhost:3000/notes/create` | Editor for new notes with categories & tags |
| **Note Detail** | `http://localhost:3000/notes/[id]` | Full note view, pin, edit, delete |
| **Edit Note** | `http://localhost:3000/notes/[id]/edit` | Update existing note title, body, category, tags |
| **Categories** | `http://localhost:3000/categories` | Manage subject categories with icons and color picker |
| **Pinned** | `http://localhost:3000/pinned` | Dedicated collection of pinned notes |
| **Profile** | `http://localhost:3000/profile` | Edit user profile and change password |

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` — Register a new account
- `POST /api/auth/login` — Sign in and receive auth cookie
- `POST /api/auth/logout` — Clear auth cookie
- `GET  /api/auth/me` — Retrieve the current logged-in user

### Notes
- `GET    /api/notes?q=&categoryId=&tag=` — Fetch filtered notes
- `POST   /api/notes` — Create a new note
- `GET    /api/notes/:id` — Get single note details
- `PUT    /api/notes/:id` — Update existing note
- `DELETE /api/notes/:id` — Delete note
- `PATCH  /api/notes/:id/pin` — Toggle note pinned status
- `GET    /api/notes/pinned` — Get all pinned notes

### Categories
- `GET    /api/categories` — Get all categories with note count
- `POST   /api/categories` — Create category
- `PUT    /api/categories/:id` — Update category
- `DELETE /api/categories/:id` — Delete category (uncategorizes linked notes)

### Profile & Stats
- `GET /api/profile` — Get profile info and activity statistics
- `PUT /api/profile` — Update name, bio, or password
- `GET /api/stats` — Get dashboard summary metrics and recent notes

---

## ❓ Troubleshooting

### 1. `Access denied for user 'root'@'localhost'`
- Check your password in the `.env` file (`DATABASE_URL`).
- Make sure the password matches what you use when logging into MySQL Command Line or Workbench.

### 2. `ECONNREFUSED 127.0.0.1:3306`
- MySQL is not running.
- On Windows: Press `Win + R`, type `services.msc`, locate **MySQL80** or **MySQL**, right-click and click **Start**.
- On XAMPP: Open XAMPP Control Panel and click **Start** next to MySQL.

### 3. `404 Not Found`
- Make sure you are accessing `http://localhost:3000/dashboard`, `http://localhost:3000/notes`, etc.
- **Do not** include `(app)` in the URL. Next.js route groups like `(app)` are organizational folders and are omitted from the URL path.
- Check the terminal output when running `npm run dev` to see if it bound to port `3000` or `3001`.

### 4. `DATABASE_URL is required`
- Ensure the `.env` file exists directly in the **root directory** of the project (same folder as `package.json`).
- If you just created the `.env` file, restart the dev server with `Ctrl + C` and run `npm run dev` again.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
>>>>>>> 7b7e2ed (firt commit)
