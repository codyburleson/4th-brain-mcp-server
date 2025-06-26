export interface VaultConfig {
  path: string;
}

export interface NoteMetadata {
  [key: string]: any;
}

export interface Note {
  path: string;
  name: string;
  content: string;
  metadata: NoteMetadata;
  tags: string[];
}