# Full Stack To-Do App

## Setup

1. Clone repo
2. Copy `.env.example` to `.env` in both `/backend` and `/frontend`
3. Fill in your secrets and URLs

## Local Development

```bash
cd backend
npm install
node index.js

cd frontend
npm install
npm run dev
```

## Deployment

- **Backend:** Render (Node.js Web Service)
- **Frontend:** Vercel or Netlify (React app)

## Required Accounts

- GitHub
- MongoDB Atlas
- Render
- Vercel (or Netlify)

## Production Build

```bash
cd frontend
npm run build
```

## Environment Variables

See `.env.example` in both folders.

## Troubleshooting

- CORS errors: Check backend CORS config and env vars.
- API URL: Use deployed backend URL in frontend env.
- 404 on refresh: Add rewrite rules.
- MongoDB: Use Atlas URI, check network access.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
"# To-Do-App"
