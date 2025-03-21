"use client";
import { useState, useEffect } from "react";
import { FileText, Rocket } from "lucide-react";
import { FileUpload } from "@/components/ui/file-upload";
import { Button } from "@/components/ui/moving-border";

import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY ?? "";

if (!apiKey) {
  console.error("❌ GEMINI API Key is missing! Make sure to add it in .env.local");
}

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

// Function to analyze resume using Gemini API
const analyzeResumeWithAI = async (resumeText: string) => {
  try {
    console.log("🔹 Sending resume text to Gemini AI...");
    const chatSession = model.startChat({ generationConfig, history: [] });
    const result = await chatSession.sendMessage(resumeText);
    return result.response.text();
  } catch (error) {
    console.error("❌ Error analyzing resume with Gemini:", error);
    return "Error analyzing resume.";
  }
};

// Function to parse ATS score from AI analysis text
const parseATSScore = (analysisText: string): number => {
  // Look for patterns like "Score: 75/100" or "ATS compatibility score: 75"
  const scoreRegex = /(?:score|rating)(?:\s*):?\s*(\d+)(?:\s*\/\s*100)?/i;
  const match = analysisText.match(scoreRegex);
  return match ? parseInt(match[1]) : 0;
};

// Function to parse suggestions from AI analysis text
const parseSuggestions = (analysisText: string): string[] => {
  // Look for numbered or bulleted lists of suggestions
  const suggestions: string[] = [];
  
  // Split by newlines and look for list patterns
  const lines = analysisText.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    // Match numbered lists (1. 2. etc) or bullet points (* - •)
    if (/^(\d+\.|\*|\-|\•)\s+/.test(line)) {
      // Clean up the line by removing the list marker
      const cleanLine = line.replace(/^(\d+\.|\*|\-|\•)\s+/, '');
      if (cleanLine.length > 0) {
        suggestions.push(cleanLine);
      }
    }
  }
  
  return suggestions;
};

// Reusable Card components
const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-blue-200 shadow-lg rounded-lg p-6 border border-blue-100">{children}</div>
);

const CardHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-4">{children}</div>
);

const CardTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-xl font-semibold text-gray-800">{children}</h2>
);

const CardContent = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;

const Progress = ({ value, className }: { value: number; className?: string }) => (
  <div className={`w-full bg-gray-200 rounded-full h-4 ${className}`}>
    <div className="bg-blue-600 h-4 rounded-full" style={{ width: `${value}%` }}></div>
  </div>
);

export default function ResumeEnhancement() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [atsScore, setAtsScore] = useState<number | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [metadata, setMetadata] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileUpload = async (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setUploadedFile(file);
      await analyzeResume(file);
    }
  };

  const analyzeResume = async (file: File) => {
    setLoading(true);
    setErrorMessage(null);
    setAtsScore(null);
    setSuggestions([]);
    setMetadata(null);
  
    try {
      console.log("🔹 Sending POST request...");
  
      // Create FormData object
      const formData = new FormData();
      formData.append("resume", file); // Send the actual file, not converted text
  
      const response = await fetch(`/api/analyze-resume`, {
        method: "POST",
        body: formData,
      });
  
      console.log("🔸 Response Status:", response.status);
      if (!response.ok) throw new Error("Failed to analyze resume");
  
      const data = await response.json();
      console.log("✅ API Response:", data);
  
      // Handle the response from the updated backend
      if (data.aiAnalysis) {
        // Parse the AI analysis to extract score and suggestions
        const analysisText = data.aiAnalysis;
        const score = parseATSScore(analysisText);
        const extractedSuggestions = parseSuggestions(analysisText);
        
        setAtsScore(score);
        setSuggestions(extractedSuggestions);
      }
      
      // Store metadata if available
      // if (data.metadata) {
      //   setMetadata(data.metadata);
      //   console.log("📋 PDF Metadata:", data.metadata);
      // }
      
    } catch (error) {
      console.error("❌ Error:", error);
      setErrorMessage("Error analyzing resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-black mx-auto p-6 space-y-14">
      {/* Resume Upload Section */}
      <div className="w-full max-w-4xl mx-auto mt-32 min-h-40 border border-dashed bg-black border-neutral-200 rounded-lg flex items-center justify-center p-4">
        <FileUpload onChange={handleFileUpload} />
      </div>

      {uploadedFile && <p className="text-center text-gray-600">📄 Uploaded: {uploadedFile.name}</p>}

      {loading && <p className="text-center text-gray-500 animate-pulse">🔍 Analyzing resume...</p>}

      {errorMessage && !loading && (
        <p className="text-center text-red-600 font-semibold">❌ {errorMessage}</p>
      )}

      {atsScore !== null && !loading && (
        <Card>
          <CardHeader>
            <CardTitle>ATS Compatibility Score</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={atsScore} className="h-3" />
            <p className="text-center mt-2">🎯 Your Resume Score: <b>{atsScore}/100</b></p>
          </CardContent>
        </Card>
      )}

      {suggestions.length > 0 && !loading && (
        <Card>
          <CardHeader>
            <CardTitle>Suggestions for Improvement</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="text-gray-700">{suggestion}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {metadata && !loading && (
        <Card>
          <CardHeader>
            <CardTitle>Resume Metadata</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {metadata.title && <p><strong>Title:</strong> {metadata.title}</p>}
              {metadata.author && <p><strong>Author:</strong> {metadata.author}</p>}
              {metadata.numPages && <p><strong>Pages:</strong> {metadata.numPages}</p>}
              {metadata.creationDate && <p><strong>Created:</strong> {metadata.creationDate}</p>}
              {metadata.fileSize && <p><strong>Size:</strong> {(metadata.fileSize / 1024).toFixed(2)} KB</p>}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <Button className="flex items-center space-x-2">
          <FileText className="w-4 h-4" />
          <span>Edit Resume</span>
        </Button>
        <Button className="flex items-center space-x-2">
          <Rocket className="w-4 h-4" />
          <span>Optimize for Job</span>
        </Button>
        {/* <Button
          onClick={async () => {
            if (uploadedFile) {
              await analyzeResume(uploadedFile);
            } else {
              setErrorMessage("⚠️ Please upload a resume first!");
            }
          }}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          <Rocket className="w-4 h-4" />
          <span>Run AI Analysis</span>
        </Button> */}
      </div>
    </div>
  );
}