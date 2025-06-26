# Obsidian MCP Server

An MCP (Model Context Protocol) server for interacting with Obsidian vault markdown notes. This server enables Claude and other LLM applications to read, search, and create notes in your Obsidian vault.

## Features

- **List Notes**: Get an overview of all notes in your vault with metadata and tags
- **Read Notes**: Read specific notes with full content, frontmatter, and tags
- **Search Notes**: Search across all notes by content, titles, tags, and metadata
- **List Tags**: View all tags used throughout your vault
- **Create Notes**: Create new notes with frontmatter, content, and tags

## Installation

1. Clone this repository:
   ```bash
   git clone <repository-url>
   cd obsidian-mcp-server
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Build the server:
   ```bash
   yarn build
   ```

## Usage

### Environment Configuration

Set the `OBSIDIAN_VAULT_PATH` environment variable to point to your Obsidian vault:

```bash
export OBSIDIAN_VAULT_PATH="/path/to/your/obsidian/vault"
```

If not set, the server will use the current working directory.

### Running the Server

```bash
yarn start
# or directly:
node dist/index.cjs
```

### Integration with Claude Desktop

Add the server to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "obsidian": {
      "command": "node",
      "args": ["/Users/dev/repos/4th-brain-mcp/dist/index.cjs"],
      "env": {
        "OBSIDIAN_VAULT_PATH": "/Users/dev/repos/4th-brain-mcp/test-vault"
      }
    }
  }
}
```

### Integration with Claude Code

Configure the server in your Claude Code settings or use it with the MCP CLI.

## Available Tools

### `list-notes`
Lists all markdown notes in the vault with their metadata and tags.

### `read-note`
Reads a specific note by file path.

**Parameters:**
- `notePath` (string, required): Path to the note file

### `search-notes`
Searches for notes containing the specified query in title, content, tags, or metadata.

**Parameters:**
- `query` (string, required): Search query

### `list-tags`
Lists all tags found across all notes in the vault.

### `create-note`
Creates a new note with optional content and tags.

**Parameters:**
- `title` (string, required): Title of the note
- `content` (string, optional): Content of the note
- `tags` (array of strings, optional): Tags for the note

## Note Format

The server works with standard Markdown files that include YAML frontmatter:

```markdown
---
title: My Note
tags: [example, demo]
created: 2024-06-26T10:00:00Z
custom_field: value
---

# My Note

This is the content of my note.

I can use #inline-tags and [[wikilinks]].
```

## Development

### Scripts

- `yarn build` - Build the server
- `yarn dev` - Build in watch mode
- `yarn start` - Run the built server
- `yarn lint` - Lint the code
- `yarn type-check` - Check TypeScript types

### Project Structure

```
src/
├── index.ts          # Main server entry point
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
│   └── markdown.ts   # Markdown parsing utilities
└── tools/            # Individual tool implementations
```

## License

MIT License