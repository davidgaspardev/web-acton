import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const quizzes = body.quizzes;
    const client_name = body.client_name;
    return new Promise((resolve) => {
      const py = spawn("python3", [
        "helpers/artificial_intelligence/generate_opinion.py"
      ]);
      let result = "";
      let error = "";
      py.stdin.write(JSON.stringify({ quizzes, client_name }));
      py.stdin.end();
      py.stdout.on("data", (data) => {
        result += data.toString();
      });
      py.stderr.on("data", (data) => {
        error += data.toString();
      });
      py.on("close", () => {
        if (error) {
          resolve(NextResponse.json({ error }, { status: 500 }));
        } else {
          resolve(NextResponse.json({ result }));
        }
      });
    });
  } catch (e) {
    return NextResponse.json({ error: e?.toString() }, { status: 500 });
  }
}
