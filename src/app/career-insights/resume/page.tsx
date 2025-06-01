// "use client";
// import { useState, useEffect } from "react";
// import { FileText, Rocket } from "lucide-react";
// import { FileUpload } from "@/components/ui/file-upload";
// import { Button } from "@/components/ui/moving-border";

// import {
//   GoogleGenerativeAI,
//   HarmCategory,
//   HarmBlockThreshold,
// } from "@google/generative-ai";

// const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY ?? "";

// if (!apiKey) {
//   console.error("❌ GEMINI API Key is missing! Make sure to add it in .env.local");
// }

// const genAI = new GoogleGenerativeAI(apiKey);

// const model = genAI.getGenerativeModel({
//   model: "gemini-2.0-flash",
// });

// const generationConfig = {
//   temperature: 1,
//   topP: 0.95,
//   topK: 40,
//   maxOutputTokens: 8192,
//   responseMimeType: "text/plain",
// };

// // Function to analyze resume using Gemini API
// const analyzeResumeWithAI = async (resumeText: string) => {
//   try {
//     console.log("🔹 Sending resume text to Gemini AI...");
//     const chatSession = model.startChat({ generationConfig, history: [] });
//     const result = await chatSession.sendMessage(resumeText);
//     return result.response.text();
//   } catch (error) {
//     console.error("❌ Error analyzing resume with Gemini:", error);
//     return "Error analyzing resume.";
//   }
// };

// // Function to parse ATS score from AI analysis text
// const parseATSScore = (analysisText: string): number => {
//   // Look for patterns like "Score: 75/100" or "ATS compatibility score: 75"
//   const scoreRegex = /(?:score|rating)(?:\s*):?\s*(\d+)(?:\s*\/\s*100)?/i;
//   const match = analysisText.match(scoreRegex);
//   return match ? parseInt(match[1]) : 0;
// };

// // Function to parse suggestions from AI analysis text
// const parseSuggestions = (analysisText: string): string[] => {
//   // Look for numbered or bulleted lists of suggestions
//   const suggestions: string[] = [];
  
//   // Split by newlines and look for list patterns
//   const lines = analysisText.split('\n');
  
//   for (let i = 0; i < lines.length; i++) {
//     const line = lines[i].trim();
//     // Match numbered lists (1. 2. etc) or bullet points (* - •)
//     if (/^(\d+\.|\*|\-|\•)\s+/.test(line)) {
//       // Clean up the line by removing the list marker
//       const cleanLine = line.replace(/^(\d+\.|\*|\-|\•)\s+/, '');
//       if (cleanLine.length > 0) {
//         suggestions.push(cleanLine);
//       }
//     }
//   }
  
//   return suggestions;
// };

// // Reusable Card components
// const Card = ({ children }: { children: React.ReactNode }) => (
//   <div className="bg-blue-200 shadow-lg rounded-lg p-6 border border-blue-100">{children}</div>
// );

// const CardHeader = ({ children }: { children: React.ReactNode }) => (
//   <div className="mb-4">{children}</div>
// );

// const CardTitle = ({ children }: { children: React.ReactNode }) => (
//   <h2 className="text-xl font-semibold text-gray-800">{children}</h2>
// );

// const CardContent = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;

// const Progress = ({ value, className }: { value: number; className?: string }) => (
//   <div className={`w-full bg-gray-200 rounded-full h-4 ${className}`}>
//     <div className="bg-blue-600 h-4 rounded-full" style={{ width: `${value}%` }}></div>
//   </div>
// );

// export default function ResumeEnhancement() {
//   const [uploadedFile, setUploadedFile] = useState<File | null>(null);
//   const [atsScore, setAtsScore] = useState<number | null>(null);
//   const [suggestions, setSuggestions] = useState<string[]>([]);
//   const [metadata, setMetadata] = useState<any>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);

//   const handleFileUpload = async (files: File[]) => {
//     if (files.length > 0) {
//       const file = files[0];
//       setUploadedFile(file);
//       await analyzeResume(file);
//     }
//   };

