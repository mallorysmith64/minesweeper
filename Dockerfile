# --- Frontend build stage ---
FROM node:20-alpine AS frontend-build
WORKDIR /frontend

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# --- Backend stage ---
FROM python:3.12-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# System deps (uncomment if you need e.g. psycopg2/build tools)
# RUN apt-get update && apt-get install -y --no-install-recommends gcc libpq-dev && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .

# Built frontend assets, served as static files by the backend app
COPY --from=frontend-build /frontend/build ./static

# Cloud Run injects PORT at runtime (defaults to 8080) — don't hardcode it
ENV PORT=8080
EXPOSE 8080

# JSON array form with an explicit shell + exec, so $PORT still expands
# but gunicorn replaces the shell as PID 1 and receives signals directly
CMD ["sh", "-c", "exec gunicorn app:app --bind 0.0.0.0:$PORT --workers 4 --timeout 120"]