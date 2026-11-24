# SKYRIN AI

A small static website with a Vercel serverless chat endpoint connected to the Gemini API.

## Files

- `index.html`, `style.css`, `script.js`: browser interface
- `api/chat.js`: server-side Vercel Function; keeps the Gemini key private

## 1. Get a Gemini API key

Create a key in Google AI Studio: https://aistudio.google.com/app/apikey

Do not put the key in frontend files or commit it to GitHub.

## 2. Test locally (optional)

Install Node.js LTS from https://nodejs.org/ if it is not already installed.

Open Terminal in this folder and run:

```bash
npm install -g vercel
vercel dev
```

When prompted, sign in and link the project. For local chat testing, add `GEMINI_API_KEY` to a `.env.local` file in the project root:

```text
GEMINI_API_KEY=YOUR_REAL_KEY
```

Never commit `.env.local`. The `.gitignore` already excludes it.

## 3. Push to GitHub

Create a new empty repository named `skyrin-ai`. In Terminal, from this project folder:

```bash
git init
git add .
git commit -m "Initial SKYRIN AI chatbot"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/skyrin-ai.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username.

## 4. Deploy to Vercel

1. Sign in at https://vercel.com/
2. Choose Add New → Project.
3. Import the `skyrin-ai` GitHub repository.
4. Framework preset: Other.
5. Build command: leave blank.
6. Output directory: leave blank (project root).
7. Before deploying, add Environment Variable:
   - Name: `GEMINI_API_KEY`
   - Value: your Gemini API key
   - Environments: Production, Preview, Development
8. Click Deploy.

After deployment, open the generated `*.vercel.app` URL and test a question.

If you add or change environment variables after deployment, redeploy the project for the change to take effect.

## 5. Update the company facts

Edit the `COMPANY_CONTEXT` constant in `api/chat.js`. Only add information confirmed by the company. Do not add confidential customer or engineering information.

## Important production notes

- Gemini free-tier quotas and model availability can change. Check https://ai.google.dev/gemini-api/docs/pricing and Google AI Studio usage.
- Free-tier Gemini usage may be subject to Google's data-use terms. Send only public, non-confidential information.
- This starter has basic input validation but no persistent database, login, CAPTCHA or robust per-user rate limiting. Do not advertise it as abuse-proof.
- Vercel Hobby is restricted to personal/non-commercial use. A company-facing production deployment may require Vercel Pro. Check https://vercel.com/legal/terms and https://vercel.com/pricing before launching publicly for business use.
- Do not use the chatbot for engineering design approval, safety-critical calculations or professional engineering advice.
