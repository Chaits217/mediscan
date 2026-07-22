# MediScan Backend

Node.js + Express + MongoDB backend for MediScan.

## What's built so far (Step 1-4 of the project)

- User signup / login (JWT-based auth, passwords hashed with bcrypt)
- Medical profile CRUD (create, view, update)
- AI-generated clinical summary (Claude API) - regenerated automatically whenever a profile is saved
- QR code generation, pointing at the public emergency scan page
- Public, no-login endpoint that returns a profile's emergency data (what a QR scan hits)
- Scan logging (records every time a profile is viewed publicly)

## Setup

1. **Install dependencies**
   ```
   npm install
   ```

2. **Create your `.env` file**

   Copy `.env.example` to a new file named `.env`, then fill in:
   - `MONGO_URI` - from MongoDB Atlas: create a free cluster at mongodb.com/atlas, click "Connect" → "Drivers", copy the connection string, and replace `<username>`/`<password>` with your database user's credentials.
   - `JWT_SECRET` - any long random string (e.g. mash your keyboard for 40 characters).
   - `ANTHROPIC_API_KEY` - from console.anthropic.com. Optional to start - the app works without it, it just won't generate real AI summaries until added.
   - `CLIENT_URL` - leave as `http://localhost:5173` for now (that's where the frontend will run).

3. **Run the server**
   ```
   npm run dev
   ```
   You should see `MongoDB connected` and `MediScan backend running on port 5000`.

4. **Test it's working**

   Open `http://localhost:5000/api/health` in your browser - you should see `{"status":"ok"}`.

## API reference

| Method | Route | Auth? | What it does |
|---|---|---|---|
| POST | `/api/auth/signup` | No | Create an account. Body: `{ email, password }` |
| POST | `/api/auth/login` | No | Log in. Body: `{ email, password }`. Returns a JWT token. |
| GET | `/api/profile/me` | Yes | Get your own profile |
| POST | `/api/profile` | Yes | Create your profile (first time). Body: see Profile model fields. |
| PUT | `/api/profile` | Yes | Update your profile (regenerates AI summary) |
| GET | `/api/profile/qr` | Yes | Get your QR code as a data URL |
| GET | `/api/public/:publicId` | No | Public scan endpoint - what the QR code opens |

For authenticated routes, send the JWT token from login/signup as a header:
`Authorization: Bearer <token>`

## Next steps

Once this backend is running and tested, we build the frontend (signup/login pages, the profile form, the dashboard with QR download, and the public scan page).
