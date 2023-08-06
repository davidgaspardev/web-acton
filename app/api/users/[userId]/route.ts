import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

type PathData = {
  params: {
    userId: string;
  };
};

export async function GET(_: Request, pathData: PathData) {
  const { userId: id } = pathData.params;

  try {
    const user = await prisma.users.findUnique({
      where: {
        id,
      },
    });

    return NextResponse.json({
      data: user,
    });
  } catch (e) {
    return NextResponse.json(e, { status: 500 });
  }
}

export async function PUT(request: Request, pathData: PathData) {
  const { userId: id } = pathData.params;

  try {
    const data = await request.json();

    const userUpdated = await prisma.users.update({
      where: {
        id,
      },
      data,
    });

    return NextResponse.json({
      data: userUpdated,
    });
  } catch (e) {
    return NextResponse.json(e, { status: 500 });
  }
}

export async function DELETE(_: Request, pathData: PathData) {
  const { userId: id } = pathData.params;

  try {
    const userDeleted = await prisma.users.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(
      {
        data: userDeleted,
      },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  } catch (e) {
    return NextResponse.json(e, { status: 500 });
  }
}
