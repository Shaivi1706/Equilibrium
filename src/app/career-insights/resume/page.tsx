"use client";
import { useState } from "react";
import { FileText, Rocket, Upload, AlertCircle, CheckCircle, Star, Zap, Target, TrendingUp, Award, Download, Copy } from "lucide-react";

// Enhanced FileUpload component with glassmorphism
const FileUpload = ({ onChange }: { onChange: (files: File[]) => void }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onChange(Array.from(e.target.files));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files) {
      onChange(Array.from(e.dataTransfer.files));
    }
  };

  return (
    <div 
      className={`relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl transition-all duration-300 cursor-pointer group ${
        isDragOver 
          ? 'border-cyan-400 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 backdrop-blur-sm' 
          : 'border-gray-600 bg-gradient-to-br from-gray-800/30 to-gray-900/30 hover:border-gray-500 hover:bg-gradient-to-br hover:from-gray-700/40 hover:to-gray-800/40'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <input
        type="file"
        accept=".pdf,.doc,.docx,.txt"
        onChange={handleFileChange}
        className="hidden"
        id="file-upload"
      />
      
      <label htmlFor="file-upload" className="cursor-pointer text-center z-10 relative">
        <div className="mb-4 relative">
          <Upload className={`w-12 h-12 mx-auto transition-all duration-300 ${isDragOver ? 'text-cyan-400 scale-110' : 'text-gray-400 group-hover:text-gray-300'}`} />
          <div className={`absolute inset-0 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 blur-xl transition-opacity duration-300 ${isDragOver ? 'opacity-100' : 'opacity-0'}`} />
        </div>
        <p className="text-lg font-medium text-gray-200 mb-2">Drag & drop your resume here</p>
        <p className="text-sm text-gray-400 mb-2">or click to browse files</p>
        <p className="text-xs text-gray-500 bg-gray-800/50 px-3 py-1 rounded-full inline-block">PDF, DOC, DOCX, TXT (max 10MB)</p>
      </label>
      
      {/* Animated border effect */}
      <div className={`absolute inset-0 rounded-2xl transition-opacity duration-300 ${isDragOver ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-500 opacity-20 animate-pulse" />
      </div>
    </div>
  );
};

// Enhanced Button component
const Button = ({ children, onClick, disabled, className = "", variant = "primary" }: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  variant?: "primary" | "secondary" | "success" | "gradient";
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "gradient":
        return "bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white shadow-lg shadow-cyan-500/25";
      case "success":
        return "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white shadow-lg shadow-green-500/25";
      case "secondary":
        return "bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-600 hover:border-gray-500";
      default:
        return "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25";
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 ${
        disabled 
          ? 'bg-gray-700 text-gray-500 cursor-not-allowed shadow-none' 
          : getVariantClasses()
      } ${className}`}
    >
      {children}
    </button>
  );
};

// Enhanced Card components with glassmorphism
const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-700/50 shadow-2xl rounded-2xl p-8 transition-all duration-300 hover:shadow-3xl hover:border-gray-600/50 ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent rounded-2xl pointer-events-none" />
    <div className="relative z-10">{children}</div>
  </div>
);

const CardHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-6">{children}</div>
);

const CardTitle = ({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) => (
  <h2 className="text-2xl font-bold text-gray-100 flex items-center gap-3">
    {icon}
    {children}
  </h2>
);

const CardContent = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;

const Progress = ({ value, className }: { value: number; className?: string }) => (
  <div className={`w-full bg-gray-800 rounded-full h-6 relative overflow-hidden ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-800 rounded-full" />
    <div 
      className="bg-gradient-to-r from-cyan-500 to-purple-600 h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden" 
      style={{ width: `${value}%` }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-shimmer" />
    </div>
    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
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
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      if (!allowedTypes.includes(file.type)) {
        setErrorMessage("Please upload a PDF, DOC, DOCX, or TXT file.");
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
      console.log("Analyzing resume...");

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
      console.log("Analysis complete:", data);

      // Assuming the backend now returns structured data
      if (data.analysis) {
        setAnalysisResult(data.analysis);
        setCurrentStep('optimize');
      } else {
        throw new Error("Invalid response format");
      }
      
    } catch (error) {
      console.error("Error:", error);
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
      console.log("Optimizing resume...");

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
      console.log("Optimization complete:", data);

      if (data.optimized) {
        setOptimizedResume(data.optimized);
      } else {
        throw new Error("Invalid optimization response");
      }
      
    } catch (error) {
      console.error("Error:", error);
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
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return "from-green-500 to-emerald-600";
    if (score >= 60) return "from-yellow-500 to-orange-600";
    return "from-red-500 to-pink-600";
  };

  const getScoreMessage = (score: number) => {
    if (score >= 80) return "Excellent! Your resume is well-optimized for ATS.";
    if (score >= 60) return "Good! Some improvements can make it even better.";
    return "Needs improvement to pass through ATS filters.";
  };

  return (
    <div className="bg-black min-h-screen relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 mx-auto p-6 space-y-12">
        {/* Header */}
        <div className="text-center pt-16 pb-8">
          <div className="mb-6">
            <div className="inline-flex items-center gap-3 px-4 mt-10 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-sm border border-cyan-500/30 rounded-full text-cyan-300 text-sm font-medium">
              <Zap className="w-4 h-4" />
              AI-Powered Resume Enhancement
            </div>
          </div>
          <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-6 tracking-tight">
            Resume Enhancement AI
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Transform your resume with cutting-edge AI technology. Optimize for ATS compatibility and maximize your job prospects.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-8">
            {[
              { step: 'upload', number: 1, label: 'Upload', icon: Upload },
              { step: 'analyze', number: 2, label: 'Analyze', icon: Target },
              { step: 'optimize', number: 3, label: 'Optimize', icon: Rocket }
            ].map(({ step, number, label, icon: Icon }) => {
              const isActive = currentStep === step;
              const isCompleted = 
                (step === 'upload' && (currentStep === 'analyze' || currentStep === 'optimize')) ||
                (step === 'analyze' && currentStep === 'optimize');
              
              return (
                <div key={step} className="flex items-center">
                  <div className={`flex items-center space-x-3 transition-all duration-300 ${
                    isActive ? 'text-cyan-400 scale-110' : 
                    isCompleted ? 'text-green-400' : 'text-gray-500'
                  }`}>
                    <div className={`relative w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      isActive ? 'border-cyan-400 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 shadow-lg shadow-cyan-500/25' :
                      isCompleted ? 'border-green-400 bg-gradient-to-br from-green-500/20 to-emerald-500/20' :
                      'border-gray-600 bg-gray-800/50'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                      {isActive && (
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/30 to-purple-500/30 animate-ping" />
                      )}
                    </div>
                    <span className="font-semibold text-lg">{label}</span>
                  </div>
                  {number < 3 && (
                    <div className={`w-16 h-0.5 mx-4 transition-all duration-300 ${
                      isCompleted ? 'bg-gradient-to-r from-green-400 to-emerald-400' : 'bg-gray-700'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Resume Upload Section */}
        <div className="w-full max-w-4xl mx-auto">
          <FileUpload onChange={handleFileUpload} />
        </div>

        {uploadedFile && (
          <div className="text-center">
            <div className="inline-flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-500/30 rounded-full text-green-300">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">{uploadedFile.name} uploaded successfully</span>
            </div>
          </div>
        )}

        {/* Loading States */}
        {loading && (
          <div className="text-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full mx-auto mb-6 animate-spin" />
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-400 rounded-full mx-auto animate-spin animate-reverse" style={{ animationDelay: '0.5s' }} />
            </div>
            <p className="text-xl text-gray-300 font-medium">AI is analyzing your resume...</p>
            <p className="text-sm text-gray-400 mt-2">This may take a few moments</p>
          </div>
        )}

        {optimizing && (
          <div className="text-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-green-500/30 border-t-green-400 rounded-full mx-auto mb-6 animate-spin" />
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-emerald-400 rounded-full mx-auto animate-spin animate-reverse" style={{ animationDelay: '0.5s' }} />
            </div>
            <p className="text-xl text-gray-300 font-medium">Optimizing your resume...</p>
            <p className="text-sm text-gray-400 mt-2">Creating the perfect version</p>
          </div>
        )}

        {/* Error Messages */}
        {errorMessage && !loading && !optimizing && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 backdrop-blur-sm border border-red-500/30 text-red-300 px-6 py-4 rounded-2xl flex items-center space-x-3">
              <AlertCircle className="w-6 h-6 flex-shrink-0" />
              <span className="font-medium">{errorMessage}</span>
            </div>
          </div>
        )}

        {/* Analysis Results */}
        {analysisResult && !loading && (
          <div className="max-w-6xl mx-auto space-y-8">
            {/* ATS Score */}
            <Card className="relative overflow-hidden">
              <div className={`absolute inset-0 bg-gradient-to-br ${getScoreGradient(analysisResult.score)} opacity-5`} />
              <CardHeader>
                <CardTitle icon={<Award className="w-8 h-8 text-cyan-400" />}>
                  ATS Compatibility Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <Progress value={analysisResult.score} className="h-8" />
                  <div className="text-center space-y-4">
                    <div className="relative">
                      <p className={`text-6xl font-black ${getScoreColor(analysisResult.score)} relative z-10`}>
                        {analysisResult.score}
                        <span className="text-3xl text-gray-400">/100</span>
                      </p>
                      <div className={`absolute inset-0 text-6xl font-black bg-gradient-to-r ${getScoreGradient(analysisResult.score)} bg-clip-text text-transparent blur-sm`}>
                        {analysisResult.score}
                      </div>
                    </div>
                    <p className="text-lg text-gray-300 font-medium bg-gray-800/50 px-4 py-2 rounded-full inline-block">
                      {getScoreMessage(analysisResult.score)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Strengths */}
              {analysisResult.strengths?.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle icon={<Star className="w-6 h-6 text-green-400" />}>
                      Strengths
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {analysisResult.strengths.map((strength, index) => (
                        <li key={index} className="text-gray-300 flex items-start space-x-3 group">
                          <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform duration-200" />
                          <span className="leading-relaxed">{strength}</span>
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
                    <CardTitle icon={<TrendingUp className="w-6 h-6 text-yellow-400" />}>
                      Suggestions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      {analysisResult.suggestions.map((suggestion, index) => (
                        <li key={index} className="text-gray-300 flex items-start space-x-3 group">
                          <div className="w-7 h-7 bg-gradient-to-br from-yellow-500 to-orange-500 text-black rounded-full flex items-center justify-center text-sm font-bold mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                            {index + 1}
                          </div>
                          <span className="leading-relaxed">{suggestion}</span>
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
                    <CardTitle icon={<AlertCircle className="w-6 h-6 text-red-400" />}>
                      Areas to Improve
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {analysisResult.weaknesses.map((weakness, index) => (
                        <li key={index} className="text-gray-300 flex items-start space-x-3 group">
                          <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform duration-200" />
                          <span className="leading-relaxed">{weakness}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Optimized Resume */}
        {optimizedResume && !optimizing && (
          <div className="max-w-6xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle icon={<Target className="w-8 h-8 text-purple-400" />}>
                  AI-Optimized Resume
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 max-h-96 overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm text-gray-200 font-mono leading-relaxed">{optimizedResume.content}</pre>
                  </div>
                  
                  {optimizedResume.improvements?.length > 0 && (
                    <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-6 rounded-2xl border border-green-500/20">
                      <h4 className="font-bold text-green-400 mb-4 flex items-center gap-2">
                        <Zap className="w-5 h-5" />
                        Key Improvements Made:
                      </h4>
                      <ul className="grid md:grid-cols-2 gap-3">
                        {optimizedResume.improvements.map((improvement, index) => (
                          <li key={index} className="text-gray-300 flex items-start space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{improvement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-4 justify-center">
                    <Button variant="success" className="flex items-center space-x-2">
                      <Download className="w-4 h-4" />
                      <span>Download Resume</span>
                    </Button>
                    <Button variant="secondary" className="flex items-center space-x-2">
                      <Copy className="w-4 h-4" />
                      <span>Copy to Clipboard</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Action Buttons */}
        {analysisResult && !loading && (
          <div className="flex justify-center space-x-6 pt-8">
            <Button 
              onClick={handleEditResume}
              variant="secondary"
              className="flex items-center space-x-2"
            >
              <FileText className="w-5 h-5" />
              <span>Edit Resume</span>
            </Button>
            
            <Button 
              onClick={optimizeResume}
              disabled={optimizing}
              variant="gradient"
              className="flex items-center space-x-2"
            >
              <Rocket className="w-5 h-5" />
              <span>{optimizing ? 'Optimizing...' : 'AI Optimize Resume'}</span>
            </Button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        
        .animate-reverse {
          animation-direction: reverse;
        }
        
        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05);
        }
      `}</style>
    </div>
  );
}