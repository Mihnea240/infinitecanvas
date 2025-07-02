# InfiniteCanvas

A lightweight web component that provides an infinite, zoomable and pannable canvas for HTML elements. Built with vanilla JavaScript and designed to be framework-agnostic.

## Features

- 🎯 **Infinite panning** - Drag to move around the canvas
- 🔍 **Smooth zooming** - Mouse wheel zoom with zoom-to-cursor behavior  
- 📱 **Touch support** - Works on mobile devices

## Installation

### Via GitHub
```bash
npm install github:Mihnea240/infinitecanvas#dist
```

## Content Positioning

Place content using absolute positioning within the canvas:

```html
<infinite-canvas>
  <!-- Use absolute positioning for canvas content -->
  <div style="position: absolute; top: 100px; left: 200px;">
    Your content here
  </div>
  
  <!-- Content will move and scale with the canvas -->
  <img src="image.jpg" style="position: absolute; top: 300px; left: 150px;" />
</infinite-canvas>
```
**TIP:** Use transitions on the transform property for smooth animations.
## [Demo](https://mihnea240.github.io/infinitecanvas/example)

## API Reference

### Properties

#### `position` (get/set)
Controls the pan position of the canvas.

```javascript
// Get current position
const currentPos = canvas.position; // Returns vec2

// Set position
canvas.position = { x: 100, y: 50 };
```

#### `scale` (get/set)
Controls the zoom level of the canvas.

```javascript
// Get current scale
const currentScale = canvas.scale; // Returns number

// Set scale (1.0 = 100%, 2.0 = 200%, 0.5 = 50%)
canvas.scale = 1.5;
```

#### `zoomFactor`
Controls how much the canvas zooms per wheel event (default: 1.1).

### Methods

#### `screenToCanvas(point)`
Converts screen coordinates to canvas coordinates.

```javascript
import { vec2 } from "infinitecanvas";

const screenPoint = new vec2(event.clientX, event.clientY);
const canvasPoint = canvas.screenToCanvas(screenPoint);
// screenPoint is modified in place and returned
```

#### `canvasToScreen(point)`
Converts canvas coordinates to screen coordinates.

```javascript
import { vec2 } from "infinitecanvas";

const canvasPoint = new vec2(100, 200);
const screenPoint = canvas.canvasToScreen(canvasPoint);
// canvasPoint is modified in place and returned
```