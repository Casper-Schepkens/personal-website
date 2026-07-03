import { siteConfig } from "@/lib/site";
import { absoluteUrl } from "@/lib/seo";

export default function ProjectJsonLd({ project, slug }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    url: absoluteUrl(`/projects/${slug}`),
    image: absoluteUrl(project.coverImage),
    author: { "@id": `${siteConfig.url}/#person` },
    inLanguage: "nl-BE",
    ...(project.dateStart && { dateCreated: project.dateStart }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
