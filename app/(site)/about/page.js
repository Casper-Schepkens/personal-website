import content from "@/lib/content";
import { createMetadata } from "@/lib/seo";
import { SectionHeading, FadeIn } from "@/components/Motion";

export const metadata = createMetadata({
  title: content.about.title,
  description: content.about.subtitle,
  path: "/about",
});

export default function AboutPage() {
  const { skills } = content.about;

  const skillGroups = [
    { label: "Development", items: skills.dev },
    { label: "Tools", items: skills.tools },
    { label: "Overig", items: skills.other },
  ];

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <SectionHeading title={content.about.title} subtitle={content.about.subtitle} />

      <FadeIn>
        <h3 className="font-display text-2xl">{content.about.storyTitle}</h3>
        <p className="mt-4 text-muted leading-relaxed text-lg">{content.about.story}</p>
      </FadeIn>

      <FadeIn delay={0.1} className="mt-16">
        <h3 className="font-display text-2xl">{content.about.skillsTitle}</h3>
        <p className="mt-2 text-muted">{content.about.skillsIntro}</p>

        <div className="mt-8 grid gap-8 sm:grid-cols-3">
          {skillGroups.map((group) => (
            <div key={group.label}>
              <p className="text-xs font-medium uppercase tracking-brand text-muted mb-3">
                {group.label}
              </p>
              <ul className="space-y-2">
                {group.items.map((skill) => (
                  <li key={skill} className="text-sm text-muted">
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </FadeIn>

      <FadeIn delay={0.2} className="mt-16 rounded-xl border border-border bg-surface p-6">
        <p className="text-sm text-muted">
          Meer context over mijn pad vind je op de{" "}
          <a href="/roadmap" className="text-foreground hover:underline underline-offset-4">
            roadmap
          </a>
          .
        </p>
      </FadeIn>
    </div>
  );
}
