# HolyNotes - Plugin para Equicord/Vencord

Um plugin para salvar mensagens do Discord como notas pessoais organizadas em notebooks.

## ✨ Features

- 📌 **Salvar mensagens**: Adicione mensagens aos seus notebooks com um clique
- 📚 **Notebooks organizados**: Crie múltiplos notebooks para organizar suas notas
- 🔍 **Busca rápida**: Encontre mensagens salvas facilmente
- 💾 **Persistência local**: Dados armazenados localmente via DataStore
- 📤 **Exportar/Importar**: Backup das suas notas em JSON
- 🎨 **UI integrada**: Ícone na toolbar do canal e menu de contexto

## 📦 Instalação

### Método 1: Instalação Manual

1. Clone ou baixe este repositório
2. Copie a pasta `dist` para:
   - **Equicord**: `~/.config/Equicord/plugins/holynotes/`
   - **Vencord**: `~/.config/Vencord/plugins/holynotes/`
3. Ative o plugin nas configurações do Equicord/Vencord

### Método 2: Build Local

```bash
# Instalar dependências
pnpm install

# Build
pnpm build

# O arquivo compilado estará em dist/index.js
```

## 🚀 Uso

1. **Adicionar nota**: Clique com o botão direito em uma mensagem → "Pin Message To" → Escolha o notebook
2. **Abrir notas**: Clique no ícone 📌 na toolbar do canal
3. **Gerenciar notebooks**: Use o modal para criar/remover notebooks

## 🛠️ Desenvolvimento

### Estrutura

```
holynotes/
├── src/
│   ├── index.tsx       # Entry point do plugin
│   ├── NoteHandler.ts  # Lógica de gerenciamento de notas
│   ├── types.ts        # Type definitions
│   ├── utils.ts        # Funções utilitárias (DataStore, export/import)
│   ├── style.css       # Estilos
│   └── components/     # Componentes React
│       ├── icons/
│       └── modals/
├── package.json
├── tsconfig.json
└── README.md
```

### Build

```bash
# Desenvolvimento com watch
pnpm watch

# Build de produção
pnpm build
```

### Deploy para Equicord

```bash
# Empacotar e copiar para o diretório do Equicord
npx asar pack dist ~/.config/Equicord/equicord.asar

# Reiniciar o Equicord completamente
```

## 📝 API

### NoteHandler

```typescript
// Adicionar nota
noteHandler.addNote(message: Message, notebook: string)

// Deletar nota
noteHandler.deleteNote(noteId: string, notebook: string)

// Mover nota entre notebooks
noteHandler.moveNote(note: Note, from: string, to: string)

// Criar notebook
noteHandler.newNoteBook(name: string, silent?: boolean)

// Deletar notebook
noteHandler.deleteNotebook(name: string)

// Exportar notas
const notes = await noteHandler.exportNotes()

// Importar notas
await noteHandler.importNotes(notes: Note[])
```

## 🐛 Issues

Encontrou um bug? Abra uma issue no GitHub!

## 📄 Licença

GPL-3.0-or-later

## 👨‍💻 Autor

- **Dante** ([@Dantesousa](https://github.com/Dantesousa))

## 🙏 Agradecimentos

- [Vencord](https://github.com/Vendicated/Vencord) - Framework base
- [Equicord](https://github.com/Equicord/Equicord) - Fork do Vencord
- Equipe do Goob-StationBR - Suporte da comunidade

---

Feito com 💜 para a comunidade brasileira do Space Station 14