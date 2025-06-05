// "use client";
// import { useState } from "react";
// import { Button } from "@/components/ui/moving-border";

// const skills = [
//   "Database Fundamentals",
//   "Computer Architecture",
//   "Distributed Computing Systems",
//   "Cyber Security",
//   "Networking",
//   "Software Development",
//   "Programming Skills",
//   "Project Management",
//   "Computer Forensics Fundamentals",
//   "Technical Communication",
//   "AI ML",
//   "Software Engineering",
//   "Business Analysis",
//   "Communication skills",
//   "Data Science",
//   "Troubleshooting skills",
//   "Graphics Designing",
// ];

// const levels = ["Beginner", "Poor", "Average", "Intermediate", "Excellent", "Professional", "Not Interested"];

// export default function SkillQuiz() {
//   const [ratings, setRatings] = useState<{ [key: string]: string }>({});
//   const [predictedRole, setPredictedRole] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   const handleSelection = (skill: string, level: string) => {
//     setRatings((prev) => ({ ...prev, [skill]: level }));
//   };

//   const handleSubmit = async () => {
//     if (Object.keys(ratings).length !== skills.length) {
//       alert("Please rate all skills before submitting.");
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await fetch("/api/job-role", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ skills: ratings }),
//       });
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       const data = await response.json();
//       setPredictedRole(data.predicted_role);
//     } catch (error) {
//       console.error("Error:", error);
//       alert("Failed to get a prediction. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   return (
//     <div className="p-6 mx-auto bg-gray-100 dark:bg-gray-900 w-screen">
//       <h2 className="text-2xl font-semibold text-center text-white mb-6 mt-28">Skill Quiz</h2>

//       {predictedRole && (
//         <div className="mb-6 p-4 mt-6 bg-black border border-gray-700 rounded-lg text-center">
//           <h3 className="text-lg font-semibold text-white">
//             Best IT Role for You: {predictedRole}
//           </h3>
//         </div>
//       )}
      
      
      
//       {skills.map((skill, index) => (
//         <div key={index} className="mb-6 p-4 border mx-28 border-gray-300 rounded-lg shadow-md">
//           <h3 className="text-lg font-medium mb-4 text-white">{skill}</h3>
//           <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
//             {levels.map((level) => (
//               <button
//                 key={level}
//                 onClick={() => handleSelection(skill, level)}
//                 className={`p-2 border rounded-md ${
//                   ratings[skill] === level ? "bg-purple-600 text-white" : "bg-gray-200 hover:bg-gray-300"
//                 }`}
//               >
//                 {level}
//               </button>
//             ))}
//           </div>
//         </div>
//       ))}
      
//       <div className="text-center mt-6">
//         <Button onClick={handleSubmit} disabled={loading}>
//           {loading ? "Predicting..." : "Submit"}
//         </Button>
//       </div>
      
//     </div>
//   );
// }

"use client";
import { useState } from "react";
import { Button } from "@/components/ui/moving-border";
import { Brain, Target, CheckCircle, Star, TrendingUp, Zap } from "lucide-react";

const skills = [
  "Database Fundamentals",
  "Computer Architecture", 
  "Distributed Computing Systems",
  "Cyber Security",
  "Networking",
  "Software Development",
  "Programming Skills",
  "Project Management",
  "Computer Forensics Fundamentals",
  "Technical Communication",
  "AI ML",
  "Software Engineering",
  "Business Analysis",
  "Communication skills",
  "Data Science",
  "Troubleshooting skills",
  "Graphics Designing",
];

const levels = [
  { name: "Beginner", color: "bg-red-500/20 border-red-500/30 text-red-300", icon: "🌱" },
  { name: "Poor", color: "bg-orange-500/20 border-orange-500/30 text-orange-300", icon: "📚" },
  { name: "Average", color: "bg-yellow-500/20 border-yellow-500/30 text-yellow-300", icon: "⚡" },
  { name: "Intermediate", color: "bg-blue-500/20 border-blue-500/30 text-blue-300", icon: "🚀" },
  { name: "Excellent", color: "bg-green-500/20 border-green-500/30 text-green-300", icon: "⭐" },
  { name: "Professional", color: "bg-purple-500/20 border-purple-500/30 text-purple-300", icon: "👑" },
  { name: "Not Interested", color: "bg-gray-500/20 border-gray-500/30 text-gray-400", icon: "❌" }
];

