import { DEBUG_MODE, JWT_SECRET_KEY } from "@/helpers/env";
import prisma from "@/lib/prisma";
import { verify } from "jsonwebtoken";
import { NextResponse } from "next/server";

type PathData = {
  params: {
    userId: string;
  };
};

export async function GET(request: Request, pathData: PathData) {
  const { userId: id } = pathData.params;

  try {
    const authorization = request.headers.get("Authorization");
    if (!authorization) {
      return new Response(undefined, { status: 401 });
    }

    const token = authorization.split(" ")[1];

    const payload = verify(token, JWT_SECRET_KEY);

    if (DEBUG_MODE) {
      console.log("Token payload:", payload);
    }

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
