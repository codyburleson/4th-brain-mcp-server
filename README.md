# 4th Brain MCP Server

An MCP (Model Context Protocol) server for interacting with markdown notes in a personal knowledge vault. This server enables Claude Desktop, Claude Code, and other LLM applications to interact with any personal knowledge management (PKM) system that follows the 4th Brain Open Standards and Guidelines. You can learn more about 4th Brain from the [4th Brain Reference Vault for Obsidian](https://github.com/codyburleson/4th-brain-reference-vault).

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
   cd 4th-brain-mcp-server
   ```

2. If using VS Code, execute the following command:

```bash
yarn dlx @yarnpkg/sdks vscode
```

This modifies your .vscode/settings.json to add TypeScript compiler-wrapper inside tssdk as a Workspace TypeScript compiler.

(note: before executing this step, test whether it works without executing it, since the first time I did, it updated settings.json, which is now part of the project)

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

Set the `VAULT_PATH` environment variable to point to your knowledge vault (an Obsidian vault, for example):

```bash
export VAULT_PATH="/path/to/your/knowledge/vault"
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

macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
Windows: `%APPDATA%\Claude\claude_desktop_config.json`

Open up the configuration file in any text editor. Add the 4th Brain stanza as shown below and then close and restart Claude Desktop.

```json
{
  "mcpServers": {
    "4th-brain": {
      "command": "node",
      "args": ["/Users/dev/repos/4th-brain-mcp-server/dist/index.cjs"],
      "env": {
        "VAULT_PATH": "/Users/dev/repos/4th-brain-mcp-server/test-vault"
      }
    }
  }
}
```

### Integration with Claude Code

Configure the server in your Claude Code settings or use it with the MCP CLI.

First make sure your local entry point node file has execute permissions...

```bash
chmod +x /Users/dev/repos/4th-brain-mcp-server/dist/index.cjs
```

Execute the following Claude Code command:

```bash
claude mcp add 4th-brain -e VAULT_PATH=/Users/dev/repos/4th-brain-mcp-server/test-vault -s user -- /Users/dev/repos/4th-brain-mcp-server/dist/index.cjs
```

Where...

e = environment variables
s = scope (local, project, or user)

Verify the MCP server is running with the following Claude Code slash command:

```bash
/mcp
```

You can remove the server from Claude Code with the following command:

```bash
claude mcp remove 4th-brain
```

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
├── prompts/          # Pre-written templates that help users accomplish specific tasks
├── resources/        # File-like data that can be read by clients (like API responses or file contents)
├── tools/            # Functions that can be called by the LLM (with user approval)
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
│   └── markdown.ts   # Markdown parsing utilities
└── index.ts          # Main server entry point
```

## License

MIT License

## Developer References

- https://modelcontextprotocol.io
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)

