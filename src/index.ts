import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import type { VaultConfig } from "./types/index.js";
import { MarkdownUtils } from "./utils/markdown.js";
import {
  ListNotesTool,
  ReadNoteTool,
  SearchNotesTool,
  ListTagsTool,
  CreateNoteTool,
} from "./tools/index.js";

class ObsidianMCPServer {
  private server: Server;
  private vaultConfig: VaultConfig;
  private markdownUtils: MarkdownUtils;
  private listNotesTool: ListNotesTool;
  private readNoteTool: ReadNoteTool;
  private searchNotesTool: SearchNotesTool;
  private listTagsTool: ListTagsTool;
  private createNoteTool: CreateNoteTool;

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

    // Initialize tools
    this.listNotesTool = new ListNotesTool(this.markdownUtils);
    this.readNoteTool = new ReadNoteTool(this.markdownUtils);
    this.searchNotesTool = new SearchNotesTool(this.markdownUtils);
    this.listTagsTool = new ListTagsTool(this.markdownUtils);
    this.createNoteTool = new CreateNoteTool(this.markdownUtils);

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
            return await this.listNotesTool.execute();
          case "read-note":
            return await this.readNoteTool.execute({
              notePath: args?.notePath as string,
            });
          case "search-notes":
            return await this.searchNotesTool.execute({
              query: args?.query as string,
            });
          case "list-tags":
            return await this.listTagsTool.execute();
          case "create-note":
            return await this.createNoteTool.execute({
              title: args?.title as string,
              content: args?.content as string,
              tags: args?.tags as string[],
            });
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

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Obsidian MCP Server running on stdio");
  }
}

const server = new ObsidianMCPServer();
server.run().catch(console.error);
