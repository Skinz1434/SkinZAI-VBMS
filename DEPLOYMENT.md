# NOVA Platform Deployment Guide

## Overview
The NOVA Platform consists of a Next.js frontend and a FastAPI backend with QBit AI assistant.

## Frontend Deployment (Vercel) - Already Deployed ✅
The frontend is automatically deployed at: https://skinzai-vbms.vercel.app

## Backend Deployment (Render)

### Step 1: Deploy to Render

1. **Create a Render Account**
   - Go to [render.com](https://render.com)
   - Sign up for a free account

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository: `https://github.com/Skinz1434/SkinZAI-VBMS`
   - Select the repository

3. **Configure the Service**
   - **Name**: `nova-qbit-backend`
   - **Root Directory**: `backend`
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main_simplified:app --host 0.0.0.0 --port $PORT`

4. **Environment Variables**
   Add these in Render dashboard:
   ```
   PYTHON_VERSION=3.11.0
   APP_NAME=NOVA QBit
   VERSION=1.0.0
   ENVIRONMENT=production
   LOG_LEVEL=INFO
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (takes 5-10 minutes)
   - Copy your backend URL (e.g., `https://nova-qbit-backend.onrender.com`)

### Step 2: Update Frontend Environment

1. **Update Vercel Environment Variables**
   - Go to your Vercel dashboard
   - Navigate to Settings → Environment Variables
   - Add:
     ```
     NEXT_PUBLIC_API_URL=https://nova-qbit-backend.onrender.com
     NEXT_PUBLIC_WS_URL=wss://nova-qbit-backend.onrender.com
     ```

2. **Redeploy Frontend**
   - Trigger a redeploy in Vercel to pick up new environment variables

## Alternative: Local Development

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main_simplified:app --reload --host 0.0.0.0 --port 8000
```

### Frontend
```bash
npm install
npm run dev
```

## Testing the Integration

1. **Health Check**
   ```bash
   curl https://nova-qbit-backend.onrender.com/health
   ```

2. **Test Authentication**
   ```bash
   curl -X POST https://nova-qbit-backend.onrender.com/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username": "testuser", "password": "testpass"}'
   ```

3. **Test QBit Chat**
   - Open https://skinzai-vbms.vercel.app
   - Click the chat bubble in bottom right
   - Try asking: "What are the requirements for service connection?"

## Features Available

### QBit AI Assistant
- **M21-1 and 38 CFR Knowledge**: Built-in regulatory knowledge
- **Navigation Assistance**: "Navigate to claims" or "Show me the dashboard"
- **Claims Guidance**: Ask about service connection, disability ratings
- **Real-time Chat**: WebSocket connection for instant responses

### Security Features
- **No Session Logging**: Privacy-first design
- **User Isolation**: Each user has isolated WebSocket connection
- **JWT Authentication**: Secure token-based auth
- **Rate Limiting**: Built-in protection against abuse

### Agent Orchestration
- Claims Processor Agent
- Medical Reviewer Agent
- Quality Auditor Agent
- Document Analyzer Agent
- Notification Manager Agent
- Leiden Analyzer Agent (Pattern Analysis)

## Monitoring

### Backend Status
- Health: `/health`
- Stats: `/api/stats`
- Agent Status: `/api/agents/status`

### Frontend Status
- Vercel Dashboard shows deployment status and logs

## Troubleshooting

### Backend Issues
1. **"Backend not responding"**
   - Check Render dashboard for deployment status
   - Look at logs in Render dashboard
   - Verify environment variables are set

2. **"WebSocket connection failed"**
   - Ensure WSS URL is correct in frontend env
   - Check CORS settings in backend

### Frontend Issues
1. **"Chat not appearing"**
   - Check browser console for errors
   - Verify API URLs in environment variables
   - Clear browser cache

## Demo Credentials
For testing purposes, any username/password combination will work as the simplified backend uses demo authentication.

## Next Steps

1. **Production Database**: When ready, add PostgreSQL for persistence
2. **Redis Cache**: Add Redis for improved performance
3. **OpenAI Integration**: Add OpenAI API key for enhanced AI capabilities
4. **Custom Domain**: Configure custom domain for backend
5. **SSL Certificates**: Ensure HTTPS is properly configured

## Support

For issues or questions:
- Frontend: Check Vercel deployment logs
- Backend: Check Render deployment logs
- Repository: https://github.com/Skinz1434/SkinZAI-VBMS