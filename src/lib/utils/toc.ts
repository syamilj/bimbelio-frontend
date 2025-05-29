export interface Heading {
  id: string;
  text: string;
  level: number;
}

export const extractHeadings = (markdown: string): Heading[] => {
  const headingRegex = /^(#{1,6})\s+(.+?)(?:\s*\{#([^}]+)\})?$/gm;
  const headings: Heading[] = [];
  let match;

  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = match[3] || slugify(text);

    headings.push({ id, text, level });
  }

  return headings;
};

export const addIdsToHeadings = (markdown: string): string => {
  return markdown.replace(
    /^(#{1,6})\s+(.+?)(?:\s*\{#([^}]+)\})?$/gm,
    (match, hashes, title, id) => {
      if (id) return match; // If ID already exists, don't modify
      const generatedId = slugify(title);
      return `${hashes} ${title} {#${generatedId}}`;
    },
  );
};

export const removeIdsFromContent = (markdown: string): string => {
  return markdown.replace(/^(#{1,6})\s+(.+?)\s*\{#[^}]+\}\s*$/gm, '$1 $2');
};

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/^-+|-+$/g, '');
};
