# Project Manager

Project Manager is a React-based project and task management dashboard built as an API-driven application.

## Features

- User authentication
- Protected routes
- Dashboard overview
- Project management
- Task management
- CRUD operations
- Search and filtering
- Task assignment
- Project assignment
- Task status and priority management
- Form validation
- Loading and error states
- Delete confirmation modals
- Toast notifications
- Responsive UI

## Tech Stack

- React
- React Router
- Redux Toolkit
- Context API
- Axios
- Tailwind CSS
- Recharts
- JSON Server
- React Hot Toast
- Vite

## Project Structure

```text
src/
├── components/
├── pages/
├── services/
├── store/
├── context/
├── hooks/
└── utils/
```
## Setup
1. Install Dependencies
``` bash
npm install
```
2. Configure Environmental Variables
``` bash
Create a .env file in the project root

VITE_API_BASE_URL=http://localhost:3000
```
3. Start JSON Server
``` bash
Create a .env file in the project root
```
The API will be available at:
```
npx json-server db.json --port 3000
```
4. Start the React Application
```
npm run dev
```

## API Endpoints
### Projects
```
GET     /projects
POST    /projects
PATCH   /projects/:id
DELETE  /projects/:id
```
### Tasks
```
GET     /tasks
POST    /tasks
PATCH   /tasks/:id
DELETE  /tasks/:id
```
### Users
```
GET     /users
```

## Architecture
The application separates UI components, pages, API services, global state, authentication context, reusable hooks, and validation utilities.

API requests are handled through a centralized Axios instance, while the API URL is configured using environment variables.

## State Management
Redux Toolkit is used to manage application data such as:

* Projects
* Tasks
* Loading states
* API errors

React Context API is used for authentication state and user session management.

## Validation
Reusable validation utilities are used to validate form inputs before submitting project and task data.

## Development 
Create a production build 
``` 
npm run build
```

Preview the production build:
```
npm run preview
```