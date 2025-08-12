import os
BROKER_URL = os.getenv("BROKER_URL", "amqp://guest:guest@rabbitmq:5672//")
RESULT_BACKEND = os.getenv("RESULT_BACKEND", "rpc://")
API_URL = os.getenv("API_URL", "http://api:8000")
