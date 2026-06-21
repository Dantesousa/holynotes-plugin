# HolyNotes - Equicord Plugin

A plugin to save Discord messages as personal notes organized in notebooks.

> **Note**: This plugin is built specifically for **Equicord** (Vencord fork).  
> Looking for the Vencord version? Check out [`holynotes-vencord`](https://github.com/Dantesousa/holynotes-vencord).

## ✨ Features

- 📌 **Save messages**: Add messages to your notebooks with one click
- 📚 **Organized notebooks**: Create multiple notebooks to organize your notes
- 🔍 **Quick search**: Easily find saved messages
- 💾 **Local persistence**: Data stored locally via DataStore
- 📤 **Export/Import**: Backup your notes in JSON format
- 🎨 **Integrated UI**: Channel toolbar icon and context menu

## 📦 Installation

### Method 1: Manual Installation

1. Clone or download this repository
2. Copy the `dist` folder to:
   - **Equicord**: `~/.config/Equicord/plugins/holynotes/`
3. Enable the plugin in Equicord settings

### Method 2: Local Build

```bash
# Install dependencies
pnpm install

# Build
pnpm build

# The compiled file will be in dist/index.js
```

## 🚀 Usage

1. **Add note**: Right-click a message → "Pin Message To" → Choose notebook
2. **Open notes**: Click the 📌 icon in the channel toolbar
3. **Manage notebooks**: Use the modal to create/remove notebooks

## 🛠️ Development

### Structure

```
holynotes/
├── src/
│   ├── index.tsx       # Plugin entry point
│   ├── NoteHandler.ts  # Notes management logic
│   ├── types.ts        # Type definitions
│   ├── utils.ts        # Utility functions (DataStore, export/import)
│   ├── style.css       # Styles
│   └── components/     # React components
│       ├── icons/
│       └── modals/
├── package.json
├── tsconfig.json
└── README.md
```

### Build

```bash
# Development with watch
pnpm watch

# Production build
pnpm build
```

### Deploy to Equicord

```bash
# Package and copy to Equicord directory
npx asar pack dist ~/.config/Equicord/equicord.asar

# Restart Equicord completely
```

## 📝 API

### NoteHandler

```typescript
// Add note
noteHandler.addNote(message: Message, notebook: string)

// Delete note
noteHandler.deleteNote(noteId: string, notebook: string)

// Move note between notebooks
noteHandler.moveNote(note: Note, from: string, to: string)

// Create notebook
noteHandler.newNoteBook(name: string, silent?: boolean)

// Delete notebook
noteHandler.deleteNotebook(name: string)

// Export notes
const notes = await noteHandler.exportNotes()

// Import notes
await noteHandler.importNotes(notes: Note[])
```

## 🐛 Issues

Found a bug? Open an issue on GitHub!

## 📄 License

GPL-3.0-or-later

## 👨‍💻 Author

- **Dante** ([@Dantesousa](https://github.com/Dantesousa))

## 🙏 Acknowledgments

- [Equicord](https://github.com/Equicord/Equicord) - Vencord fork
- [Vencord](https://github.com/Vendicated/Vencord) - Base framework

---

Made with 💜 for the Discord community