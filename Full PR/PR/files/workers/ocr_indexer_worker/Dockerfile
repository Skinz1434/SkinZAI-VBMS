FROM python:3.11-slim
WORKDIR /app
# Copy API source so tasks can import models/db
COPY ./api /app/api
# Best effort: install API deps if file exists
RUN if [ -f /app/api/requirements.txt ]; then pip install --no-cache-dir -r /app/api/requirements.txt; fi
# Queue deps
RUN pip install --no-cache-dir celery==5.3.6 requests==2.31.0
ENV PYTHONPATH=/app
CMD ["celery","-A","api.celery_app.celery","worker","-l","INFO"]
