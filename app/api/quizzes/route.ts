import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * Add quiz result
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const quizCreated = await prisma.quizzes.create({ data });

    return NextResponse.json({
      data: quizCreated,
    });
  } catch (e) {
    return NextResponse.json(e, { status: 500 });
  }
}

/**
 * Get quizzes by session code
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionCode = searchParams.get("sessionCode");

    if (!sessionCode) {
      return NextResponse.json(
        { message: "Missing sessionCode query param" },
        { status: 400 }
      );
    }

    const quizzes = await prisma.quizzes.findMany({
      where: {
        sessionCode,
      },
      orderBy: {
        date: "asc",
      },
    });

    return NextResponse.json({
      data: quizzes,
    });
  } catch (e) {
    return NextResponse.json(e, { status: 500 });
  }
}
