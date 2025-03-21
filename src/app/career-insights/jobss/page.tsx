"use client";
// // // import { useState } from "react";
// // // import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";

// // // const JobRecommendations = () => {
// // //     const [search, setSearch] = useState("");
// // //     const [predictedRole, setPredictedRole] = useState<string | null>(null);
    
// // //     const placeholders = [
// // //         "Are there any openings in Google?",
// // //         "What tech stack should I have to be a MERN Stack Dev?",
// // //         "What skills do I need to become an AI Engineer?",
// // //         "Best resources to master system design?",
// // //         "What are the best companies for remote software jobs?",
// // //     ];

// // //     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// // //         setSearch(e.target.value);
// // //     };

// // //     const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
// // //         e.preventDefault();

// // //         const skills = {
// // //             "Database Fundamentals": "Intermediate",
// // //             "Computer Architecture": "Beginner",
// // //             "Distributed Computing Systems": "Poor",
// // //             "Cyber Security": "Excellent",
// // //             "Networking": "Professional",
// // //             "Software Development": "Average",
// // //             "Programming Skills": "Beginner",
// // //             "Project Management": "Intermediate",
// // //             "Computer Forensics Fundamentals": "Not Interested",
// // //             "Technical Communication": "Beginner",
// // //             "AI ML": "Intermediate",
// // //             "Software Engineering": "Excellent",
// // //             "Business Analysis": "Average",
// // //             "Communication skills": "Excellent",
// // //             "Data Science": "Beginner",
// // //             "Troubleshooting skills": "Average",
// // //             "Graphics Designing": "Not Interested"
// // //         };

// // //         try {
// // //             const res = await fetch("/api/job-role", {
// // //                 method: "POST",
// // //                 headers: { "Content-Type": "application/json" },
// // //                 body: JSON.stringify({ skills }),
// // //             });

// // //             const data = await res.json();
// // //             if (data.predicted_role) setPredictedRole(data.predicted_role);
// // //             else setPredictedRole("Error getting job role");
// // //         } catch (error) {
// // //             console.error("Error fetching job role:", error);
// // //             setPredictedRole("Server error");
// // //         }
// // //     };

// // //     return (
// // //         <div className="min-h-screen bg-black md:h-[40rem] w-full rounded-md flex flex-col items-center justify-center relative overflow-hidden mx-auto py-10 md:py-0">
// // //             <div className="text-center mb-6">
// // //                 <h1 className="text-5xl font-bold text-white">Tailored Job Matches for You</h1>
// // //                 <p className="text-white text-2xl mt-4">Find the best job opportunities tailored to your skills!</p>
// // //             </div>

// // //             <PlaceholdersAndVanishInput placeholders={placeholders} onChange={handleChange} onSubmit={onSubmit} />

// // //             {predictedRole && (
// // //                 <div className="mt-6 bg-gray-800 text-white p-4 rounded-lg">
// // //                     <h2 className="text-xl font-semibold">Predicted Role:</h2>
// // //                     <p className="text-lg">{predictedRole}</p>
// // //                 </div>
// // //             )}
// // //         </div>
// // //     );
// // // };

// // // export default JobRecommendations;

// // "use client";
// // import { useState } from "react";

// // const skillsList = [
// //     "AI", "Python", "Machine Learning", "Web Development", "Cyber Security",
// //     "Data Science", "Cloud Computing", "Blockchain", "Software Engineering",
// //     "Networking", "Project Management", "UI/UX Design", "DevOps", 
// //     "Business Analysis", "Database Administration", "Game Development", "Technical Writing"
// // ];

// // const JobSearch = () => {
// //     const [selectedSkills, setSelectedSkills] = useState<{ skill: string; level: number }[]>([]);
// //     const [newSkill, setNewSkill] = useState<string>("");
// //     const [newLevel, setNewLevel] = useState<number>(0);
// //     const [filters, setFilters] = useState<string[]>([]);
// //     const [predictedRole, setPredictedRole] = useState<string | null>(null);

// //     const handleAddSkill = () => {
// //         if (newSkill && !selectedSkills.find(s => s.skill === newSkill)) {
// //             setSelectedSkills([...selectedSkills, { skill: newSkill, level: newLevel }]);
// //             setNewSkill(""); // Reset dropdown
// //             setNewLevel(0); // Reset level input
// //         }
// //     };

// //     const handleSearch = async () => {
// //         const skills = Object.fromEntries(selectedSkills.map(s => [s.skill, s.level]));

// //         const response = await fetch("/api/job-role", {
// //             method: "POST",
// //             headers: { "Content-Type": "application/json" },
// //             body: JSON.stringify({ skills, filters }),
// //         });

// //         const data = await response.json();
// //         setPredictedRole(data.predicted_role);
// //     };

// //     return (
// //         <div className="flex justify-center items-center min-h-screen bg-gray-100">
// //             <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
// //                 <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">🔮 Job Role Predictor</h2>

