import { NextResponse } from "next/server";
import path from "path";
import { readFileSync } from "fs";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  featured: boolean;
  available: boolean;
  sizes: string[];
}

interface DB {
  products: Product[];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const featured = searchParams.get("featured");

  const filePath = path.join(process.cwd(), "src", "data", "db.json");
  const db: DB = JSON.parse(readFileSync(filePath, "utf8"));

  let products = db.products.filter((p) => p.available);

  if (category) {
    products = products.filter((p) => p.category === category);
  }

  if (featured === "true") {
    products = products.filter((p) => p.featured);
  }

  return NextResponse.json(products);
}
