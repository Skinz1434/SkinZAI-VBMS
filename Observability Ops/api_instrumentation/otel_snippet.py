# Add this to your API startup to emit basic metrics/traces.
from fastapi import FastAPI
from prometheus_client import Counter, generate_latest
from fastapi.responses import PlainTextResponse

REQUESTS = Counter('skinzai_requests_total','Total requests',['path'])

def instrument(app: FastAPI):
    @app.middleware("http")
    async def _metrics(request, call_next):
        resp = await call_next(request)
        REQUESTS.labels(path=request.url.path).inc()
        return resp

    @app.get("/metrics")
    def metrics():
        return PlainTextResponse(generate_latest().decode("utf-8"))
