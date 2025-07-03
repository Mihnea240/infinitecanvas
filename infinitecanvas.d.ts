/**
 * InfiniteCanvas TypeScript Definitions
 * 
 * A web component that provides an infinite, zoomable and pannable canvas
 * for HTML elements.
 */

// Re-export vec2 from the vec2 package
export { vec2 } from "vec2";

/**
 * InfiniteCanvas Web Component
 * 
 * A custom HTML element that provides infinite panning and zooming capabilities
 * for HTML content using drag interactions and mouse wheel.
 */
export default class InfiniteCanvas extends HTMLElement {
  /**
   * CSS styles applied to the component using Constructable Stylesheets
   */
  static readonly styleSheet: CSSStyleSheet;

  /**
   * Shadow DOM template for the canvas container
   */
  static readonly shadowDom: string;

  /**
   * The canvas container element within shadow DOM
   */
  readonly canvas: HTMLElement;

  /**
   * Temporary point for calculations
   */
  readonly point: vec2;

  /**
   * Current cursor position in screen coordinates
   */
  readonly cursor: vec2;

  /**
   * Zoom factor for wheel events (1.1 = 10% zoom per step)
   * @default 1.1
   */
  zoomFactor: number;

  /**
   * Internal properties object (private)
   */
  private readonly __props: {
    size: vec2;
    screen_position: vec2;
    scale: number;
    position: vec2;
  };

  /**
   * Creates a new InfiniteCanvas instance
   * Sets up shadow DOM, event listeners, and drag/zoom functionality
   */
  constructor();

  /**
   * Gets the current pan position of the canvas
   */
  get position(): vec2;

  /**
   * Sets the pan position of the canvas
   * @param pos - Position object with x and y properties
   */
  set position(pos: { x: number; y: number });

  /**
   * Gets the current zoom scale of the canvas
   */
  get scale(): number;

  /**
   * Sets the zoom scale of the canvas
   * @param value - The scale factor (1.0 = 100%, 2.0 = 200%, 0.5 = 50%)
   */
  set scale(value: number);

  /**
   * Converts a point from screen coordinates to canvas coordinates
   * @param point - The point to convert (modified in place)
   * @returns The converted point (same instance as input)
   * @description This is useful for translating user interactions (like mouse clicks) 
   * into the canvas's coordinate system. It accounts for the canvas's screen position, 
   * pan offset, and current scale.
   */
  screenToCanvas(point: vec2): vec2;

  /**
   * Converts a point from canvas coordinates to screen coordinates
   * @param point - The point to convert (modified in place)
   * @returns The converted point (same instance as input)
   * @description Converts a point from the canvas coordinate system back to screen coordinates.
   * Useful for positioning elements or getting screen positions of canvas elements.
   */
  canvasToScreen(point: vec2): vec2;

  /**
   * Updates the visual transform of the canvas based on current position and scale
   * @private
   */
  private update(): void;

  /**
   * Called when the element is connected to the DOM
   * Initializes the canvas size and screen position
   */
  connectedCallback(): void;
}

/**
 * Augment the global HTMLElementTagNameMap to include our custom element
 */
declare global {
  interface HTMLElementTagNameMap {
    'infinite-canvas': InfiniteCanvas;
  }
}
