"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import content from "@/lib/content";

export default function ProjectCard({ project, index = 0 }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-surface-hover">
        <Image
          src={project.coverImage}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <span
          className={`absolute top-3 left-3 rounded-full px-2.5 py-0.5 text-xs font-medium ${
            project.status === "active"
              ? "bg-foreground text-background"
              : "bg-surface-hover text-muted border border-border"
          }`}
        >
          {project.status === "active" ? content.projects.active : content.projects.completed}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl group-hover:text-foreground/80 transition-colors">
          {project.title}
        </h3>
        <p className="mt-2 flex-1 text-sm text-muted leading-relaxed">{project.summary}</p>

        {project.tags?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-surface-hover px-2 py-0.5 text-xs text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <Link
          href={`/projects/${project.slug}`}
          className="mt-4 inline-flex items-center gap-1 text-sm font-medium hover:underline underline-offset-4"
        >
          {content.home.viewProject} →
        </Link>
      </div>
    </motion.article>
  );
}
