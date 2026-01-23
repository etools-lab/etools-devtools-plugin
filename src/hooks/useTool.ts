import { useState, useCallback } from 'react';
import type { ConversionResult, Tool } from '../types';
import { generateHash } from '../tools/cryptography/hash';
import { aesEncrypt, aesDecrypt, formatEncryptedOutput } from '../tools/cryptography/encrypt';
import { bcryptHash, bcryptVerify, isValidBcryptHash } from '../tools/cryptography/bcrypt';
import {
  jsonFormat,
  jsonValidate,
  jsonToCsv,
  jsonToGetParams,
  jsonEscape,
  jsonUnescape,
  jsonMinify,
} from '../tools/developer/json';
import { sqlFormat, sqlMinify } from '../tools/developer/sql';
import { yamlFormat, yamlMinify } from '../tools/developer/yaml';
import { xmlFormat, xmlMinify, xmlEscape, xmlUnescape } from '../tools/developer/xml';
import { testRegex, replaceRegex, formatMatchGroups } from '../tools/developer/regex';
import {
  timestampToDate,
  dateToTimestamp,
  getCurrentTimestamp,
} from '../tools/time/timestamp';
import { generateQRCode, parseQRCode } from '../tools/generate/qrcode';
import { generateBarcodeDataURL } from '../tools/generate/barcode';
import { convertToPinyin } from '../tools/convert/pinyin';
import { s2t, t2s } from '../tools/convert/s2t';

interface UseToolOptions<TInput = string, TOutput = string> {
  tool: Tool;
  extraInput?: string; // For password/secret in encryption tools
  regexFlags?: { g: boolean; i: boolean; m: boolean; s: boolean; u: boolean; y: boolean };
  timezoneOffset?: number;
  onComplete?: (result: ConversionResult<TOutput>) => void;
  onError?: (error: Error) => void;
}

interface UseToolReturn<TInput = string, TOutput = string> {
  execute: (input: TInput) => Promise<ConversionResult<TOutput>>;
  isLoading: boolean;
  result: ConversionResult<TOutput> | null;
  error: Error | null;
  reset: () => void;
}

