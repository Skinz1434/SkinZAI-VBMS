import os
from celery import Celery

BROKER_URL = os.getenv("BROKER_URL", "amqp://guest:guest@rabbitmq:5672//")
RESULT_BACKEND = os.getenv("RESULT_BACKEND", "rpc://")

celery = Celery("skinzai_api", broker=BROKER_URL, backend=RESULT_BACKEND, include=["api.celery_tasks"])
