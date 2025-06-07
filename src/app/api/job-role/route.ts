// // // // /app/api/job-role/route.ts
// // // import { NextResponse } from "next/server";
// // // import { exec } from "child_process";

// // // const skillMapping: Record<string, number> = {
// // //     "Not Interested": 0, "Poor": 1, "Beginner": 2, "Average": 3,
// // //     "Intermediate": 4, "Excellent": 5, "Professional": 6
// // // };

// // // const skillFeatures = [
// // //     "Database Fundamentals", "Computer Architecture", "Distributed Computing Systems", "Cyber Security",
// // //     "Networking", "Software Development", "Programming Skills", "Project Management",
// // //     "Computer Forensics Fundamentals", "Technical Communication", "AI ML", "Software Engineering",
// // //     "Business Analysis", "Communication skills", "Data Science", "Troubleshooting skills", "Graphics Designing"
// // // ];

// // // export async function GET() {
// // //   return new Response("Page is working", {
// // //     status: 200,
// // //     headers: { "Content-Type": "text/plain" }
// // //   });
// // // }

// // // export async function POST(req: Request): Promise<Response> {
    
// // //     try {
// // //         const { skills } = await req.json();
// // //         const inputValues = skillFeatures.map(skill => skillMapping[skills[skill]] || 0);

// // //         return new Promise((resolve) => {
// // //             exec(
// // //                 `python3 backend/predict.py ${inputValues.join(" ")}`,
// // //                 (error: any, stdout: any, stderr: any) => {
// // //                     if (error) {
// // //                         console.error("Python Error:", stderr);
// // //                         resolve(new Response(JSON.stringify({ error: stderr }), {
// // //                         status: 500,
// // //                         headers: { "Content-Type": "application/json" }
// // //                         }));
// // //                         return;
// // //                     }
        
// // //                     try {
// // //             const jsonResponse = JSON.parse(stdout.trim());
// // //             resolve(new Response(JSON.stringify(jsonResponse), {
// // //               status: 200,
// // //               headers: { "Content-Type": "application/json" }
// // //             }));
// // //           } catch (parseError) {
// // //             console.error("Invalid JSON Response:", stdout);
// // //             resolve(new Response(JSON.stringify({ error: "Invalid JSON from backend" }), {
// // //               status: 500,
// // //               headers: { "Content-Type": "application/json" }
// // //             }));
// // //           }
// // //         }
// // //       );
// // //     });

// // //   } catch (error: any) {
// // //     return new Response(JSON.stringify({ error: error.message }), {
// // //       status: 500,
// // //       headers: { "Content-Type": "application/json" }
// // //     });
// // //   }
// // // }

// // // /app/api/job-role/route.ts
// // import { NextResponse } from "next/server";

// // const skillMapping: Record<string, number> = {
// //     "Not Interested": 0, "Poor": 1, "Beginner": 2, "Average": 3,
// //     "Intermediate": 4, "Excellent": 5, "Professional": 6
// // };

// // const skillFeatures = [
// //     "Database Fundamentals", "Computer Architecture", "Distributed Computing Systems", "Cyber Security",
// //     "Networking", "Software Development", "Programming Skills", "Project Management",
// //     "Computer Forensics Fundamentals", "Technical Communication", "AI ML", "Software Engineering",
// //     "Business Analysis", "Communication skills", "Data Science", "Troubleshooting skills", "Graphics Designing"
// // ];

// // export async function GET() {
// //   return new Response("Page is working", {
// //     status: 200,
// //     headers: { "Content-Type": "text/plain" }
// //   });
// // }

// // export async function POST(req: Request): Promise<Response> {
    
// //     try {
// //         const { skills } = await req.json();
// //         const inputValues = skillFeatures.map(skill => skillMapping[skills[skill]] || 0);

// //         //python3 backend/predict.py
// //         return new Promise((resolve) => {
// //             fetch("https://job-role-model.onrender.com/predict", {
// //                 method: "POST",
// //                 headers: { "Content-Type": "application/json" },
// //                 body: JSON.stringify({ input: inputValues })
// //             })
// //             .then(res => res.json())
// //             .then(jsonResponse => {
// //                 resolve(new Response(JSON.stringify(jsonResponse), {
// //                     status: 200,
// //                     headers: { "Content-Type": "application/json" }
// //                 }));
// //             })
// //             .catch(fetchError => {
// //                 console.error("Model API error:", fetchError);
// //                 resolve(new Response(JSON.stringify({ error: "Failed to get prediction from external model API" }), {
// //                     status: 500,
// //                     headers: { "Content-Type": "application/json" }
// //                 }));
// //             });
// //         });

