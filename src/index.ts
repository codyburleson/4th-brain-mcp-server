import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import type { VaultConfig } from "./types/index.js";
import { MarkdownUtils } from "./utils/markdown.js";

class ObsidianMCPServer {
  private server: Server;
  private vaultConfig: VaultConfig;
  private markdownUtils: MarkdownUtils;

  constructor() {
    this.server = new Server(
      {
        name: "obsidian-mcp-server",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      },
    );

    this.vaultConfig = {
      path: process.env.OBSIDIAN_VAULT_PATH || process.cwd(),
    };

    this.markdownUtils = new MarkdownUtils(this.vaultConfig);
    this.setupToolHandlers();
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: "list-notes",
            description: "List all markdown notes in the Obsidian vault",
            inputSchema: {
              type: "object",
              properties: {},
            },
          },
          {
            name: "read-note",
            description: "Read the content of a specific note",
            inputSchema: {
              type: "object",
              properties: {
                notePath: {
                  type: "string",
                  description: "Path to the note file",
                },
              },
              required: ["notePath"],
            },
          },
          {
            name: "search-notes",
            description: "Search for text across all notes",
            inputSchema: {
              type: "object",
              properties: {
                query: {
                  type: "string",
                  description: "Search query",
                },
              },
              required: ["query"],
            },
          },
          {
            name: "list-tags",
            description: "List all tags used in the vault",
            inputSchema: {
              type: "object",
              properties: {},
            },
          },
          {
            name: "create-note",
            description: "Create a new note",
            inputSchema: {
              type: "object",
              properties: {
                title: {
                  type: "string",
                  description: "Title of the note",
                },
                content: {
                  type: "string",
                  description: "Content of the note",
                },
                tags: {
                  type: "array",
                  items: { type: "string" },
                  description: "Tags for the note",
                },
              },
              required: ["title"],
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case "list-notes":
            return await this.listNotes();
          case "read-note":
            return await this.readNote(args?.notePath as string);
          case "search-notes":
            return await this.searchNotes(args?.query as string);
          case "list-tags":
            return await this.listTags();
          case "create-note":
            return await this.createNote(
              args?.title as string,
              args?.content as string,
              args?.tags as string[],
            );
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  private async listNotes() {
    try {
      const notes = await this.markdownUtils.getAllNotes();
      const notesList = notes.map((note) => ({
        name: note.name,
        path: note.path,
        tags: note.tags,
        metadata: note.metadata,
      }));

      return {
        content: [
          {
            type: "text",
            text:
              `Found ${notes.length} notes:\n\n` +
              notesList
                .map(
                  (note) =>
                    `**${note.name}**\n` +
                    `Path: ${note.path}\n` +
                    `Tags: ${note.tags.join(", ") || "None"}\n` +
                    (Object.keys(note.metadata).length > 0
                      ? `Metadata: ${JSON.stringify(note.metadata, null, 2)}\n`
                      : "") +
                    "\n",
                )
                .join(""),
          },
        ],
      };
    } catch (error) {
      throw new Error(
        `Failed to list notes: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  private async readNote(notePath: string) {
    try {
      if (!notePath) {
        throw new Error("Note path is required");
      }

      const note = await this.markdownUtils.parseNote(notePath);

      let response = `# ${note.name}\n\n`;

      if (Object.keys(note.metadata).length > 0) {
        response += `**Metadata:**\n\`\`\`json\n${JSON.stringify(note.metadata, null, 2)}\n\`\`\`\n\n`;
      }

      if (note.tags.length > 0) {
        response += `**Tags:** ${note.tags.map((tag) => `#${tag}`).join(" ")}\n\n`;
      }

      if (note.content.trim()) {
        response += `**Content:**\n${note.content}`;
      } else {
        response += `**Content:** (empty)`;
      }

      return {
        content: [
          {
            type: "text",
            text: response,
          },
        ],
      };
    } catch (error) {
      throw new Error(
        `Failed to read note: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  private async searchNotes(query: string) {
    try {
      if (!query || query.trim() === "") {
        throw new Error("Search query is required");
      }

      const matchingNotes = await this.markdownUtils.searchNotes(query);

      if (matchingNotes.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: `No notes found matching query: "${query}"`,
            },
          ],
        };
      }

      const response =
        `Found ${matchingNotes.length} notes matching "${query}":\n\n` +
        matchingNotes
          .map((note) => {
            const preview =
              note.content.length > 200
                ? note.content.substring(0, 200) + "..."
                : note.content;

            return (
              `**${note.name}**\n` +
              `Path: ${note.path}\n` +
              `Tags: ${note.tags.join(", ") || "None"}\n` +
              `Preview: ${preview.replace(/\n/g, " ")}\n\n`
            );
          })
          .join("");

      return {
        content: [
          {
            type: "text",
            text: response,
          },
        ],
      };
    } catch (error) {
      throw new Error(
        `Failed to search notes: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  private async listTags() {
    try {
      const tags = await this.markdownUtils.getAllTags();

      if (tags.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: "No tags found in the vault.",
            },
          ],
        };
      }

      const response =
        `Found ${tags.length} tags in the vault:\n\n` +
        tags.map((tag) => `• #${tag}`).join("\n");

      return {
        content: [
          {
            type: "text",
            text: response,
          },
        ],
      };
    } catch (error) {
      throw new Error(
        `Failed to list tags: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  private async createNote(title: string, content?: string, tags?: string[]) {
    try {
      if (!title || title.trim() === "") {
        throw new Error("Note title is required");
      }

      const noteContent = content || "";
      const noteTags = tags || [];

      const filePath = await this.markdownUtils.createNote(
        title,
        noteContent,
        noteTags,
      );

      return {
        content: [
          {
            type: "text",
            text: `Successfully created note "${title}" at ${filePath}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(
        `Failed to create note: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Obsidian MCP Server running on stdio");
  }
}

const server = new ObsidianMCPServer();
server.run().catch(console.error);
