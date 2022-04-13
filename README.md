# Uptime Monitoring Server
A dockerized uptime monitoring RESTful API server that allows authenticated users to monitor URLs, and get detailed uptime reports about their availability, average response time, and total uptime/downtime.

## Overview
- Signup with email verification.
- CRUD operations for URL checks (`GET`, `PUT` and `DELETE` can be called only by the user user who created the check).
- Authenticated users can get detailed uptime reports about their URLs availability, average response time, and total uptime/downtime.
- Authenticated users can group their checks by tags and get reports by tag.
- Stateless authenication using JWT.
- APIs consume and produce `application/json`.

## Setup

### Installing locally
- `npm install`
- Create a new database on MongoDB and change the `.env` file with the new connections details, (OR you can work with the current database)
-  `npm run start`

### Running the Docker image
- Download the repo
- cd to the project directory
- Run in terminal `docker-compose -f docker-compose.yml up`

## How to use the API endpoints

- Registeration
    - (POST) `/api/auth/signup` to sign up using your email and password
    - (POST) `/api/auth/verify` to verify your email by the code sent to your email
    - (POST) `/api/auth/login` to login and get a response with the `auth-token` you will be using accross the API server (you will need to add it to the header)

- CRUD operations on the Checks
    - (GET) `/api/checks` to get all of your checks
    - (GET) `/api/checks/:id` to get a specific check
    - (POST) `/api/checks` to create a check
    - (DELETE) `/api/checks/:id` to delete a check of yours
    - (PUT) `/api/checks/:id` to update a check of yours

- CRUD operations on the Reports
    - (GET) `/api/reports` to get all of your reports
    - (POST) `/api/reports/tags` to get all of your reports having the same specified tag(s)

#### `Still working on some features`
