import Image from "next/image";

/**
 * Project cover images use a fixed aspect frame. Logos and mixed-ratio assets
 * need object-contain + inset padding so nothing gets cropped.
 * Pass coverFit="cover" for full-bleed photo covers only.
 */
export default function ProjectCoverImage({
  src,
  alt,
  aspect = "16/10",
  coverFit = "contain",
  priority = false,
  sizes,
  className = "",
  hover = false,
}) {
  const aspectClass =
    aspect === "16/9" ? "aspect-[16/9]" : "aspect-[16/10]";
  const isCover = coverFit === "cover";

  return (
    <div
      className={`relative overflow-hidden bg-[var(--color-logo-tile)] ${aspectClass} ${className}`}
    >
      <div
        className={
          isCover
            ? "absolute inset-0"
            : "absolute inset-5 sm:inset-8"
        }
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={`${
            isCover ? "object-cover" : "object-contain"
          } ${hover ? "transition-transform duration-500 group-hover:scale-105" : ""} ${className}`}
        />
      </div>
    </div>
  );
}
