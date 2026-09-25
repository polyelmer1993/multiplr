/** Hidden until focused: lets keyboard users jump past the header. */
export function SkipLink({ href }: { href: string }) {
  return (
    <a
      href={href}
      className="sr-only z-50 bg-paper px-4 py-3 text-ink focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
    >
      Skip to content
    </a>
  );
}
