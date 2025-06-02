import FeaturedCourses from "@/components/featuredCourses/page";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";


export default function Home() {
  return (
    <main className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02]">
      <HeroSection />
      <div id="featured-courses">
        <FeaturedCourses />
      </div>
      <Footer />
    </main>
  );
}
