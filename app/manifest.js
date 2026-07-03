import content from "@/lib/content";
import { siteConfig } from "@/lib/site";

export default function manifest() {
  return {
    name: content.meta.siteName,
    short_name: "CS",
    description: content.meta.description,
    start_url: "/",
    display: "standalone",
    background_color: "#e8e8e8",
    theme_color: "#2d2d2d",
    lang: "nl",
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
    ],
  };
}
