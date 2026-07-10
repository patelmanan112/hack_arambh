/**
 * ChunkingService
 * Converts raw repository artifacts into clean text chunks
 * suitable for embedding and Qdrant storage.
 */

const MAX_CHUNK_CHARS = 1500; // ~375 tokens, safe for embedding

/** Split a long text into overlapping chunks */
function splitText(text: string, chunkSize = MAX_CHUNK_CHARS, overlap = 200): string[] {
  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    chunks.push(text.slice(start, end).trim());
    if (end === text.length) break;
    start = end - overlap;
  }

  return chunks.filter(c => c.length > 50); // discard tiny fragments
}

export interface TextChunk {
  text: string;
  source: string;
  sourceType: 'README' | 'PR' | 'Commit' | 'Issue' | 'Contributor' | 'Repository';
  url?: string;
  author?: string;
  date?: string;
}

/** Chunk a README document */
export function chunkReadme(readmeText: string, repoName: string): TextChunk[] {
  const cleaned = readmeText.replace(/!\[.*?\]\(.*?\)/g, '').trim(); // remove images
  const sections = cleaned.split(/\n#{1,3} /); // split by headings

  const chunks: TextChunk[] = [];
  for (const section of sections) {
    if (section.trim().length < 30) continue;
    const parts = splitText(section);
    for (const part of parts) {
      chunks.push({
        text: `[README: ${repoName}]\n${part}`,
        source: `${repoName}/README.md`,
        sourceType: 'README',
      });
    }
  }

  return chunks;
}

/** Chunk Pull Requests */
export function chunkPullRequests(prs: any[], repoName: string): TextChunk[] {
  const chunks: TextChunk[] = [];

  for (const pr of prs) {
    const body = pr.description || pr.body || '';
    const text = `[Pull Request #${pr.prNumber || pr.number}: ${pr.title}]
Author: ${pr.author || pr.user?.login || 'Unknown'}
State: ${pr.state || 'unknown'}
${body ? `Description:\n${body.substring(0, 800)}` : ''}`.trim();

    if (text.length > 40) {
      chunks.push({
        text,
        source: `${repoName}/PR #${pr.prNumber || pr.number}`,
        sourceType: 'PR',
        url: pr.url || pr.html_url,
        author: pr.author || pr.user?.login,
      });
    }
  }

  return chunks;
}

/** Chunk Commits — group into batches of 10 */
export function chunkCommits(commits: any[], repoName: string): TextChunk[] {
  const chunks: TextChunk[] = [];
  const BATCH = 10;

  for (let i = 0; i < commits.length; i += BATCH) {
    const batch = commits.slice(i, i + BATCH);
    const lines = batch.map((c: any) => {
      const msg = c.commitMessage || c.commit?.message || '';
      const author = c.author || c.commit?.author?.name || 'Unknown';
      const date = c.date || c.commit?.author?.date || '';
      return `- ${msg.split('\n')[0]} (by ${author}${date ? ` on ${new Date(date).toLocaleDateString()}` : ''})`;
    });

    chunks.push({
      text: `[Recent Commits in ${repoName}]\n${lines.join('\n')}`,
      source: `${repoName}/commits`,
      sourceType: 'Commit',
      author: batch[0]?.author,
    });
  }

  return chunks;
}

/** Chunk Issues */
export function chunkIssues(issues: any[], repoName: string): TextChunk[] {
  const chunks: TextChunk[] = [];

  for (const issue of issues) {
    const body = issue.description || issue.body || '';
    const labels = Array.isArray(issue.labels)
      ? issue.labels.map((l: any) => (typeof l === 'string' ? l : l.name)).join(', ')
      : '';
    const text = `[Issue: ${issue.title}]
Status: ${issue.status || issue.state || 'unknown'}
${labels ? `Labels: ${labels}` : ''}
${body ? `Description:\n${body.substring(0, 800)}` : ''}`.trim();

    if (text.length > 40) {
      chunks.push({
        text,
        source: `${repoName}/Issues`,
        sourceType: 'Issue',
        author: issue.assignee,
      });
    }
  }

  return chunks;
}

/** Chunk Contributors */
export function chunkContributors(contributors: any[], repoName: string): TextChunk[] {
  if (!contributors || contributors.length === 0) return [];

  const lines = contributors
    .slice(0, 30)
    .map((c: any) => `- ${c.githubUsername || c.login}: ${c.commitsCount || c.contributions || 0} commits`);

  return [{
    text: `[Contributors to ${repoName}]\n${lines.join('\n')}`,
    source: `${repoName}/contributors`,
    sourceType: 'Contributor',
  }];
}
