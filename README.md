# mern
A basic MERN stack

## Prerequisites

- Node.js
- MongoDB

## Setup

1. Start MongoDB:
```bash
sudo systemctl start mongod
```

2. Go to the root directory:
```bash
cd mern
```

3. Install dependencies:
```bash
npm install
```

4. Setup .env file:
```bash
echo "NODE_ENV=development" > .env
echo "SERVER_HOST=localhost" >> .env
echo "SERVER_PORT=3000" >> .env
echo "CLIENT_HOST=localhost" >> .env
echo "CLIENT_PORT=5173" >> .env
echo "DATABASE_HOST=localhost" >> .env
echo "DATABASE_PORT=27017" >> .env
echo "DATABASE_USER=admin" >> .env
echo "DATABASE_PASSWORD=" >> .env
echo "DATABASE_NAME=mern" >> .env
```

5. Start the app:
```bash
npm run start
```