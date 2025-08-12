import os
JWT_SECRET = os.getenv("JWT_SECRET", "dev-secret-change-me")
JWT_ALG = os.getenv("JWT_ALG", "HS256")
DATABASE_URL = os.getenv("DATABASE_URL","postgresql://skinzai:skinzai@db:5432/skinzai")
TOKEN_TTL = int(os.getenv("TOKEN_TTL","3600"))
