import { NextResponse } from "next/server";
import { exec } from "child_process";

export async function GET() {
  return new Promise((resolve) => {
    exec(
      "python3 -c \"import sys; import json; print(json.dumps({'status': 'ok', 'python_version': sys.version}))\"",
      (error, stdout, stderr) => {
        if (error) {
          console.error("Python Error:", stderr);
          resolve(NextResponse.json({ error: stderr, stdout: stdout }, { status: 500 }));
          return;
        }
        
        try {
          const jsonResponse = JSON.parse(stdout.trim());
          resolve(NextResponse.json(jsonResponse, { status: 200 }));
        } catch (parseError) {
          resolve(NextResponse.json({ 
            error: "Invalid JSON from Python", 
            raw_output: stdout,
            parse_error: String(parseError)
          }, { status: 500 }));
        }
      }
    );
  });
}