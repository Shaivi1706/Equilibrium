// In /app/api/analyze-resume/route.ts or .js
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY as string;
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: Request) {
  try {
    console.log("📥 API route called");
    
    // Check API key
    if (!apiKey) {
      console.error("❌ Missing Gemini API key");
      return NextResponse.json({ error: "Server configuration error: Missing API key" }, { status: 500 });
    }
    
    const formData = await req.formData();
    const file = formData.get("resume") as File;
    
    if (!file) {
      console.error("❌ No file provided");
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    
    console.log("📄 File received:", file.name, file.type, file.size);
    
    // Get file content as text
    let fileContent = "";
    
    try {
      // For simplicity, just convert to text directly
      const buffer = Buffer.from(await file.arrayBuffer());
      fileContent = buffer.toString('utf-8');
      
      // If it's not readable text, let's inform the user
      if (!fileContent || fileContent.length < 10) {
        console.warn("⚠️ File content appears to be binary or empty");
        fileContent = "This appears to be a binary file that couldn't be read as text.";
      }
    } catch (fileError) {
      console.error("❌ Error reading file:", fileError);
      return NextResponse.json({ 
        error: "Error reading file content", 
        details: String(fileError)
      }, { status: 400 });
    }
    
    // Simple metadata extraction
    const metadata = {
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: new Date(file.lastModified).toISOString()
    };
    
    console.log("✅ File content extracted, length:", fileContent.length);
    
    // Use Gemini to analyze the content
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    const prompt = `
      You are an ATS (Applicant Tracking System) evaluator. Analyze the following resume text and:
      1. Provide an ATS compatibility score out of 100.
      2. Suggest 3-5 improvements to make it more ATS-friendly.
      
      Resume Text:
      ${fileContent}
    `;
    
    try {
      const response = await model.generateContent(prompt);
      const aiAnalysis = await response.response.text();
      
      return NextResponse.json({ 
        aiAnalysis,
        metadata,
        textContent: fileContent
      });
    } catch (aiError) {
      console.error("❌ AI analysis error:", aiError);
      return NextResponse.json({ 
        error: "Error during AI analysis", 
        details: String(aiError)
      }, { status: 500 });
    }
  } catch (error) {
    console.error("❌ Unexpected server error:", error);
    return NextResponse.json({ 
      error: "Internal Server Error", 
      details: String(error)
    }, { status: 500 });
  }
}