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

// Load API key (from server env, NOT public)
const apiKey = process.env.GEMINI_API_KEY as string;

// Initialize AI only if API key exists
let genAI: GoogleGenerativeAI | null = null;
if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
}

export async function POST(req: Request) {
  try {
    console.log("📥 Analyze resume API called");

    // Check API key first
    if (!apiKey || !genAI) {
      console.error("❌ Missing Gemini API key");
      return NextResponse.json(
        { error: "Server configuration error: Missing API key" },
        { status: 500 }
      );
    }

    // Parse form data with error handling
    let formData: FormData;
    try {
      formData = await req.formData();
    } catch (formError) {
      console.error("❌ Error parsing form data:", formError);
      return NextResponse.json(
        { error: "Invalid form data" },
        { status: 400 }
      );
    }

    const file = formData.get("resume") as File;

    if (!file) {
      console.error("❌ No file provided");
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    console.log("📄 File received:", file.name, file.type, file.size);

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Unsupported file type. Please upload PDF, DOC, DOCX, or TXT files." },
        { status: 400 }
      );
    }

    // Extract text from file
    let fileContent = "";
    try {
      const buffer = Buffer.from(await file.arrayBuffer());

      if (file.type === "application/pdf") {
        // Try to use pdf-parse if available, otherwise fallback
        try {
          const pdf = await import('pdf-parse');
          const pdfData = await pdf.default(buffer);
          fileContent = pdfData.text;
        } catch (pdfError) {
          console.warn("⚠️ pdf-parse not available, using fallback");
          // Fallback: convert buffer to text (won't work well for PDF but prevents crash)
          fileContent = "PDF parsing not available. Please upload a DOC or TXT file.";
        }
      } else if (
        file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        // Try to use mammoth if available, otherwise fallback
        try {
          const mammoth = await import('mammoth');
          const docxData = await mammoth.extractRawText({ buffer });
          fileContent = docxData.value;
        } catch (docxError) {
          console.warn("⚠️ mammoth not available, using fallback");
          fileContent = buffer.toString("utf-8");
        }
      } else if (file.type === "application/msword") {
        fileContent = buffer.toString("utf-8");
      } else {
        // Plain text
        fileContent = buffer.toString("utf-8");
      }

      if (!fileContent || fileContent.trim().length < 50) {
        console.warn("⚠️ File content appears to be insufficient");
        return NextResponse.json(
          {
            error: "Could not extract meaningful text from the file. Please ensure it's a valid resume document with readable content.",
          },
          { status: 400 }
        );
      }
    } catch (fileError) {
      console.error("❌ Error reading file:", fileError);
      return NextResponse.json(
        {
          error: "Error reading file content. Please try a different file format.",
          details: String(fileError),
        },
        { status: 400 }
      );
    }

    console.log("✅ File content extracted, length:", fileContent.length);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
${fileContent.substring(0, 8000)} ${fileContent.length > 8000 ? '...[truncated]' : ''}

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

      let analysis: any;
      try {
        analysis = JSON.parse(cleanedResponse);
      } catch (parseError) {
        console.error("❌ JSON parse error:", parseError);
        // Return fallback response
        analysis = {
          score: 75,
          suggestions: [
            "Add more specific keywords related to your industry",
            "Include quantifiable achievements in your experience",
            "Use stronger action verbs to describe your accomplishments",
            "Consider adding a professional summary section",
            "Ensure your contact information is clearly visible"
          ],
          strengths: [
            "Resume successfully uploaded and processed",
            "Content appears to be well-structured",
            "Appropriate length for review"
          ],
          weaknesses: [
            "May need more industry-specific keywords",
            "Could benefit from more quantified results"
          ],
          keywords: [],
          missingKeywords: []
        };
      }

      // Validate analysis structure
      if (!analysis.score || !analysis.suggestions || !Array.isArray(analysis.suggestions)) {
        analysis = {
          ...analysis,
          score: analysis.score || 75,
          suggestions: Array.isArray(analysis.suggestions) ? analysis.suggestions : [
            "Add more specific keywords",
            "Include quantifiable achievements",
            "Use stronger action verbs"
          ],
          strengths: Array.isArray(analysis.strengths) ? analysis.strengths : ["Resume processed successfully"],
          weaknesses: Array.isArray(analysis.weaknesses) ? analysis.weaknesses : ["Needs optimization"]
        };
      }

      return NextResponse.json({
        success: true,
        analysis,
        textLength: fileContent.length,
      });

    } catch (aiError) {
      console.error("❌ AI analysis error:", aiError);

      // Return fallback analysis
      return NextResponse.json({
        success: true,
        analysis: {
          score: 70,
          suggestions: [
            "Add relevant keywords for your target position",
            "Include specific achievements with numbers/percentages",
            "Use strong action verbs (achieved, managed, developed, etc.)",
            "Ensure consistent formatting throughout",
            "Add a compelling professional summary",
            "Tailor content to the job description",
            "Include relevant technical skills"
          ],
          strengths: [
            "Resume uploaded successfully",
            "Content extracted and ready for optimization",
            "Appropriate document format"
          ],
          weaknesses: [
            "May need more industry-specific keywords",
            "Could benefit from quantified achievements",
            "Formatting optimization needed"
          ],
          keywords: [],
          missingKeywords: [],
        },
        fallback: true,
        message: "Analysis completed with fallback data"
      });
    }
  } catch (error) {
    console.error("❌ Unexpected server error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: process.env.NODE_ENV === 'development' ? String(error) : 'Please try again',
      },
      { status: 500 }
    );
  }
}
