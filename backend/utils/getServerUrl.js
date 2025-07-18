import dotenv from 'dotenv';

dotenv.config({ override: true, path: '../.env', quiet: true });

export const getServerUrl = () => {
  const host = process.env.SERVER_HOST;
  const port = process.env.SERVER_PORT;

  // Ensure required environment variables exist
  if (!host || !port) {
    throw new Error(`Missing required server environment variables: ${!host ? 'SERVER_HOST' : ''} ${!port ? 'SERVER_PORT' : ''}`);
  }

  return { host, port };
}