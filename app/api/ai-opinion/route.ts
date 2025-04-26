import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";

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

    return new Promise((resolve) => {
      // Use path.join to ensure correct path across platforms
      const scriptPath = path.join(
        process.cwd(),
        "helpers",
        "artificial_intelligence",
        "generate_opinion.py"
      );

      const py = spawn("python3", [scriptPath], {
        stdio: ["pipe", "pipe", "pipe"],
        env: { ...process.env, PYTHONUNBUFFERED: "1" }
      });

      let result = "";
      let error = "";

      // Handle process errors
      py.on("error", (err) => {
        console.error("Failed to start Python process:", err);
        resolve(
          NextResponse.json(
            { error: "Failed to start AI opinion generation process" },
            { status: 500 }
          )
        );
      });

      // Write input data
      try {
        py.stdin.write(JSON.stringify({ quizzes, client_name }));
        py.stdin.end();
      } catch (e) {
        console.error("Error writing to Python process:", e);
        resolve(
          NextResponse.json(
            { error: "Error communicating with AI process" },
            { status: 500 }
          )
        );
      }

      // Collect output
      py.stdout.on("data", (data) => {
        result += data.toString();
      });

      py.stderr.on("data", (data) => {
        error += data.toString();
        console.error("Python process error:", data.toString());
      });

      // Handle process completion
      py.on("close", (code) => {
        if (code !== 0) {
          console.error(`Python process exited with code ${code}`);
          resolve(
            NextResponse.json(
              {
                error: error || "AI opinion generation process failed"
              },
              { status: 500 }
            )
          );
          return;
        }

        if (error) {
          resolve(NextResponse.json({ error }, { status: 500 }));
          return;
        }

        if (!result) {
          resolve(
            NextResponse.json(
              { error: "No response from AI process" },
              { status: 500 }
            )
          );
          return;
        }

        resolve(NextResponse.json({ result }));
      });

      // Handle timeout
      setTimeout(() => {
        py.kill();
        resolve(
          NextResponse.json(
            { error: "AI opinion generation timed out" },
            { status: 504 }
          )
        );
      }, 30000); // 30 second timeout
    });
  } catch (e) {
    console.error("AI opinion route error:", e);
    return NextResponse.json(
      { error: e?.toString() || "Unknown error occurred" },
      { status: 500 }
    );
  }
}
