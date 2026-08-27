# Changelog

All notable changes to this project are documented in this file.

## [1.0.1] - 2026-08-27

### Fixed

- Docked the minimap flush against the right edge of the active editor view.
- Removed the empty gutter previously left between the minimap and the editor boundary.
- Hid the native CodeMirror scrollbar only while the minimap is visible.
- Replaced the unreliable editor-class scrollbar selector with a stable host-based selector.
- Preserved native scrolling through the mouse, trackpad, and keyboard.
- Kept editor content clear of the minimap by reserving the exact panel width.

### Changed

- Added complete installation, usage, development, privacy, and fix documentation.
- Included the compiled plugin entry point in the repository for manual installation.

## [1.0.0]

### Added

- Initial interactive document minimap.
- Theme-aware rendering for common Markdown structures.
- Viewport indicator and pointer, wheel, and keyboard navigation.
- Width, opacity, enablement, and minimum-line settings.