// //     } catch (error: any) {
// //         return new Response(JSON.stringify({ error: error.message }), {
// //             status: 500,
// //             headers: { "Content-Type": "application/json" }
// //         });
// //     }
// // }

// // /app/api/job-role/route.ts
// import { NextResponse } from "next/server";

// const skillMapping: Record<string, number> = {
//   "Not Interested": 0, "Poor": 1, "Beginner": 2, "Average": 3,
//   "Intermediate": 4, "Excellent": 5, "Professional": 6
// };

// const skillFeatures = [
//   "Database Fundamentals", "Computer Architecture", "Distributed Computing Systems", "Cyber Security",
//   "Networking", "Software Development", "Programming Skills", "Project Management", 
//   "Computer Forensics Fundamentals", "Technical Communication", "AI ML", "Software Engineering",
//   "Business Analysis", "Communication skills", "Data Science", "Troubleshooting skills", "Graphics Designing"
// ];

// // Simple rule-based prediction as fallback
// function predictRoleLocally(inputValues: number[]): string {
//   const roles = [
//     { name: "Software Developer", weights: [2, 3, 2, 1, 2, 6, 6, 3, 1, 4, 2, 6, 2, 4, 1, 4, 1] },
//     { name: "Data Scientist", weights: [4, 2, 3, 2, 2, 4, 5, 3, 1, 4, 6, 4, 4, 4, 6, 3, 2] },
//     { name: "Cybersecurity Specialist", weights: [3, 4, 3, 6, 5, 3, 4, 3, 6, 4, 2, 3, 2, 4, 2, 5, 1] },
//     { name: "Network Administrator", weights: [4, 5, 4, 4, 6, 2, 3, 4, 3, 4, 1, 3, 3, 4, 2, 6, 1] },
//     { name: "Business Analyst", weights: [3, 1, 2, 1, 2, 2, 2, 6, 1, 6, 2, 2, 6, 6, 4, 3, 2] },
//     { name: "Project Manager", weights: [2, 2, 3, 2, 3, 3, 3, 6, 2, 6, 2, 4, 5, 6, 3, 4, 2] },
//     { name: "Graphics Designer", weights: [1, 1, 1, 1, 1, 2, 2, 4, 1, 5, 1, 2, 3, 5, 2, 2, 6] },
//     { name: "AI/ML Engineer", weights: [4, 4, 4, 2, 3, 5, 6, 3, 1, 4, 6, 5, 3, 4, 6, 4, 2] }
//   ];

//   let bestRole = "Software Developer";
//   let bestScore = -1;

//   for (const role of roles) {
//     let score = 0;
//     for (let i = 0; i < inputValues.length && i < role.weights.length; i++) {
//       score += inputValues[i] * role.weights[i];
//     }
    
//     if (score > bestScore) {
//       bestScore = score;
//       bestRole = role.name;
//     }
//   }

//   return bestRole;
// }

// export async function GET() {
//   return new Response("Job Role API is working", {
//     status: 200,
//     headers: { "Content-Type": "text/plain" }
//   });
// }

// export async function POST(req: Request): Promise<Response> {
//   try {
//     const { skills } = await req.json();
    
//     // Convert skills to input values
//     const inputValues = skillFeatures.map(skill => skillMapping[skills[skill]] || 0);
//     const controller = new AbortController();
//     const timeoutId = setTimeout(() => controller.abort(), 10000);
    
//     console.log("Input values:", inputValues);
    
//     // Try external API first
//     try {
//       console.log("Trying external API...");
      
//       const response = await fetch("https://job-role-model.onrender.com/predict", {
//         method: "POST",
//         headers: { 
//           "Content-Type": "application/json",
//           "Accept": "application/json"
//         },
//         body: JSON.stringify({ input: inputValues }),
//       });
//       clearTimeout(timeoutId);
      
//       console.log("External API response status:", response.status);
      
//       if (response.ok) {
//         const apiResult = await response.json();
//         console.log("External API result:", apiResult);
        
//         // Handle different possible response formats
//         let predictedRole;
//         if (apiResult.predicted_role) {
//           predictedRole = apiResult.predicted_role;
//         } else if (apiResult.prediction) {
//           predictedRole = apiResult.prediction;
//         } else if (apiResult.result) {
//           predictedRole = apiResult.result;
//         } else if (typeof apiResult === 'string') {
//           predictedRole = apiResult;
//         } else {
//           throw new Error("Unknown API response format");
//         }
        
