/**
 * Inline SVG marks for the technologies we ship with.
 *
 * Drawn as simplified monochrome glyphs tinted by `currentColor` rather than
 * fetched brand assets — that keeps the row visually consistent, avoids
 * network requests, and sidesteps trademark-colour usage issues.
 */

type IconProps = { className?: string };

const P = ({ d, opacity }: { d: string; opacity?: string }) => (
  <path d={d} fill="currentColor" opacity={opacity} />
);

function Svg({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="none">
      {children}
    </svg>
  );
}

const ICONS: Record<string, (p: IconProps) => React.ReactElement> = {
  React: ({ className }) => (
    <Svg className={className}>
      <circle cx="12" cy="12" r="2.1" fill="currentColor" />
      <g stroke="currentColor" strokeWidth="1.1" fill="none">
        <ellipse cx="12" cy="12" rx="10" ry="3.9" />
        <ellipse cx="12" cy="12" rx="10" ry="3.9" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="3.9" transform="rotate(120 12 12)" />
      </g>
    </Svg>
  ),
  "Next.js": ({ className }) => (
    <Svg className={className}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.2" />
      <P d="M8.2 8h1.5l6 8.4-1.2.9-4.8-6.7V16H8.2V8Z" />
      <P d="M14.4 8h1.4v5.2l-1.4-2V8Z" />
    </Svg>
  ),
  TypeScript: ({ className }) => (
    <Svg className={className}>
      <rect x="2" y="2" width="20" height="20" rx="2.4" stroke="currentColor" strokeWidth="1.2" />
      <P d="M7 10.2V8.7h6v1.5h-2.2V17H9.2v-6.8H7Z" />
      <P d="M14 15.3c.5.4 1.2.6 1.9.6.8 0 1.2-.3 1.2-.8 0-.4-.3-.7-1.2-1-1.4-.5-2.1-1.2-2.1-2.3 0-1.4 1.1-2.3 2.8-2.3.8 0 1.5.2 2 .5l-.4 1.4c-.4-.2-.9-.4-1.5-.4-.7 0-1.1.3-1.1.7 0 .4.4.6 1.3 1 1.4.5 2 1.2 2 2.3 0 1.4-1 2.4-3 2.4-.8 0-1.7-.2-2.2-.6l.3-1.5Z" />
    </Svg>
  ),
  "Node.js": ({ className }) => (
    <Svg className={className}>
      <path
        d="M12 2.2 21 7.4v9.2L12 21.8 3 16.6V7.4L12 2.2Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <P d="M12.1 9.4c1.9 0 2.9.6 3 1.9h-1.4c-.1-.6-.6-.8-1.6-.8-1 0-1.5.3-1.5.8 0 .4.2.6 1 .7l1.4.2c1.5.2 2.2.8 2.2 1.9 0 1.4-1.1 2.1-3.1 2.1-2 0-3.1-.7-3.2-2.1h1.4c.1.7.7 1 1.8 1 1.1 0 1.6-.3 1.6-.8 0-.4-.3-.6-1.1-.7l-1.4-.2c-1.4-.2-2.1-.8-2.1-1.9 0-1.3 1.1-2.1 3-2.1Z" />
    </Svg>
  ),
  Flutter: ({ className }) => (
    <Svg className={className}>
      <P d="M13.9 2 5.6 10.3l2.6 2.6L19.1 2h-5.2Z" />
      <P d="M13.9 11.2 9.2 15.9l4.7 4.7h5.2l-4.7-4.7 4.7-4.7h-5.2Z" />
      <P d="M8.2 12.9 5.6 15.5l2.6 2.6 2.6-2.6-2.6-2.6Z" opacity="0.55" />
    </Svg>
  ),
  Python: ({ className }) => (
    <Svg className={className}>
      <P d="M11.9 2c-2.4 0-4.2.8-4.2 2.6v2h4.4v.8H6.3C4.4 7.4 3 8.7 3 11.5c0 2.3.9 3.9 2.8 3.9h1.5v-2.3c0-1.9 1.5-3.2 3.4-3.2h3.5c1.7 0 2.9-1.1 2.9-2.7V4.6C17.1 2.9 15.2 2 12 2h-.1Zm-2.3 1.5c.5 0 .9.4.9.9s-.4.9-.9.9-.9-.4-.9-.9.4-.9.9-.9Z" />
      <P d="M12.1 22c2.4 0 4.2-.8 4.2-2.6v-2h-4.4v-.8h5.8c1.9 0 3.3-1.3 3.3-4.1 0-2.3-.9-3.9-2.8-3.9h-1.5v2.3c0 1.9-1.5 3.2-3.4 3.2H9.8c-1.7 0-2.9 1.1-2.9 2.7v2.6c0 1.7 1.9 2.6 5.1 2.6h.1Zm2.3-1.5c-.5 0-.9-.4-.9-.9s.4-.9.9-.9.9.4.9.9-.4.9-.9.9Z" opacity="0.7" />
    </Svg>
  ),
  Laravel: ({ className }) => (
    <Svg className={className}>
      <P d="M2 6.6 6.2 4.2 10.4 6.6v4.7l3.6-2.1V4.5l4.2-2.4L22.4 4.5v4.8l-4.2 2.4v4.8L14 18.9l-4.2 2.4-4.2-2.4-3.6-2.1V6.6Zm1.5.9v7.7l2.7 1.6V9.1L3.5 7.5Z" />
    </Svg>
  ),
  PHP: ({ className }) => (
    <Svg className={className}>
      <ellipse cx="12" cy="12" rx="10.5" ry="6" stroke="currentColor" strokeWidth="1.2" />
      <P d="M6 9h2.6c1.4 0 2.1.7 1.9 1.9l-.2 1c-.2 1.1-1 1.7-2.3 1.7H6.9l-.3 1.4H5L6 9Zm1.2 1.3-.4 2h.9c.6 0 1-.3 1.1-.8l.1-.5c.1-.5-.1-.7-.7-.7h-1Z" />
      <P d="M11.4 7h1.6l-.3 2h1.4c1.3 0 1.9.6 1.7 1.7l-.6 3.3h-1.6l.6-3c.1-.5-.1-.7-.6-.7h-1.2l-.8 3.7h-1.6L11.4 7Z" />
      <P d="M17 9h2.6c1.4 0 2.1.7 1.9 1.9l-.2 1c-.2 1.1-1 1.7-2.3 1.7h-1.1l-.3 1.4h-1.6L17 9Zm1.2 1.3-.4 2h.9c.6 0 1-.3 1.1-.8l.1-.5c.1-.5-.1-.7-.7-.7h-1Z" />
    </Svg>
  ),
  AWS: ({ className }) => (
    <Svg className={className}>
      <P d="M6.9 10.6c0 .3 0 .5.1.7l.3.6c0 .1.1.1.1.2s0 .2-.2.3l-.5.4h-.2c-.1 0-.2 0-.3-.1l-.4-.5-.3-.6c-.7.8-1.5 1.2-2.5 1.2-.7 0-1.3-.2-1.7-.6-.4-.4-.6-1-.6-1.6 0-.7.3-1.3.8-1.7.5-.4 1.2-.6 2.2-.6.3 0 .6 0 1 .1l1 .2v-.6c0-.6-.1-1.1-.4-1.3-.3-.3-.7-.4-1.4-.4-.3 0-.6 0-.9.1l-.9.3h-.3c-.2 0-.2-.1-.2-.3v-.4c0-.2 0-.3.1-.3l.2-.2c.3-.2.7-.3 1.1-.4L4.2 5c.9 0 1.6.2 2 .6.4.4.6 1 .6 1.9v2.5Zm-3.4 1.3c.3 0 .6-.1.9-.2.3-.1.6-.3.8-.6l.3-.5v-1l-.8-.2-.8-.1c-.6 0-1 .1-1.3.3-.3.2-.4.5-.4.9s.1.7.3.9c.2.3.5.4.9.4Zm6.8.9c-.2 0-.3 0-.4-.1l-.2-.3-2-6.5v-.3c0-.2 0-.2.2-.2h.8c.2 0 .3 0 .4.1l.2.3 1.4 5.6 1.3-5.6.2-.3c.1-.1.2-.1.4-.1h.7c.2 0 .3 0 .4.1l.2.3 1.4 5.7 1.5-5.7.2-.3c.1-.1.2-.1.4-.1h.8c.1 0 .2.1.2.2v.3l-2.1 6.5-.2.3c-.1.1-.2.1-.4.1h-.8c-.2 0-.3 0-.4-.1l-.2-.3-1.3-5.5-1.3 5.5-.2.3c-.1.1-.2.1-.4.1h-.8Zm10.8.2c-.4 0-.9-.1-1.3-.2l-.9-.3-.2-.2-.1-.3v-.4c0-.2.1-.3.2-.3h.2l.2.1c.3.1.6.2.9.3l1 .1c.5 0 .9-.1 1.2-.3.3-.2.4-.4.4-.8 0-.2-.1-.4-.2-.6l-.8-.4-1.2-.4c-.6-.2-1-.5-1.3-.8-.3-.4-.4-.8-.4-1.2 0-.4.1-.7.2-.9l.6-.7.8-.4 1-.1h.5l.6.1.5.1.4.2.2.2.1.3v.4c0 .2-.1.3-.2.3h-.3c-.5-.2-1-.3-1.6-.3-.5 0-.8.1-1.1.2-.3.2-.4.4-.4.7 0 .2.1.4.3.6l.9.4 1.2.4c.5.2 1 .4 1.2.8.2.3.4.7.4 1.1 0 .4-.1.7-.2 1l-.6.7-.9.5c-.4.1-.8.1-1.3.1Z" />
      <P d="M20.6 17.1c-2.7 2-6.6 3.1-10 3.1-4.7 0-8.9-1.7-12.1-4.6-.2-.2-.1-.5.2-.3 3.5 2 7.7 3.2 12.2 3.2 3 0 6.3-.6 9.3-1.9.5-.2.9.3.4.5Zm1.1-1.3c-.3-.4-2.3-.2-3.1-.1-.3 0-.3-.2-.1-.3 1.5-1.1 4-.8 4.3-.4.3.4-.1 2.9-1.5 4.1-.2.2-.4.1-.3-.2.3-.8.9-2.7.7-3.1Z" opacity="0.7" />
    </Svg>
  ),
  Docker: ({ className }) => (
    <Svg className={className}>
      <P d="M4 10.5h2.4v2.4H4v-2.4Zm2.9 0h2.4v2.4H6.9v-2.4Zm2.9 0h2.4v2.4H9.8v-2.4Zm2.9 0h2.4v2.4h-2.4v-2.4ZM6.9 7.6h2.4V10H6.9V7.6Zm2.9 0h2.4V10H9.8V7.6Zm2.9 0h2.4V10h-2.4V7.6Zm0-2.9h2.4v2.4h-2.4V4.7Z" />
      <P d="M23 11.4c-.5-.3-1.6-.5-2.5-.3-.1-.9-.6-1.6-1.5-2.3l-.5-.4-.4.5c-.5.7-.7 1.9-.2 2.8-.3.1-.7.3-1.3.3H1.3c-.2 1.3.1 3 1.1 4.4 1.1 1.4 2.8 2.1 5 2.1 4.8 0 8.4-2.2 10.1-6.3 1.2 0 2.5 0 3.2-1.3l.4-.6-.9-.6-.2.2Z" opacity="0.75" />
    </Svg>
  ),
  MongoDB: ({ className }) => (
    <Svg className={className}>
      <P d="M12 2s4.3 4.2 4.3 8.9c0 3.9-2.6 6.4-3.7 7.3l-.3 2.4h-.6l-.3-2.4c-1.1-.9-3.7-3.4-3.7-7.3C7.7 6.2 12 2 12 2Zm0 2.8v12.6c.8-.9 2.1-2.8 2.1-6.5 0-2.8-1.4-5.1-2.1-6.1Z" />
    </Svg>
  ),
  MySQL: ({ className }) => (
    <Svg className={className}>
      <ellipse cx="12" cy="6" rx="8" ry="3.2" stroke="currentColor" strokeWidth="1.3" />
      <path d="M4 6v6c0 1.8 3.6 3.2 8 3.2s8-1.4 8-3.2V6" stroke="currentColor" strokeWidth="1.3" />
      <path d="M4 12v6c0 1.8 3.6 3.2 8 3.2s8-1.4 8-3.2v-6" stroke="currentColor" strokeWidth="1.3" />
    </Svg>
  ),
  WordPress: ({ className }) => (
    <Svg className={className}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.2" />
      <P d="M3.6 12c0-1.2.3-2.4.7-3.4l3.9 10.6C5.4 17.9 3.6 15.2 3.6 12Zm8.4 8.4c-.8 0-1.6-.1-2.3-.3l2.5-7.2 2.5 6.9v.2c-.8.3-1.7.4-2.7.4Zm1.1-12.3c.5 0 .9-.1.9-.1.4 0 .4-.7-.1-.6 0 0-1.4.1-2.2.1-.8 0-2.2-.1-2.2-.1-.5 0-.5.6-.1.6 0 0 .4.1.9.1l1.3 3.5-1.8 5.4L7 8.1c.5 0 .9-.1.9-.1.4 0 .4-.7-.1-.6 0 0-1.4.1-2.2.1h-.5C6.6 5.1 9.1 3.6 12 3.6c2.1 0 4.1.8 5.5 2.2h-.2c-.9 0-1.5.8-1.5 1.6 0 .8.4 1.4.9 2.1.3.6.7 1.3.7 2.4 0 .8-.3 1.7-.7 2.9l-.9 3-3.3-9.7Zm5.1 11.1 2.5-7.2c.5-1.2.6-2.1.6-2.9v-.4c.6 1.1.9 2.4.9 3.7 0 2.9-1.6 5.4-3.9 6.8Z" />
    </Svg>
  ),
  Git: ({ className }) => (
    <Svg className={className}>
      <path
        d="M22.4 11 13 1.6a1.4 1.4 0 0 0-2 0L9 3.6l2.5 2.5a1.7 1.7 0 0 1 2.1 2.1l2.4 2.4a1.7 1.7 0 1 1-1 1L12.8 9.3v5.9a1.7 1.7 0 1 1-1.4 0V9.2a1.7 1.7 0 0 1-.9-2.2L8 4.6l-6.4 6.5a1.4 1.4 0 0 0 0 2l9.4 9.4a1.4 1.4 0 0 0 2 0l9.4-9.4a1.4 1.4 0 0 0 0-2Z"
        fill="currentColor"
      />
    </Svg>
  ),
  Figma: ({ className }) => (
    <Svg className={className}>
      <P d="M8.5 2h3.4v6.8H8.5a3.4 3.4 0 0 1 0-6.8Z" />
      <P d="M12.1 2h3.4a3.4 3.4 0 0 1 0 6.8h-3.4V2Z" opacity="0.8" />
      <P d="M12.1 8.9h3.4a3.4 3.4 0 1 1-3.4 3.4V8.9Z" opacity="0.65" />
      <P d="M8.5 8.9h3.4v6.8H8.5a3.4 3.4 0 1 1 0-6.8Z" opacity="0.85" />
      <P d="M8.5 15.7h3.4v3.1a3.4 3.4 0 1 1-3.4-3.1Z" opacity="0.7" />
    </Svg>
  ),
};

/** Renders a technology's mark, or a neutral dot when we have no glyph. */
export function TechIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name];
  if (!Icon) {
    return (
      <span
        aria-hidden
        className={`inline-block rounded-full bg-current opacity-40 ${className ?? ""}`}
      />
    );
  }
  return <Icon className={className} />;
}

export const HAS_ICON = (name: string): boolean => name in ICONS;
