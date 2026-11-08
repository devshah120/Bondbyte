export interface TextBlocksData {
  blocks: { id: string; title: string; body: string }[];
}

/** Titled blocks of text, e.g. the privacy policy and terms. Paragraphs are split on empty lines. */
export function TextBlocks({ data }: { data: TextBlocksData }) {
  if (data.blocks.length === 0) return null;

  return (
    <section className="border-t border-line py-20 lg:py-28">
      <div className="container-page max-w-3xl space-y-10">
        {data.blocks.map((block) => (
          <div key={block.id} className="border-t border-line pt-7">
            <h2 className="text-[1.25rem] font-medium tracking-tight text-fg">{block.title}</h2>
            <div className="mt-3 space-y-3 text-[1.0625rem] leading-relaxed text-fg-muted">
              {block.body
                .split(/\n{2,}/)
                .filter(Boolean)
                .map((paragraph, i) => (
                  <p key={i} className="whitespace-pre-line">
                    {paragraph}
                  </p>
                ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
