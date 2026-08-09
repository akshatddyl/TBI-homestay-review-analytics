# Perlogo

**Homestay Guest Review Sentiment Classifier** for Trishul Eco-Homestays.

Paste guest reviews and instantly receive sentiment classification, theme tagging, and suggested management responses — powered by AI.

---

## Tech Stack

| Layer    | Technology                     | Deployment |
| -------- | ------------------------------ | ---------- |
| Frontend | React + Vite + Tailwind CSS v3 | Vercel     |
| Backend  | Node.js + Express              | Render     |
| Database | MongoDB Atlas + Mongoose       | Atlas      |
| Auth     | Google OAuth via Passport.js   | —          |
| AI       | Gemini API                     | —          |

## Project Status

> 🚧 This project is being built **phase by phase**.
>
> **Phase 1** — Repository scaffold ✅

## Getting Started

```bash
# Use correct Node version
nvm use

# Install all dependencies (root + server + client)
npm run install-all

# Start development servers
npm run dev
```

## Folder Structure

```
perlogo/
  client/          # React + Vite frontend
  server/          # Node.js + Express backend
  docs/            # Deployment notes and test reports
  AGENTS.md        # Project rules
  README.md
  .gitignore
  .nvmrc
  package.json
```

## License

Private — Trishul Eco-Homestays.
