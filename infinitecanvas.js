import { vec2 } from "vec2";
import customDrag from "customdrag";

export { vec2 }

/**
 * InfiniteCanvas - A web component that provides an infinite, zoomable and pannable canvas
 * for HTML elements.
 * 
 * Features:
 * - Pan by dragging the canvas background
 * - Zoom with mouse wheel
 * @extends HTMLElement
 */
export default class InfiniteCanvas extends HTMLElement {
	/**
	 * CSS styles applied to the component using Constructable Stylesheets
	 * @static
	 * @type {CSSStyleSheet}
	 */
	static styleSheet = (() => {
		const sheet = new CSSStyleSheet();
		sheet.replaceSync(/*css*/`
			:host {
				display: block;
				position: relative;
				overflow: hidden !important;
			}
			[part="canvas"] {
				position: absolute;
				user-select: none;
				inset: 0;
				background: transparent;

				transform-origin: top left;
				transition: inherit;
			}
		`);
		return sheet;
	})();

	/**
	 * Shadow DOM template for the canvas container
	 * @static
	 * @type {string}
	 */
	static shadowDom = /*html*/`
		<div part="canvas">
			<slot></slot>
		</div>
	`.trim();

	/**
	 * Creates a new InfiniteCanvas instance
	 * Sets up shadow DOM, event listeners, and drag/zoom functionality
	 */
	constructor() {
		super();
		const shadow = this.attachShadow({ mode: "open" });
		shadow.adoptedStyleSheets = [InfiniteCanvas.styleSheet];
		this.shadowRoot.innerHTML = InfiniteCanvas.shadowDom;

		// Initialize internal properties
		/** @type {HTMLElement} The canvas container element within shadow DOM */
		this.canvas = this.shadowRoot.querySelector("[part='canvas']");
		
		/** 
		 * Internal properties object
		 * @private
		 * @type {Object}
		 * @property {vec2} size - Canvas size in pixels
		 * @property {vec2} screen_position - Canvas position on screen
		 * @property {number} scale - Current zoom scale factor
		 * @property {vec2} position - Current pan position
		 */
		this.__props = {
			size: new vec2(0, 0),
			screen_position: new vec2(0, 0),
			scale: 1,
			position: new vec2(0, 0),
		}
		
		/** @type {vec2} Temporary point for calculations */
		this.point = new vec2(0, 0);
		
		/** @type {vec2} Current cursor position in screen coordinates */
		this.cursor = new vec2(0, 0);
		
		/** @type {number} Zoom factor for wheel events (1.1 = 10% zoom per step) */
		this.zoomFactor = 1.1;
		
		// Set up drag functionality for panning
		customDrag(this, {
			onstart: (ev) => {
				// Only allow dragging on the canvas background, not on child elements
				if (ev.target != this) return false;
				ev.stopPropagation();

				// Cache bounds for performance during drag
				const bounds = this.getBoundingClientRect();
				this.__props.screen_position.set(bounds.left, bounds.top);
				return true; // Allow dragging to start
			},
			onmove: (ev, deltaX, deltaY) => {
				// Update position with drag delta using requestAnimationFrame for smooth animation
				this.__props.position.translate(deltaX, deltaY);
				requestAnimationFrame(() => {
					this.update();
				});
			},
		});

		// Track cursor position for zoom operations
		this.addEventListener("pointermove", (ev) => {
			this.cursor.set(ev.clientX, ev.clientY);
			this.screenToCanvas(this.cursor);
		});

		// Handle zoom with mouse wheel
		this.addEventListener("wheel", (ev) => {
			ev.stopPropagation();
			
			// Calculate new scale with bounds checking
			const newScale = Math.max(0.1, this.scale * (ev.deltaY > 0 ? 1 / this.zoomFactor : this.zoomFactor));

			// Convert cursor position to canvas coordinates for zoom-to-cursor
			this.screenToCanvas(this.cursor.set(ev.clientX, ev.clientY));
			
			// Adjust position to zoom towards cursor
			this.__props.position.add(this.cursor.scale(this.scale - newScale));
			
			this.scale = newScale;
		});
	}
	/**
	 * Updates the visual transform of the canvas based on current position and scale
	 * @private
	 */
	update() {
		this.canvas.style.cssText += `
			transform: translate(${this.position.x}px, ${this.position.y}px) scale(${this.scale});
		`;
	}
	/**
	 * Converts a point from screen coordinates to canvas coordinates
	 * @param {vec2} point - The point to convert (modified in place)
	 * @returns {vec2} The converted point (same instance as input)
	 * @description This is useful for translating user interactions (like mouse clicks) 
	 * into the canvas's coordinate system. It accounts for the canvas's screen position, 
	 * pan offset, and current scale.
	 */
	screenToCanvas(point) {
		return point
			.sub(this.__props.screen_position)
			.sub(this.__props.position)
			.scale(1 / this.scale);
	}
	/**
	 * Converts a point from canvas coordinates to screen coordinates
	 * @param {vec2} point - The point to convert (modified in place)
	 * @returns {vec2} The converted point (same instance as input)
	 * @description Converts a point from the canvas coordinate system back to screen coordinates.
	 * Useful for positioning elements or getting screen positions of canvas elements.
	 */
	canvasToScreen(point) {
		return point
			.scale(this.scale)
			.add(this.screen_position)
			.add(this.__props.position);
	}

	/**
	 * Sets the pan position of the canvas
	 * @param {Object} pos - Position object with x and y properties
	 * @param {number} pos.x - X coordinate
	 * @param {number} pos.y - Y coordinate
	 * @returns {vec2} The position vector
	 */
	set position({ x, y }) {
		this.__props.position.set(x, y);
		this.update();
		return this.__props.position;
	}
	/**
	 * Gets the current pan position of the canvas
	 * @returns {vec2} The current position vector
	 */
	get position() {
		return this.__props.position;
	}

	/**
	 * Sets the zoom scale of the canvas
	 * @param {number} value - The scale factor (1.0 = 100%, 2.0 = 200%, 0.5 = 50%)
	 * @returns {number} The scale value
	 */
	set scale(value) {
		this.__props.scale = value;
		this.update();
		return this.__props.scale;
	}
	/**
	 * Gets the current zoom scale of the canvas
	 * @returns {number} The current scale factor
	 */
	get scale() {
		return this.__props.scale;
	}

	/**
	 * Called when the element is connected to the DOM
	 * Initializes the canvas size and screen position
	 */
	connectedCallback() {
		const bounds = this.getBoundingClientRect();
		this.size = { width: bounds.width, height: bounds.height };
		this.__props.screen_position.set(bounds.left, bounds.top);
	}
}

// Register the custom element
customElements.define("infinite-canvas", InfiniteCanvas);