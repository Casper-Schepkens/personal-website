import fs from "fs";
import path from "path";
import matter from "gray-matter";

const roadmapDirectory = path.join(process.cwd(), "content/roadmap");

export function getRoadmapItems() {
  if (!fs.existsSync(roadmapDirectory)) return [];

  const files = fs
    .readdirSync(roadmapDirectory)
    .filter((file) => file.endsWith(".mdx"));

  const items = files.map((file) => {
    const raw = fs.readFileSync(path.join(roadmapDirectory, file), "utf8");
    const { data, content } = matter(raw);
    return {
      id: data.id ?? file.replace(/\.mdx$/, ""),
      date: data.date,
      type: data.type ?? "milestone",
      title: data.title,
      content,
    };
  });

  return items.sort((a, b) => (a.date ?? "").localeCompare(b.date ?? ""));
}