// //                 {/* Skill Selection */}
// //                 <div className="mb-4">
// //                     <label className="block text-gray-600 mb-1">Select Skill:</label>
// //                     <select
// //                         value={newSkill}
// //                         onChange={(e) => setNewSkill(e.target.value)}
// //                         className="w-full px-3 py-2 text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                     >
// //                         <option value="">-- Select a skill --</option>
// //                         {skillsList.map(skill => (
// //                             <option key={skill} value={skill}>{skill}</option>
// //                         ))}
// //                     </select>
// //                 </div>

// //                 {/* Skill Level Input */}
// //                 <div className="mb-4">
// //                     <label className="block text-gray-600 mb-1">Skill Level (0-5):</label>
// //                     <input
// //                         type="number"
// //                         step="0.1"
// //                         min="0"
// //                         max="5"
// //                         value={newLevel}
// //                         onChange={(e) => setNewLevel(parseFloat(e.target.value))}
// //                         className="w-full px-3 text-black py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                     />
// //                 </div>

// //                 {/* Add Skill Button */}
// //                 <button
// //                     onClick={handleAddSkill}
// //                     className="w-full bg-green-600 text-black py-2 rounded-md hover:bg-green-700 transition-all mb-4"
// //                 >
// //                     ➕ Add Skill
// //                 </button>

// //                 {/* Display Selected Skills */}
// //                 {selectedSkills.length > 0 && (
// //                     <div className="mb-4">
// //                         <h3 className="text-lg font-semibold text-gray-700 mb-2">🛠 Selected Skills:</h3>
// //                         <ul className="list-disc pl-5 text-gray-600">
// //                             {selectedSkills.map(({ skill, level }) => (
// //                                 <li key={skill}>
// //                                     {skill}: <span className="font-bold">{level}</span>
// //                                 </li>
// //                             ))}
// //                         </ul>
// //                     </div>
// //                 )}

// //                 {/* Filters - Multi Select */}
// //                 <label className="block text-gray-600 mb-1">Filter by Role:</label>
// //                 <select
// //                     multiple
// //                     onChange={(e) =>
// //                         setFilters(Array.from(e.target.selectedOptions, (option) => option.value))
// //                     }
// //                     className="w-full px-3 py-2 text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
// //                 >
// //                     <option value="Data Scientist">Data Scientist</option>
// //                     <option value="Software Developer">Software Developer</option>
// //                     <option value="Cyber Security Specialist">Cyber Security Specialist</option>
// //                     <option value="Project Manager">Project Manager</option>
// //                     <option value="Business Analyst">Business Analyst</option>
// //                 </select>

// //                 {/* Search Button */}
// //                 <button
// //                     onClick={handleSearch}
// //                     className="w-full bg-blue-600 text-black py-2 rounded-md hover:bg-blue-700 transition-all"
// //                 >
// //                     🔍 Predict My Role
// //                 </button>

// //                 {/* Predicted Role Display */}
// //                 {predictedRole && (
// //                     <div className="mt-4 text-center text-lg font-semibold text-gray-700">
// //                         🎯 Predicted Role: <span className="text-blue-600">{predictedRole}</span>
// //                     </div>
// //                 )}
// //             </div>
// //         </div>
// //     );
// // };

// // export default JobSearch;

// "use client";
// import { useState } from "react";

// const skillsList = [
//     "AI", "Python", "Machine Learning", "Web Development", "Cyber Security",
//     "Data Science", "Cloud Computing", "Blockchain", "Software Engineering",
//     "Networking", "Project Management", "UI/UX Design", "DevOps", 
//     "Business Analysis", "Database Administration", "Game Development", "Technical Writing"
// ];

// const JobSearch = () => {
//     const [selectedSkills, setSelectedSkills] = useState<{ skill: string; level: number }[]>([]);
//     const [newSkill, setNewSkill] = useState<string>("");
//     const [newLevel, setNewLevel] = useState<number>(0);
//     const [filters, setFilters] = useState<string[]>([]);
//     const [predictedRole, setPredictedRole] = useState<string | null>(null);

//     const handleAddSkill = () => {
//         if (newSkill && !selectedSkills.find(s => s.skill === newSkill)) {
//             setSelectedSkills([...selectedSkills, { skill: newSkill, level: newLevel }]);
//             setNewSkill(""); // Reset dropdown
//             setNewLevel(0); // Reset level input
//         }
//     };

//     const handleSearch = async () => {
//       setPredictedRole(null); // Reset previous role
  
//       const skills = Object.fromEntries(selectedSkills.map(s => [s.skill, s.level]));
  
//       try {
//           const response = await fetch("/api/job-role", {
//               method: "POST",
//               headers: { "Content-Type": "application/json" },
//               body: JSON.stringify({ skills, filters }),
//           });
  
