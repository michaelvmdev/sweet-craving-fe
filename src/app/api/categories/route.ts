import { NextResponse } from "next/server";
import path from "path";
import { readFileSync } from "fs";

export async function GET() {
  const filePath = path.join(process.cwd(), "src", "data", "db.json");
  const db = JSON.parse(readFileSync(filePath, "utf8"));
  return NextResponse.json(db.categories);
}
