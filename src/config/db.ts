import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config();

const sql = neon(process.env.DATABASE_URL!);

export const pool = {
  query: async (text: string, params?: any[]) => {
    const result = await sql`${text}`;  // Neon maneja params en template, pero para simple usamos esto
    return result;  // devuelve array directo
  }
};