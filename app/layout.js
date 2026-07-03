import content from "@/lib/content";
import { createMetadata, googleSiteVerification } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import "./globals.css";

const verification = googleSiteVerification();

export const metadata = {
  ...createMetadata({ description: content.meta.description }),
  title: {
    default: content.meta.siteName,
    template: `%s | ${content.meta.siteName}`,
  },
  ...(verification && { verification }),
};

export default function RootLayout({ children }) {
  return (
    <html lang="nl" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;var dark=t==='dark'?true:t==='light'?false:d;document.documentElement.classList.toggle('dark',dark);}catch(e){}})();`,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Source+Sans+3:ital,wght@0,400;0,500;0,600;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="min-h-screen font-sans"
        style={{
          "--font-sans": "'Source Sans 3', system-ui, sans-serif",
          "--font-display": "'Playfair Display', Georgia, serif",
        }}
      >
        <JsonLd />
        {children}
      </body>
    </html>
  );
}
