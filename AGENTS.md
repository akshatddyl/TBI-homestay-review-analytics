# AGENTS.md — Perlogo Project Rules

This file is the permanent instruction file for the Perlogo project.
All agents, contributors, and automation must follow these rules.

---

## PROJECT NAME

Perlogo

## PROJECT GOAL

Build a Homestay Guest Review Sentiment Classifier web tool for Trishul Eco-Homestays.

A staff member can paste guest reviews, one per line, and receive:

1. **Sentiment classification:** positive, neutral, or negative
2. **Primary theme tag:** food, host, location, cleanliness, value, or experience
3. **One-line suggested management response**

---

## FINAL STACK

| Layer    | Technology                            | Deployment |
| -------- | ------------------------------------- | ---------- |
| Frontend | React + Vite + Tailwind CSS           | Vercel     |
| Backend  | Node.js + Express                     | Render     |
| Database | MongoDB Atlas with Mongoose           | Atlas      |
| Auth     | Google OAuth using Passport.js        | —          |
| AI       | Gemini API                            | —          |

---

## ABSOLUTE RULES

- Build phase by phase.
- Do not skip phases.
- Do not rewrite earlier phases unless explicitly asked.
- Use JavaScript only, not TypeScript.
- Use React with Vite for frontend.
- Use Tailwind CSS v3, not Tailwind v4-specific setup.
- Use Node.js and Express for backend.
- Use CommonJS for backend code.
- Use MongoDB Atlas through Mongoose.
- Use Passport.js with Google OAuth 2.0.
- Use Gemini API for AI classification and response generation.
- Do not expose secrets to the frontend.
- Do not commit `.env` files.
- Create `.env.example` files for frontend and backend.
- Use environment variables for all secrets.
- Keep the code simple, clean, and demo-ready.
- Do not add unnecessary libraries.
- Use npm, not yarn or pnpm.
- Use local backend port **5000**.
- Use local frontend port **5173**.
- Use fetch API on frontend, not Axios, unless absolutely necessary.
- Every phase must end with verification instructions.

---

## FOLDER STRUCTURE

```
perlogo/
  client/
  server/
  docs/
  README.md
  AGENTS.md
  .gitignore
  .nvmrc
```

---

## FRONTEND REQUIREMENTS

### Pages (React Router)

| Route        | Description                |
| ------------ | -------------------------- |
| `/`          | Landing / home page        |
| `/register`  | Registration info page     |
| `/login`     | Login page                 |
| `/dashboard` | Protected dashboard        |

### Behavior

- Register page can be simple and say registration is handled through Google OAuth.
- Login page has a **Login with Google** button.
- Login button redirects to backend Google OAuth route.
- Dashboard is protected.
- If not authenticated, redirect to `/login`.
- Dashboard contains textarea for reviews, one review per line.
- Add **Analyze Reviews** button.
- Show loading, error, empty, and success states.
- Show results in a responsive table:

  | Review | Sentiment | Theme | Suggested Response |
  | ------ | --------- | ----- | ------------------ |

- Add logout button.
- Add dark/light mode toggle persisted in `localStorage`.
- Use clean brutalism UI.
- Must be responsive on mobile, tablet, and desktop.

---

## BACKEND REQUIREMENTS

### Structure

- Express server inside `server` folder.
- Entry file: `server/src/index.js`

### Routes

| Method | Path                    | Purpose                  |
| ------ | ----------------------- | ------------------------ |
| GET    | `/health`               | Health check             |
| GET    | `/auth/google`          | Start Google OAuth       |
| GET    | `/auth/google/callback` | Google OAuth callback    |
| GET    | `/auth/me`              | Get current user or 401  |
| POST   | `/auth/logout`          | Destroy session / logout |
| POST   | `/analyze`              | Analyze reviews with AI  |

### Middleware & Config

- Use `express-session`.
- Use `connect-mongo` for session storage.
- Use Passport Google OAuth 2.0.
- Use CORS with credentials.
- Use `helmet`.
- Use `express.json`.
- Use rate limiting on `/analyze`.
- Add `app.set("trust proxy", 1)`.
- Use secure cookies in production.
- Use `SameSite: "none"` in production.
- Use `SameSite: "lax"` in development.
- `FRONTEND_URL` environment variable controls allowed CORS origin.
- Support comma-separated `FRONTEND_URL` values.

---

## DATABASE MODELS

### User

```
googleId    : String
displayName : String
email       : String
avatar      : String
createdAt   : Date
```

### Analysis

```
userId    : ObjectId (ref: User)
review    : String
sentiment : String
theme     : String
response  : String
createdAt : Date
```

---

## AUTH FLOW

1. Frontend redirects to backend `/auth/google`.
2. Backend uses Passport Google OAuth.
3. After successful OAuth, backend redirects to `FRONTEND_URL/dashboard`.
4. Backend `/auth/me` returns logged-in user or **401**.
5. Frontend protected dashboard checks `/auth/me` with `credentials: "include"`.
6. Backend `/auth/logout` destroys session.

---

## AI FEATURE

### POST /analyze

**Request body:**

```json
{
  "reviews": ["review one", "review two"]
}
```

### Rules

