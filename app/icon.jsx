import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundColor: "#2d2d2d",
          color: "#e8e8e8",
          fontSize: 18,
          fontWeight: 600,
          fontFamily: "Georgia, serif",
        }}
      >
        CS
      </div>
    ),
    { ...size }
  );
}
