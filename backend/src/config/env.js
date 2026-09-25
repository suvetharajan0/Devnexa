
import dotenv from 'dotenv';


dotenv.config();


const required = ['MONGODB_URI', 'JWT_SECRET'];


function getEnv() {
  const env = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 5000,
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/devnexa',
    JWT_SECRET: process.env.JWT_SECRET || 'dev-only-change-me',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
    CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
    COOKIE_NAME: process.env.COOKIE_NAME || 'devnexa_token',
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  };


  if (env.NODE_ENV === 'production') {
    for (const key of required) {
      if (!process.env[key]) {
        throw new Error(`Missing required environment variable: ${key}`);
      }
    }
    if(env.JWT_SECRET === 'dev-only-change-me'){
      throw new Error('JWT_SECRET is still set to the development default - refusing to start in production.')
    }
  }


  return env;
}


export const env = getEnv();