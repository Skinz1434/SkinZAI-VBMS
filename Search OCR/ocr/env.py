import os
S3_ENDPOINT = os.getenv("S3_ENDPOINT","http://minio:9000")
S3_ACCESS_KEY = os.getenv("S3_ACCESS_KEY","minio")
S3_SECRET_KEY = os.getenv("S3_SECRET_KEY","minio123")
S3_BUCKET = os.getenv("S3_BUCKET","efolder")
