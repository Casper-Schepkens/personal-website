import content from "@/lib/content";
import { siteConfig } from "@/lib/site";

export function createMetadata({ title, description, path = "" }) {
  const pageTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;
  const pageDescription = description ?? content.meta.description;
  const url = `${siteConfig.url}${path}`;

  return {
    title: title ?? siteConfig.name,
    description: pageDescription,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      url,
      siteName: siteConfig.name,
      title: pageTitle,
      description: pageDescription,
      images: [
        {
          url: "/images/og.png",
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: ["/images/og.png"],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