export function useTool<TInput = string, TOutput = string>({
  tool,
  extraInput,
  regexFlags,
  timezoneOffset,
  onComplete,
  onError,
}: UseToolOptions<TInput, TOutput>): UseToolReturn<TOutput> {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ConversionResult<TOutput> | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (input: TInput): Promise<ConversionResult<TOutput>> => {
      setIsLoading(true);
      setError(null);

      const startTime = performance.now();

      try {
        // Call the appropriate handler based on tool ID
        let output: TOutput;
        switch (tool.id) {
          case 'base64-encode': {
            // Handle UTF-8 properly using TextEncoder/TextDecoder
            const encoder = new TextEncoder();
            const bytes = encoder.encode(String(input));
            output = btoa(String.fromCharCode(...bytes)) as TOutput;
            break;
          }
          case 'base64-decode': {
            // Handle UTF-8 properly using TextEncoder/TextDecoder
            const binary = atob(String(input));
            const bytes = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) {
              bytes[i] = binary.charCodeAt(i);
            }
            const decoder = new TextDecoder();
            output = decoder.decode(bytes) as TOutput;
            break;
          }
          case 'url-encode': {
            output = encodeURIComponent(String(input)) as TOutput;
            break;
          }
          case 'url-decode': {
            output = decodeURIComponent(String(input)) as TOutput;
            break;
          }
          case 'unicode-encode': {
            let res = '';
            const text = String(input);
            for (let i = 0; i < text.length; i++) {
              const charCode = text.charCodeAt(i);
              res += `\\u${charCode.toString(16).padStart(4, '0')}`;
            }
            output = res as TOutput;
            break;
          }
          case 'unicode-decode': {
            output = String(input).replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => {
              return String.fromCharCode(parseInt(hex, 16));
            }) as TOutput;
            break;
          }
          case 'hex-encode': {
            const text = String(input);
            const bytes = new TextEncoder().encode(text);
            output = Array.from(bytes)
              .map((b) => b.toString(16).padStart(2, '0'))
              .join(' ') as TOutput;
            break;
          }
          case 'hex-decode': {
            const hex = String(input).replace(/\s+/g, '').toLowerCase();
            const bytes: number[] = [];
            for (let i = 0; i < hex.length; i += 2) {
              bytes.push(parseInt(hex.slice(i, i + 2), 16));
            }
            output = new TextDecoder().decode(new Uint8Array(bytes)) as TOutput;
            break;
          }
          case 'uuid-gen': {
            output = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
              /[xy]/g,
              (c) => {
                const r = (Math.random() * 16) | 0;
                const v = c === 'x' ? r : (r & 0x3) | 0x8;
                return v.toString(16);
              }
            ) as TOutput;
            break;
          }
          // Hash tools
          case 'hash-md5': {
            const hashResult = await generateHash(String(input), 'md5');
            if (!hashResult.success) {
              throw new Error(hashResult.error);
            }
            output = hashResult.result as TOutput;
            break;
          }
          case 'hash-sha1': {
            const hashResult = await generateHash(String(input), 'sha1');
            if (!hashResult.success) {
              throw new Error(hashResult.error);
            }
            output = hashResult.result as TOutput;
            break;
          }
          case 'hash-sha256': {
            const hashResult = await generateHash(String(input), 'sha256');
            if (!hashResult.success) {
              throw new Error(hashResult.error);
            }
            output = hashResult.result as TOutput;
            break;
          }
          case 'hash-sha512': {
            const hashResult = await generateHash(String(input), 'sha512');
            if (!hashResult.success) {
              throw new Error(hashResult.error);
            }
            output = hashResult.result as TOutput;
            break;
          }
          case 'hash-sm3': {
            const hashResult = await generateHash(String(input), 'sm3');
            if (!hashResult.success) {
              throw new Error(hashResult.error);
            }
            output = hashResult.result as TOutput;
            break;
          }
          // JSON tools
          case 'json-format': {
            const result = jsonFormat(String(input), 2);
            if (!result.success) {
              throw new Error(result.error);
            }
            output = result.result as TOutput;
            break;
          }
          case 'json-validate': {
            const result = jsonValidate(String(input));
            if (!result.success) {
              throw new Error(result.error);
            }
            output = 'JSON 格式正确' as TOutput;
            break;
          }
          case 'json-to-csv': {
            const result = jsonToCsv(String(input));
            if (!result.success) {
              throw new Error(result.error);
            }
            output = result.result as TOutput;
            break;
          }
          case 'json-to-get': {
            const result = jsonToGetParams(String(input));
            if (!result.success) {
              throw new Error(result.error);
            }
            output = result.result as TOutput;
            break;
          }
          case 'json-escape': {
            const result = jsonEscape(String(input));
            if (!result.success) {
              throw new Error(result.error);
            }
            output = result.result as TOutput;
            break;
          }
          case 'json-unescape': {
            const result = jsonUnescape(String(input));
            if (!result.success) {
              throw new Error(result.error);
            }
            output = result.result as TOutput;
            break;
          }
          case 'json-minify': {
            const result = jsonMinify(String(input));
            if (!result.success) {
              throw new Error(result.error);
            }
            output = result.result as TOutput;
            break;
          }
          // Code formatting tools
          case 'sql-format': {
            const result = sqlFormat(String(input), 2);
            if (!result.success) {
              throw new Error(result.error);
            }
            output = result.result as TOutput;
            break;
          }
          case 'yaml-format': {
            const result = yamlFormat(String(input), 2);
            if (!result.success) {
              throw new Error(result.error);
            }
            output = result.result as TOutput;
            break;
          }
          case 'xml-format': {
            const result = xmlFormat(String(input), 2);
            if (!result.success) {
              throw new Error(result.error);
            }
            output = result.result as TOutput;
            break;
          }
          // AES encryption
          case 'aes-encrypt': {
            if (!extraInput) {
              throw new Error('Password is required for AES encryption');
            }
            const encResult = await aesEncrypt(String(input), extraInput);
            if (!encResult.success) {
              throw new Error(encResult.error);
            }
            output = formatEncryptedOutput(encResult.result) as TOutput;
            break;
          }
          case 'aes-decrypt': {
            if (!extraInput) {
              throw new Error('Password is required for AES decryption');
            }
            try {
              const parsed = JSON.parse(String(input));
              const decResult = await aesDecrypt(parsed.ciphertext, extraInput, parsed.iv, parsed.salt);
              if (!decResult.success) {
                throw new Error(decResult.error);
              }
              output = decResult.result as TOutput;
            } catch {
              throw new Error('Invalid encrypted input format. Expected JSON with ciphertext, iv, and salt.');
            }
            break;
          }
          // Bcrypt tools
          case 'bcrypt-hash': {
            const rounds = parseInt(extraInput || '10', 10);
            const hashResult = await bcryptHash(String(input), rounds);
            if (!hashResult.success) {
              throw new Error(hashResult.error);
            }
            output = hashResult.result as TOutput;
            break;
          }
          case 'bcrypt-verify': {
            if (!extraInput) {
              throw new Error('Hash is required for verification');
            }
            const verifyResult = await bcryptVerify(String(input), extraInput);
            if (!verifyResult.success) {
              throw new Error(verifyResult.error);
            }
            output = (verifyResult.result ? 'Verification passed: Hash matches' : 'Verification failed: Hash does not match') as TOutput;
            break;
          }
          // Regex tester
          case 'regex-test': {
            // Expect format: pattern|text or pattern|flags|text
            const inputStr = String(input);
            const parts = inputStr.split('|');
            let pattern = parts[0];
            let flags = 'g';
            let text = '';

            if (parts.length === 2) {
              text = parts[1];
            } else if (parts.length >= 3) {
              flags = parts[1];
              text = parts.slice(2).join('|');
            }

            // Apply regex flags from options if provided
            if (regexFlags) {
              const flagChars = [];
              if (regexFlags.g) flagChars.push('g');
              if (regexFlags.i) flagChars.push('i');
              if (regexFlags.m) flagChars.push('m');
              if (regexFlags.s) flagChars.push('s');
              if (regexFlags.u) flagChars.push('u');
              if (regexFlags.y) flagChars.push('y');
              flags = flagChars.join('');
            }

            if (!pattern) {
              throw new Error('正则表达式不能为空');
            }
            if (!text) {
              throw new Error('请输入要匹配的文本');
            }

            let result;
            if (extraInput) {
              // Replace mode
              result = replaceRegex(pattern, text, extraInput, flags);
              if (!result.success) {
                throw new Error(result.error);
              }
              output = `替换结果:\n${result.result?.replacedText}\n\n匹配信息:\n${formatMatchGroups(result.result?.matches || [])}` as TOutput;
            } else {
              // Test mode
              result = testRegex(pattern, text, flags);
              if (!result.success) {
                throw new Error(result.error);
              }
              output = formatMatchGroups(result.result?.matches || []) as TOutput;
            }
            break;
          }
          // Timestamp tools
          case 'ts-to-date': {
            const result = timestampToDate(String(input), timezoneOffset);
            if (!result.success) {
              throw new Error(result.error);
            }
            output = result.result as TOutput;
            break;
          }
          case 'date-to-ts': {
            const result = dateToTimestamp(String(input), timezoneOffset);
            if (!result.success) {
              throw new Error(result.error);
            }
            output = result.result as TOutput;
            break;
          }
          // QR Code generator
          case 'qrcode-gen': {
            const qrResult = await generateQRCode(String(input));
            if (!qrResult.success) {
              throw new Error(qrResult.error);
            }
            output = `![QR Code](${qrResult.result})` as TOutput;
            break;
          }
          // QR Code parser
          case 'qrcode-parse': {
            const parseResult = await parseQRCode(String(input));
            if (!parseResult.success) {
              throw new Error(parseResult.error);
            }
            output = parseResult.result as TOutput;
            break;
          }
          // Barcode generator
          case 'barcode-gen': {
            const barcodeResult = generateBarcodeDataURL(String(input));
            if (!barcodeResult.success) {
              throw new Error(barcodeResult.error);
            }
            output = `![Barcode](${barcodeResult.result})` as TOutput;
            break;
          }
          // Pinyin converter
          case 'pinyin-convert': {
            // extraInput contains options in format: toneType,outputType,separator
            const optionsStr = extraInput || 'none,full, ';
            const [toneType = 'none', outputType = 'full', separator = ' '] = optionsStr.split(',');
            const pinyinResult = convertToPinyin(String(input), {
              toneType: toneType as 'symbol' | 'none' | 'number',
              outputType: outputType as 'full' | 'initials' | 'array',
              separator,
            });
            if (!pinyinResult.success) {
              throw new Error(pinyinResult.error);
            }
            output = pinyinResult.result as TOutput;
            break;
          }
          // Simplified to Traditional
          case 's2t-convert': {
            const s2tResult = s2t(String(input));
            if (!s2tResult.success) {
              throw new Error(s2tResult.error);
            }
            output = s2tResult.result as TOutput;
            break;
          }
          // Traditional to Simplified
          case 't2s-convert': {
            const t2sResult = t2s(String(input));
            if (!t2sResult.success) {
              throw new Error(t2sResult.error);
            }
            output = t2sResult.result as TOutput;
            break;
          }
          default:
            throw new Error(`Unknown tool: ${tool.id}`);
        }

        const endTime = performance.now();
        const conversionResult: ConversionResult<TOutput> = {
          success: true,
          result: output,
          metadata: {
            duration: Math.round(endTime - startTime),
            inputLength: String(input).length,
            outputLength: String(output).length,
          },
        };

        setResult(conversionResult);
        onComplete?.(conversionResult);
        return conversionResult;
      } catch (err) {
        const conversionResult: ConversionResult<TOutput> = {
          success: false,
          error: err instanceof Error ? err.message : 'Unknown error',
          metadata: {
            duration: Math.round(performance.now() - startTime),
            inputLength: String(input).length,
          },
        };

        setError(err instanceof Error ? err : new Error(String(err)));
        setResult(conversionResult);
        onError?.(err instanceof Error ? err : new Error(String(err)));
        return conversionResult;
      } finally {
        setIsLoading(false);
      }
    },
    [tool.id, onComplete, onError]
  );

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    execute,
    isLoading,
    result,
    error,
    reset,
  };
}
