'use client'
import Link from "next/link"
import { BackgroundGradient } from "../ui/background-gradient"


function FeaturedCourses() {


  return (
    
    <div className="py-12 min-h-screen bg-gray-900">
        <div>
            <div className="text-center">
                <h2 className="text-base text-teal-600 mt-28 font-semibold tracking-wide uppercase">FEATURES OF OUR PLATFORM</h2>
                <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">Unlock Your True Potential</p>
            </div>
        </div>
        <div className="mt-10 mx-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 justify-center">
                    <div className="flex justify-center">
                        <BackgroundGradient
                        className="flex flex-col rounded-[22px] bg-white dark:bg-zinc-900 overflow-hidden h-full max-w-sm">
                            <div className="p-4 sm:p-6 flex flex-col items-center text-center flex-grow">
                                <p className="text-lg sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200">AI-Powered Career Predictions</p>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400 flex-grow">Get precise career role suggestions based on your unique skill set using advanced machine learning models. </p>
                                <Link href='/career-insights/jobss' className="text-cyan-700">
                                Learn More
                                </Link>
                            </div>
                        </BackgroundGradient>
                    </div>
                    <div className="flex justify-center">
                        <BackgroundGradient
                        className="flex flex-col rounded-[22px] bg-white dark:bg-zinc-900 overflow-hidden h-full max-w-sm">
                            <div className="p-4 sm:p-6 flex flex-col items-center text-center flex-grow">
                                <p className="text-lg sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200">Courses Recommendation</p>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400 flex-grow">Search any topic, and let our system instantly recommend the top-reviewed, expert-approved courses to accelerate your learning journey.</p>
                                <Link href='/career-insights/courses' className="text-cyan-700">
                                Learn More
                                </Link>
                            </div>
                        </BackgroundGradient>
                    </div>
            </div>
            <div className="flex justify-center mt-8">
                        <BackgroundGradient
                        className="flex flex-col rounded-[22px] bg-white dark:bg-zinc-900 overflow-hidden h-full max-w-sm">
                            <div className="p-4 sm:p-6 flex flex-col items-center text-center flex-grow">
                                <p className="text-lg sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200">Resume Enhancement</p>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400 flex-grow">Upload your resume and let our system spot gaps, suggest improvements, and help you present the best version of your professional self.</p>
                                <Link href='/career-insights/resume' className="text-cyan-700">
                                Learn More
                                </Link>
                            </div>
                        </BackgroundGradient>
                    </div>
        </div>
    </div>
  )
}

export default FeaturedCourses