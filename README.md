# Trishul Eco-Homestays Review Analytics Platform

An enterprise-grade SaaS pipeline that asynchronously analyzes, translates, and drafts multilingual responses to bulk guest reviews, empowering homestay managers to manage their reputation without manual bottlenecks.

## Core Features

* **Asynchronous Batch Processing:** Decouples bulk CSV/text uploads from the HTTP lifecycle to process thousands of reviews without UI timeouts or blocking the web server.
* **Semantic Vector Caching:** Uses vector embeddings to detect highly similar reviews, instantly serving cached AI responses to drastically reduce latency and API token costs.
* **Multilingual Analysis & Drafting:** Automatically translates guest reviews into English for the staff dashboard while drafting management responses in the guest's original native language.
* **Human-in-the-Loop Workflow:** Puts AI drafts in a pending state for staff to review, edit, and approve, ensuring high-quality responses while building a dataset for future model fine-tuning.

## Tech Stack

* **Frontend:** Next.js 14 (App Router) with TypeScript
* **Styling & UI:** Tailwind CSS, Shadcn UI, TanStack Table (Data Grid), Recharts
* **Backend & Async:** FastAPI (Python), Celery (Workers), Redis (Message Broker)
* **Database:** PostgreSQL (with `pgvector` extension)
* **Auth Method:** NextAuth / JWT
* **Deployment:** Vercel (Frontend Hosting) and Render (FastAPI Backend, Celery Workers, Redis, and Managed Postgres), containerized via Docker.

---

## Setup & Running Locally

### Backend Setup (FastAPI)

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```
2. **Create and activate a virtual environment**:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
3. **Install the dependencies**:
   ```bash
   pip install fastapi uvicorn pydantic
   ```
4. **Run the development server**:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   *The backend will now be accessible at `http://localhost:8000`.*
   
# 🗄️ Backend Database Migration

## Overview

Successfully migrated the backend data layer from **in-memory arrays** to a **PostgreSQL** database hosted on **Supabase**, leveraging **SQLAlchemy ORM** for efficient and scalable relational data management.

### ✨ Key Improvements

- 🔄 Replaced temporary in-memory storage with a persistent **PostgreSQL** database.
- ☁️ Integrated **Supabase** as the managed cloud database provider.
- 🧩 Implemented **SQLAlchemy ORM** for clean, object-oriented database interactions.
- 🔗 Established structured relational models to improve data integrity and maintainability.
- 📈 Enhanced scalability, reliability, and long-term data persistence.
- 🛠️ Simplified database operations through ORM abstractions, reducing raw SQL usage.

### 🛠️ Technology Stack

| Component | Technology |
|-----------|------------|
| Database | PostgreSQL |
| Hosting | Supabase |
| ORM | SQLAlchemy |

> **Result:** The backend now supports persistent, scalable, and relational data management with improved maintainability and production readiness.
