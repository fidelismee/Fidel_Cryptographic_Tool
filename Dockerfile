# Build frontend
FROM node:20-alpine as frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Final image
FROM python:3.9-slim
WORKDIR /app
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ .
COPY --from=frontend /app/frontend/dist ./static
EXPOSE 5001
ENV FLASK_APP=app:create_app()
CMD ["gunicorn", "--bind", "0.0.0.0:5001", "--timeout", "120", "app:create_app()"]
