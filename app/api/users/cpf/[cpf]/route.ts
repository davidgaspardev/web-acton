import { DEBUG_MODE, JWT_SECRET_KEY } from "@/helpers/env";
import prisma from "@/lib/prisma";
import { verify } from "jsonwebtoken";
import { NextResponse } from "next/server";

type PathData = {
  params: {
    cpf: string;
  };
};

export async function GET(request: Request, pathData: PathData) {
  const { cpf: cpf } = pathData.params;

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

    const user = await prisma.users.findFirst({
      where: {
        cpf,
      },
      include: {
        results: true,
      },
    });


    return NextResponse.json({
      data: user,
    });
  } catch (e) {
    return NextResponse.json(e, { status: 500 });
  }
}
