"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import content from "@/lib/content";
import ProjectCard from "@/components/ProjectCard";

export default function ProjectFilters({ projects, allTags }) {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState(searchParams.get("status") ?? "all");
  const [tag, setTag] = useState(searchParams.get("tag") ?? "all");

  const filtered = projects.filter((p) => {
    if (status !== "all" && p.status !== status) return false;
    if (tag !== "all" && !p.tags.includes(tag)) return false;
    return true;
  });

  const filterBtn = (active) =>
    `rounded-lg px-3 py-1.5 text-sm transition-colors ${
      active
        ? "bg-foreground text-background"
        : "text-muted hover:bg-surface-hover hover:text-foreground"
    }`;

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-6">
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-brand text-muted">
            {content.projects.filterStatus}
          </p>
          <div className="flex flex-wrap gap-1">
            {["all", "active", "completed"].map((s) => (
              <button key={s} onClick={() => setStatus(s)} className={filterBtn(status === s)}>
                {content.projects[s]}
              </button>
            ))}
          </div>
        </div>

        {allTags.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-brand text-muted">
              {content.projects.filterTags}
            </p>
            <div className="flex flex-wrap gap-1">
              <button onClick={() => setTag("all")} className={filterBtn(tag === "all")}>
                {content.projects.all}
              </button>
              {allTags.map((tg) => (
                <button key={tg} onClick={() => setTag(tg)} className={filterBtn(tag === tg)}>
                  {tg}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted py-12 text-center">{content.projects.noResults}</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {filtered.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
