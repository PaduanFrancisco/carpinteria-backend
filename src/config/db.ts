import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config();

const sql = neon(process.env.DATABASE_URL!);

export const pool = {
  query: async (query: string, params: any[] = []) => {
    return await sql`${query}` as any;
  }
};