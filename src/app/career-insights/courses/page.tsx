"use client";
import { useState, useEffect } from "react";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { 
  Star, 
  Clock, 
  ExternalLink, 
  ChevronDown, 
  BookOpen, 
  Filter,
  Heart,
  Award,
  Calendar,
  Gift,
  Search,
  Sparkles
} from "lucide-react";
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

  const filterOptions = [
    { value: "all", label: "All Courses", icon: BookOpen },
    { value: "high-rating", label: "4.5+ Rating", icon: Award },
    { value: "most-recent", label: "Most Recent", icon: Calendar },
    { value: "free", label: "Free Courses", icon: Gift }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 mt-20">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full mb-6 backdrop-blur-sm border border-blue-500/30">
            <BookOpen className="w-10 h-10 text-blue-400" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Discover Your Next Course
          </h1>
          
          <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
            Find the perfect courses to advance your career and master new skills
          </p>
        </div>

        {/* Search and Filters Section */}
        <div className="bg-black/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 mb-8 shadow-2xl">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            {/* Filter Dropdown */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="pl-10 pr-4 py-3 bg-gray-800/80 border border-gray-600 rounded-xl text-white font-medium focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 min-w-[200px]"
              >
                {filterOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Input */}
            <div className="flex-1 w-full">
              <PlaceholdersAndVanishInput
                placeholders={placeholders}
                onChange={handleSearchChange}
                onSubmit={handleSearchSubmit}
              />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-300 px-6 py-4 rounded-xl mb-6 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">!</span>
              </div>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full mb-4 animate-pulse">
              <Search className="w-8 h-8 text-blue-400 animate-bounce" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Searching Courses...</h3>
            <p className="text-gray-400">Finding the best matches for you</p>
          </div>
        )}

        {/* Results Section */}
        {!loading && hasSearched && (
          <div className="w-full">
            {filteredCourses.length > 0 ? (
              <>
                {/* Results Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-yellow-400" />
                    <h2 className="text-2xl font-bold text-white">
                      Found {filteredCourses.length} Course{filteredCourses.length !== 1 ? 's' : ''}
                    </h2>
                  </div>
                  {filter !== 'all' && (
                    <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-full text-sm font-medium">
                      Filtered: {filterOptions.find(opt => opt.value === filter)?.label}
                    </span>
                  )}
                </div>

                {/* Courses Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {filteredCourses.map((course) => (
                    <div
                      key={course.id}
                      className="group bg-black/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden shadow-2xl hover:border-purple-500/30 transition-all duration-300 transform hover:scale-[1.02]"
                    >
                      {/* Course Image */}
                      <div className="relative overflow-hidden">
                        <Image
                          src={course.image}
                          alt={course.title}
                          width={400}
                          height={200}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.src = "/fallback.jpg";
                          }}
                        />
                        
                        {/* Favorite Button */}
                        <button
                          onClick={() => toggleFavorite(course.id)}
                          className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-all duration-200"
                        >
                          <Heart
                            className={`w-5 h-5 ${
                              favorites[course.id] 
                                ? "text-red-400 fill-current" 
                                : "text-gray-300"
                            }`}
                          />
                        </button>

                        {/* Free Badge */}
                        {course.isFree && (
                          <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                            <Gift className="w-3 h-3" />
                            FREE
                          </div>
                        )}
                      </div>

                      {/* Course Content */}
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-purple-300 transition-colors">
                          {course.title}
                        </h3>

                        {/* Rating and Date */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <Star className="w-5 h-5 text-yellow-400 fill-current" />
                            <span className="text-yellow-300 font-semibold">
                              {course.rating.toFixed(1)}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-gray-400">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm">
                              {new Date(course.updatedAt).toLocaleDateString("en-US", {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>

                        {/* Expand Button */}
                        <button
                          onClick={() => toggleExpand(course.id)}
                          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium mb-4 transition-colors"
                        >
                          {expanded[course.id] ? "Show Less" : "Show Details"}
                          <ChevronDown 
                            className={`w-4 h-4 transition-transform duration-200 ${
                              expanded[course.id] ? "rotate-180" : ""
                            }`} 
                          />
                        </button>

                        {/* Expanded Content */}
                        {expanded[course.id] && (
                          <div className="border-t border-gray-700 pt-4 space-y-4">
                            <p className="text-gray-300 text-sm leading-relaxed">
                              {course.description}
                            </p>
                            
                            <a
                              href={course.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
                            >
                              <ExternalLink className="w-4 h-4" />
                              Start Learning
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              !error && (
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-700/30 rounded-full mb-4">
                    <BookOpen className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">No Courses Found</h3>
                  <p className="text-gray-400 max-w-md mx-auto">
                    No courses match your current criteria. Try adjusting your search terms or filters.
                  </p>
                </div>
              )
            )}
          </div>
        )}

        {/* Initial State */}
        {!hasSearched && !loading && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full mb-6">
              <Search className="w-10 h-10 text-purple-400" />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Start Learning?
            </h3>
            
            <p className="text-gray-300 text-lg mb-8 max-w-lg mx-auto">
              Enter a search term above to discover courses that match your interests and goals
            </p>
            
            <div className="flex flex-wrap justify-center gap-3">
              {["Python", "React", "Data Science", "Machine Learning", "Web Development"].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setSearch(suggestion);
                    fetchCourses(suggestion);
                  }}
                  className="px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-full text-gray-300 hover:bg-gray-700/50 hover:border-gray-500 hover:text-white transition-all duration-200"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;