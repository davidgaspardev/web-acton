import { createHash } from "crypto";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { sign } from "jsonwebtoken";
import { DEBUG_MODE, JWT_SECRET_KEY } from "@/helpers/env";

export async function GET(request: Request) {
  try {
    const authorization = request.headers.get("Authorization");
    if (!authorization) {
      return new Response(undefined, { status: 401 });
    }

    if (!authorization.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          message: "Authorization header invalid",
        },
        { status: 400 }
      );
    }

    const [username, password] = atob(authorization.split(" ")[1]).split(":");

    const passwordHash = createHash("sha256").update(password).digest("hex");

    if (DEBUG_MODE) {
      console.log("Admin username:", username);
      console.log("Admin password:", password);
      console.log("Admin password hash:", passwordHash);
    }

    // const admin = await prisma.admins
    const admin = await prisma.admins.findUniqueOrThrow({
      where: {
        username,
        password: passwordHash,
      },
    });

    if (admin) {
      const { id, rules } = admin;
      const date = Date.now();
      const jwtPayload = {
        id,
        rules,
        date,
      };

      const token = sign(jwtPayload, JWT_SECRET_KEY, { expiresIn: "2 days" });

      if (DEBUG_MODE) {
        console.log("JWT payload:", jwtPayload);
        console.log("JWT:", token);
      }

      return NextResponse.json(
        {
          token,
        },
        { status: 200 }
      );
    }

    return new Response(undefined, { status: 401 });
  } catch (e) {
    return NextResponse.json(e, { status: 500 });
  }
}