//   const analyzeResume = async (file: File) => {
//     setLoading(true);
//     setErrorMessage(null);
//     setAtsScore(null);
//     setSuggestions([]);
//     setMetadata(null);
  
//     try {
//       console.log("🔹 Sending POST request...");
  
//       // Create FormData object
//       const formData = new FormData();
//       formData.append("resume", file); // Send the actual file, not converted text
  
//       const response = await fetch(`/api/analyze-resume`, {
//         method: "POST",
//         body: formData,
//       });
  
//       console.log("🔸 Response Status:", response.status);
//       if (!response.ok) throw new Error("Failed to analyze resume");
  
//       const data = await response.json();
//       console.log("✅ API Response:", data);
  
//       // Handle the response from the updated backend
//       if (data.aiAnalysis) {
//         // Parse the AI analysis to extract score and suggestions
//         const analysisText = data.aiAnalysis;
//         const score = parseATSScore(analysisText);
//         const extractedSuggestions = parseSuggestions(analysisText);
        
//         setAtsScore(score);
//         setSuggestions(extractedSuggestions);
//       }
      
//       // Store metadata if available
//       // if (data.metadata) {
//       //   setMetadata(data.metadata);
//       //   console.log("📋 PDF Metadata:", data.metadata);
//       // }
      
//     } catch (error) {
//       console.error("❌ Error:", error);
//       setErrorMessage("Error analyzing resume. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   return (
//     <div className="bg-black mx-auto p-6 space-y-14">
//       {/* Resume Upload Section */}
//       <div className="w-full max-w-4xl mx-auto mt-32 min-h-40 border border-dashed bg-black border-neutral-200 rounded-lg flex items-center justify-center p-4">
//         <FileUpload onChange={handleFileUpload} />
//       </div>

//       {uploadedFile && <p className="text-center text-gray-600">📄 Uploaded: {uploadedFile.name}</p>}

//       {loading && <p className="text-center text-gray-500 animate-pulse">🔍 Analyzing resume...</p>}

//       {errorMessage && !loading && (
//         <p className="text-center text-red-600 font-semibold">❌ {errorMessage}</p>
//       )}

//       {atsScore !== null && !loading && (
//         <Card>
//           <CardHeader>
//             <CardTitle>ATS Compatibility Score</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <Progress value={atsScore} className="h-3" />
//             <p className="text-center mt-2">🎯 Your Resume Score: <b>{atsScore}/100</b></p>
//           </CardContent>
//         </Card>
//       )}

//       {suggestions.length > 0 && !loading && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Suggestions for Improvement</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ul className="list-disc list-inside space-y-2">
//               {suggestions.map((suggestion, index) => (
//                 <li key={index} className="text-gray-700">{suggestion}</li>
//               ))}
//             </ul>
//           </CardContent>
//         </Card>
//       )}

//       {metadata && !loading && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Resume Metadata</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-2">
//               {metadata.title && <p><strong>Title:</strong> {metadata.title}</p>}
//               {metadata.author && <p><strong>Author:</strong> {metadata.author}</p>}
//               {metadata.numPages && <p><strong>Pages:</strong> {metadata.numPages}</p>}
//               {metadata.creationDate && <p><strong>Created:</strong> {metadata.creationDate}</p>}
//               {metadata.fileSize && <p><strong>Size:</strong> {(metadata.fileSize / 1024).toFixed(2)} KB</p>}
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {/* Action Buttons */}
//       <div className="flex justify-center space-x-4">
//         <Button className="flex items-center space-x-2">
//           <FileText className="w-4 h-4" />
//           <span>Edit Resume</span>
//         </Button>
//         <Button className="flex items-center space-x-2">
//           <Rocket className="w-4 h-4" />
//           <span>Optimize for Job</span>
//         </Button>
//         {/* <Button
//           onClick={async () => {
//             if (uploadedFile) {
//               await analyzeResume(uploadedFile);
//             } else {
//               setErrorMessage("⚠️ Please upload a resume first!");
//             }
//           }}
//           className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md"
//         >
//           <Rocket className="w-4 h-4" />
//           <span>Run AI Analysis</span>
//         </Button> */}
//       </div>
//     </div>
//   );
// }

