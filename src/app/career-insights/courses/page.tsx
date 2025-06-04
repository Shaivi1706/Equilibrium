// //src/app/career-insights/courses/page.tsx
// "use client";

// import { useState, useEffect } from "react";
// import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
// import { Star, Clock, ExternalLink, ChevronDown } from "lucide-react";
// import Image from "next/image";


// const CoursesPage = () => {
//   const [loading, setLoading] = useState(false);
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [filter, setFilter] = useState("all");
//   const [search, setSearch] = useState("");
//   const [error, setError] = useState("");
//   const [expanded, setExpanded] = useState<Record<string, boolean>>({});
//   const [favorites, setFavorites] = useState<Record<string, boolean>>({});

//   const placeholders = [
//     "Are there any openings at Google?",
//     "What tech stack do I need for MERN?",
//     "Skills required to become an AI Engineer?",
//     "Best system design resources?",
//     "Top companies for remote software jobs?",
//   ];

//   type Course = {
//     id: string;
//     title: string;
//     image: string;
//     description: string;
//     rating: number;
//     updatedAt: string;
//     url: string;
//     isFree: boolean;
//   };

//   // Function to fetch courses
//   const fetchCourses = async (searchTerm: string) => {
//     setLoading(true);
//     setError("");
//     try {
//       const response = await fetch(`/api/courses?query=${encodeURIComponent(searchTerm)}`);
//       const data = await response.json();

//       if (response.ok) {
//         setCourses(data.courses);
//       } else {
//         setError(data.error || "Failed to load courses");
//       }
//     } catch (err) {
//       setError("Failed to load courses");
//     }
//     setLoading(false);
//   };

//   // Fetch courses when the search changes
//   useEffect(() => {
//     if (search.trim()) {
//       fetchCourses(search);
//     }
//   }, [search]);

//   // Toggle expanded state
//   const toggleExpand = (id: string) => {
//     setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
//   };

//   // Toggle favorite state
//   const toggleFavorite = (id: string) => {
//     setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
//   };

//   return (
//     <div className="min-h-screen bg-black flex flex-col items-center py-10">
//       <h1 className="text-4xl font-bold text-center mb-6 mt-32 text-white">Find the Best Courses for Your Career</h1>

//       {/* FILTERS */}
//       <div className="flex flex-col sm:flex-row justify-between w-full max-w-4xl gap-4 mb-6 z-0">
//         <select
//           value={filter}
//           onChange={(e) => setFilter(e.target.value)}
//           className="border p-2 rounded-lg bg-gray-800 text-white shadow-lg"
//         >
//           <option value="all">All Courses</option>
//           <option value="high-rating">4.5+ Rating</option>
//           <option value="most-recent">Most Recent</option>
//           <option value="free">Free Courses</option>
//         </select>

//         <PlaceholdersAndVanishInput
//           placeholders={placeholders}
//           onChange={(e) => setSearch(e.target.value)}
//           onSubmit={(e) => fetchCourses(search)}
//         />
//       </div>

//       {/* ERROR MESSAGE */}
//       {error && <p className="text-red-500 mt-2">{error}</p>}

//       {/* COURSES GRID */}
//       {loading ? (
//         <p className="text-gray-400 mt-6">Loading courses...</p>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {courses.length > 0 ? (
//             courses
//               .filter((course) =>
//                 filter === "high-rating" ? course.rating >= 4.5 :
//                 filter === "most-recent" ? new Date(course.updatedAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) :
//                 filter === "free" ? course.isFree : true
//               )
//               .map((course) => (
//                 <div
//                   key={course.id}
//                   className="p-4 border rounded-lg shadow-md bg-gray-900 text-white hover:bg-gray-800 transition"
//                 >
//                   {/* <img src={course.image} alt={course.title} className="w-full h-32 object-cover mb-3 rounded-lg" /> */}


//                   <Image
//                     src={course.image}
//                     alt={course.title}
//                     width={300}
//                     height={150}
//                     className="w-full h-32 object-cover mb-3 rounded-lg"
//                   />

//                   <h2 className="text-lg font-semibold">{course.title}</h2>
//                   <div className="flex items-center gap-2 mt-2">
//                     <button onClick={() => toggleFavorite(course.id)}>
//                       <Star className={`w-5 h-5 ${favorites[course.id] ? "text-yellow-400" : "text-gray-400"}`} />
//                     </button>
//                     <span className="text-yellow-300 font-medium">{course.rating}</span>
//                   </div>
//                   <div className="flex items-center gap-2 text-gray-400 mt-2">
//                     <Clock className="w-5 h-5" />
//                     <span>Last updated: {new Date(course.updatedAt).toLocaleDateString("en-US")}</span>
//                   </div>
//                   <button onClick={() => toggleExpand(course.id)} className="text-blue-400 mt-2 flex items-center gap-1">
//                     See More <ChevronDown className="w-5 h-5" />
//                   </button>
//                   {expanded[course.id] && (
//                     <div className="mt-2">
//                       <p className="text-gray-400">{course.description}</p>
//                       <a
//                         href={course.url}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-blue-400 mt-2 flex items-center gap-2 hover:underline"
//                       >
//                         <ExternalLink className="w-5 h-5" /> Visit Course
//                       </a>
//                     </div>
//                   )}
//                 </div>
//               ))
//           ) : (
//             <p className="text-gray-400 mt-6 text-center"></p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default CoursesPage;
//src/app/career-insights/courses/page.tsx
"use client";