//         return NextResponse.json({ predicted_role: predictedRole });
//       } else {
//         throw new Error(`API returned status ${response.status}`);
//       }
      
//     } catch (apiError) {
//       console.error("External API failed:", apiError);
//       console.log("Falling back to local prediction...");
      
//       // Fallback to local prediction
//       const localPrediction = predictRoleLocally(inputValues);
//       console.log("Local prediction:", localPrediction);
      
//       return NextResponse.json({ 
//         predicted_role: localPrediction,
//         source: "local_fallback"
//       });
//     }
    
//   } catch (error: any) {
//     console.error("General error:", error);
//     return NextResponse.json(
//       { error: "Failed to process request: " + error.message },
//       { status: 500 }
//     );
//   }
// }
// /app/api/job-role/route.ts
import { NextResponse } from "next/server";

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

// Simple rule-based prediction as fallback
function predictRoleLocally(inputValues: number[]): string {
  const roles = [
    { name: "Software Developer", weights: [2, 3, 2, 1, 2, 6, 6, 3, 1, 4, 2, 6, 2, 4, 1, 4, 1] },
    { name: "Data Scientist", weights: [4, 2, 3, 2, 2, 4, 5, 3, 1, 4, 6, 4, 4, 4, 6, 3, 2] },
    { name: "Cybersecurity Specialist", weights: [3, 4, 3, 6, 5, 3, 4, 3, 6, 4, 2, 3, 2, 4, 2, 5, 1] },
    { name: "Network Administrator", weights: [4, 5, 4, 4, 6, 2, 3, 4, 3, 4, 1, 3, 3, 4, 2, 6, 1] },
    { name: "Business Analyst", weights: [3, 1, 2, 1, 2, 2, 2, 6, 1, 6, 2, 2, 6, 6, 4, 3, 2] },
    { name: "Project Manager", weights: [2, 2, 3, 2, 3, 3, 3, 6, 2, 6, 2, 4, 5, 6, 3, 4, 2] },
    { name: "Graphics Designer", weights: [1, 1, 1, 1, 1, 2, 2, 4, 1, 5, 1, 2, 3, 5, 2, 2, 6] },
    { name: "AI/ML Engineer", weights: [4, 4, 4, 2, 3, 5, 6, 3, 1, 4, 6, 5, 3, 4, 6, 4, 2] }
  ];

  let bestRole = "Software Developer";
  let bestScore = -1;

  for (const role of roles) {
    let score = 0;
    for (let i = 0; i < inputValues.length && i < role.weights.length; i++) {
      score += inputValues[i] * role.weights[i];
    }
    
    if (score > bestScore) {
      bestScore = score;
      bestRole = role.name;
    }
  }

  return bestRole;
}

export async function GET() {
  return new Response("Job Role API is working", {
    status: 200,
    headers: { "Content-Type": "text/plain" }
  });
}

export async function POST(req: Request): Promise<Response> {
  try {
    const { skills } = await req.json();
    
    // Convert skills to input values
    const inputValues = skillFeatures.map(skill => skillMapping[skills[skill]] || 0);
    
    console.log("Input values:", inputValues);
    
    // Try external API first
    try {
      console.log("Trying external API...");
      
      const response = await fetch("https://job-role-model.onrender.com/predict", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ input: inputValues }),
        timeout: 10000 // 10 second timeout
      });
      
      console.log("External API response status:", response.status);
      
      if (response.ok) {
        const apiResult = await response.json();
        console.log("External API result:", apiResult);
        
        // Handle different possible response formats
        let predictedRole;
        if (apiResult.predicted_role) {
          predictedRole = apiResult.predicted_role;
        } else if (apiResult.prediction) {
          predictedRole = apiResult.prediction;
        } else if (apiResult.result) {
          predictedRole = apiResult.result;
        } else if (typeof apiResult === 'string') {
          predictedRole = apiResult;
        } else {
          throw new Error("Unknown API response format");
        }
        
        return NextResponse.json({ predicted_role: predictedRole });
      } else {
        throw new Error(`API returned status ${response.status}`);
      }
      
    } catch (apiError) {
      console.error("External API failed:", apiError);
      console.log("Falling back to local prediction...");
      
      // Fallback to local prediction
      const localPrediction = predictRoleLocally(inputValues);
      console.log("Local prediction:", localPrediction);
      
      return NextResponse.json({ 
        predicted_role: localPrediction,
        source: "local_fallback"
      });
    }
    
  } catch (error: any) {
    console.error("General error:", error);
    return NextResponse.json(
      { error: "Failed to process request: " + error.message },
      { status: 500 }
    );
  }
}