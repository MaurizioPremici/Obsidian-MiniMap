# MiniMap v1.0.1

This release fixes the right-edge layout and removes the redundant native scrollbar beside the minimap.

## What was wrong

The minimap was positioned relative to an editor element that did not span the full stable view boundary. This could leave an empty gutter on the right. The scrollbar-hiding rule also depended on a class attached to CodeMirror's editor node, but that class was not reliable across editor updates.

## What changed

- The minimap now mounts on the closest `.view-content` host and is anchored at `right: 0`.
- The host receives `.obsidian-minimap-host` only while the minimap is visible.
- The stable `.obsidian-minimap-host .cm-scroller` selector hides the native scrollbar.
- The editor scroller reserves the minimap width so document content is never covered.
- Native mouse, trackpad, and keyboard scrolling remains unchanged.

## Validation

- TypeScript type checking and the production build complete successfully with `npm run build`.
- The final layout was manually verified in Obsidian desktop with the minimap flush to the right edge and no second visible scrollbar.

## Installation files

- `main.js`
- `manifest.json`
- `styles.css`
