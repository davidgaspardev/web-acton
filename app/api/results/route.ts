import EvoApi from "@/app/helpers/api/evo";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const resultCreated = await prisma.results.create({
      data,
    });

    const user = await prisma.users.findUnique({
      where: {
        id: resultCreated.userId,
      },
      include: {
        branch: true,
      },
    });

    if (user && user.prospectId && user.branch) {
      const evoApi = EvoApi.getInstance();

      await evoApi.updateProspectByIdNameAndEmail(
        user.prospectId,
        user.fullname,
        user.email || "",
        {
          notes: `Acton produto: ${resultCreated.methodology} | Fase ${resultCreated.stage} - Nível ${resultCreated.level} (id: ${resultCreated.id})`,
        },
        {
          username: user.branch.evoDns,
          password: user.branch.evoToken,
        }
      );
    }

    return NextResponse.json({
      data: resultCreated,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(e, { status: 500 });
  }
}
