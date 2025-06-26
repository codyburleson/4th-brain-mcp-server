# Claude Code Session - Obsidian MCP Server Development
## Date: 2025-06-26

### Initial Request

**User:** Help me setup the project structure and initial code for an Anthropic Claude MCP server. The code should use TypeScript and Node.js. The goal of the MCP server is to interact with the markdown notes in an Obsidian vault. At first, I just want to get the MCP server working with something simple to prove that it works. Then, over time, we will extend it to understand standard patterns for personal knowledge management and to use known templates in the vault for creating new notes. For example, if we ask to look up a person't phone number, the MCP server should understand how to query across the notes of type Person, finding the appropriate person note, and then retrieving the phone number from a known metadata field. Similarly, a template type may be "Task" and the system will help users create and update task notes to manage TO DO lists. That just gives you an idea of the vision. Like I said, however, we don't want to try to go too far too fast. First I just want to get something basic working and prove that I can install it into Claude Code and Claude Desktop and use it. So, at first, maybe you shoudl recommend some basic functions that it could perform. Feel free to refe to the Obsidian website at https://obsidian.md/ . Since Obsidian works with standard markdown files (the notes, or document), this system should not have to be too concerned with Obsidian's specific functionality. It could work with any tool that uses markdown files, for example. The key things to kepp in mind are that notes are markdown documents in an Obsidian vault (folder). There are folders and markdown documents. There is front-matter metadata on the docunments. And there can be tags on the documents.

### Plan Mode Discussion

**Assistant:** I'll help you create an Anthropic Claude MCP server for interacting with Obsidian vault markdown notes. Let me first gather some information about MCP server development and then create a comprehensive plan.

*[Researched MCP documentation and Obsidian features via WebFetch]*

Based on my research, I'll create a comprehensive plan for building your Obsidian MCP server. Here's what I recommend for the initial implementation:

## Basic Functions for First Version

1. **Vault Discovery** - List available notes and folders
2. **Note Reading** - Read content of specific notes with frontmatter parsing
3. **Note Search** - Simple text search across notes 
4. **Tag Listing** - List all tags used in the vault
5. **Note Creation** - Create new notes with basic templates

## Project Structure

The server will be organized as:
- TypeScript/Node.js project with MCP SDK
- Modular architecture for easy extension
- Configuration for vault path
- Utilities for markdown parsing and frontmatter handling

**User:** I forgot to mention that I want to prefer the use of Vite over any other build tool or local server tool. Refer to https://vite.dev/ for details if you need them.

**Assistant:** *[Researched Vite library mode capabilities]*

Perfect! I'll update the plan to incorporate Vite as the build tool. Vite can be configured in library mode to build Node.js/TypeScript servers effectively.

## MCP Server Implementation Plan (with Vite)

### Phase 1: Project Setup
1. Initialize TypeScript Node.js project with Vite as build tool
2. Configure Vite in library mode for Node.js server output (CJS format)
3. Install MCP SDK and required dependencies (gray-matter, glob, etc.)
4. Setup TypeScript, ESLint, and Vite build/dev scripts
5. Create project structure optimized for Vite builds

### Phase 2: Core Infrastructure
1. Implement basic MCP server with stdio transport
2. Create vault configuration system (path to Obsidian vault)
3. Build markdown file utilities (parsing, frontmatter extraction)
4. Add error handling and logging
5. Configure Vite for proper Node.js externals and bundling

### Phase 3: Basic Tools Implementation
1. **list-notes** - List all markdown files in vault
2. **read-note** - Read specific note content with frontmatter
3. **search-notes** - Simple text search across all notes
4. **list-tags** - Extract and list all tags from notes
5. **create-note** - Create new note with basic template

### Phase 4: Testing & Integration
1. Create test vault with sample notes
2. Test Vite build process and server execution
3. Test server with Claude Desktop/Code integration
4. Verify all tools work correctly
5. Document installation and usage

### File Structure:
```
obsidian-mcp-server/
├── package.json
├── vite.config.ts (configured for Node.js library mode)
├── tsconfig.json
├── src/
│   ├── index.ts (main server entry)
│   ├── tools/ (individual tool implementations)
│   ├── utils/ (markdown, file utilities)
│   └── types/ (TypeScript definitions)
├── dist/ (Vite build output)
└── README.md
```

