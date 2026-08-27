"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => MiniMapPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");
var import_view = require("@codemirror/view");
var DEFAULT_SETTINGS = {
  enabled: true,
  width: 112,
  opacity: 0.72,
  minimumLines: 20
};
var SETTINGS_EVENT = "obsidian-minimap-local:settings-changed";
var runtimeSettings = {
  ...DEFAULT_SETTINGS
};
function clamp(value, minimum, maximum) {
  return Math.min(
    maximum,
    Math.max(minimum, value)
  );
}
function cssVariable(styles, name, fallback) {
  const value = styles.getPropertyValue(name).trim();
  return value || fallback;
}
var MiniMapView = class {
  constructor(view) {
    this.animationFrame = null;
    this.dragging = false;
    this.handleScroll = () => {
      this.scheduleRender();
    };
    this.handleSettingsChanged = () => {
      this.applySettings();
    };
    this.handlePointerDown = (event) => {
      if (event.button !== 0) {
        return;
      }
      this.dragging = true;
      this.container.setPointerCapture(event.pointerId);
      this.navigateFromPointer(event);
      event.preventDefault();
    };
    this.handlePointerMove = (event) => {
      if (!this.dragging) {
        return;
      }
      this.navigateFromPointer(event);
      event.preventDefault();
    };
    this.handlePointerUp = (event) => {
      this.dragging = false;
      if (this.container.hasPointerCapture(event.pointerId)) {
        this.container.releasePointerCapture(
          event.pointerId
        );
      }
    };
    this.handleWheel = (event) => {
      this.view.scrollDOM.scrollTop += event.deltaY;
      event.preventDefault();
    };
    this.handleKeyDown = (event) => {
      const scroller = this.view.scrollDOM;
      const page = Math.max(
        100,
        scroller.clientHeight * 0.85
      );
      switch (event.key) {
        case "ArrowUp":
          scroller.scrollTop -= 48;
          break;
        case "ArrowDown":
          scroller.scrollTop += 48;
          break;
        case "PageUp":
          scroller.scrollTop -= page;
          break;
        case "PageDown":
          scroller.scrollTop += page;
          break;
        case "Home":
          scroller.scrollTop = 0;
          break;
        case "End":
          scroller.scrollTop = scroller.scrollHeight;
          break;
        default:
          return;
      }
      event.preventDefault();
      this.scheduleRender();
    };
    this.view = view;
    this.host = this.view.dom.closest(".view-content") ?? this.view.dom;
    this.container = document.createElement("div");
    this.container.className = "obsidian-minimap";
    this.container.style.left = "auto";
    this.container.style.right = "0";
    this.container.style.borderRight = "0";
    this.container.style.borderLeft = "1px solid var(--background-modifier-border)";
    this.container.tabIndex = 0;
    this.container.setAttribute("role", "scrollbar");
    this.container.setAttribute(
      "aria-label",
      "Document minimap"
    );
    this.container.setAttribute(
      "aria-orientation",
      "vertical"
    );
    this.container.setAttribute(
      "aria-valuemin",
      "0"
    );
    this.container.setAttribute(
      "aria-valuemax",
      "100"
    );
    this.container.title = "Click or drag to navigate the document";
    this.canvas = document.createElement("canvas");
    this.canvas.className = "obsidian-minimap-canvas";
    this.canvas.setAttribute("aria-hidden", "true");
    this.viewportIndicator = document.createElement("div");
    this.viewportIndicator.className = "obsidian-minimap-viewport";
    this.viewportIndicator.setAttribute(
      "aria-hidden",
      "true"
    );
    this.container.append(
      this.canvas,
      this.viewportIndicator
    );
    this.host.append(this.container);
    this.view.scrollDOM.addEventListener(
      "scroll",
      this.handleScroll,
      { passive: true }
    );
    this.container.addEventListener(
      "pointerdown",
      this.handlePointerDown
    );
    this.container.addEventListener(
      "pointermove",
      this.handlePointerMove
    );
    this.container.addEventListener(
      "pointerup",
      this.handlePointerUp
    );
    this.container.addEventListener(
      "pointercancel",
      this.handlePointerUp
    );
    this.container.addEventListener(
      "wheel",
      this.handleWheel,
      { passive: false }
    );
    this.container.addEventListener(
      "keydown",
      this.handleKeyDown
    );
    window.addEventListener(
      SETTINGS_EVENT,
      this.handleSettingsChanged
    );
    this.resizeObserver = new ResizeObserver(() => {
      this.scheduleRender();
    });
    this.resizeObserver.observe(this.view.dom);
    this.resizeObserver.observe(this.container);
    this.applySettings();
  }
  update(update) {
    if (update.docChanged || update.viewportChanged) {
      this.applySettings();
    }
  }
  destroy() {
    if (this.animationFrame !== null) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
    this.resizeObserver.disconnect();
    this.view.scrollDOM.removeEventListener(
      "scroll",
      this.handleScroll
    );
    this.container.removeEventListener(
      "pointerdown",
      this.handlePointerDown
    );
    this.container.removeEventListener(
      "pointermove",
      this.handlePointerMove
    );
    this.container.removeEventListener(
      "pointerup",
      this.handlePointerUp
    );
    this.container.removeEventListener(
      "pointercancel",
      this.handlePointerUp
    );
    this.container.removeEventListener(
      "wheel",
      this.handleWheel
    );
    this.container.removeEventListener(
      "keydown",
      this.handleKeyDown
    );
    window.removeEventListener(
      SETTINGS_EVENT,
      this.handleSettingsChanged
    );
    this.view.dom.classList.remove(
      "obsidian-minimap-enabled"
    );
    this.view.dom.style.removeProperty(
      "--obsidian-minimap-width"
    );
    this.host.style.removeProperty(
      "--obsidian-minimap-width"
    );
    this.view.scrollDOM.style.removeProperty(
      "margin-left"
    );
    this.view.scrollDOM.style.removeProperty(
      "margin-right"
    );
    this.host.classList.remove(
      "obsidian-minimap-host"
    );
    this.container.remove();
  }
  applySettings() {
    const lineCount = this.view.state.doc.lines;
    const shouldShow = runtimeSettings.enabled && lineCount >= runtimeSettings.minimumLines;
    this.container.hidden = !shouldShow;
    this.host.classList.toggle(
      "obsidian-minimap-host",
      shouldShow
    );
    this.view.dom.classList.toggle(
      "obsidian-minimap-enabled",
      shouldShow
    );
    this.view.dom.style.setProperty(
      "--obsidian-minimap-width",
      `${runtimeSettings.width}px`
    );
    this.host.style.setProperty(
      "--obsidian-minimap-width",
      `${runtimeSettings.width}px`
    );
    if (shouldShow) {
      this.view.scrollDOM.style.marginRight = `calc(${runtimeSettings.width}px + 7px)`;
      this.view.scrollDOM.style.marginLeft = "0";
    } else {
      this.view.scrollDOM.style.removeProperty(
        "margin-left"
      );
      this.view.scrollDOM.style.removeProperty(
        "margin-right"
      );
    }
    if (shouldShow) {
      this.scheduleRender();
    }
  }
  scheduleRender() {
    if (this.container.hidden || this.animationFrame !== null) {
      return;
    }
    this.animationFrame = requestAnimationFrame(() => {
      this.animationFrame = null;
      this.render();
    });
  }
  render() {
    const bounds = this.container.getBoundingClientRect();
    const width = Math.max(
      1,
      Math.floor(bounds.width)
    );
    const height = Math.max(
      1,
      Math.floor(bounds.height)
    );
    const pixelRatio = Math.min(
      window.devicePixelRatio || 1,
      2
    );
    const physicalWidth = Math.floor(
      width * pixelRatio
    );
    const physicalHeight = Math.floor(
      height * pixelRatio
    );
    if (this.canvas.width !== physicalWidth || this.canvas.height !== physicalHeight) {
      this.canvas.width = physicalWidth;
      this.canvas.height = physicalHeight;
    }
    const context = this.canvas.getContext("2d");
    if (!context) {
      return;
    }
    context.setTransform(
      pixelRatio,
      0,
      0,
      pixelRatio,
      0,
      0
    );
    context.clearRect(
      0,
      0,
      width,
      height
    );
    const bodyStyles = getComputedStyle(
      document.body
    );
    const palette = {
      normal: cssVariable(
        bodyStyles,
        "--text-muted",
        "#8b949e"
      ),
      heading: cssVariable(
        bodyStyles,
        "--color-accent",
        "#7c5cff"
      ),
      list: cssVariable(
        bodyStyles,
        "--color-cyan",
        "#56d4dd"
      ),
      quote: cssVariable(
        bodyStyles,
        "--color-purple",
        "#b48ead"
      ),
      code: cssVariable(
        bodyStyles,
        "--color-orange",
        "#d19a66"
      ),
      link: cssVariable(
        bodyStyles,
        "--link-color",
        "#61afef"
      )
    };
    const documentText = this.view.state.doc;
    const lineCount = documentText.lines;
    const sampleStep = Math.max(
      1,
      Math.ceil(lineCount / (height * 1.5))
    );
    context.globalAlpha = runtimeSettings.opacity;
    for (let lineNumber = 1; lineNumber <= lineCount; lineNumber += sampleStep) {
      const rawText = documentText.line(lineNumber).text;
      const trimmedText = rawText.trim();
      if (!trimmedText) {
        continue;
      }
      const leadingWhitespace = rawText.match(/^\s*/)?.[0].replace(/\t/g, "    ").length ?? 0;
      const indentation = Math.min(
        width * 0.32,
        leadingWhitespace * 0.85
      );
      const x = 5 + indentation;
      const availableWidth = Math.max(
        4,
        width - x - 6
      );
      const relativeLength = clamp(
        trimmedText.length / 100,
        0.08,
        1
      );
      const lineWidth = Math.max(
        3,
        availableWidth * relativeLength
      );
      const y = (lineNumber - 1) / Math.max(1, lineCount - 1) * height;
      const lineHeight = Math.max(
        1,
        height / lineCount * sampleStep * 0.68
      );
      context.fillStyle = this.pickColor(
        trimmedText,
        palette
      );
      context.fillRect(
        x,
        y,
        lineWidth,
        lineHeight
      );
    }
    context.globalAlpha = 1;
    this.renderViewportIndicator(height);
  }
  pickColor(text, palette) {
    if (/^#{1,6}\s/.test(text)) {
      return palette.heading;
    }
    if (/^```/.test(text) || /^~~~/.test(text) || /^(const|let|var|function|class|interface|import|export)\b/.test(
      text
    )) {
      return palette.code;
    }
    if (/^[-*+]\s/.test(text) || /^\d+[.)]\s/.test(text)) {
      return palette.list;
    }
    if (/^>/.test(text)) {
      return palette.quote;
    }
    if (/\[\[.+?]]/.test(text) || /\[.+?]\(.+?\)/.test(text)) {
      return palette.link;
    }
    return palette.normal;
  }
  renderViewportIndicator(minimapHeight) {
    const scroller = this.view.scrollDOM;
    const scrollHeight = Math.max(
      scroller.scrollHeight,
      1
    );
    const clientHeight = Math.max(
      scroller.clientHeight,
      1
    );
    const indicatorHeight = clamp(
      clientHeight / scrollHeight * minimapHeight,
      18,
      minimapHeight
    );
    const maximumIndicatorTop = Math.max(
      0,
      minimapHeight - indicatorHeight
    );
    const maximumScrollTop = Math.max(
      1,
      scrollHeight - clientHeight
    );
    const scrollRatio = clamp(
      scroller.scrollTop / maximumScrollTop,
      0,
      1
    );
    const indicatorTop = scrollRatio * maximumIndicatorTop;
    this.viewportIndicator.style.height = `${indicatorHeight}px`;
    this.viewportIndicator.style.transform = `translateY(${indicatorTop}px)`;
    const percentage = Math.round(
      scrollRatio * 100
    );
    this.container.setAttribute(
      "aria-valuenow",
      String(percentage)
    );
  }
  navigateFromPointer(event) {
    const bounds = this.container.getBoundingClientRect();
    const localY = clamp(
      event.clientY - bounds.top,
      0,
      bounds.height
    );
    const ratio = bounds.height > 0 ? localY / bounds.height : 0;
    const scroller = this.view.scrollDOM;
    const maximumScrollTop = Math.max(
      0,
      scroller.scrollHeight - scroller.clientHeight
    );
    const targetScrollTop = clamp(
      ratio * scroller.scrollHeight - scroller.clientHeight / 2,
      0,
      maximumScrollTop
    );
    scroller.scrollTop = targetScrollTop;
    this.view.focus();
    this.scheduleRender();
  }
};
var miniMapEditorExtension = import_view.ViewPlugin.fromClass(MiniMapView);
var MiniMapPlugin = class extends import_obsidian.Plugin {
  constructor() {
    super(...arguments);
    this.settings = {
      ...DEFAULT_SETTINGS
    };
  }
  async onload() {
    await this.loadSettings();
    runtimeSettings = {
      ...this.settings
    };
    this.registerEditorExtension(
      miniMapEditorExtension
    );
    this.addSettingTab(
      new MiniMapSettingTab(
        this.app,
        this
      )
    );
    this.addCommand({
      id: "toggle-minimap",
      name: "Toggle minimap",
      callback: async () => {
        await this.updateSettings({
          enabled: !this.settings.enabled
        });
        new import_obsidian.Notice(
          this.settings.enabled ? "MiniMap enabled" : "MiniMap disabled"
        );
      }
    });
  }
  onunload() {
    runtimeSettings = {
      ...DEFAULT_SETTINGS,
      enabled: false
    };
    window.dispatchEvent(
      new CustomEvent(SETTINGS_EVENT)
    );
  }
  async loadSettings() {
    const saved = await this.loadData();
    this.settings = {
      ...DEFAULT_SETTINGS,
      ...saved ?? {}
    };
  }
  async updateSettings(patch) {
    this.settings = {
      ...this.settings,
      ...patch
    };
    await this.saveData(this.settings);
    runtimeSettings = {
      ...this.settings
    };
    window.dispatchEvent(
      new CustomEvent(SETTINGS_EVENT)
    );
  }
};
var MiniMapSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    new import_obsidian.Setting(containerEl).setName("Enable MiniMap").setDesc(
      "Show the document minimap in editor views."
    ).addToggle((toggle) => {
      toggle.setValue(
        this.plugin.settings.enabled
      ).onChange(async (value) => {
        await this.plugin.updateSettings({
          enabled: value
        });
      });
    });
    new import_obsidian.Setting(containerEl).setName("MiniMap width").setDesc(
      "Width of the minimap in pixels."
    ).addSlider((slider) => {
      slider.setLimits(72, 180, 4).setDynamicTooltip().setValue(
        this.plugin.settings.width
      ).onChange(async (value) => {
        await this.plugin.updateSettings({
          width: value
        });
      });
    });
    new import_obsidian.Setting(containerEl).setName("Content opacity").setDesc(
      "Opacity of the lines drawn inside the minimap."
    ).addSlider((slider) => {
      slider.setLimits(0.2, 1, 0.05).setDynamicTooltip().setValue(
        this.plugin.settings.opacity
      ).onChange(async (value) => {
        await this.plugin.updateSettings({
          opacity: value
        });
      });
    });
    new import_obsidian.Setting(containerEl).setName("Minimum document lines").setDesc(
      "Hide the minimap when the note contains fewer lines."
    ).addSlider((slider) => {
      slider.setLimits(1, 200, 1).setDynamicTooltip().setValue(
        this.plugin.settings.minimumLines
      ).onChange(async (value) => {
        await this.plugin.updateSettings({
          minimumLines: value
        });
      });
    });
  }
};
