import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

export const sql = neon(process.env.DATABASE_URL!);

export const pool = {
  query: async (query: TemplateStringsArray, ...params: any[]) => {
    return await sql(query, ...params);
  }
};
