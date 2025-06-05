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
      console.log("📦 Buffer created, size:", buffer.length);

      if (file.type === "application/pdf") {
        console.log("🔍 Processing PDF file...");
        try {
          // Dynamic import to handle both CommonJS and ES modules
          const pdfParse = await import('pdf-parse');
          const pdfData = await (pdfParse.default || pdfParse)(buffer);
          fileContent = pdfData.text;
          console.log("✅ PDF parsed successfully, text length:", fileContent.length);
        } catch (pdfError) {
          console.error("❌ PDF parsing failed:", pdfError);
          // More detailed error for PDF parsing failure
          return NextResponse.json(
            { 
              error: "Could not extract text from PDF. Please ensure it's a text-based PDF (not a scanned image) or try uploading a DOC/DOCX file instead.",
              details: "PDF parsing library error"
            },
            { status: 400 }
          );
        }
      } else if (
        file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        console.log("🔍 Processing DOCX file...");
        try {
          const mammoth = await import('mammoth');
          const docxData = await mammoth.extractRawText({ buffer });
          fileContent = docxData.value;
          console.log("✅ DOCX parsed successfully, text length:", fileContent.length);
        } catch (docxError) {
          console.error("❌ DOCX parsing failed:", docxError);
          // Try fallback for DOCX
          try {
            fileContent = buffer.toString("utf-8");
            console.log("⚠️ Used fallback DOCX parsing");
          } catch (fallbackError) {
            return NextResponse.json(
              { 
                error: "Could not extract text from DOCX file. Please try uploading a plain text or PDF file.",
                details: "DOCX parsing failed"
              },
              { status: 400 }
            );
          }
        }
      } else if (file.type === "application/msword") {
        console.log("🔍 Processing DOC file...");
        fileContent = buffer.toString("utf-8");
      } else {
        console.log("🔍 Processing text file...");
        fileContent = buffer.toString("utf-8");
      }

      // Debug: Show extracted content preview
      console.log("📝 Extracted content preview:", fileContent.substring(0, 200));
      console.log("📏 Total extracted content length:", fileContent.length);

      if (!fileContent || fileContent.trim().length < 50) {
        console.warn("⚠️ File content appears to be insufficient, length:", fileContent.length);
        return NextResponse.json(
          {
            error: "Could not extract meaningful text from the file. The file might be:",
            suggestions: [
              "A scanned PDF (image-based) - try a text-based PDF",
              "An encrypted or protected document",
              "Corrupted or in an unsupported format",
              "Try uploading a plain text (.txt) or Word (.docx) version"
            ]
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

    console.log("✅ File content extracted successfully, proceeding with AI analysis");

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
You are an expert ATS (Applicant Tracking System) evaluator and resume optimization specialist. 

Analyze the following resume text carefully and provide a detailed, specific analysis based on the actual content provided.

IMPORTANT: Base your analysis entirely on the resume content below. Do not use generic responses.

Resume Content to Analyze:
${fileContent}

Provide a JSON response with this exact structure:
{
  "score": <number between 0-100 based on actual content>,
  "strengths": [<array of 3-5 specific strengths found in THIS resume>],
  "suggestions": [<array of 5-7 specific, actionable improvements based on what you see>],
  "weaknesses": [<array of 3-5 specific weaknesses in THIS resume>],
  "keywords": [<array of important keywords actually found in the resume>],
  "missingKeywords": [<array of relevant keywords that should be added based on the role/industry>]
}

Focus your analysis on:
1. ATS compatibility (formatting, keywords, structure)
2. Content quality and relevance  
3. Professional presentation
4. Skills and experience highlighting
5. Action verbs and quantifiable achievements
6. Industry-specific keywords present/missing
7. Overall resume effectiveness

Be specific and reference actual content from the resume. Return ONLY the JSON object.
`;

    try {
      console.log("🤖 Sending to AI for analysis...");
      const response = await model.generateContent(prompt);
      const aiResponse = await response.response.text();
      
      console.log("🤖 AI Response received, length:", aiResponse.length);
      console.log("🤖 AI Response preview:", aiResponse.substring(0, 200));

      let cleanedResponse = aiResponse.trim();
      if (cleanedResponse.startsWith("```json")) {
        cleanedResponse = cleanedResponse.replace(/```json\n?/, "").replace(/\n?```$/, "");
      } else if (cleanedResponse.startsWith("```")) {
        cleanedResponse = cleanedResponse.replace(/```\n?/, "").replace(/\n?```$/, "");
      }

      let analysis: any;
      try {
        analysis = JSON.parse(cleanedResponse);
        console.log("✅ AI analysis parsed successfully");
      } catch (parseError) {
        console.error("❌ JSON parse error:", parseError);
        console.error("❌ Failed to parse AI response:", cleanedResponse.substring(0, 500));
        
        // Only use fallback if AI completely fails
        analysis = {
          score: 70,
          suggestions: [
            "Resume processed but detailed analysis unavailable",
            "Add more specific keywords related to your industry",
            "Include quantifiable achievements in your experience",
            "Use stronger action verbs to describe accomplishments",
            "Consider adding a professional summary section"
          ],
          strengths: [
            "Resume successfully uploaded and processed",
            "Content extracted for analysis"
          ],
          weaknesses: [
            "Detailed analysis temporarily unavailable"
          ],
          keywords: [],
          missingKeywords: [],
          note: "AI analysis failed, showing basic feedback"
        };
      }

      // Validate analysis structure
      if (!analysis.score || !analysis.suggestions || !Array.isArray(analysis.suggestions)) {
        console.warn("⚠️ Incomplete analysis structure, filling gaps");
        analysis = {
          ...analysis,
          score: analysis.score || 70,
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
        debug: {
          fileSize: file.size,
          fileName: file.name,
          contentPreview: fileContent.substring(0, 100)
        }
      });

    } catch (aiError) {
      console.error("❌ AI analysis error:", aiError);

      // Return analysis based on extracted content instead of generic fallback
      const hasContent = fileContent.length > 100;
      const contentWords = fileContent.toLowerCase().split(/\s+/);
      const commonSkills = ['javascript', 'python', 'java', 'react', 'node', 'sql', 'aws', 'docker'];
      const foundSkills = commonSkills.filter(skill => contentWords.includes(skill));

      return NextResponse.json({
        success: true,
        analysis: {
          score: hasContent ? 75 : 60,
          suggestions: [
            "Add more quantifiable achievements with specific numbers",
            "Include relevant technical keywords for your industry",
            "Use stronger action verbs (achieved, managed, developed, etc.)",
            "Ensure consistent formatting throughout",
            "Add a compelling professional summary",
            "Tailor content to specific job descriptions",
            "Include relevant certifications or training"
          ],
          strengths: [
            hasContent ? "Resume content successfully extracted" : "File uploaded successfully",
            foundSkills.length > 0 ? `Technical skills identified: ${foundSkills.join(', ')}` : "Standard resume structure",
            "Ready for optimization process"
          ],
          weaknesses: [
            !hasContent ? "Limited content extracted from file" : "Could benefit from more quantified achievements",
            "May need more industry-specific keywords",
            "Formatting could be optimized for ATS systems"
          ],
          keywords: foundSkills,
          missingKeywords: [],
        },
        fallback: true,
        message: "Analysis completed with content-based fallback",
        textLength: fileContent.length
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