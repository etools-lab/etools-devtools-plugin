/**
 * Local type definitions for ETools Plugin SDK
 * These types should match the ETools plugin SDK v2 specification
 */

// ============================================================================
// Tool Types
// ============================================================================

export type ToolCategory =
  | 'encoding'
  | 'cryptography'
  | 'developer'
  | 'time'
  | 'convert'
  | 'generate'
  | 'text'
  | 'network';

export interface Tool {
  /** Unique identifier for the tool */
  id: string;
  /** Display name of the tool */
  name: string;
  /** Icon emoji or identifier */
  icon: string;
  /** Brief description of the tool */
  description: string;
  /** Category this tool belongs to */
  category: ToolCategory;
  /** Whether the tool works offline */
  offlineSupported: boolean;
  /** Keywords that trigger this tool in search */
  triggerKeywords: string[];
}

export interface ConversionResult<T = string> {
  /** Whether the operation was successful */
  success: boolean;
  /** The result data (if successful) */
  result?: T;
  /** Error message (if failed) */
  error?: string;
  /** Additional metadata about the operation */
  metadata?: {
    /** Time taken in milliseconds */
    duration?: number;
    /** Input length for reference */
    inputLength?: number;
    /** Output length for reference */
    outputLength?: number;
    /** Additional info like line/column for JSON errors */
    extra?: Record<string, any>;
  };
}

// ============================================================================
// Plugin SDK Types
// ============================================================================

export type PluginPermission =
  | 'read:clipboard'
  | 'write:clipboard'
  | 'read:files'
  | 'write:files'
  | 'network:request'
  | 'show:notification';

export interface PluginSetting {
  id: string;
  label: string;
  type: 'text' | 'number' | 'boolean' | 'select';
  default?: string | number | boolean;
  options?: Array<{ label: string; value: string | number | boolean }>;
}

export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  permissions: PluginPermission[];
  triggers: string[];
  settings?: PluginSetting[];
  icon?: string;
  homepage?: string;
}

export interface PluginSearchResultV2 {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  actionData?: Record<string, any>;
  action?: () => void | Promise<void>;
}

export interface PluginUI {
  component: any; // React component type
}

export interface PluginV2 {
  manifest: PluginManifest;
  onSearch: (query: string) => Promise<PluginSearchResultV2[]>;
  executeAction?: (actionData: any) => Promise<string>;
  ui?: PluginUI;
}
