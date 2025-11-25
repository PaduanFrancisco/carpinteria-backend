import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config();

const sql = neon(process.env.DATABASE_URL!);

// Esto es lo que usa todo el mundo en Vercel + Neon 2025
export const pool = {
  query: async (text: string, params?: any[]) => {
    return await sql.query(text, params);
  }
};