# NodeJS-Chat-Server
NodeJS Chat Server is a real-time chat server built with Node.js. This project aims to provide a simple yet powerful platform for users to join chat rooms, send messages, and access chat history.

## Features

- User authentication with basic username/password login.
- A single chat room created upon server startup.
- Persistent storage of chat messages in a MongoDB database.
- Real-time message sending and retrieval through WebSocket.
- RESTful endpoints for message operations.
- Scalability considerations with Redis for message broadcasting.

## Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

## Getting Started

### Dependencies

- Node.js
- Express
- TypeScript
- MongoDB
- Redis

### Installing
- Clone the repository: `git clone https://github.com/gevorgabgaryan/NodeJS-Chat-Server.git`
- Change directory to the project folder: `cd NodeJS-Chat-Server`
- Copy the sample environment  .env-sample  file to .env: `cp .env-example .env`


### Building and Running the Application

   1. Build and start the application with Docker Compose: `docker-compose up --build -d`

   2. The application will be running on
      -  http://localhost:4000
      -  ws://localhost:1990

### Testing

- Execute tests using: `npm test`

### Using Postman for API Testing

1. Import the provided Postman collections and environment files into Postman:
 - `Node_Chat_API.postman_collection.json`
 - `Node_Chat.postman_environment.json`
2. Use the "Auth" collection for login operations.
3. Use the "Chat" collection for message posting, retrieval, and deletion.
### Contact
   For any inquiries, please contact Gevorg
   at gevorg.gak@gmail.com