//           // ✅ Check if response is OK before parsing JSON
//           if (!response.ok) {
//               const errorText = await response.text(); // Read raw response
//               throw new Error(`Server Error: ${response.status} - ${errorText}`);
//           }
  
//           // ✅ Ensure response contains JSON
//           const contentType = response.headers.get("content-type");
//           if (!contentType || !contentType.includes("application/json")) {
//               throw new Error("Invalid JSON response from server");
//           }
  
//           const data = await response.json();
//           setPredictedRole(data.predicted_role || "No matching role found");
//       } catch (error) {
//           console.error("Error fetching job role:", error);
//           setPredictedRole("Error fetching prediction");
//       }
//   };
  

//     return (
//         <div className="flex justify-center items-center min-h-screen bg-gray-100">
//             <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
//                 <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">🔮 Job Role Predictor</h2>

//                 {/* Skill Selection */}
//                 <div className="mb-4">
//                     <label className="block text-gray-600 mb-1">Select Skill:</label>
//                     <select
//                         value={newSkill}
//                         onChange={(e) => setNewSkill(e.target.value)}
//                         className="w-full px-3 py-2 text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     >
//                         <option value="">-- Select a skill --</option>
//                         {skillsList.map(skill => (
//                             <option key={skill} value={skill}>{skill}</option>
//                         ))}
//                     </select>
//                 </div>

//                 {/* Skill Level Input */}
//                 <div className="mb-4">
//                     <label className="block text-gray-600 mb-1">Skill Level (0-5):</label>
//                     <input
//                         type="number"
//                         step="0.1"
//                         min="0"
//                         max="5"
//                         value={newLevel}
//                         onChange={(e) => setNewLevel(parseFloat(e.target.value))}
//                         className="w-full px-3 text-black py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                 </div>

//                 {/* Add Skill Button */}
//                 <button
//                     onClick={handleAddSkill}
//                     className="w-full bg-green-600 text-black py-2 rounded-md hover:bg-green-700 transition-all mb-4"
//                 >
//                     ➕ Add Skill
//                 </button>

//                 {/* Display Selected Skills */}
//                 {selectedSkills.length > 0 && (
//                     <div className="mb-4">
//                         <h3 className="text-lg font-semibold text-gray-700 mb-2">🛠 Selected Skills:</h3>
//                         <ul className="list-disc pl-5 text-gray-600">
//                             {selectedSkills.map(({ skill, level }) => (
//                                 <li key={skill}>
//                                     {skill}: <span className="font-bold">{level}</span>
//                                 </li>
//                             ))}
//                         </ul>
//                     </div>
//                 )}

//                 {/* Filters - Multi Select */}
//                 <label className="block text-gray-600 mb-1">Filter by Role:</label>
//                 <select
//                     multiple
//                     onChange={(e) =>
//                         setFilters(Array.from(e.target.selectedOptions, (option) => option.value))
//                     }
//                     className="w-full px-3 py-2 text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
//                 >
//                     <option value="Data Scientist">Data Scientist</option>
//                     <option value="Software Developer">Software Developer</option>
//                     <option value="Cyber Security Specialist">Cyber Security Specialist</option>
//                     <option value="Project Manager">Project Manager</option>
//                     <option value="Business Analyst">Business Analyst</option>
//                 </select>

//                 {/* Search Button */}
//                 <button
//                     onClick={handleSearch}
//                     className="w-full bg-blue-600 text-black py-2 rounded-md hover:bg-blue-700 transition-all"
//                 >
//                     🔍 Predict My Role
//                 </button>

//                 {/* Predicted Role Display */}
//                 {predictedRole && (
//                     <div className="mt-4 text-center text-lg font-semibold text-gray-700">
//                         🎯 Predicted Role: <span className="text-blue-600">{predictedRole}</span>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default JobSearch;


import { useState } from "react";
import { Button } from "@/components/ui/moving-border";

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

const levels = ["Beginner", "Poor", "Average", "Intermediate", "Excellent", "Professional", "Not Interested"];

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
  };

  return (
    <div className="p-6 mx-auto bg-black/[0.80] w-screen">
      <h2 className="text-2xl font-semibold text-center mb-6 mt-14">Skill Quiz</h2>
      
      
      
      {skills.map((skill, index) => (
        <div key={index} className="mb-6 p-4 border mx-28 border-gray-300 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-4 text-white">{skill}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {levels.map((level) => (
              <button
                key={level}
                onClick={() => handleSelection(skill, level)}
                className={`p-2 border rounded-md ${
                  ratings[skill] === level ? "bg-purple-600 text-white" : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      ))}
      
      <div className="text-center mt-6">
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Predicting..." : "Submit"}
        </Button>
      </div>
      {predictedRole && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 rounded-lg text-center">
          <h3 className="text-lg font-semibold text-green-800">
            Best IT Role for You: {predictedRole}
          </h3>
        </div>
      )}
    </div>
  );
}