### Key Vite Configuration:
- Library mode targeting Node.js (CJS output)
- External dependencies (MCP SDK, Node.js built-ins)
- TypeScript compilation with proper Node.js types
- Dev script for rapid development iteration

**User:** Continue where we just left off, but note that I prefer the use of yarn over npm. Let's use all yarn commands unless it is absolutely necessary to use an npm command.

### Implementation Phase

**Assistant:** *[Began implementation with yarn preference noted]*

#### Phase 1: Project Setup

1. **Created package.json** with:
   - TypeScript and Vite configuration
   - MCP SDK and dependencies (gray-matter, glob)
   - Yarn scripts for build, dev, start, lint, type-check
   - Proper ESM configuration

2. **Created tsconfig.json** with:
   - ES2022 target with ESNext module
   - Bundler module resolution
   - Strict TypeScript configuration
   - Node.js types

3. **Created project structure**:
   ```
   src/
   ├── tools/
   ├── utils/
   └── types/
   ```

#### Phase 2: Vite Configuration

**Created vite.config.ts** with:
- Library mode for Node.js (CJS output)
- External dependencies configuration
- Shebang banner for executable
- TypeScript compilation

**Created .eslintrc.js** with TypeScript ESLint configuration.

#### Phase 3: Dependency Installation

**Ran yarn install** - Successfully installed all dependencies including:
- @modelcontextprotocol/sdk@1.13.1
- TypeScript tooling
- Build dependencies

#### Phase 4: Core Infrastructure

1. **Created type definitions** (`src/types/index.ts`):
   ```typescript
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
   ```

2. **Created main server** (`src/index.ts`):
   - MCP Server class with stdio transport
   - Tool handlers for all 5 planned tools
   - Error handling and validation
   - Environment variable configuration

3. **Created markdown utilities** (`src/utils/markdown.ts`):
   - `getAllNotes()` - Scan vault for all markdown files
   - `parseNote()` - Parse individual notes with frontmatter
   - `searchNotes()` - Full-text search across notes
   - `getAllTags()` - Extract all tags from vault
   - `createNote()` - Create new notes with frontmatter
   - Tag extraction from frontmatter and inline `#tags`

#### Phase 5: Tool Implementation

**Implemented all 5 tools:**

1. **list-notes**: Lists all notes with paths, tags, and metadata preview
2. **read-note**: Reads specific note with formatted output including metadata, tags, and content
3. **search-notes**: Searches across note content, titles, tags, and metadata with previews
4. **list-tags**: Lists all unique tags found in the vault
5. **create-note**: Creates new notes with frontmatter, content, and tags

#### Phase 6: Testing Setup

**Created test vault** (`test-vault/`) with sample notes:

1. **sample-note.md**: Basic note with frontmatter, tags, and content
2. **person-john-doe.md**: Person template with contact info and typed metadata
3. **task-implement-mcp.md**: Task template with status tracking and requirements

#### Phase 7: Build Process

**Encountered and resolved build issues:**

1. **TypeScript import issues**: Fixed with type-only imports for interfaces
2. **Vite externals configuration**: Added all Node.js built-ins to external list
3. **Shebang duplication**: Removed duplicate shebang from source
4. **Dependency bundling**: Configured proper externals vs bundled dependencies

**Final successful build**: 
- Output: `dist/index.cjs` (716.46 kB)
- Executable with proper shebang
- All dependencies properly handled

#### Phase 8: Documentation

**Created comprehensive README.md** covering:
- Installation instructions
- Usage and configuration
- Integration with Claude Desktop/Code
- Tool documentation with parameters
- Development setup
- Project structure

### Final Status

✅ **All planned features implemented:**
- Complete MCP server with 5 tools
- Vite build system working properly
- TypeScript with proper types
- Yarn-based workflow
- Test vault with sample data
- Full documentation

**Ready for integration** with Claude Desktop and Claude Code. The server can be configured with `OBSIDIAN_VAULT_PATH` environment variable to point to any Obsidian vault.

**Future extensions** can build on this foundation to add:
- Person/Task template recognition
- Advanced querying capabilities
- Template-based note creation
- Metadata field extraction for specific note types