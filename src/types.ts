/**
 * Local type definitions for ETools Plugin SDK
 * These types should match the ETools plugin SDK v2 specification
 */

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
