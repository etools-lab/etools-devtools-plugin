/**
 * QR Code generator and parser
 */

import type { ConversionResult } from '../../types';
import QRCode from 'qrcode';
import { BrowserMultiFormatReader, BarcodeFormat, DecodeHintType } from '@zxing/library';

/**
 * QR Code error correction levels
 */
export type QRCodeErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

/**
 * QR Code generation options
 */
export interface QRCodeOptions {
  /** Error correction level: L (7%), M (15%), Q (25%), H (30%) */
  errorCorrectionLevel?: QRCodeErrorCorrectionLevel;
  /** QR code width in pixels */
  width?: number;
  /** QR code margin */
  margin?: number;
  /** QR code color */
  color?: {
    dark?: string;
    light?: string;
  };
}

/**
 * Generate QR code as data URL
 */
export async function generateQRCode(
  text: string,
  options: QRCodeOptions = {}
): Promise<ConversionResult<string>> {
  const startTime = performance.now();

  try {
    const {
      errorCorrectionLevel = 'M',
      width = 256,
      margin = 2,
      color = { dark: '#000000', light: '#ffffff' },
    } = options;

    const dataUrl = await QRCode.toDataURL(text, {
      errorCorrectionLevel,
      width,
      margin,
      color,
    });

    const endTime = performance.now();
    return {
      success: true,
      result: dataUrl,
      metadata: {
        duration: Math.round(endTime - startTime),
        inputLength: text.length,
        outputLength: dataUrl.length,
        extra: {
          errorCorrectionLevel,
          width,
          textLength: text.length,
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate QR code',
      metadata: {
        duration: Math.round(performance.now() - startTime),
        inputLength: text.length,
      },
    };
  }
}

/**
 * Generate QR code as SVG string
 */
export async function generateQRCodeSVG(
  text: string,
  options: QRCodeOptions = {}
): Promise<ConversionResult<string>> {
  const startTime = performance.now();

  try {
    const {
      errorCorrectionLevel = 'M',
      width = 256,
      margin = 2,
      color = { dark: '#000000', light: '#ffffff' },
    } = options;

    const svg = await QRCode.toString(text, {
      type: 'svg',
      errorCorrectionLevel,
      width,
      margin,
      color,
    });

    const endTime = performance.now();
    return {
      success: true,
      result: svg,
      metadata: {
        duration: Math.round(endTime - startTime),
        inputLength: text.length,
        outputLength: svg.length,
        extra: {
          errorCorrectionLevel,
          width,
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate QR code SVG',
      metadata: {
        duration: Math.round(performance.now() - startTime),
        inputLength: text.length,
      },
    };
  }
}

/**
 * Parse QR code from image data URL
 */
export async function parseQRCode(imageDataUrl: string): Promise<ConversionResult<string>> {
  const startTime = performance.now();

  try {
    const hints = new Map();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.QR_CODE]);
    hints.set(DecodeHintType.TRY_HARDER, true);

    const reader = new BrowserMultiFormatReader(hints);

    // Extract base64 data from data URL
    const base64Data = imageDataUrl.split(',')[1];
    const imageData = Buffer.from(base64Data, 'base64');

    const result = await reader.decodeFromImageData(imageData);

    const endTime = performance.now();

    if (result) {
      return {
        success: true,
        result: result.getText(),
        metadata: {
          duration: Math.round(endTime - startTime),
          extra: {
            format: 'QR_CODE',
            encoding: result.getRawBytes()?.length || 0,
          },
        },
      };
    } else {
      return {
        success: false,
        error: 'No QR code found in image',
        metadata: {
          duration: Math.round(performance.now() - startTime),
        },
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to parse QR code',
      metadata: {
        duration: Math.round(performance.now() - startTime),
      },
    };
  }
}

/**
 * Parse QR code from image file
 */
export async function parseQRCodeFromFile(file: File): Promise<ConversionResult<string>> {
  const startTime = performance.now();

  try {
    const hints = new Map();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.QR_CODE]);
    hints.set(DecodeHintType.TRY_HARDER, true);

    const reader = new BrowserMultiFormatReader(hints);

    const arrayBuffer = await file.arrayBuffer();
    const imageData = Buffer.from(arrayBuffer);

    const result = await reader.decodeFromImageData(imageData);

    const endTime = performance.now();

    if (result) {
      return {
        success: true,
        result: result.getText(),
        metadata: {
          duration: Math.round(endTime - startTime),
          extra: {
            format: 'QR_CODE',
            fileName: file.name,
            fileSize: file.size,
          },
        },
      };
    } else {
      return {
        success: false,
        error: 'No QR code found in image',
        metadata: {
          duration: Math.round(performance.now() - startTime),
        },
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to parse QR code',
      metadata: {
        duration: Math.round(performance.now() - startTime),
      },
    };
  }
}
