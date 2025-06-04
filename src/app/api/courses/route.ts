// src/app/api/courses/route.ts
import { NextRequest, NextResponse } from "next/server";

// TypeScript interfaces
interface CourseraInstitution {
  id: string;
  name: string;
  shortName?: string;
  description?: string;
  logo?: string;
}

interface CourseraCourse {
  id: string;
  name: string;
  slug: string;
  description?: string;
  photoUrl?: string;
  avgRating?: number;
  workload?: string;
  certificates?: string[];
  partners?: CourseraInstitution[];
}

interface APIResponse {
  elements?: CourseraCourse[];
  courses?: CourseraCourse[];
  institutions?: CourseraInstitution[];
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || "web development";

  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": process.env.RAPIDAPI_KEY!,
      "x-rapidapi-host": "collection-for-coursera-courses.p.rapidapi.com",
    },
  };

  try {
    const result = await fetchAllCourses(query, options);
    if (result) return NextResponse.json(result);

    const institutionsUrl = "https://collection-for-coursera-courses.p.rapidapi.com/rapidapi/course/get_institution.php";
    const institutionsResponse = await fetch(institutionsUrl, options);

    if (institutionsResponse.ok) {
      const text = await institutionsResponse.text();
      const data = JSON.parse(text);
      const mockCourses = createCoursesFromInstitutions(data, query);

      return NextResponse.json({
        courses: mockCourses,
        total: mockCourses.length,
        query,
        source: "Institutions Backup",
      });
    }

    const mockCourses = generateMockCourses(query);
    return NextResponse.json({
      courses: mockCourses,
      total: mockCourses.length,
      query,
      source: "Mock Data Fallback",
    });
  } catch (err) {
    console.error("Final API Error:", err);
    const mockCourses = generateMockCourses(query);
    return NextResponse.json({
      error: "API down. Showing mock data.",
      courses: mockCourses,
      total: mockCourses.length,
      query,
      source: "Mock Data",
    });
  }
}

async function fetchAllCourses(query: string, options: RequestInit) {
  const endpoints = [
    {
      name: "Get Courses by Search",
      url: `https://collection-for-coursera-courses.p.rapidapi.com/rapidapi/course/search.php?query=${encodeURIComponent(query)}`,
    },
    {
      name: "Get All Courses",
      url: "https://collection-for-coursera-courses.p.rapidapi.com/rapidapi/course/get_courses.php",
    },
    {
      name: "Get Popular Courses",
      url: "https://collection-for-coursera-courses.p.rapidapi.com/rapidapi/course/popular.php",
    },
    {
      name: "Get Courses by Category",
      url: `https://collection-for-coursera-courses.p.rapidapi.com/rapidapi/course/category.php?category=${encodeURIComponent(query)}`,
    },
  ];

  const requests = endpoints.map(async (endpoint) => {
    try {
      const start = Date.now();
      const res = await fetch(endpoint.url, options);
      const time = Date.now() - start;
      console.log(`${endpoint.name} took ${time}ms`);

      if (!res.ok) throw new Error("Bad response");

      const text = await res.text();
      const data = JSON.parse(text);
      const courses = parseCoursesFromResponse(data, query);

      if (courses.length > 0) {
        return {
          courses,
          total: courses.length,
          query,
          source: endpoint.name,
        };
      }
    } catch (e) {
      console.log(`${endpoint.name} failed`, e);
      return null;
    }
  });

  const results = await Promise.all(requests);
  return results.find((r) => r !== null) || null;
}

function parseCoursesFromResponse(data: APIResponse, query: string): any[] {
  let coursesArray: any[] = [];

  if (data.elements && Array.isArray(data.elements)) {
    coursesArray = data.elements;
  } else if (data.courses && Array.isArray(data.courses)) {
    coursesArray = data.courses;
  } else if (Array.isArray(data)) {
    coursesArray = data;
  }

  return coursesArray.map((course: any, index: number) => ({
    id: course.id || course.slug || `course-${Date.now()}-${index}`,
    title: course.name || course.title || `${query} Course ${index + 1}`,
    image: course.photoUrl || course.imageUrl || course.logo || `https://picsum.photos/300/200?random=${index + 1}`,
    description: course.description || course.summary || `Learn ${query} with this comprehensive course.`,
    rating: parseFloat(course.avgRating) || Math.random() * 1.5 + 3.5,
    updatedAt: course.updatedAt || new Date().toISOString(),
    url: course.slug ? `https://www.coursera.org/learn/${course.slug}` : `https://www.coursera.org/search?query=${encodeURIComponent(course.name || query)}`,
    isFree: course.certificates?.includes("free") || Math.random() > 0.6,
  }));
}

function createCoursesFromInstitutions(institutionsData: any, query: string): any[] {
  let institutions: any[] = [];

  if (Array.isArray(institutionsData)) {
    institutions = institutionsData;
  } else if (institutionsData.elements) {
    institutions = institutionsData.elements;
  } else if (institutionsData.institutions) {
    institutions = institutionsData.institutions;
  }

  const courseTopics = [
    `Introduction to ${query}`,
    `Advanced ${query}`,
    `${query} for Beginners`,
    `Professional ${query}`,
    `${query} Specialization`,
  ];

  const courses: any[] = [];

  institutions.slice(0, 10).forEach((institution: any, instIndex: number) => {
    courseTopics.forEach((topic, topicIndex) => {
      courses.push({
        id: `${institution.id || instIndex}-${topicIndex}`,
        title: `${topic} - ${institution.name || `Institution ${instIndex + 1}`}`,
        image: institution.logo || `https://picsum.photos/300/200?random=${instIndex + topicIndex + 1}`,
        description: `Learn ${query} from ${institution.name || "top institution"}.`,
        rating: Math.random() * 1.5 + 3.5,
        updatedAt: new Date().toISOString(),
        url: `https://www.coursera.org/search?query=${encodeURIComponent(topic)}`,
        isFree: Math.random() > 0.7,
      });
    });
  });

  return courses.slice(0, 12);
}

function generateMockCourses(query: string): any[] {
  const topic = query.toLowerCase().includes("python") ? "Python" :
                query.toLowerCase().includes("react") ? "React" :
                query.toLowerCase().includes("javascript") ? "JavaScript" :
                query.toLowerCase().includes("data") ? "Data Science" : "Web Development";

  return Array.from({ length: 4 }).map((_, index) => ({
    id: `mock-${index}-${Date.now()}`,
    title: `Learn ${topic} - Level ${index + 1}`,
    image: `https://picsum.photos/300/200?random=${index + 1}`,
    description: `A solid course on ${topic} including hands-on projects.`,
    rating: 4.5 + Math.random() * 0.5,
    updatedAt: new Date(Date.now() - index * 7 * 24 * 60 * 60 * 1000).toISOString(),
    url: `https://www.coursera.org/search?query=${encodeURIComponent(topic)}`,
    isFree: index % 2 === 0,
  }));
}
