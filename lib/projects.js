import fs from "fs";
import path from "path";
import matter from "gray-matter";

const projectsDirectory = path.join(process.cwd(), "content/projects");

function parseProjectFile(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);

  return {
    slug: data.slug,
    title: data.title,
    status: data.status,
    tags: data.tags ?? [],
    dateStart: data.dateStart,
    dateEnd: data.dateEnd ?? null,
    summary: data.summary,
    coverImage: data.coverImage ?? "/images/placeholder-project.svg",
    coverFit: data.coverFit ?? "contain",
    links: data.links ?? {},
    priority: data.priority ?? 99,
    featured: data.featured ?? false,
    content,
  };
}

export function getAllProjects() {
  if (!fs.existsSync(projectsDirectory)) return [];

  const files = fs
    .readdirSync(projectsDirectory)
    .filter((file) => file.endsWith(".mdx"));

  const projects = files.map((file) =>
    parseProjectFile(path.join(projectsDirectory, file))
  );

  return projects.sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority;
    return (b.dateStart ?? "").localeCompare(a.dateStart ?? "");
  });
}

export function getProjectBySlug(slug) {
  const filePath = path.join(projectsDirectory, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  return parseProjectFile(filePath);
}

export function getFeaturedProjects(limit = 4) {
  const projects = getAllProjects();
  const featured = projects.filter((p) => p.featured);
  if (featured.length >= limit) return featured.slice(0, limit);
  const rest = projects.filter((p) => !p.featured);
  return [...featured, ...rest].slice(0, limit);
}

export function getActiveProjects(limit = 2) {
  return getAllProjects()
    .filter((p) => p.status === "active")
    .slice(0, limit);
}

export function getAllProjectSlugs() {
  if (!fs.existsSync(projectsDirectory)) return [];
  return fs
    .readdirSync(projectsDirectory)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getProjectLastModified(slug) {
  const filePath = path.join(projectsDirectory, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return new Date();
  return fs.statSync(filePath).mtime;
}

export function getAllTags() {
  const tags = new Set();
  getAllProjects().forEach((p) => p.tags.forEach((tag) => tags.add(tag)));
  return Array.from(tags).sort();
}
