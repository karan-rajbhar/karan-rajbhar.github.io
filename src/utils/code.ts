interface CodeBlockInfo {
  code: string;
  language: string;
  filename?: string;
}

export function parseCodeBlock(markdown: string): CodeBlockInfo {
  // Match code blocks with optional language and filename
  // Format: ```language path/to/file.ext\ncode```
  // or: ```language\ncode```
  const codeBlockRegex = /```(?:(\w+)(?:\s+([^\n]+))?\n)?([\s\S]*?)```/;
  const match = markdown.match(codeBlockRegex);

  if (!match) {
    return {
      code: markdown.replace(/^```|```$/g, '').trim(),
      language: 'plaintext'
    };
  }

  const [, language, possibleFilename, code] = match;

  // If possibleFilename looks like a path/filename, treat it as filename
  const isFilename = possibleFilename && /[./\\]/.test(possibleFilename);
  
  return {
    code: code.trim(),
    language: language || 'plaintext',
    filename: isFilename ? possibleFilename : undefined
  };
}

export function getLanguageFromFilename(filename: string): string {
  const extensionMap: Record<string, string> = {
    js: 'javascript',
    ts: 'typescript',
    jsx: 'jsx',
    tsx: 'tsx',
    html: 'html',
    css: 'css',
    json: 'json',
    md: 'markdown',
    py: 'python',
    rb: 'ruby',
    java: 'java',
    cpp: 'cpp',
    c: 'c',
    go: 'go',
    rs: 'rust',
    sh: 'bash',
    bash: 'bash',
    yml: 'yaml',
    yaml: 'yaml',
    sql: 'sql',
    php: 'php',
    astro: 'astro',
    ini: 'ini',
    conf: 'ini',
    toml: 'toml',
    dockerfile: 'docker',
    vue: 'vue',
    svelte: 'svelte',
    graphql: 'graphql',
    gql: 'graphql',
    xml: 'xml',
    nginx: 'nginx'
  };

  if (!filename) return 'plaintext';

  // Handle special cases like Dockerfile
  if (filename.toLowerCase() === 'dockerfile') return 'docker';
  
  const extension = filename.split('.').pop()?.toLowerCase();
  return extension ? extensionMap[extension] || 'plaintext' : 'plaintext';
} 