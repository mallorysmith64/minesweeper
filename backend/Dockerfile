FROM python:3.12-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# System deps (uncomment if you need e.g. psycopg2/build tools)
# RUN apt-get update && apt-get install -y --no-install-recommends gcc libpq-dev && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Railway injects PORT at runtime — don't hardcode it
EXPOSE 8000

# JSON array form with an explicit shell + exec, so $PORT still expands
# but gunicorn replaces the shell as PID 1 and receives signals directly
CMD ["sh", "-c", "exec gunicorn app:app --bind 0.0.0.0:$PORT --workers 4 --timeout 120"]