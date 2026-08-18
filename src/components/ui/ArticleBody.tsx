import type { InsightBlock } from "@/lib/constants/insights";

/**
 * Renders an article's typed blocks.
 *
 * Paragraph text supports inline `backticks`, which become <code>. The parser
 * is deliberately tiny — it splits on backtick pairs rather than pulling in a
 * markdown dependency for one feature, and it never injects HTML, so article
 * text cannot introduce markup.
 */
export function ArticleBody({ blocks }: { blocks: readonly InsightBlock[] }) {
  return (
    <div className="space-y-6">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "h2":
            return (
              <h2
                key={i}
                className="pt-6 text-[1.4rem] font-semibold leading-snug tracking-tight text-fg lg:text-[1.6rem]"
              >
                {block.text}
              </h2>
            );

          case "quote":
            return (
              <blockquote
                key={i}
                className="border-l-2 border-accent pl-6 text-[1.15rem] font-medium leading-relaxed text-fg"
              >
                {renderInline(block.text)}
              </blockquote>
            );

          case "list":
            return (
              <ul key={i} className="space-y-2.5 pl-1">
                {block.items.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-[1.0625rem] leading-[1.75] text-fg-muted"
                  >
                    <span aria-hidden className="mt-[0.7em] h-1 w-1 shrink-0 rounded-full bg-accent" />
                    <span>{renderInline(item)}</span>
                  </li>
                ))}
              </ul>
            );

          case "p":
          default:
            return (
              <p key={i} className="text-[1.0625rem] leading-[1.8] text-fg-muted">
                {renderInline(block.text)}
              </p>
            );
        }
      })}
    </div>
  );
}

/** Splits on backtick pairs; odd segments become inline code. */
function renderInline(text: string): React.ReactNode {
  const parts = text.split("`");
  if (parts.length === 1) return text;

  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <code
        key={i}
        className="rounded border border-line bg-surface-hi px-1.5 py-0.5 font-mono text-[0.875em] text-fg"
      >
        {part}
      </code>
    ) : (
      part
    ),
  );
}
