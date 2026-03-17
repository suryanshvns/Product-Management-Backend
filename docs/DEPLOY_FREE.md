# Go live (free): Neon + Render

Use **Neon** for the database and **Render** for the backend. Follow only these steps.

---

## Step 1: Database (Neon)

1. Open [neon.tech](https://neon.tech) and sign up with GitHub.
2. **New project** → name it (e.g. `pm-platform`) → Create.
3. On the project dashboard, copy the **connection string**.
4. Ensure the URL ends with `?sslmode=require`. If not, add it.

Save this URL; you will use it as `DATABASE_URL`.

---

## Step 2: Backend (Render)

1. Push your backend code to **GitHub**.
2. Open [render.com](https://render.com) and sign up (GitHub).
3. **New +** → **Web Service**.
4. Connect your GitHub account and select this backend repo.
5. Use these settings:

   | Setting           | Value                                |
   | ----------------- | ------------------------------------ |
   | **Runtime**       | Node                                 |
   | **Build command** | `npm install && npx prisma generate` |
   | **Start command** | `npm run start:deploy`               |
   | **Instance type** | Free                                 |

6. Click **Advanced** → **Add Environment Variable**. Add these (copy-paste):

   | Key            | Value                                                              |
   | -------------- | ------------------------------------------------------------------ |
   | `NODE_ENV`     | `production`                                                       |
   | `DATABASE_URL` | _(paste your Neon connection string from Step 1)_                  |
   | `JWT_SECRET`   | `14f666627a114a2804b66ba5c20641bf76f8f50abb05f1a600af2c4bcf3fba50` |
   | `API_BASE_URL` | `https://YOUR-SERVICE-NAME.onrender.com`                           |

   Replace `YOUR-SERVICE-NAME` with your Render service name (e.g. `product-management-backend`). Use your real Neon connection string for `DATABASE_URL`.

7. Click **Create Web Service**. Wait until the deploy finishes (Build and Start must succeed).

8. Your API base URL is: **`https://<your-service-name>.onrender.com`**
   Example health check: `https://<your-service-name>.onrender.com/api/health`

---

## Step 3: Seed the database (once)

After the first successful deploy:

1. In Render dashboard → your service → **Shell** (or use **Environment** to see `DATABASE_URL` and run locally).
2. In the shell run: `node database/seed.js`
3. Exit the shell.

You can now log in with `admin@company.com` / `test` and use the API.

---

## If you have a frontend

Add one more env var on Render:

| Key           | Value                              |
| ------------- | ---------------------------------- |
| `CORS_ORIGIN` | `https://your-frontend-domain.com` |

Use your real frontend URL (e.g. from Vercel/Netlify). For multiple URLs, separate with commas.

---

That’s all you need to go live with this backend and database for free.
