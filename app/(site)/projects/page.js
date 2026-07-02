import { Suspense } from "react";
import content from "@/lib/content";
import { getAllProjects, getAllTags } from "@/lib/projects";
import { SectionHeading } from "@/components/Motion";
import ProjectFilters from "@/components/ProjectFilters";

export default function ProjectsPage() {
  const projects = getAllProjects();
  const allTags = getAllTags();

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <SectionHeading title={content.projects.title} subtitle={content.projects.subtitle} />
      <Suspense fallback={<div className="text-muted">Laden...</div>}>
        <ProjectFilters projects={projects} allTags={allTags} />
      </Suspense>
    </div>
  );
}
