import { BaseTool } from "./base.js";

export class SearchNotesTool extends BaseTool {
  async execute(args: { query: string }) {
    try {
      if (!args.query || args.query.trim() === "") {
        throw new Error("Search query is required");
      }

      const matchingNotes = await this.markdownUtils.searchNotes(args.query);

      if (matchingNotes.length === 0) {
        return {
          content: [
            {
              type: "text" as const,
              text: `No notes found matching query: "${args.query}"`,
            },
          ],
        };
      }

      const response =
        `Found ${matchingNotes.length} notes matching "${args.query}":\n\n` +
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
            type: "text" as const,
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
}
