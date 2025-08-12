# Vercel Deployment Guide for SkinZAI VBMS

This guide will help you deploy the SkinZAI VBMS application to Vercel with full functionality.

## Prerequisites

- GitHub repository connected (✅ Already done: https://github.com/Skinz1434/SkinZAI-VBMS)
- Vercel account (free tier works)
- Backend hosting solution (Railway, Render, or Heroku)
- Database (Neon, Supabase, or Railway PostgreSQL)
- Object storage (Cloudflare R2, AWS S3, or MinIO)

## Step 1: Deploy Backend Services First

### Option A: Railway (Recommended - Fast & Simple)

1. Go to [Railway](https://railway.app)
2. Create new project → "Deploy from GitHub repo"
3. Select your repository
4. Add services:

```bash
# Main API Service
- Service: StarterKit/api
- Port: 8000
- Start Command: uvicorn main:app --host 0.0.0.0 --port 8000

# Auth Service
- Service: Auth RBAC Pack/auth
- Port: 8001
- Start Command: uvicorn app:app --host 0.0.0.0 --port 8001

# ML Service (optional)
- Service: MS ML Pack/ml
- Port: 8088
- Start Command: uvicorn app:app --host 0.0.0.0 --port 8088
```

4. Add PostgreSQL database from Railway's templates
5. Note down all the public URLs Railway provides

### Option B: Render

1. Use the included `render.yaml` file
2. Create Blueprint instance on Render
3. Configure environment variables

### Option C: Heroku

Create `Procfile` in each service directory:
```
web: uvicorn main:app --host 0.0.0.0 --port $PORT
```

## Step 2: Set Up Database

### Using Neon (Recommended - Free tier)

1. Sign up at [Neon](https://neon.tech)
2. Create database
3. Copy connection string
4. Add to backend environment variables

### Using Supabase

1. Create project at [Supabase](https://supabase.com)
2. Get connection string from Settings → Database
3. Use in `DATABASE_URL`

## Step 3: Set Up Object Storage

### Using Cloudflare R2 (Recommended)

1. Sign up for Cloudflare
2. Go to R2 Storage
3. Create bucket named `efolder`
4. Generate API tokens
5. Get endpoint URL

### Using AWS S3

1. Create S3 bucket
2. Configure CORS policy
3. Create IAM user with S3 access
4. Get access keys

## Step 4: Deploy to Vercel

### Method 1: Vercel Dashboard (Easiest)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure project:
   - Framework Preset: Next.js
   - Root Directory: `./`
   - Build Command: `cd StarterKit/web && npm install --legacy-peer-deps && npm run build`
   - Output Directory: `StarterKit/web/.next`
   - Install Command: `cd StarterKit/web && npm install --legacy-peer-deps`

5. Add Environment Variables (click "Environment Variables"):

```env
# Required
NEXT_PUBLIC_API_URL=/api/proxy
API_URL=https://your-api.railway.app
DATABASE_URL=postgresql://...

# Object Storage
S3_ENDPOINT=https://...
S3_ACCESS_KEY=...
S3_SECRET_KEY=...
S3_BUCKET=efolder

# Optional
NEXT_PUBLIC_APP_NAME=SkinZAI VBMS
NEXT_PUBLIC_ENVIRONMENT=production
```

6. Click "Deploy"

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd "Z:/projects/SkinZAI VBMS"
vercel

# Follow prompts:
# - Set up and deploy: Y
# - Which scope: Your account
# - Link to existing project: N
# - Project name: skinzai-vbms
# - Directory: ./StarterKit/web
# - Build Command: npm run build
# - Output Directory: .next
# - Development Command: npm run dev

# Add environment variables
vercel env add NEXT_PUBLIC_API_URL
vercel env add API_URL
# ... add all required vars

# Deploy to production
vercel --prod
```

## Step 5: Configure Domain (Optional)

1. In Vercel Dashboard → Settings → Domains
2. Add custom domain
3. Update DNS records as instructed

## Step 6: Post-Deployment Setup

### Initialize Database

SSH into your API container or use a one-off job:

```bash
# Run migrations
python -m alembic upgrade head

# Seed initial data
python -m seeds.seed_ep_claims --participants 5 --claims-per-ep 3
```

### Upload Sample Files

If using R2/S3, upload sample files:

1. Go to your storage dashboard
2. Upload files from `Mock eFolder/` directory
3. Maintain folder structure

### Test Deployment

1. Visit your Vercel URL
2. Check API health: `https://your-app.vercel.app/api/proxy/health`
3. Test authentication flow
4. Verify document upload/download

## Environment Variables Reference

### Vercel (Frontend)

```env
# Public (exposed to browser)
NEXT_PUBLIC_API_URL=/api/proxy
NEXT_PUBLIC_APP_NAME=SkinZAI VBMS
NEXT_PUBLIC_ENVIRONMENT=production

# Server-side only
API_URL=https://api.example.com
DATABASE_URL=postgresql://...
JWT_SECRET=...
```

### Backend Services

```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/db

# Storage
S3_ENDPOINT=https://...
S3_ACCESS_KEY=...
S3_SECRET_KEY=...
S3_BUCKET=efolder

# CORS
CORS_ORIGINS=https://your-app.vercel.app,https://custom-domain.com

# Auth
JWT_SECRET=same-as-frontend
TOKEN_EXPIRY=3600
```

## Troubleshooting

### Build Fails

```bash
# Check build logs
vercel logs

# Common fixes:
- Ensure all dependencies in package.json
- Check Node version compatibility
- Verify environment variables set
```

### API Connection Issues

1. Check CORS settings in backend
2. Verify API_URL environment variable
3. Test API directly: `curl https://your-api.railway.app/health`
4. Check proxy route: `/api/proxy/[...path]/route.ts`

### Database Connection

1. Verify DATABASE_URL format
2. Check SSL requirements (add `?sslmode=require`)
3. Whitelist Vercel IPs if needed

### Performance Optimization

1. Enable caching:
```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['your-s3-domain.com'],
  },
  experimental: {
    outputStandalone: true,
  },
}
```

2. Use Vercel Edge Functions for API routes
3. Enable ISR for static pages

## Monitoring

### Vercel Analytics

1. Enable in Dashboard → Analytics
2. Add to app:
```bash
npm install @vercel/analytics
```

### Error Tracking (Sentry)

```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

## CI/CD Pipeline

The repository includes GitHub Actions for auto-deployment:

`.github/workflows/vercel-deploy.yml` (already configured)

Pushes to `main` branch trigger automatic deployment.

## Security Checklist

- ✅ Environment variables set (not in code)
- ✅ CORS configured properly
- ✅ Authentication implemented
- ✅ API rate limiting enabled
- ✅ HTTPS enforced
- ✅ Security headers configured
- ✅ Input validation on all endpoints

## Support

For deployment issues:
1. Check Vercel deployment logs
2. Review backend service logs
3. Verify all environment variables
4. Test API endpoints directly

## Next Steps

1. Set up monitoring (Vercel Analytics, Sentry)
2. Configure custom domain
3. Enable preview deployments
4. Set up staging environment
5. Configure backup strategy