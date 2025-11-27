// src/config/db.ts
import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config();

// ESTO ES LO ÚNICO QUE NECESITÁS EN 2025 CON NEON + VERCEL
export const sql = neon(process.env.DATABASE_URL!);