import Image from "next/image";

export default function MdxImage({ src, alt = "", className = "", ...props }) {
  if (!src) return null;

  return (
    <Image
      src={src}
      alt={alt}
      width={1200}
      height={800}
      sizes="(max-width: 768px) 100vw, 768px"
      className={`w-full h-auto rounded-xl border border-border ${className}`.trim()}
      {...props}
    />
  );
}
