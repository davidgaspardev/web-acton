import { DEBUG_MODE } from "@/helpers/env";
import { MetricsInfo } from "@/helpers/types";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const metrics: MetricsInfo<BigInt> =
      await prisma.$queryRaw`SELECT methodology, COUNT(*) AS quantity FROM Results GROUP BY methodology`;

    if (DEBUG_MODE) console.log("metrics:", metrics);

    return NextResponse.json(
      {
        data: metrics.map((metric) => ({
          ...metric,
          quantity: Number(metric.quantity.toString()),
        })),
      },
      { status: 200 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(e, { status: 500 });
  }
}
