import type { Options as SanitizeSchema } from 'rehype-sanitize';
import { defaultSchema } from 'rehype-sanitize';

/**
 * Sanitize schema for markdown rendered with `rehype-raw`.
 *
 * Extends the GitHub-style default schema so that raw HTML (scripts, event
 * handlers, `javascript:` URLs, iframes, ...) is stripped, while still keeping
 * the classes needed for math (`language-math`, `math-inline`,
 * `math-display`) and syntax highlighting.
 *
 * Use it right after `rehype-raw` and before `rehype-katex`:
 * `rehypePlugins={[rehypeRaw, [rehypeSanitize, markdownSanitizeSchema], rehypeKatex]}`
 */
export const markdownSanitizeSchema: SanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    code: [...(defaultSchema.attributes?.code ?? []), 'className'],
    pre: [...(defaultSchema.attributes?.pre ?? []), 'className'],
    span: [...(defaultSchema.attributes?.span ?? []), 'className'],
    div: [...(defaultSchema.attributes?.div ?? []), 'className'],
  },
};
