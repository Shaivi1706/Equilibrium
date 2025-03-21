"use client";

import { useState, useEffect } from "react";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { Star, Clock, ExternalLink, ChevronDown } from "lucide-react";
import Image from "next/image";


const CoursesPage = () => {
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const placeholders = [
    "Are there any openings at Google?",
    "What tech stack do I need for MERN?",
    "Skills required to become an AI Engineer?",
    "Best system design resources?",
    "Top companies for remote software jobs?",
  ];

  type Course = {
    id: string;
    title: string;
    image: string;
    description: string;
    rating: number;
    updatedAt: string;
    url: string;
    isFree: boolean;
  };

  // Function to fetch courses
  const fetchCourses = async (searchTerm: string) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/courses?query=${encodeURIComponent(searchTerm)}`);
      const data = await response.json();

      if (response.ok) {
        setCourses(data.courses);
      } else {
        setError(data.error || "Failed to load courses");
      }
    } catch (err) {
      setError("Failed to load courses");
    }
    setLoading(false);
  };

  // Fetch courses when the search changes
  useEffect(() => {
    if (search.trim()) {
      fetchCourses(search);
    }
  }, [search]);

  // Toggle expanded state
  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Toggle favorite state
  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center py-10">
      <h1 className="text-4xl font-bold text-center mb-6 mt-32 text-white">Find the Best Courses for Your Career</h1>

      {/* FILTERS */}
      <div className="flex flex-col sm:flex-row justify-between w-full max-w-4xl gap-4 mb-6">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-2 rounded-lg bg-gray-800 text-white shadow-lg"
        >
          <option value="all">All Courses</option>
          <option value="high-rating">4.5+ Rating</option>
          <option value="most-recent">Most Recent</option>
          <option value="free">Free Courses</option>
        </select>

        <PlaceholdersAndVanishInput
          placeholders={placeholders}
          onChange={(e) => setSearch(e.target.value)}
          onSubmit={(e) => fetchCourses(search)}
        />
      </div>

      {/* ERROR MESSAGE */}
      {error && <p className="text-red-500 mt-2">{error}</p>}

      {/* COURSES GRID */}
      {loading ? (
        <p className="text-gray-400 mt-6">Loading courses...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.length > 0 ? (
            courses
              .filter((course) =>
                filter === "high-rating" ? course.rating >= 4.5 :
                filter === "most-recent" ? new Date(course.updatedAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) :
                filter === "free" ? course.isFree : true
              )
              .map((course) => (
                <div
                  key={course.id}
                  className="p-4 border rounded-lg shadow-md bg-gray-900 text-white hover:bg-gray-800 transition"
                >
                  {/* <img src={course.image} alt={course.title} className="w-full h-32 object-cover mb-3 rounded-lg" /> */}


                  <Image
                    src={course.image}
                    alt={course.title}
                    width={300}
                    height={150}
                    className="w-full h-32 object-cover mb-3 rounded-lg"
                  />

                  <h2 className="text-lg font-semibold">{course.title}</h2>
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => toggleFavorite(course.id)}>
                      <Star className={`w-5 h-5 ${favorites[course.id] ? "text-yellow-400" : "text-gray-400"}`} />
                    </button>
                    <span className="text-yellow-300 font-medium">{course.rating}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 mt-2">
                    <Clock className="w-5 h-5" />
                    <span>Last updated: {new Date(course.updatedAt).toLocaleDateString("en-US")}</span>
                  </div>
                  <button onClick={() => toggleExpand(course.id)} className="text-blue-400 mt-2 flex items-center gap-1">
                    See More <ChevronDown className="w-5 h-5" />
                  </button>
                  {expanded[course.id] && (
                    <div className="mt-2">
                      <p className="text-gray-400">{course.description}</p>
                      <a
                        href={course.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 mt-2 flex items-center gap-2 hover:underline"
                      >
                        <ExternalLink className="w-5 h-5" /> Visit Course
                      </a>
                    </div>
                  )}
                </div>
              ))
          ) : (
            <p className="text-gray-400 mt-6 text-center"></p>
          )}
        </div>
      )}
    </div>
  );
};

export default CoursesPage;