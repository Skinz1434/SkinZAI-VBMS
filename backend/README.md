# NOVA QBit Backend - Secure FastAPI Service

## Overview

NOVA QBit (Quantum Benefits Intelligence Transformer) is a secure, FastAPI-based backend service that provides intelligent chatbot capabilities with M21/CFR knowledge integration, agent orchestration, and real-time notifications.

## Features

### Security
- **Secure WebSocket connections** with user isolation
- **Rate limiting** per user/session
- **Input sanitization** and XSS prevention
- **JWT authentication** with refresh tokens
- **Security headers** (CSP, HSTS, X-Frame-Options)
- **SQL injection protection**
- **Audit logging** for all interactions

### QBit Chatbot
- **M21-1 and 38 CFR knowledge base** integration
- **Navigation assistance** throughout the NOVA platform
- **Claims processing guidance** with regulatory citations
- **Intelligent intent recognition**
- **Context-aware responses**

### Agent Orchestration
- **Leiden clustering** for pattern analysis
- **Role-based access control** (RBAC) for agents
- **Specialized agents**:
  - Claims Processor
  - Medical Reviewer
  - Quality Auditor
  - Document Analyzer
  - Notification Manager
  - Leiden Analyzer
- **Scoped permissions** per agent
- **Parallel agent coordination**

### Real-time Features
- **WebSocket support** with heartbeat
- **User-isolated connections**
- **Real-time notifications**
- **Live chat with QBit**

## Installation

1. **Clone the repository**
```bash
cd backend
```

2. **Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

5. **Set up database**
```bash
# Ensure PostgreSQL is running
# Create database: CREATE DATABASE nova_qbit;
alembic upgrade head
```

6. **Run the application**
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## API Documentation

Once running, access the interactive API documentation at:
- Swagger UI: http://localhost:8000/api/docs
- ReDoc: http://localhost:8000/api/redoc

## WebSocket Connection

Connect to the WebSocket endpoint for real-time chat:

```javascript
const ws = new WebSocket('ws://localhost:8000/api/chat/ws/session-123?token=YOUR_JWT_TOKEN');

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  console.log('Received:', message);
};

ws.send(JSON.stringify({
  type: 'chat',
  content: 'Help me with a PTSD claim',
  context: {}
}));
```

## Security Best Practices

1. **Never commit .env files** with real credentials
2. **Use strong SECRET_KEY and JWT_SECRET_KEY** (min 32 characters)
3. **Enable HTTPS in production** with proper certificates
4. **Implement rate limiting** appropriate for your load
5. **Regular security audits** of dependencies
6. **Monitor logs** for suspicious activity
7. **Keep dependencies updated**

## Agent Permissions

Each agent has scoped permissions:

```python
{
  "claims_processor": {
    "can_read": ["claims", "veterans", "medical_records"],
    "can_write": ["claims", "decisions"],
    "can_execute": ["rating_calculator", "exam_scheduler"]
  },
  "medical_reviewer": {
    "can_read": ["medical_records", "exam_results"],
    "can_write": ["medical_opinions"],
    "can_execute": ["medical_analyzer"]
  }
}
```

## Knowledge Base

The knowledge base includes:
- **M21-1 Manual** sections
- **38 CFR regulations**
- **VA procedures and policies**
- **Best practices**

Query the knowledge base:
```python
POST /api/chat/message
{
  "content": "What are the requirements for service connection?",
  "type": "knowledge_query"
}
```

## Monitoring

- **Health check**: GET /health
- **Metrics**: GET /metrics (Prometheus format)
- **WebSocket stats**: GET /api/chat/stats
- **Agent stats**: GET /api/agents/stats

## Testing

Run tests with pytest:
```bash
pytest tests/ -v
```

## Production Deployment

1. Use a process manager like Gunicorn
2. Set up reverse proxy with Nginx
3. Enable SSL/TLS certificates
4. Configure firewall rules
5. Set up monitoring and alerting
6. Enable log aggregation
7. Regular backups of database

## License

Proprietary - NOVA Platform

## Support

For issues or questions, contact the NOVA development team.