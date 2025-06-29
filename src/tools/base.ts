import type { MarkdownUtils } from "../utils/markdown.js";

export interface ToolResponse {
  content: Array<{
    type: "text";
    text: string;
  }>;
  isError?: boolean;
}

export abstract class BaseTool {
  protected markdownUtils: MarkdownUtils;

  constructor(markdownUtils: MarkdownUtils) {
    this.markdownUtils = markdownUtils;
  }

  abstract execute(args?: any): Promise<ToolResponse>;
}
