import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request:NextRequest) {
    try {
        const branches = await prisma.branches.findMany({
            orderBy: {
                name: "asc"
            },
        });

        return NextResponse.json({
            data: branches,
        });
    } catch (e) {
        return NextResponse.json(e, { status: 500 });
    }
}