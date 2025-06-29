import { BaseTool } from "./base.js";

export class ReadNoteTool extends BaseTool {
  async execute(args: { notePath: string }) {
    try {
      if (!args.notePath) {
        throw new Error("Note path is required");
      }

      const note = await this.markdownUtils.parseNote(args.notePath);

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
            type: "text" as const,
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
}
