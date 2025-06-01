'use client';

import React, { useState } from "react";
import { HoveredLink, Menu, MenuItem, ProductItem } from "./ui/navbar-menu";
import { cn } from "@/utils/cn";
import Link from "next/link";

function Navbar({ className }: { className?: string }) {
    const [active, setActive] = useState<string | null>(null);
  return (
    <div
    className={cn("fixed top-10 inset-x-0 max-w-2xl mx-auto z-50", className)}
    >
      {/* home nav */}
        <Menu setActive={setActive}>
            <Link href={"/"}>
            <MenuItem setActive={setActive} active={active} item="Home">
            
            </MenuItem>
            </Link>

            {/* our courses nav */}
            {/* <MenuItem
            setActive={setActive} active={active} item="Our Courses"
            >
               <div className="flex flex-col space-y-4 text-sm">
               <HoveredLink href="/courses">All Courses</HoveredLink>
            <HoveredLink href="/courses">
              Basic Music Theory
            </HoveredLink>
            <HoveredLink href="/courses">
              Advanced Composition
            </HoveredLink>
            <HoveredLink href="/courses">Songwriting</HoveredLink>
            <HoveredLink href="/courses">
              Music Production
            </HoveredLink>
               </div>
            </MenuItem> */}

          {/* finalised first nav */}
            <MenuItem setActive={setActive} active={active} item="Level Up">
          <div className="text-sm grid grid-cols-2 gap-10 p-4 ">
            <ProductItem
              title="Job Recommendations"
              href="/career-insights/jobss"
              src="/courses/jr.jpeg"
              description="AI-powered job role suggestions tailored to your skills and career goals."
            />
            <ProductItem
              title="Course Recommendations"
              href="/career-insights/courses"
              src="/courses/cr.jpeg"
              description="Find the best courses to upskill and advance your career with ease."
            />
            </div>
            <div className="text-sm flex items-center justify-center gap-10 p-4">
            <ProductItem
              title="Resume Enhancement"
              href="/career-insights/resume"
              src="/courses/ra.jpeg"
              description="Upload your resume and get AI-driven suggestions to optimize your ATS score."
            />
            {/* <ProductItem
              title="Rogue"
              href="/courses"
              src="/public/courses/classical-music.jpg"
              description="Respond to government RFPs, RFIs and RFQs 10x faster using AI"
            /> */}
            </div>
        </MenuItem>


              {/* contact us page */}
            <Link href={"/contact"}>
            <MenuItem setActive={setActive} active={active} item="Contact Us">
            
            </MenuItem>
            </Link>
        </Menu>
    </div>
  )
}

export default Navbar