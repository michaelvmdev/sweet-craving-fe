import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const featured = searchParams.get("featured");

  const conditions: string[] = ["p.product_active = TRUE"];
  const params: unknown[] = [];

  if (category) {
    params.push(category);
    conditions.push(`c.category_slug = $${params.length}`);
  }
  if (featured === "true") {
    conditions.push("p.featured = TRUE");
  }

  const where = `WHERE ${conditions.join(" AND ")}`;

  const { rows } = await pool.query(
    `SELECT
       p.product_id                                                          AS id,
       p.product_name                                                        AS name,
       p.product_summary                                                     AS summary,
       p.product_unit_price                                                  AS price,
       p.product_promotional_price                                           AS promotional_price,
       c.category_slug,
       c.category_name,
       c.category_icon,
       c.sort_order                                                          AS category_order,
       p.featured,
       p.product_slug                                                        AS slug,
       p.sort_order,
       (
         SELECT COALESCE(array_agg(url_image ORDER BY sort_order), ARRAY[]::text[])
         FROM   product_images
         WHERE  product_id = p.product_id
       )                                                                     AS images,
       (
         SELECT COALESCE(array_agg(size_label ORDER BY sort_order), ARRAY[]::text[])
         FROM   product_sizes
         WHERE  product_id = p.product_id
       )                                                                     AS sizes
     FROM products p
     JOIN categories c ON c.category_id = p.category_id
     ${where}
     ORDER BY c.sort_order, p.sort_order`,
    params
  );

  return NextResponse.json(rows);
}
