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

export async function POST(req: Request): Promise<Response> {
  try {
    const { skills } = await req.json();
    const inputValues = skillFeatures.map(skill => skillMapping[skills[skill]] || 0);

    return await new Promise<Response>((resolve) => {
      exec(
        `python3 backend/predict.py ${inputValues.join(" ")}`,
        (error, stdout, stderr) => {
          if (error) {
            console.error("Python Error:", stderr);
            resolve(NextResponse.json({ error: stderr }, { status: 500 }));
            return;
          }

          try {
            const jsonResponse = JSON.parse(stdout.trim());
            resolve(NextResponse.json(jsonResponse, { status: 200 }));
          } catch (parseError) {
            console.error("Invalid JSON Response:", stdout);
            resolve(NextResponse.json({ error: "Invalid JSON from backend" }, { status: 500 }));
          }
        }
      );
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}