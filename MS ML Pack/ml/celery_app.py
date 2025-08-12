from celery import Celery
from .env import BROKER_URL, RESULT_BACKEND

celery = Celery("skinzai_ml", broker=BROKER_URL, backend=RESULT_BACKEND, include=["orchestrator"])
