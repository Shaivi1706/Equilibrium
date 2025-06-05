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
  return new NextResponse('Page is working');
}

export async function POST(req: Request) {
    
    try {
        const { skills } = await req.json();
        const inputValues = skillFeatures.map(skill => skillMapping[skills[skill]] || 0);

        return new Promise((resolve) => {
            exec(
                `python3 backend/predict.py ${inputValues.join(" ")}`,
                (error: any, stdout: any, stderr: any) => {
                    if (error) {
                        console.error("Python Error:", stderr);
                        resolve(NextResponse.json({ error: stderr }, { status: 500 }));
                        return;
                    }
        
                    try {
                        const jsonResponse = JSON.parse(stdout.trim()); // Ensure valid JSON
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
