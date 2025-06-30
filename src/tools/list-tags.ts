import { BaseTool } from "./base.js";

export class ListTagsTool extends BaseTool {
  async execute() {
    try {
      const tags = await this.markdownUtils.getAllTags();

      if (tags.length === 0) {
        return {
          content: [
            {
              type: "text" as const,
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
            type: "text" as const,
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
}
