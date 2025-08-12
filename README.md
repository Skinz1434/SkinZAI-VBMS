# SkinZAI VBMS

A comprehensive Veterans Benefits Management System (VBMS) implementation with modular architecture.

## Overview

This project provides a complete VBMS solution with the following components:

### Core Modules

- **StarterKit**: Main application with PostgreSQL-backed API, React/Next.js UI, and MinIO storage
- **Auth RBAC Pack**: Authentication and role-based access control service
- **Correspondence Builder**: Document generation service for VA correspondence
- **Decision Builder Pack**: Claims decision and codesheet generation
- **Mock eFolder**: Sample veteran data for testing and development

### Supporting Services

- **Search OCR**: Optical character recognition and document search capabilities
- **MS ML Pack**: Machine learning agents for quality analysis and predictions
- **Observability Ops**: Monitoring and observability stack
- **Cloud Deployment Pack**: Cloud deployment configurations (Vercel, Render)
- **CI QA Security Pack**: Continuous integration and security testing
- **UI Polish Demo Pack**: Enhanced UI components and demo features

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Python 3.11+
- Node.js 20+
- Git

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd "SkinZAI VBMS"
```

2. Start the main application:
```bash
cd StarterKit
docker compose up -d --build
```

3. Access the services:
- Web UI: http://localhost:3000
- API Documentation: http://localhost:8000/docs
- MinIO Console: http://localhost:9001 (user: `minio`, pass: `minio123`)

### Development Setup

For local development without Docker:

1. Set up the API:
```bash
cd StarterKit/api
pip install -r requirements.txt
uvicorn main:app --reload
```

2. Set up the web interface:
```bash
cd StarterKit/web
npm install --legacy-peer-deps
npm run dev
```

## Architecture

The system follows a microservices architecture with:

- **API Layer**: FastAPI-based REST services
- **Database**: PostgreSQL for persistent storage
- **Object Storage**: MinIO (S3-compatible) for document storage
- **Message Queue**: RabbitMQ for async processing
- **Frontend**: Next.js React application

## Features

- Document management and eFolder organization
- Claims processing and tracking
- Participant (veteran) management
- Role-based access control
- OCR and document search
- Automated correspondence generation
- Decision and award calculation
- Audit logging

## Documentation

Detailed documentation is available in each module's `docs/` directory:

- [StarterKit Documentation](StarterKit/docs/README.md)
- [Authentication Guide](Auth%20RBAC%20Pack/docs/README_AUTH.md)
- [Correspondence Builder](Correspondence%20Builder/docs/README_CORRESPONDENCE_PACKET.md)
- [Decision Builder](Decision%20Builder%20Pack/docs/README_DECISIONS.md)

## Testing

Run tests using the CI/QA pack:

```bash
cd "CI QA Security Pack"
pytest
```

## Deployment

See the [Cloud Deployment Pack](Cloud%20Deployment%20Pack/README.md) for deployment instructions to:
- Vercel (Frontend)
- Render (Backend services)
- AWS/GCP/Azure (Full stack)

## Security

This project includes:
- JWT-based authentication
- Role-based access control (RBAC)
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- Audit logging

## Contributing

Please follow the existing code style and include tests for new features.

## License

[Specify License]

## Support

For issues and questions, please open a GitHub issue.

---

**Note**: This system uses synthetic data only for development and testing purposes.