# Notes Application - Kubernetes Deployment

A full-stack notes application with user authentication, built with Django REST Framework, Next.js, and PostgreSQL, deployed on Kubernetes.

## Project Structure
.
├── backend/
│   ├── backend/
│   ├── notes/
│   ├── manage.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── package.json
│   └── Dockerfile
└── k8s/
    ├── db-secret.yaml
    ├── db-deployment.yaml
    ├── db-service.yaml
    ├── backend-deployment.yaml
    ├── backend-service.yaml
    ├── frontend-deployment.yaml
    └── frontend-service.yaml


## Features

- User registration & login
- CRUD for notes (text only)
- Notes are user-specific

## Prerequisites

- Docker & Docker Hub account
- Kubernetes cluster (Minikube or Docker Desktop)
- `kubectl` installed

## Setup Instructions

### 1. Build and Push Docker Images

```
# Backend
cd backend
docker build -t <username>/notes-backend:v1 .
docker push <username>/notes-backend:v1

# Frontend
cd frontend
docker build -t <username>/notes-frontend:v1 .
docker push <username>/notes-frontend:v1
```
### 2. Apply Kubernetes Manifests
```
kubectl apply -f k8s/
```
### 3. Verify Deployment
```
kubectl get pods
kubectl get services
kubectl logs -f deployment/notes-backend
kubectl logs -f deployment/notes-frontend
```
### 4. Access the Application
NodePort: http://<node-ip>:30080

## API Endpoints
POST /api/users/register/ - Register

POST /api/users/login/ - Login

GET /api/users/me/ - Current user

GET /api/notes/ - List notes

POST /api/notes/ - Create note

GET /api/notes/{id}/ - Get note

PATCH /api/notes/{id}/ - Update note

DELETE /api/notes/{id}/ - Delete note

## Environment Variables
### Backend
DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT

DEBUG, SECRET_KEY

### Frontend
NEXT_PUBLIC_API_URL - Backend API URL
