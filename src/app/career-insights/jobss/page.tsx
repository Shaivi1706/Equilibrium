"use client";
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="p-6 mx-auto bg-gray-100 dark:bg-gray-900 w-screen">
      <h2 className="text-2xl font-semibold text-center text-white mb-6 mt-28">Skill Quiz</h2>

      {predictedRole && (
        <div className="mb-6 p-4 mt-6 bg-black border border-gray-700 rounded-lg text-center">
          <h3 className="text-lg font-semibold text-white">
            Best IT Role for You: {predictedRole}
          </h3>
        </div>
      )}
      
      
      
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
      
    </div>
  );
}