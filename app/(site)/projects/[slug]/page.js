import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import content from "@/lib/content";
import { getProjectBySlug, getAllProjectSlugs } from "@/lib/projects";
import { createMetadata } from "@/lib/seo";
import MDXContent from "@/components/MDXContent";
import { FadeIn } from "@/components/Motion";

export async function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};

  return createMetadata({
    title: project.title,
    description: project.summary,
    path: `/projects/${slug}`,
  });
}

function formatPeriod(dateStart, dateEnd) {
  const end = dateEnd ?? content.common.present;
  return `${dateStart} — ${end}`;
}

export default async function ProjectDetailPage({ params }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) notFound();

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <FadeIn>
        <Link href="/projects" className="text-sm text-muted hover:text-foreground transition-colors">
          ← {content.projects.back}
        </Link>
      </FadeIn>

      <FadeIn delay={0.05} className="mt-8">
        <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-surface-hover">
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>
      </FadeIn>

      <FadeIn delay={0.1} className="mt-10">
        <span
          className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
            project.status === "active"
              ? "bg-foreground text-background"
              : "bg-surface-hover text-muted"
          }`}
        >
          {project.status === "active" ? content.projects.active : content.projects.completed}
        </span>
        <h1 className="font-display mt-4 text-4xl font-normal tracking-tight sm:text-5xl">
          {project.title}
        </h1>
        <p className="mt-4 text-lg text-muted">{project.summary}</p>
      </FadeIn>

      <FadeIn delay={0.15} className="mt-8 grid gap-4 sm:grid-cols-2 border-y border-border py-6">
        <div>
          <p className="text-xs uppercase tracking-brand text-muted">{content.common.period}</p>
          <p className="mt-1 font-medium">{formatPeriod(project.dateStart, project.dateEnd)}</p>
        </div>
        {project.tags?.length > 0 && (
          <div>
            <p className="text-xs uppercase tracking-brand text-muted">{content.common.tools}</p>
            <p className="mt-1 font-medium">{project.tags.join(", ")}</p>
          </div>
        )}
      </FadeIn>

      {(project.links?.live || project.links?.repo) && (
        <FadeIn delay={0.2} className="mt-6 flex flex-wrap gap-3">
          {project.links.live && (
            <a
              href={project.links.live}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90 transition-opacity"
            >
              {content.common.live} →
            </a>
          )}
          {project.links.repo && (
            <a
              href={project.links.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:border-foreground/30 transition-colors"
            >
              {content.common.repo}
            </a>
          )}
        </FadeIn>
      )}

      <FadeIn delay={0.25} className="mt-12">
        <MDXContent source={project.content} />
      </FadeIn>
    </article>
  );
}
