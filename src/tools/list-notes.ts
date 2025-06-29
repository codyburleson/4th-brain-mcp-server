import { BaseTool } from "./base.js";

export class ListNotesTool extends BaseTool {
  async execute() {
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
            type: "text" as const,
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
}
