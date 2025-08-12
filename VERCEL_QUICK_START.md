# Quick Vercel Deployment Checklist

Follow these steps to deploy SkinZAI VBMS to Vercel in under 10 minutes:

## ✅ Prerequisites Complete
- [x] GitHub repo ready: https://github.com/Skinz1434/SkinZAI-VBMS
- [x] Vercel.json configuration created
- [x] API proxy routes configured  
- [x] Environment variables template ready
- [x] TypeScript/Next.js setup complete

## 🚀 Deploy to Vercel (5 minutes)

### Step 1: Deploy Frontend
1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Import `Skinz1434/SkinZAI-VBMS`
4. Configure:
   - **Framework**: Next.js (auto-detected)
   - **Root Directory**: `./`
   - **Build Command**: `cd StarterKit/web && npm install --legacy-peer-deps && npm run build`
   - **Install Command**: `cd StarterKit/web && npm install --legacy-peer-deps`
   - **Output Directory**: `StarterKit/web/.next`

5. **Add Environment Variables**:
```
NEXT_PUBLIC_API_URL=/api/proxy
NEXT_PUBLIC_APP_NAME=SkinZAI VBMS
NEXT_PUBLIC_ENVIRONMENT=production
API_URL=https://your-backend.railway.app
```

6. Click **"Deploy"**

### Step 2: Deploy Backend (Railway - Recommended)
1. Go to [railway.app](https://railway.app)
2. **"Deploy from GitHub repo"** → Select your repo
3. **Add Service** → Select `StarterKit/api`
4. Configure:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Port**: `8000`

5. **Add Environment Variables**:
```bash
DATABASE_URL=postgresql://user:pass@host:5432/db
S3_ENDPOINT=https://your-storage.com
S3_ACCESS_KEY=your_key
S3_SECRET_KEY=your_secret
S3_BUCKET=efolder
CORS_ORIGINS=https://your-app.vercel.app
```

6. **Add PostgreSQL Database** from Railway templates
7. Note the **public URL** Railway provides

### Step 3: Update Frontend API URL
1. Back in Vercel Dashboard → Your Project → Settings → Environment Variables
2. Update `API_URL` to your Railway backend URL
3. Redeploy: Overview → ... → Redeploy

## 🔧 Optional: Database & Storage Setup

### Database (Choose One)
- **Neon** (Free): [neon.tech](https://neon.tech) → Create database → Copy connection string
- **Supabase** (Free): [supabase.com](https://supabase.com) → New project → Settings → Database
- **Railway** (Paid): Add PostgreSQL service to your Railway project

### Object Storage (Choose One)  
- **Cloudflare R2** (Cheap): R2 Storage → Create bucket "efolder" → Generate API tokens
- **AWS S3** (Standard): Create S3 bucket → IAM user → Access keys
- **MinIO** (Self-hosted): Deploy MinIO container

## ✅ Verify Deployment

1. **Frontend**: Visit your Vercel URL
2. **API Health**: `https://your-app.vercel.app/api/proxy/health`
3. **Database**: Check if tables are created
4. **Storage**: Test file upload/download

## 🎯 Expected Result

You should have:
- ✅ **Frontend**: Fully functional Next.js app on Vercel
- ✅ **Backend API**: FastAPI service on Railway
- ✅ **Database**: PostgreSQL with auto-created tables
- ✅ **Proxy**: API calls routed through Vercel edge functions
- ✅ **CORS**: Proper cross-origin configuration

## 🐛 Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| Build fails | Check Node version, install legacy peer deps |
| API not connecting | Verify API_URL env var, check CORS settings |
| Database errors | Check DATABASE_URL format, SSL requirements |
| 404 on routes | Ensure proper Next.js routing, check vercel.json |

## 🔄 Continuous Deployment

Once deployed:
- **Auto-deploy**: Pushes to `main` branch trigger automatic deployments
- **Preview**: Pull requests get preview deployments  
- **Environment**: Separate staging/production environments

## 📞 Need Help?

- Check the full guide: [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)
- Vercel docs: [vercel.com/docs](https://vercel.com/docs)
- Railway docs: [docs.railway.app](https://docs.railway.app)

---

**Total Time**: ~10 minutes for basic deployment, +15 minutes for database/storage setup