"use client";
import { useState } from "react";
import { FileText, Rocket, Upload, AlertCircle, CheckCircle } from "lucide-react";

// Mock FileUpload component since we can't import from @/components/ui
const FileUpload = ({ onChange }: { onChange: (files: File[]) => void }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onChange(Array.from(e.target.files));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer">
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange}
        className="hidden"
        id="file-upload"
      />
      <label htmlFor="file-upload" className="cursor-pointer text-center">
        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
        <p className="text-xs text-gray-500">PDF, DOC, DOCX (max 10MB)</p>
      </label>
    </div>
  );
};

// Mock Button component
const Button = ({ children, onClick, disabled, className = "" }: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 rounded-md font-medium transition-colors ${
      disabled 
        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
        : 'bg-blue-600 hover:bg-blue-700 text-white'
    } ${className}`}
  >
    {children}
  </button>
);

// Card components
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
    <div className="bg-blue-600 h-4 rounded-full transition-all duration-500" style={{ width: `${value}%` }}></div>
  </div>
);

// Types for structured API response
interface AnalysisResult {
  score: number;
  suggestions: string[];
  strengths: string[];
  weaknesses: string[];
}

interface OptimizedResume {
  content: string;
  improvements: string[];
}

export default function ResumeEnhancement() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [optimizedResume, setOptimizedResume] = useState<OptimizedResume | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [optimizing, setOptimizing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<'upload' | 'analyze' | 'optimize'>('upload');

  const handleFileUpload = async (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setErrorMessage("Please upload a PDF, DOC, or DOCX file.");
        return;
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage("File size must be less than 10MB.");
        return;
      }

      setUploadedFile(file);
      setErrorMessage(null);
      setCurrentStep('analyze');
      await analyzeResume(file);
    }
  };

  const analyzeResume = async (file: File) => {
    setLoading(true);
    setErrorMessage(null);
    setAnalysisResult(null);

    try {
      console.log("🔹 Analyzing resume...");

      const formData = new FormData();
      formData.append("resume", file);

      const response = await fetch(`/api/analyze-resume`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to analyze resume");
      }

      const data = await response.json();
      console.log("✅ Analysis complete:", data);

      // Assuming the backend now returns structured data
      if (data.analysis) {
        setAnalysisResult(data.analysis);
        setCurrentStep('optimize');
      } else {
        throw new Error("Invalid response format");
      }
      
    } catch (error) {
      console.error("❌ Error:", error);
      setErrorMessage(error instanceof Error ? error.message : "Error analyzing resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const optimizeResume = async () => {
    if (!uploadedFile || !analysisResult) return;

    setOptimizing(true);
    setErrorMessage(null);

    try {
      console.log("🚀 Optimizing resume...");

      const formData = new FormData();
      formData.append("resume", uploadedFile);
      formData.append("analysisData", JSON.stringify(analysisResult));

      const response = await fetch(`/api/optimize-resume`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to optimize resume");
      }

      const data = await response.json();
      console.log("✅ Optimization complete:", data);

      if (data.optimized) {
        setOptimizedResume(data.optimized);
      } else {
        throw new Error("Invalid optimization response");
      }
      
    } catch (error) {
      console.error("❌ Error:", error);
      setErrorMessage(error instanceof Error ? error.message : "Error optimizing resume. Please try again.");
    } finally {
      setOptimizing(false);
    }
  };

  const handleEditResume = () => {
    // For now, just show a placeholder message
    alert("Edit Resume feature will open a rich text editor to modify your resume content.");
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreMessage = (score: number) => {
    if (score >= 80) return "Excellent! Your resume is well-optimized for ATS.";
    if (score >= 60) return "Good! Some improvements can make it even better.";
    return "Needs improvement to pass through ATS filters.";
  };

  return (
    <div className="bg-black min-h-screen mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center mt-24 mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Resume Enhancement AI</h1>
        <p className="text-gray-400 text-lg">Optimize your resume for ATS compatibility and better job prospects</p>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-4">
          <div className={`flex items-center space-x-2 ${currentStep === 'upload' ? 'text-blue-400' : currentStep === 'analyze' || currentStep === 'optimize' ? 'text-green-400' : 'text-gray-500'}`}>
            <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center">1</div>
            <span>Upload</span>
          </div>
          <div className="w-8 h-px bg-gray-600"></div>
          <div className={`flex items-center space-x-2 ${currentStep === 'analyze' ? 'text-blue-400' : currentStep === 'optimize' ? 'text-green-400' : 'text-gray-500'}`}>
            <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center">2</div>
            <span>Analyze</span>
          </div>
          <div className="w-8 h-px bg-gray-600"></div>
          <div className={`flex items-center space-x-2 ${currentStep === 'optimize' ? 'text-blue-400' : 'text-gray-500'}`}>
            <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center">3</div>
            <span>Optimize</span>
          </div>
        </div>
      </div>

      {/* Resume Upload Section */}
      <div className="w-full max-w-4xl mx-auto">
        <FileUpload onChange={handleFileUpload} />
      </div>

      {uploadedFile && (
        <div className="text-center">
          <p className="text-gray-300 flex items-center justify-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span>📄 Uploaded: {uploadedFile.name}</span>
          </p>
        </div>
      )}

      {/* Loading States */}
      {loading && (
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">🔍 Analyzing your resume with AI...</p>
        </div>
      )}

      {optimizing && (
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-green-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">🚀 Optimizing your resume...</p>
        </div>
      )}

      {/* Error Messages */}
      {errorMessage && !loading && !optimizing && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center space-x-2">
            <AlertCircle className="w-5 h-5" />
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      {/* Analysis Results */}
      {analysisResult && !loading && (
        <div className="max-w-4xl mx-auto space-y-6">
          {/* ATS Score */}
          <Card>
            <CardHeader>
              <CardTitle>ATS Compatibility Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress value={analysisResult.score} className="h-6" />
                <div className="text-center">
                  <p className={`text-3xl font-bold ${getScoreColor(analysisResult.score)}`}>
                    {analysisResult.score}/100
                  </p>
                  <p className="text-gray-600 mt-2">{getScoreMessage(analysisResult.score)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Strengths */}
          {analysisResult.strengths?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-green-700">✅ Strengths</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysisResult.strengths.map((strength, index) => (
                    <li key={index} className="text-gray-700 flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Improvement Suggestions */}
          {analysisResult.suggestions?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-orange-700">💡 Suggestions for Improvement</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {analysisResult.suggestions.map((suggestion, index) => (
                    <li key={index} className="text-gray-700 flex items-start space-x-2">
                      <div className="w-6 h-6 bg-orange-200 text-orange-700 rounded-full flex items-center justify-center text-sm font-bold mt-0.5 flex-shrink-0">
                        {index + 1}
                      </div>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Weaknesses */}
          {analysisResult.weaknesses?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-red-700">⚠️ Areas Needing Attention</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysisResult.weaknesses.map((weakness, index) => (
                    <li key={index} className="text-gray-700 flex items-start space-x-2">
                      <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <span>{weakness}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Optimized Resume */}
      {optimizedResume && !optimizing && (
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-purple-700">🎯 AI-Optimized Resume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-lg border max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm text-gray-800">{optimizedResume.content}</pre>
                </div>
                
                {optimizedResume.improvements?.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Key Improvements Made:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                      {optimizedResume.improvements.map((improvement, index) => (
                        <li key={index}>{improvement}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex space-x-4">
                  <Button className="bg-green-600 hover:bg-green-700">
                    📄 Download Optimized Resume
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    📋 Copy to Clipboard
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Action Buttons */}
      {analysisResult && !loading && (
        <div className="flex justify-center space-x-4 pt-8">
          <Button 
            onClick={handleEditResume}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
          >
            <FileText className="w-4 h-4" />
            <span>Edit Resume</span>
          </Button>
          
          <Button 
            onClick={optimizeResume}
            disabled={optimizing}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
          >
            <Rocket className="w-4 h-4" />
            <span>{optimizing ? 'Optimizing...' : 'AI Optimize Resume'}</span>
          </Button>
        </div>
      )}
    </div>
  );
}