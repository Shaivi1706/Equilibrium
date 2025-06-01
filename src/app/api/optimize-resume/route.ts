// /app/api/optimize-resume/route.ts
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import pdf from 'pdf-parse';
import mammoth from 'mammoth';

// Use server-only environment variable (remove NEXT_PUBLIC_ prefix)
const apiKey = process.env.GEMINI_API_KEY as string;
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: Request) {
  try {
    console.log("🚀 Optimize resume API called");

    if (!apiKey) {
      return NextResponse.json({ 
        error: "Server configuration error: Missing API key" 
      }, { status: 500 });
    }

    const formData = await req.formData();
    const file = formData.get("resume") as File;
    const analysisDataStr = formData.get("analysisData") as string;

    if (!file || !analysisDataStr) {
      return NextResponse.json({ 
        error: "Missing file or analysis data" 
      }, { status: 400 });
    }

    const analysisData = JSON.parse(analysisDataStr);

    // Extract text from file (same logic as analyze)
    let fileContent = "";
    try {
      const buffer = Buffer.from(await file.arrayBuffer());
      
      if (file.type === 'application/pdf') {
        const pdfData = await pdf(buffer);
        fileContent = pdfData.text;
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const docxData = await mammoth.extractRawText({ buffer });
        fileContent = docxData.value;
      } else if (file.type === 'application/msword') {
        // For older .doc files, you might need additional parsing
        fileContent = buffer.toString('utf-8');
      } else {
        // Fallback for text files
        fileContent = buffer.toString('utf-8');
      }

      if (!fileContent || fileContent.trim().length < 50) {
        return NextResponse.json({
          error: "Could not extract meaningful text from the file."
        }, { status: 400 });
      }

    } catch (fileError) {
      console.error("❌ Error reading file:", fileError);
      return NextResponse.json({
        error: "Error reading file content",
        details: String(fileError)
      }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    const optimizationPrompt = `
You are a professional resume writer and career coach. Based on the following resume analysis, rewrite and optimize the resume for maximum ATS compatibility and impact.

Original Resume:
${fileContent}

Analysis Results:
- Current Score: ${analysisData.score}/100
- Suggestions: ${analysisData.suggestions?.join(', ')}
- Weaknesses: ${analysisData.weaknesses?.join(', ')}

Please provide a JSON response with:
{
  "content": "<optimized resume text with proper formatting>",
  "improvements": [<array of specific improvements made>],
  "newScore": <estimated new score>
}

Focus on:
1. Adding relevant keywords naturally
2. Using strong action verbs
3. Quantifying achievements
4. Improving formatting for ATS
5. Enhancing professional summary
6. Optimizing skills section
7. Improving work experience descriptions

Return ONLY the JSON object.
`;

    try {
      const response = await model.generateContent(optimizationPrompt);
      const aiResponse = await response.response.text();
      
      // Clean and parse JSON response
      let cleanedResponse = aiResponse.trim();
      if (cleanedResponse.startsWith('```json')) {
        cleanedResponse = cleanedResponse.replace(/```json\n?/, '').replace(/\n?```$/, '');
      }
      if (cleanedResponse.startsWith('```')) {
        cleanedResponse = cleanedResponse.replace(/```\n?/, '').replace(/\n?```$/, '');
      }

      const optimized = JSON.parse(cleanedResponse);
      
      return NextResponse.json({
        success: true,
        optimized: optimized
      });
      
    } catch (aiError) {
      console.error("❌ AI optimization error:", aiError);
      return NextResponse.json({
        error: "Error during resume optimization",
        details: String(aiError)
      }, { status: 500 });
    }

  } catch (error) {
    console.error("❌ Unexpected optimization error:", error);
    return NextResponse.json({
      error: "Internal Server Error",
      details: String(error)
    }, { status: 500 });
  }
}