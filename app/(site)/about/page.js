import Link from "next/link";
import content from "@/lib/content";
import { createMetadata } from "@/lib/seo";
import { SectionHeading, FadeIn } from "@/components/Motion";

export const metadata = createMetadata({
  title: content.about.title,
  description: content.about.subtitle,
  path: "/about",
});

export default function AboutPage() {
  const { story, highlights, approach } = content.about;
  const storyParagraphs = Array.isArray(story) ? story : [story];

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <SectionHeading title={content.about.title} subtitle={content.about.subtitle} />

      <FadeIn>
        <h3 className="font-display text-2xl">{content.about.storyTitle}</h3>
        <div className="mt-4 space-y-4 text-muted leading-relaxed text-lg">
          {storyParagraphs.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </FadeIn>

      <FadeIn delay={0.1} className="mt-16">
        <h3 className="font-display text-2xl">{content.about.highlightsTitle}</h3>
        <div className="mt-8 space-y-6">
          {highlights.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-border bg-surface p-6"
            >
              <h4 className="font-display text-xl">{item.title}</h4>
              <p className="mt-3 text-muted leading-relaxed">{item.text}</p>
              <Link
                href={item.href}
                className="mt-4 inline-flex text-sm font-medium text-foreground hover:underline underline-offset-4"
              >
                {item.linkLabel} →
              </Link>
            </div>
          ))}
        </div>
      </FadeIn>

      <FadeIn delay={0.15} className="mt-16">
        <h3 className="font-display text-2xl">{content.about.nowTitle}</h3>
        <p className="mt-4 text-muted leading-relaxed text-lg">{content.about.now}</p>
      </FadeIn>

      <FadeIn delay={0.17} className="mt-16">
        <h3 className="font-display text-2xl">{content.about.communityTitle}</h3>
        <p className="mt-4 text-muted leading-relaxed text-lg">{content.about.community}</p>
      </FadeIn>

      <FadeIn delay={0.2} className="mt-16">
        <h3 className="font-display text-2xl">{content.about.approachTitle}</h3>
        <ul className="mt-4 space-y-3">
          {approach.map((item) => (
            <li key={item} className="flex gap-3 text-muted leading-relaxed">
              <span className="text-foreground/40 select-none" aria-hidden>
                —
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </FadeIn>

      <FadeIn delay={0.25} className="mt-16 rounded-xl border border-border bg-surface p-6">
        <p className="text-sm text-muted">
          {content.about.roadmapNote}{" "}
          <a href="/roadmap" className="text-foreground hover:underline underline-offset-4">
            roadmap
          </a>
          .
        </p>
      </FadeIn>
    </div>
  );
}
