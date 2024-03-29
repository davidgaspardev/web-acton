import EvoApi from "@/app/helpers/api/evo";
import { UserCreateData } from "@/app/helpers/utils/types";
import {
  DEBUG_MODE,
  EVO_API_ENABLE,
  JWT_SECRET_KEY,
  ORIGINS_ALLOWED,
} from "@/helpers/env";
import prisma from "@/lib/prisma";
import { verify } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

/**
 * Create a new user
 */
export async function POST(request: Request) {
  try {
    if (
      ORIGINS_ALLOWED !== "*" &&
      !ORIGINS_ALLOWED.split(",").includes(request.headers.get("origin")!)
    ) {
      return NextResponse.json({}, { status: 401 });
    }

    const newUser: UserCreateData = await request.json();
    if (EVO_API_ENABLE) {
      const evoApi = EvoApi.getInstance();
      const prospectAlreadyExists = await evoApi.findByEmail(newUser.email);

      if (prospectAlreadyExists) {
        newUser.prospectId =
          prospectAlreadyExists[prospectAlreadyExists.length - 1].idProspect;
      } else {
        await evoApi.createUser(newUser);
      }
    }

    const userCreated = await prisma.users.create({
      data: {
        ...(newUser as any),
      },
    });

    return NextResponse.json({
      data: userCreated,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(e, { status: 500 });
  }
}

/**
 * Get all users
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pageQuery = searchParams.get("page");
    const searchQuery = searchParams.get("search");

    const authorization = request.headers.get("Authorization");
    if (!authorization) {
      return new Response(undefined, { status: 401 });
    }

    const token = authorization.split(" ")[1];

    const payload = verify(token, JWT_SECRET_KEY);

    if (DEBUG_MODE) {
      console.log("Token payload:", payload);
    }

    if (!pageQuery || !Number.isInteger(Number(pageQuery))) {
      return NextResponse.json({ message: "page query invalid" }, { status: 400 });
    }

    const page = Number(pageQuery);
    const pageSize = 100;
    const usersTotal = await prisma.users.count({
      where: searchQuery
        ? {
            fullname: {
              contains: searchQuery,
            },
          }
        : undefined,
    });

    if ((page - 1) * pageSize >= usersTotal) {
      return NextResponse.json({ message: "page not exists" }, { status: 400 });
    }

    const users = await prisma.users.findMany({
      take: pageSize,
      skip: (page - 1) * pageSize,
      where: searchQuery
        ? {
            fullname: {
              contains: searchQuery,
            },
          }
        : undefined,
      include: {
        results: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      total: usersTotal,
      data: users,
    });
  } catch (e) {
    return NextResponse.json(e, { status: 500 });
  }
}