const skillIcons = {
  "Database Fundamentals": "🗄️",
  "Computer Architecture": "🖥️",
  "Distributed Computing Systems": "🌐",
  "Cyber Security": "🔒",
  "Networking": "🔗",
  "Software Development": "💻",
  "Programming Skills": "⌨️",
  "Project Management": "📋",
  "Computer Forensics Fundamentals": "🔍",
  "Technical Communication": "📢",
  "AI ML": "🤖",
  "Software Engineering": "⚙️",
  "Business Analysis": "📊",
  "Communication skills": "💬",
  "Data Science": "📈",
  "Troubleshooting skills": "🔧",
  "Graphics Designing": "🎨",
};

export default function SkillQuiz() {
  const [ratings, setRatings] = useState<{ [key: string]: string }>({});
  const [predictedRole, setPredictedRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSelection = (skill: string, level: string) => {
    setRatings((prev) => ({ ...prev, [skill]: level }));
  };

  const handleSubmit = async () => {
    if (Object.keys(ratings).length !== skills.length) {
      alert("Please rate all skills before submitting.");
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch("/api/job-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills: ratings }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setPredictedRole(data.predicted_role);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to get a prediction. Please try again.");
    } finally {
      setLoading(false);
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const completedSkills = Object.keys(ratings).length;
  const progressPercentage = (completedSkills / skills.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 mt-20">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full mb-6 backdrop-blur-sm border border-purple-500/30">
            <Brain className="w-10 h-10 text-purple-400" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-4">
            Skill Assessment
          </h1>
          
          <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
            Discover your ideal IT career path by rating your skills across key technology domains
          </p>
          
          {/* Progress Bar */}
          <div className="mt-8 max-w-md mx-auto">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-400">Progress</span>
              <span className="text-sm text-purple-400 font-semibold">{completedSkills}/{skills.length}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Results Section */}
        {predictedRole && (
          <div className="mb-12 p-8 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-2xl text-center backdrop-blur-sm">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Target className="w-8 h-8 text-green-400" />
              <h3 className="text-2xl font-bold text-white">Your Ideal IT Role</h3>
            </div>
            
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full border border-green-500/30">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span className="text-xl font-semibold text-green-300">{predictedRole}</span>
            </div>
            
            <p className="text-gray-300 mt-4 max-w-lg mx-auto">
              Based on your skill ratings, this role aligns best with your strengths and interests
            </p>
          </div>
        )}

        {/* Skills Grid */}
        <div className="grid gap-6 md:gap-8">
          {skills.map((skill, index) => (
            <div 
              key={index} 
              className="group p-6 bg-black/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl shadow-2xl hover:border-purple-500/30 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">{skillIcons[skill as keyof typeof skillIcons]}</span>
                <h3 className="text-xl font-semibold text-white group-hover:text-purple-300 transition-colors">
                  {skill}
                </h3>
                {ratings[skill] && (
                  <CheckCircle className="w-5 h-5 text-green-400 ml-auto" />
                )}
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {levels.map((level) => (
                  <button
                    key={level.name}
                    onClick={() => handleSelection(skill, level.name)}
                    className={`
                      p-3 border rounded-xl font-medium transition-all duration-200 transform hover:scale-105 active:scale-95
                      flex items-center justify-center gap-2 text-sm
                      ${ratings[skill] === level.name 
                        ? `${level.color} border-2 shadow-lg` 
                        : "bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:border-gray-500"
                      }
                    `}
                  >
                    <span className="text-lg">{level.icon}</span>
                    <span>{level.name}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Submit Section */}
        <div className="text-center mt-12 mb-8">
          <div className="mb-6">
            <p className="text-gray-400 mb-2">
              Ready to discover your ideal role?
            </p>
            <p className="text-sm text-gray-500">
              Make sure you've rated all {skills.length} skills above
            </p>
          </div>
          
          <Button 
            onClick={handleSubmit} 
            disabled={loading || completedSkills !== skills.length}
            className="relative"
          >
            <div className="flex items-center gap-3">
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Analyzing Your Skills...</span>
                </>
              ) : (
                <>
                  <TrendingUp className="w-10 h-5" />
                  <span>Get My IT Role Prediction</span>
                </>
              )}
            </div>
          </Button>
          
          {completedSkills !== skills.length && (
            <p className="text-yellow-400 text-sm mt-3">
              Complete {skills.length - completedSkills} more skill{skills.length - completedSkills !== 1 ? 's' : ''} to unlock prediction
            </p>
          )}
        </div>
      </div>
    </div>
  );
}