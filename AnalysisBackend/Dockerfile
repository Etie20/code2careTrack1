# Use a different Python base image
FROM python:3.11-slim


WORKDIR /app

# Install dependencies without caching
RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc python3-dev && \
    rm -rf /var/lib/apt/lists/*

# Install requirements directly (bypassing requirements.txt temporarily)
RUN pip install --no-cache-dir uvicorn fastapi

# Now copy requirements.txt and install the rest
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

EXPOSE 8000

CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

# FROM python:3.11.9

# WORKDIR /app

# # Install system dependencies
# RUN apt-get update && \
#     apt-get install -y --no-install-recommends gcc python3-dev && \
#     rm -rf /var/lib/apt/lists/*

# # Install Python dependencies
# COPY requirements.txt .
# RUN pip install --no-cache-dir -r requirements.txt

# # Verify uvicorn installation
# RUN pip show uvicorn && which uvicorn

# # Copy application code
# COPY . .

# # Set environment variables
# ENV PYTHONPATH=/app
# ENV PATH="/usr/local/bin:${PATH}"

# EXPOSE 8000

# CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]