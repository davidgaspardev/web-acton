import { Nullable } from "@/helpers/types";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    if (
      Object.keys(data).length !== 2 ||
      typeof data.latitude === "number" ||
      typeof data.longitude === "number"
    ) {
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }

    const { latitude, longitude } = data as { latitude: number; longitude: number };

    const branches = await prisma.branches.findMany({
      orderBy: {
        name: "asc",
      },
    });

    const nearbyBranch = branches.reduce(
      (nearbyBranch, branch) => {
        const distance = getDistanceBetweenCoordinates(
          latitude,
          longitude,
          branch.latitude.toNumber(),
          branch.longitude.toNumber()
        );

        if (distance < nearbyBranch.distance) {
          return { distance, branch };
        }

        return nearbyBranch;
      },
      { distance: Infinity, branch: null } as {
        distance: number;
        branch: Nullable<any>;
      }
    );

    return NextResponse.json({
      data: nearbyBranch.branch,
    });
  } catch (e) {
    return NextResponse.json(e, { status: 500 });
  }
}

function getDistanceBetweenCoordinates(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  const deltaX = x1 - x2;
  const deltaY = y1 - y2;

  const distance = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));

  return distance;
}