- Require authentication.
- `reviews` must be an array.
- `reviews` must not be empty.
- Maximum **20** reviews per request.
- Each review max **2000** characters.
- Trim and remove empty lines before backend processing.
- Call Gemini API.
- Use low temperature.
- Ask Gemini to return strict JSON only.
- Do not trust LLM output directly.
- Validate and normalize sentiment and theme.
- If LLM output is invalid, use safe fallback.
- Save each analyzed review to MongoDB.
- Return results in the same order as input.

### Allowed Values

**Sentiment:**

- `positive`
- `neutral`
- `negative`

**Theme:**

- `food`
- `host`
- `location`
- `cleanliness`
- `value`
- `experience`

### Theme Meaning

| Theme        | Covers                                                              |
| ------------ | ------------------------------------------------------------------- |
| food         | meals, breakfast, dinner, taste, kitchen, restaurant                |
| host         | staff, owner, service, communication, friendliness, responsiveness  |
| location     | distance, accessibility, view, surroundings, finding the property   |
| cleanliness  | room hygiene, bathroom, sheets, towels, smell                       |
| value        | price, worth, cost, expensive, cheap, budget                        |
| experience   | activities, ambience, wifi, comfort, overall stay, events           |

### AI Response Rules

Suggested management response must be:

- One line
- Professional
- Under 20 words
- Polite
- Relevant to the review
- No markdown
- No links
- No promises of refunds unless directly appropriate

**Positive response style:** Thank the guest warmly.

**Neutral response style:** Thank the guest and acknowledge feedback.

**Negative response style:** Apologize briefly and mention improvement or follow-up.

---

## ENVIRONMENT VARIABLES

### Backend `.env`

```
NODE_ENV=
PORT=
FRONTEND_URL=
MONGODB_URI=
SESSION_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=
GEMINI_API_KEY=
GEMINI_MODEL=
```

### Frontend `.env`

```
VITE_API_URL=
```

### Local Example

| Service                | URL                                            |
| ---------------------- | ---------------------------------------------- |
| Backend                | `http://localhost:5000`                         |
| Frontend               | `http://localhost:5173`                         |
| Local Google callback  | `http://localhost:5000/auth/google/callback`    |

---

## DESIGN SYSTEM

**Style:** Clean Brutalism

### Design Rules

- Bold borders
- Hard offset shadows
- Sharp corners
- Uppercase labels
- Monospace meta text
- Strong contrast
- Clean spacing
- No heavy gradients
- No glassmorphism
- No messy maximalism
- Accessible focus states
- Responsive layout

### Fonts

| Use          | Font            |
| ------------ | --------------- |
| Headings     | Archivo Black   |
| Body         | Space Grotesk   |
| Labels/Meta  | JetBrains Mono  |

### Color Tokens (CSS Variables)

**Light Mode:**

| Token      | Value     |
| ---------- | --------- |
| background | `#F5F1E8` |
| surface    | `#FFFFFF` |
| ink        | `#111111` |
| line       | `#111111` |
| accent     | `#FFDE00` |
| positive   | `#00A86B` |
| neutral    | `#B45309` |
| negative   | `#DC2626` |

**Dark Mode:**

| Token      | Value     |
| ---------- | --------- |
| background | `#0B0B0C` |
| surface    | `#141416` |
| ink        | `#F5F1E8` |
| line       | `#F5F1E8` |
| accent     | `#B7FF00` |
| positive   | `#34D399` |
| neutral    | `#FBBF24` |
| negative   | `#F87171` |

### Tailwind Config

- `darkMode: "class"`
- Use CSS variables in Tailwind colors.
- Create reusable component classes:
  - `.btn`
  - `.btn-primary`
  - `.card`
  - `.input`
  - `.label`
  - `.badge`
  - `.table-shell`

---

## COOKIE AND CORS RULES

### Frontend

- All fetch calls must include `credentials: "include"`.

### Backend CORS

- Allow exact frontend origin.
- Allow credentials.
- Support comma-separated `FRONTEND_URL` values.

### Backend Session Cookie

| Property   | Development | Production |
| ---------- | ----------- | ---------- |
| httpOnly   | `true`      | `true`     |
| secure     | `false`     | `true`     |
| sameSite   | `"lax"`     | `"none"`   |

- Use `app.set("trust proxy", 1)` in Express.

---

## QUALITY BAR

- No console errors in frontend.
- No broken routes.
- No hardcoded secrets.
- No dead buttons.
- No unresponsive table.
- No missing loading states.
- No ugly default Vite styling.
- Must work in light and dark mode.
- Must work on mobile.
- Must have clean README.
- Must have test report.

---

## DEPLOYMENT TARGETS

### Frontend — Vercel

| Setting          | Value            |
| ---------------- | ---------------- |
| Root directory   | `client`         |
| Build command    | `npm run build`  |
| Output directory | `dist`           |

### Backend — Render

| Setting        | Value           |
| -------------- | --------------- |
| Root directory | `server`        |
| Build command  | `npm install`   |
| Start command  | `npm start`     |

### Production Examples

| Service                      | Example URL                                             |
| ---------------------------- | ------------------------------------------------------- |
| Production backend callback  | `https://your-render-app.onrender.com/auth/google/callback` |
| Production frontend          | `https://your-vercel-app.vercel.app`                    |
