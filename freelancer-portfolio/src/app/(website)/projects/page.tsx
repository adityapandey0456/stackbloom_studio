import type { Metadata } from "next";
import FeaturedProjects from "@/components/home/FeaturedProjects";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Explore StackBloom Studio projects in web development, AI, automation and computer vision.",
};

export default function ProjectsPage() {
  return <FeaturedProjects />;
}