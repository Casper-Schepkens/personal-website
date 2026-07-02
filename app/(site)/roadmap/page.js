import content from "@/lib/content";
import { getRoadmapItems } from "@/lib/roadmap";
import { SectionHeading, FadeIn } from "@/components/Motion";
import MDXContent from "@/components/MDXContent";

export default function RoadmapPage() {
  const items = getRoadmapItems();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <SectionHeading title={content.roadmap.title} subtitle={content.roadmap.subtitle} />

      <div className="relative">
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" aria-hidden />

        <div className="space-y-10">
          {items.map((item, i) => (
            <FadeIn key={item.id} delay={i * 0.06}>
              <div className="relative pl-8">
                <span className="absolute left-0 top-1.5 h-[15px] w-[15px] rounded-full border-2 border-foreground bg-background" />
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <time className="text-sm font-medium">{item.date}</time>
                  <span className="rounded-md bg-surface-hover px-2 py-0.5 text-xs text-muted">
                    {content.roadmap.types[item.type] ?? item.type}
                  </span>
                </div>
                <h3 className="font-display mt-2 text-xl">{item.title}</h3>
                {item.content.trim() && (
                  <div className="mt-2">
                    <MDXContent source={item.content} />
                  </div>
                )}
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
}
