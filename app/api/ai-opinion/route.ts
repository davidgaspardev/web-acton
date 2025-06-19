
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { generateAiOpinionWithNode } from "@/helpers/artificial_intelligence/generate_opinion_with_node";


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const quizzes = body.quizzes;
    const client_name = body.client_name;

    if (!quizzes || !client_name) {
      return NextResponse.json(
        { error: "Missing required fields: quizzes and client_name" },
        { status: 400 }
      );
    }

    const baseDir = path.join(process.cwd(), "helpers", "artificial_intelligence", "base_documents");
    const result = await generateAiOpinionWithNode(quizzes, client_name, baseDir);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
