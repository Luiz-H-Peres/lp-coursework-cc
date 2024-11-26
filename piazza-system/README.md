# Piazza System

The Piazza System is a beginner-friendly social media platform backend built using **Node.js**, **Express**, and **MongoDB**. It allows users to register, log in, and interact with a simple API. This project is part of coursework for Cloud Computing and demonstrates the use of RESTful API development and authentication mechanisms.

---

## Features

- User registration with hashed passwords using bcrypt.
- JWT-based authentication for secure sessions.
- REST API routes for user creation and management.
- MongoDB integration for data storage.

---

## Prerequisites

Before running the project, ensure the following tools are installed on your system:

1. **Node.js** (v16 or higher is recommended)  
2. **MongoDB** (Installed locally or have access to a remote MongoDB database)  
3. **Postman** (or any API testing tool)  

---

## Installation

Follow these steps to set up the Piazza System on your local machine:

### 1. Clone the Repository
```bash
git clone https://github.com/username/piazza-system.git

2. **Navegate to the Project Directory
cd piazza-system

3. **Install Dependencies
npm install

4. **Start the MongoDB Server
mongod

5. **Start the Application
node app.js
// You should see the message: Connected to MongoDB on http://localhost:3000

Usage
The API has the following routes available for interaction:

1. Register a User
Endpoint: POST /auth/register
Body: 
  "name": "Luiz Peres",
  "email": "luiz@example.com",
  "password": "mypassword"

Response:
User Luiz Peres created successfully!

2. Log in a User
Endpoint: POST /auth/login
Body:
  "email": "luiz@example.com",
  "password": "mypassword"

Response:
  "message": "Logged in successfully",
  "token": "your_jwt_token"

3. Create a Message
Endpoint: POST /
Body:
  "name": "Luiz Peres",
  "message": "This is my first message!"

Response:
Hello, Luiz Peres. Your message: "This is my first message!" has been received!

Folder Structure
overview of the project's folder structure:

piazza-system/
models/       # Contains MongoDB schemas (e.g., User schema)
routes/       # Contains Express route files (e.g., users.js, auth.js)
app.js        # Main application file
package.json  # Metadata for the Node.js project
README.md     # Project documentation