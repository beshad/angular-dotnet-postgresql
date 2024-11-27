## Overview

This project consists of a **.NET 9.0 backend**, an **Angular 19 frontend**, and a **PostgreSQL database**.

The entire setup is containerized using Docker, and a `docker-compose.yml` file is provided for deployment.

## Prerequisites

To run this project, ensure you have the following installed:

- **Docker**: [Install Docker](https://docs.docker.com/get-docker/)

## Project Structure

- **server/**: Contains the .NET 9.0 API project.
- **client/**: Contains the Angular 19 application.
- **docker-compose.yml**: Orchestrates the backend, frontend, and database containers.

## Setup and Run

- Clone the repository
- Run `docker-compose up --build`
- You need to bash into the dotnet container seed the DB: `dotnet ef database update`

## Access the application:

Frontend: http://localhost:4200 (default Angular port)
Backend API: http://localhost:5000 (default .NET port)

## Notes

- The backend connects to the PostgreSQL database defined in the docker-compose.yml.
- The Angular app is configured to interact with the .NET API.

Database connection details are set in the `appsettings.json` file so this file need to be added to `,gitignore` before production
