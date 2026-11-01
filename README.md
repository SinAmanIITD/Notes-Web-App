# Notes Web App

A full-stack notes application: **Django REST Framework** backend with
**JWT authentication**, and a **React + Bootstrap** frontend for digital
note management.

## Features

- JWT-based authentication (`djangorestframework-simplejwt`): register, log
  in, access/refresh token rotation, automatic silent refresh on 401 via an
  axios interceptor.
- RESTful CRUD API for notes, scoped per-user (object-level permission check
  so one user can never read/edit/delete another user's notes).
- React frontend: login/register pages, protected routes, create/edit/delete
  notes with a responsive Bootstrap UI.

## Project layout

```
backend/
  config/         - Django project settings, URLs
  notes/          - models, serializers, views (DRF ViewSet), tests
  requirements.txt
frontend/
  src/api/        - axios client with JWT auth + refresh interceptor
  src/context/    - AuthContext (login/register/logout state)
  src/pages/      - Login, Register, Notes
  src/components/ - NoteCard, NoteForm, ProtectedRoute
```

## Backend setup

```bash
cd backend
python3 -m venv ../backend_venv && source ../backend_venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # fill in a real secret key for anything beyond local dev
python3 manage.py migrate
python3 manage.py test notes   # run the test suite
python3 manage.py runserver 8000
```

## Frontend setup

```bash
cd frontend
npm install
cp .env.example .env   # points at the backend API URL
npm run dev             # http://localhost:5173
```

## API

| Method | Endpoint                  | Description                  |
|--------|----------------------------|-------------------------------|
| POST   | `/api/auth/register/`      | Create a new user             |
| POST   | `/api/auth/token/`         | Obtain access + refresh token |
| POST   | `/api/auth/token/refresh/` | Refresh an access token       |
| GET    | `/api/notes/`               | List the current user's notes |
| POST   | `/api/notes/`               | Create a note                 |
| PATCH  | `/api/notes/{id}/`          | Update a note                 |
| DELETE | `/api/notes/{id}/`          | Delete a note                 |

## Verified

- Backend: 5 Django test cases covering registration, login (including
  wrong-password rejection), unauthenticated-request rejection, full
  create/list/update/delete CRUD, and cross-user note isolation — all pass.
- Frontend: exercised live end-to-end in a browser against the running
  backend — register, auto-login, create note, edit note, delete note, and
  JWT-protected API calls all verified working.
