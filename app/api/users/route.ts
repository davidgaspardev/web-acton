import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * Create a new user
 */
export async function POST(request: Request) {
  const data = await request.json();
  const userCreated = await prisma.users.create({
    data,
  });

  return NextResponse.json({
    data: userCreated,
  });
}

/**
 * Get all users
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const pageQuery = searchParams.get("page");

  if (!pageQuery || !Number.isInteger(Number(pageQuery))) {
    return NextResponse.json({ message: "page query invalid" }, { status: 400 });
  }

  const page = Number(pageQuery);
  const pageSize = 100;
  const usersTotal = await prisma.users.count();

  if ((page - 1) * pageSize >= usersTotal) {
    return NextResponse.json({ message: "page not exists" }, { status: 400 });
  }

  const users = await prisma.users.findMany({
    take: pageSize,
    skip: (page - 1) * pageSize,
    include: {
      results: true,
    },
  });

  return NextResponse.json({
    total: usersTotal,
    data: users,
  });
}
