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

3. Setup .env file:
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
echo "JWT_SECRET=secret-key" >> .env
```

4. Install dependencies:
```bash
npm install
```

5. Start the app:
```bash
npm run start
```

## Build

To build the frontend for production:
```bash
cd frontend
npm run build
```

To preview the production build locally:
```bash
cd frontend
npm run preview
```

## Database
To clear the database of all data:
```bash
cd backend
npm run reset
```
