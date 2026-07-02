import { MDXRemote } from "next-mdx-remote/rsc";

const components = {
  h2: (props) => (
    <h2 className="font-display text-2xl font-semibold mt-10 mb-4" {...props} />
  ),
  h3: (props) => (
    <h3 className="font-display text-xl font-semibold mt-8 mb-3" {...props} />
  ),
  p: (props) => <p className="text-muted leading-relaxed mb-4" {...props} />,
  ul: (props) => <ul className="list-disc pl-5 mb-4 space-y-1 text-muted" {...props} />,
  ol: (props) => <ol className="list-decimal pl-5 mb-4 space-y-1 text-muted" {...props} />,
  li: (props) => <li className="leading-relaxed" {...props} />,
  a: (props) => (
    <a className="text-foreground underline underline-offset-4 hover:opacity-80" target="_blank" rel="noopener noreferrer" {...props} />
  ),
  strong: (props) => <strong className="font-semibold text-foreground" {...props} />,
  img: (props) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img className="my-6 w-full rounded-xl border border-border" {...props} />
  ),
  ImageRow: ({ cols = 2, children }) => (
    <div
      className={`my-6 grid gap-3 ${
        cols === 3 ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-2"
      } [&_img]:my-0`}
    >
      {children}
    </div>
  ),
};

export default function MDXContent({ source }) {
  return (
    <div className="prose-custom max-w-none">
      <MDXRemote source={source} components={components} />
    </div>
  );
}
