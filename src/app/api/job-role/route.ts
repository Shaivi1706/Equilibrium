// /app/api/job-role/route.ts
import { NextResponse } from "next/server";
import { exec } from "child_process";

const skillMapping: Record<string, number> = {
    "Not Interested": 0, "Poor": 1, "Beginner": 2, "Average": 3,
    "Intermediate": 4, "Excellent": 5, "Professional": 6
};

const skillFeatures = [
    "Database Fundamentals", "Computer Architecture", "Distributed Computing Systems", "Cyber Security",
    "Networking", "Software Development", "Programming Skills", "Project Management",
    "Computer Forensics Fundamentals", "Technical Communication", "AI ML", "Software Engineering",
    "Business Analysis", "Communication skills", "Data Science", "Troubleshooting skills", "Graphics Designing"
];

export async function GET() {
  return new Response("Page is working", {
    status: 200,
    headers: { "Content-Type": "text/plain" }
  });
}

export async function POST(req: Request): Promise<Response> {
    
    try {
        const { skills } = await req.json();
        const inputValues = skillFeatures.map(skill => skillMapping[skills[skill]] || 0);

        return new Promise((resolve) => {
            exec(
                `python3 backend/predict.py ${inputValues.join(" ")}`,
                (error: any, stdout: any, stderr: any) => {
                    if (error) {
                        console.error("Python Error:", stderr);
                        resolve(new Response(JSON.stringify({ error: stderr }), {
                        status: 500,
                        headers: { "Content-Type": "application/json" }
                        }));
                        return;
                    }
        
                    try {
            const jsonResponse = JSON.parse(stdout.trim());
            resolve(new Response(JSON.stringify(jsonResponse), {
              status: 200,
              headers: { "Content-Type": "application/json" }
            }));
          } catch (parseError) {
            console.error("Invalid JSON Response:", stdout);
            resolve(new Response(JSON.stringify({ error: "Invalid JSON from backend" }), {
              status: 500,
              headers: { "Content-Type": "application/json" }
            }));
          }
        }
      );
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
