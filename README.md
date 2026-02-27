# Niagara Event Finder

A full-stack event discovery app with a React (Vite) frontend and a Spring Boot backend.  
Includes simple user authentication backed by an H2 database (with H2 Console enabled for dev).

## Tech Stack
- **Frontend:** React + Vite + TypeScript
- **Backend:** Java 17 + Spring Boot + Spring Security + Spring Data JPA
- **Database:** H2 (file-based for local dev)
- **Dev tooling:** Maven Wrapper, npm

## Project Structure
niagara-event-finder/
frontend/ # React/Vite app
backend/ # Spring Boot app

## Prerequisites
- **Node.js** (LTS recommended)
- **npm**
- **Java 17**
- (Optional) Git + VS Code

## Ports (Local Dev)
- **Frontend:** http://localhost:8080
- **Backend API:** http://localhost:8081
- **H2 Console:** http://localhost:8081/h2-console

> The frontend proxies API calls under `/api` to the backend during development.

## Run Locally

### 1) Start the backend (Spring Boot)
Open a terminal in the repo root:

```bash
cd backend
./mvnw spring-boot:run
```

### 1) Start the frontend (Vite)
cd frontend
npm install
npm run dev

