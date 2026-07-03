import { ImageResponse } from "next/og";
import content from "@/lib/content";

export const alt = content.meta.siteName;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          padding: "80px",
          backgroundColor: "#e8e8e8",
          color: "#2d2d2d",
        }}
      >
        <p
          style={{
            fontSize: 28,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#6b6b6b",
            marginBottom: 24,
          }}
        >
          Student · Ondernemer · Bouwer
        </p>
        <p
          style={{
            fontSize: 72,
            fontWeight: 400,
            lineHeight: 1.1,
            margin: 0,
            fontFamily: "Georgia, serif",
          }}
        >
          {content.meta.siteName}
        </p>
        <p
          style={{
            fontSize: 32,
            lineHeight: 1.4,
            color: "#6b6b6b",
            marginTop: 32,
            maxWidth: 900,
          }}
        >
          {content.meta.description}
        </p>
      </div>
    ),
    { ...size }
  );
}
