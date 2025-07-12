# pern
A basic PERN stack

## Prerequisites

- Node.js
- PostgreSQL

## Setup

1. Create a postgreSQL database:
```bash
createdb -h localhost -p 5432 -U postgres your_db_name_here
```

2. Go to the root directory:
```bash
cd pern
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
echo "DATABASE_PORT=5432" >> .env
echo "DATABASE_USER=postgres" >> .env
echo "DATABASE_PASSWORD=your_password_here" >> .env
echo "DATABASE_NAME=your_db_name_here" >> .env
```

5. Start the app:
```bash
npm run start
```