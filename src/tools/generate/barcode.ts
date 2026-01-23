/**
 * Barcode generator using JsBarcode
 */

import type { ConversionResult } from '../../types';
import JsBarcode from 'jsbarcode';

/**
 * Supported barcode formats
 */
export type BarcodeFormat = 'CODE128' | 'EAN13' | 'EAN8' | 'UPC' | 'CODE39' | 'ITF14' | 'MSI' | 'pharmacode';

/**
 * Barcode generation options
 */
export interface BarcodeOptions {
  /** Barcode format */
  format?: BarcodeFormat;
  /** Barcode width */
  width?: number;
  /** Barcode height */
  height?: number;
  /** Display human-readable text */
  displayValue?: boolean;
  /** Font size for text */
  fontSize?: number;
  /** Font family */
  font?: string;
  /** Text margin */
  margin?: number;
  /** Background color */
  background?: string;
  /** Bar color */
  lineColor?: string;
}

/**
 * Generate barcode as SVG string
 */
export function generateBarcode(
  text: string,
  options: BarcodeOptions = {}
): ConversionResult<string> {
  const startTime = performance.now();

  try {
    const {
      format = 'CODE128',
      width = 2,
      height = 60,
      displayValue = true,
      fontSize = 20,
      font = 'monospace',
      margin = 10,
      background = '#ffffff',
      lineColor = '#000000',
    } = options;

    // Create a temporary canvas element
    const canvas = document.createElement('canvas');

    JsBarcode(canvas, text, {
      format,
      width,
      height,
      displayValue,
      fontSize,
      font,
      margin,
      background,
      lineColor,
      valid: function (valid: boolean) {
        if (!valid) {
          throw new Error('Invalid barcode data for format ' + format);
        }
      },
    });

    // Convert to SVG
    const svg = canvasToSVG(canvas, background);

    const endTime = performance.now();
    return {
      success: true,
      result: svg,
      metadata: {
        duration: Math.round(endTime - startTime),
        inputLength: text.length,
        outputLength: svg.length,
        extra: {
          format,
          textLength: text.length,
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate barcode',
      metadata: {
        duration: Math.round(performance.now() - startTime),
        inputLength: text.length,
      },
    };
  }
}

/**
 * Generate barcode as data URL
 */
export function generateBarcodeDataURL(
  text: string,
  options: BarcodeOptions = {}
): ConversionResult<string> {
  const startTime = performance.now();

  try {
    const {
      format = 'CODE128',
      width = 2,
      height = 60,
      displayValue = true,
      fontSize = 20,
      font = 'monospace',
      margin = 10,
      background = '#ffffff',
      lineColor = '#000000',
    } = options;

    // Create a temporary canvas element
    const canvas = document.createElement('canvas');

    JsBarcode(canvas, text, {
      format,
      width,
      height,
      displayValue,
      fontSize,
      font,
      margin,
      background,
      lineColor,
      valid: function (valid: boolean) {
        if (!valid) {
          throw new Error('Invalid barcode data for format ' + format);
        }
      },
    });

    const dataUrl = canvas.toDataURL('image/png');

    const endTime = performance.now();
    return {
      success: true,
      result: dataUrl,
      metadata: {
        duration: Math.round(endTime - startTime),
        inputLength: text.length,
        outputLength: dataUrl.length,
        extra: {
          format,
          textLength: text.length,
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate barcode',
      metadata: {
        duration: Math.round(performance.now() - startTime),
        inputLength: text.length,
      },
    };
  }
}

/**
 * Get supported barcode formats
 */
export function getSupportedBarcodeFormats(): BarcodeFormat[] {
  return ['CODE128', 'EAN13', 'EAN8', 'UPC', 'CODE39', 'ITF14', 'MSI', 'pharmacode'];
}

/**
 * Convert canvas to SVG
 */
function canvasToSVG(canvas: HTMLCanvasElement, background: string): string {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const width = canvas.width;
  const height = canvas.height;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;
  svg += `<rect width="100%" height="100%" fill="${background}"/>`;

  // Find contiguous pixel regions (bars)
  for (let x = 0; x < width; x++) {
    let isBar = false;
    for (let y = 0; y < height; y++) {
      const i = (y * width + x) * 4;
      const isBlack = imageData.data[i] < 128;

      if (isBlack && !isBar) {
        // Start of a new bar
        isBar = true;
        let barEnd = y;
        // Find bar end
        while (barEnd < height) {
          const j = (barEnd * width + x) * 4;
          if (imageData.data[j] >= 128) break;
          barEnd++;
        }
        svg += `<rect x="${x}" y="${y}" width="1" height="${barEnd - y}" fill="#000000"/>`;
      } else if (!isBlack && isBar) {
        isBar = false;
      }
    }
  }

  svg += '</svg>';
  return svg;
}
