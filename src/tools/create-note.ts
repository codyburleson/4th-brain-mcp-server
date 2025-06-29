import { BaseTool } from "./base.js";

export class CreateNoteTool extends BaseTool {
  async execute(args: { title: string; content?: string; tags?: string[] }) {
    try {
      if (!args.title || args.title.trim() === "") {
        throw new Error("Note title is required");
      }

      const noteContent = args.content || "";
      const noteTags = args.tags || [];

      const filePath = await this.markdownUtils.createNote(
        args.title,
        noteContent,
        noteTags,
      );

      return {
        content: [
          {
            type: "text" as const,
            text: `Successfully created note "${args.title}" at ${filePath}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(
        `Failed to create note: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}
