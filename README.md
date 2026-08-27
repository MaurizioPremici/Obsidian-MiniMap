# MiniMap for Obsidian

MiniMap adds an interactive, theme-aware document overview to the right edge of the Obsidian desktop editor. It provides fast navigation through long notes without covering the document text.

## Features

- Renders a compact overview of headings, lists, quotes, code, links, and regular text.
- Shows the currently visible section with a viewport indicator.
- Supports click, drag, mouse wheel, and keyboard navigation.
- Uses Obsidian theme colors automatically.
- Provides settings for width, content opacity, and the minimum document length.
- Hides the native vertical scrollbar only while the minimap is visible; native scrolling remains fully functional.

## Installation

MiniMap is currently distributed as a manual desktop plugin.

1. Download `main.js`, `manifest.json`, and `styles.css` from the latest GitHub release.
2. Create this directory inside the target vault:

   ```text
   <vault>/.obsidian/plugins/obsidian-minimap-local/
   ```

3. Copy the three downloaded files into that directory.
4. Restart Obsidian or reload the app.
5. Open **Settings > Community plugins** and enable **MiniMap**.

The plugin supports Obsidian 1.5.0 or later and is desktop-only.

## Usage

- Click or drag inside the minimap to navigate.
- Scroll over the minimap with a mouse or trackpad.
- Focus the minimap and use `Arrow Up`, `Arrow Down`, `Page Up`, `Page Down`, `Home`, or `End`.
- Run **MiniMap: Toggle minimap** from the Command Palette.

## Settings

- **Enable MiniMap**: shows or hides the minimap.
- **MiniMap width**: sets the panel width from 72 to 180 pixels.
- **Content opacity**: adjusts the visibility of the rendered document lines.
- **Minimum document lines**: hides the minimap for short notes.

## Right-edge layout fix

Version 1.0.1 fixes two related layout defects:

1. The minimap could leave an empty gutter between itself and the right edge of the editor.
2. The native CodeMirror scrollbar could remain visible beside the minimap.

The minimap is now mounted on the closest stable `.view-content` host and anchored with `right: 0`. The editor scroller reserves exactly the required horizontal space, preventing the minimap from covering note content. The native scrollbar is hidden through the stable `.obsidian-minimap-host .cm-scroller` relationship only when the minimap is active. This avoids relying on a transient class on CodeMirror's editor node.

Scrolling behavior is unchanged: the scrollbar is visually hidden, but mouse, trackpad, touchpad, and keyboard scrolling continue to use the native CodeMirror scroller.

## Development

Requirements:

- Node.js 18 or later
- npm

Install dependencies and build:

```bash
npm ci
npm run build
```

The production build is written to `main.js`.

## Privacy

The plugin runs locally inside Obsidian. It does not make network requests, collect analytics, or include machine-specific filesystem paths.

## License

MIT. See [LICENSE](LICENSE).
