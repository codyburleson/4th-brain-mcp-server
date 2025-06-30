import * as fs from "fs";
import * as path from "path";
import matter from "gray-matter";
import { glob } from "glob";
import type { Note, VaultConfig } from "../types/index.js";

export class MarkdownUtils {
  constructor(private vaultConfig: VaultConfig) {}

  async getAllNotes(): Promise<Note[]> {
    const pattern = path.join(this.vaultConfig.path, "**/*.md");
    const files = await glob(pattern);

    const notes: Note[] = [];
    for (const filePath of files) {
      try {
        const note = await this.parseNote(filePath);
        notes.push(note);
      } catch (error) {
        console.error(`Error parsing note ${filePath}:`, error);
      }
    }

    return notes;
  }

  async parseNote(filePath: string): Promise<Note> {
    const content = fs.readFileSync(filePath, "utf-8");
    const parsed = matter(content);

    const tags = this.extractTags(parsed.data, parsed.content);

    return {
      path: filePath,
      name: path.basename(filePath, ".md"),
      content: parsed.content,
      metadata: parsed.data,
      tags,
    };
  }

  async searchNotes(query: string): Promise<Note[]> {
    const notes = await this.getAllNotes();
    const searchTerm = query.toLowerCase();

    return notes.filter(
      (note) =>
        note.name.toLowerCase().includes(searchTerm) ||
        note.content.toLowerCase().includes(searchTerm) ||
        note.tags.some((tag) => tag.toLowerCase().includes(searchTerm)) ||
        Object.values(note.metadata).some(
          (value) =>
            typeof value === "string" &&
            value.toLowerCase().includes(searchTerm),
        ),
    );
  }

  async getAllTags(): Promise<string[]> {
    const notes = await this.getAllNotes();
    const tagSet = new Set<string>();

    notes.forEach((note) => {
      note.tags.forEach((tag) => tagSet.add(tag));
    });

    return Array.from(tagSet).sort();
  }

  async createNote(
    title: string,
    content: string = "",
    tags: string[] = [],
  ): Promise<string> {
    const filename = this.sanitizeFilename(title) + ".md";
    const filePath = path.join(this.vaultConfig.path, filename);

    const frontmatter = {
      title,
      created: new Date().toISOString(),
      tags,
    };

    const noteContent = matter.stringify(content, frontmatter);

    if (fs.existsSync(filePath)) {
      throw new Error(`Note with title "${title}" already exists`);
    }

    fs.writeFileSync(filePath, noteContent, "utf-8");
    return filePath;
  }

  private extractTags(metadata: any, content: string): string[] {
    const tags = new Set<string>();

    if (metadata.tags) {
      if (Array.isArray(metadata.tags)) {
        metadata.tags.forEach((tag: string) => tags.add(tag));
      } else if (typeof metadata.tags === "string") {
        metadata.tags.split(",").forEach((tag: string) => tags.add(tag.trim()));
      }
    }

    if (metadata.tag) {
      if (Array.isArray(metadata.tag)) {
        metadata.tag.forEach((tag: string) => tags.add(tag));
      } else if (typeof metadata.tag === "string") {
        tags.add(metadata.tag);
      }
    }

    const inlineTagRegex = /#([a-zA-Z0-9_/-]+)/g;
    let match;
    while ((match = inlineTagRegex.exec(content)) !== null) {
      tags.add(match[1]);
    }

    return Array.from(tags);
  }

  private sanitizeFilename(title: string): string {
    return title
      .replace(/[<>:"/\\|?*]/g, "")
      .replace(/\s+/g, "-")
      .toLowerCase();
  }

  getVaultPath(): string {
    return this.vaultConfig.path;
  }

  async noteExists(title: string): Promise<boolean> {
    const filename = this.sanitizeFilename(title) + ".md";
    const filePath = path.join(this.vaultConfig.path, filename);
    return fs.existsSync(filePath);
  }
}
