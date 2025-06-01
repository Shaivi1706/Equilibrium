// // In /app/api/analyze-resume/route.ts or .js
// import { NextResponse } from "next/server";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import pdf from 'pdf-parse'; // npm install pdf-parse
// import mammoth from 'mammoth'; // npm install mammoth

// const apiKey = process.env.GEMINI_API_KEY as string;
// const genAI = new GoogleGenerativeAI(apiKey);

// export async function POST(req: Request) {
//   try {
//     console.log("📥 API route called");
    
//     // Check API key
//     if (!apiKey) {
//       console.error("❌ Missing Gemini API key");
//       return NextResponse.json({ error: "Server configuration error: Missing API key" }, { status: 500 });
//     }
    
//     const formData = await req.formData();
//     const file = formData.get("resume") as File;
    
//     if (!file) {
//       console.error("❌ No file provided");
//       return NextResponse.json({ error: "No file provided" }, { status: 400 });
//     }
    
//     console.log("📄 File received:", file.name, file.type, file.size);
    
//     // Get file content as text
//     let fileContent = "";
    
//     try {
//       // For simplicity, just convert to text directly
//       const buffer = Buffer.from(await file.arrayBuffer());
//       fileContent = buffer.toString('utf-8');
      
//       // If it's not readable text, let's inform the user
//       if (!fileContent || fileContent.length < 10) {
//         console.warn("⚠️ File content appears to be binary or empty");
//         fileContent = "This appears to be a binary file that couldn't be read as text.";
//       }
//     } catch (fileError) {
//       console.error("❌ Error reading file:", fileError);
//       return NextResponse.json({ 
//         error: "Error reading file content", 
//         details: String(fileError)
//       }, { status: 400 });
//     }
    
//     // Simple metadata extraction
//     const metadata = {
//       name: file.name,
//       type: file.type,
//       size: file.size,
//       lastModified: new Date(file.lastModified).toISOString()
//     };
    
//     console.log("✅ File content extracted, length:", fileContent.length);
    
//     // Use Gemini to analyze the content
//     const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
//     const prompt = `
//       You are an ATS (Applicant Tracking System) evaluator. Analyze the following resume text and:
//       1. Provide an ATS compatibility score out of 100.
//       2. Suggest 3-5 improvements to make it more ATS-friendly.
      
//       Resume Text:
//       ${fileContent}
//     `;
    
//     try {
//       const response = await model.generateContent(prompt);
//       const aiAnalysis = await response.response.text();
      
//       return NextResponse.json({ 
//         aiAnalysis,
//         metadata,
//         textContent: fileContent
//       });
//     } catch (aiError) {
//       console.error("❌ AI analysis error:", aiError);
//       return NextResponse.json({ 
//         error: "Error during AI analysis", 
//         details: String(aiError)
//       }, { status: 500 });
//     }
//   } catch (error) {
//     console.error("❌ Unexpected server error:", error);
//     return NextResponse.json({ 
//       error: "Internal Server Error", 
//       details: String(error)
//     }, { status: 500 });
//   }
// }

// /app/api/analyze-resume/route.ts
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import pdf from "pdf-parse"; // npm install pdf-parse
import mammoth from "mammoth"; // npm install mammoth

// Load API key (from server env, NOT public)
const apiKey = process.env.GEMINI_API_KEY as string;
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: Request) {
  try {
    console.log("📥 Analyze resume API called");

    if (!apiKey) {
      console.error("❌ Missing Gemini API key");
      return NextResponse.json(
        { error: "Server configuration error: Missing API key" },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("resume") as File;

    if (!file) {
      console.error("❌ No file provided");
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    console.log("📄 File received:", file.name, file.type, file.size);

    let fileContent = "";
    try {
      const buffer = Buffer.from(await file.arrayBuffer());

      if (file.type === "application/pdf") {
        const pdfData = await pdf(buffer);
        fileContent = pdfData.text;
      } else if (
        file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        const docxData = await mammoth.extractRawText({ buffer });
        fileContent = docxData.value;
      } else if (file.type === "application/msword") {
        fileContent = buffer.toString("utf-8");
      } else {
        fileContent = buffer.toString("utf-8");
      }

      if (!fileContent || fileContent.trim().length < 50) {
        console.warn("⚠️ File content appears to be insufficient");
        return NextResponse.json(
          {
            error:
              "Could not extract meaningful text from the file. Please ensure it's a valid resume document.",
          },
          { status: 400 }
        );
      }
    } catch (fileError) {
      console.error("❌ Error reading file:", fileError);
      return NextResponse.json(
        {
          error:
            "Error reading file content. Please ensure it's a valid document.",
          details: String(fileError),
        },
        { status: 400 }
      );
    }

    console.log("✅ File content extracted, length:", fileContent.length);

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
You are an expert ATS (Applicant Tracking System) evaluator and resume optimization specialist. 

Analyze the following resume text and provide a structured JSON response with the following format:

{
  "score": <number between 0-100>,
  "strengths": [<array of 3-5 specific strengths found in the resume>],
  "suggestions": [<array of 5-7 specific, actionable improvement suggestions>],
  "weaknesses": [<array of 3-5 specific weaknesses or missing elements>],
  "keywords": [<array of important keywords found>],
  "missingKeywords": [<array of common keywords that should be added>]
}

Focus on:
1. ATS compatibility (formatting, keywords, structure)
2. Content quality and relevance
3. Professional presentation
4. Skills and experience highlighting
5. Action verbs and quantifiable achievements

Resume Text:
${fileContent}

Return ONLY the JSON object, no additional text.
`;

    try {
      const response = await model.generateContent(prompt);
      const aiResponse = await response.response.text();

      let cleanedResponse = aiResponse.trim();
      if (cleanedResponse.startsWith("```json")) {
        cleanedResponse = cleanedResponse.replace(/```json\n?/, "").replace(/\n?```$/, "");
      } else if (cleanedResponse.startsWith("```")) {
        cleanedResponse = cleanedResponse.replace(/```\n?/, "").replace(/\n?```$/, "");
      }

      const analysis = JSON.parse(cleanedResponse);

      if (
        !analysis.score ||
        !analysis.suggestions ||
        !Array.isArray(analysis.suggestions)
      ) {
        throw new Error("Invalid AI response structure");
      }

      return NextResponse.json({
        success: true,
        analysis,
        textLength: fileContent.length,
      });
    } catch (aiError) {
      console.error("❌ AI analysis error:", aiError);

      const fallbackResponse = await model.generateContent(prompt);
      const fallbackText = await fallbackResponse.response.text();

      return NextResponse.json({
        success: true,
        analysis: {
          score: 70,
          suggestions: parseSuggestionsFromText(fallbackText),
          strengths: ["Resume uploaded successfully"],
          weaknesses: ["AI analysis needs refinement"],
          keywords: [],
          missingKeywords: [],
        },
        fallback: true,
        rawResponse: fallbackText,
      });
    }
  } catch (error) {
    console.error("❌ Unexpected server error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: String(error),
      },
      { status: 500 }
    );
  }
}

// 🛠️ Helper to parse suggestions in fallback
function parseSuggestionsFromText(text: string): string[] {
  const suggestions: string[] = [];
  const lines = text.split("\n");

  for (const line of lines) {
    const trimmed = line.trim();
    if (/^(\d+\.|\*|\-|\•)\s+/.test(trimmed)) {
      const cleanLine = trimmed.replace(/^(\d+\.|\*|\-|\•)\s+/, "");
      if (cleanLine.length > 10) {
        suggestions.push(cleanLine);
      }
    }
  }

  return suggestions.slice(0, 7);
}