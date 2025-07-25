FROM python:3.9-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Environment variables
ENV PYTHONPATH=/app
ENV C_FORCE_ROOT=1

EXPOSE 8000

CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port 8000 & celery -A scheduler.celery_app worker --pool=solo --loglevel=info & celery -A scheduler.celery_app beat --loglevel=info"]







# FROM python:3.9-slim

# WORKDIR /app

# # Install system dependencies
# RUN apt-get update && apt-get install -y \
#     build-essential \
#     && rm -rf /var/lib/apt/lists/*

# # Install Python dependencies
# COPY requirements.txt .
# RUN pip install --no-cache-dir -r requirements.txt

# # Copy application code
# COPY . .

# # Ensure packages are in PATH
# ENV PATH="/usr/local/bin:${PATH}"
# ENV PYTHONPATH=/app
# ENV C_FORCE_ROOT=1

# EXPOSE 8000

# # Use absolute paths for commands
# CMD ["sh", "-c", "/usr/local/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000 & /usr/local/bin/celery -A app.scheduler.celery_app worker --pool=solo --loglevel=info & /usr/local/bin/celery -A app.scheduler.celery_app beat --loglevel=info"]