import { useState, useEffect } from "react";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { Star, Clock, ExternalLink, ChevronDown } from "lucide-react";
import Image from "next/image";

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

const CoursesPage = () => {
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [hasSearched, setHasSearched] = useState(false);

  const placeholders = [
    "Search for Python courses",
    "Find React development courses",
    "Data Science courses",
    "Machine Learning tutorials",
    "Web Development bootcamp",
  ];

  // Function to fetch courses
  const fetchCourses = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setError("Please enter a search term");
      return;
    }

    setLoading(true);
    setError("");
    setHasSearched(true);
    
    try {
      console.log("Searching for:", searchTerm);
      const response = await fetch(`/api/courses?query=${encodeURIComponent(searchTerm)}`);
      const data = await response.json();

      console.log("Response data:", data);

      if (response.ok) {
        setCourses(data.courses || []);
        if (data.courses && data.courses.length === 0) {
          setError("No courses found for your search term. Try different keywords.");
        }
      } else {
        setError(data.error || "Failed to load courses");
        setCourses([]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load courses. Please check your internet connection.");
      setCourses([]);
    }
    setLoading(false);
  };

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  // Handle form submission from PlaceholdersAndVanishInput
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      fetchCourses(search.trim());
    }
  };

  // Toggle expanded state
  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Toggle favorite state
  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Filter courses based on selected filter
  const filteredCourses = courses.filter((course) => {
    switch (filter) {
      case "high-rating":
        return course.rating >= 4.5;
      case "most-recent":
        return new Date(course.updatedAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      case "free":
        return course.isFree;
      default:
        return true;
    }
  });

  return (
    <div className="min-h-screen bg-black flex flex-col items-center py-10">
      <h1 className="text-4xl font-bold text-center mb-6 mt-32 text-white">
        Find the Best Courses for Your Career
      </h1>

      {/* SEARCH AND FILTERS */}
      <div className="flex flex-col sm:flex-row justify-between w-full max-w-4xl gap-4 mb-6 z-0">
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

        {/* REMOVED THE OUTER FORM - PlaceholdersAndVanishInput handles its own form */}
        <div className="flex-1">
          <PlaceholdersAndVanishInput
            placeholders={placeholders}
            onChange={handleSearchChange}
            onSubmit={handleSearchSubmit}
          />
        </div>
      </div>

      {/* REMOVED THE SEPARATE SEARCH BUTTON - PlaceholdersAndVanishInput has its own submit button */}

      {/* ERROR MESSAGE */}
      {error && (
        <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded mb-4 max-w-4xl w-full">
          <p>{error}</p>
        </div>
      )}

      {/* LOADING STATE */}
      {loading && (
        <div className="text-center text-gray-400 mt-6">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-2"></div>
          <p>Searching for courses...</p>
        </div>
      )}

      {/* COURSES GRID */}
      {!loading && hasSearched && (
        <div className="w-full max-w-6xl">
          {filteredCourses.length > 0 ? (
            <>
              <p className="text-gray-400 mb-4 text-center">
                Found {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} 
                {filter !== 'all' && ` (filtered: ${filter})`}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <div
                    key={course.id}
                    className="p-4 border border-gray-700 rounded-lg shadow-md bg-gray-900 text-white hover:bg-gray-800 transition-all duration-200"
                  >
                    <Image
                      src={course.image}
                      alt={course.title}
                      width={300}
                      height={150}
                      className="w-full h-32 object-cover mb-3 rounded-lg"
                      onError={(e) => {
                        // Fallback to placeholder if image fails to load
                        e.currentTarget.src = "/fallback.jpg";
                      }}
                    />

                    <h2 className="text-lg font-semibold mb-2 line-clamp-2">{course.title}</h2>
                    
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <button onClick={() => toggleFavorite(course.id)}>
                          <Star 
                            className={`w-5 h-5 ${favorites[course.id] ? "text-yellow-400 fill-current" : "text-gray-400"}`} 
                          />
                        </button>
                        <span className="text-yellow-300 font-medium">{course.rating.toFixed(1)}</span>
                      </div>
                      {course.isFree && (
                        <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">FREE</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-gray-400 mb-3">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">Updated: {new Date(course.updatedAt).toLocaleDateString("en-US")}</span>
                    </div>

                    <button 
                      onClick={() => toggleExpand(course.id)} 
                      className="text-blue-400 mb-2 flex items-center gap-1 hover:text-blue-300"
                    >
                      {expanded[course.id] ? "Show Less" : "Show More"} 
                      <ChevronDown className={`w-4 h-4 transition-transform ${expanded[course.id] ? "rotate-180" : ""}`} />
                    </button>

                    {expanded[course.id] && (
                      <div className="mt-2 border-t border-gray-700 pt-3">
                        <p className="text-gray-300 text-sm mb-3">{course.description}</p>
                        <a
                          href={course.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 hover:underline"
                        >
                          <ExternalLink className="w-4 h-4" /> 
                          Visit Course
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            !error && (
              <p className="text-gray-400 mt-6 text-center">
                No courses found matching your criteria. Try adjusting your search or filters.
              </p>
            )
          )}
        </div>
      )}

      {/* INITIAL STATE */}
      {!hasSearched && !loading && (
        <div className="text-center text-gray-400 mt-10">
          <p className="text-lg">Enter a search term above to find courses</p>
          <p className="text-sm mt-2">Try searching for "Python", "React", "Data Science", etc.</p>
        </div>
      )}
    </div>
  );
};

export default CoursesPage;