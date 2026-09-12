import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  const { rows } = await pool.query(`
    SELECT
      category_slug AS id,
      category_name AS name,
      category_icon AS icon,
      sort_order
    FROM categories
    WHERE category_active = TRUE
    ORDER BY sort_order
  `);
  return NextResponse.json(rows);
}
