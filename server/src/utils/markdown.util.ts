import removeMarkdown from 'remove-markdown';

export const extractCleanText = (markdown: string): string => {
  if (!markdown) return '';
  // Convert markdown to plain text
  let text = removeMarkdown(markdown);
  // Remove extra spaces and newlines
  text = text.replace(/\s+/g, ' ').trim();
  return text;
};
