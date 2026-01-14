/**
 * Developer Tools Plugin UI Component
 * Provides a consistent UI that matches etools design system
 */

import { useState } from 'react';
import {
  PluginUIContainer,
  Button,
  Input,
  Card,
  Badge,
  Spinner,
} from '@etools/plugin-sdk';
import './ui.css';

interface ToolResult {
  type: string;
  success: boolean;
  result?: string;
  error?: string;
}

export function DevToolsUI() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ToolResult | null>(null);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  const tools = [
    { id: 'json', name: 'JSON 格式化', icon: '📋', description: '格式化和验证 JSON' },
    { id: 'base64-encode', name: 'Base64 编码', icon: '🔐', description: '编码文本为 Base64' },
    { id: 'base64-decode', name: 'Base64 解码', icon: '🔓', description: '解码 Base64 为文本' },
    { id: 'url-encode', name: 'URL 编码', icon: '🔗', description: '编码 URL 组件' },
    { id: 'url-decode', name: 'URL 解码', icon: '🔗', description: '解码 URL 组件' },
  ];

  const handleToolSelect = (toolId: string) => {
    setSelectedTool(toolId);
    setResult(null);
  };

  const handleExecute = async () => {
    if (!selectedTool || !input.trim()) {
      return;
    }

    setIsLoading(true);

    // Simulate async operation
    setTimeout(() => {
      let toolResult: ToolResult;

      try {
        switch (selectedTool) {
          case 'json': {
            try {
              const parsed = JSON.parse(input);
              toolResult = {
                type: 'json',
                success: true,
                result: JSON.stringify(parsed, null, 2),
              };
            } catch (error) {
              toolResult = {
                type: 'json',
                success: false,
                error: error instanceof Error ? error.message : 'Invalid JSON',
              };
            }
            break;
          }

          case 'base64-encode': {
            toolResult = {
              type: 'base64-encode',
              success: true,
              result: btoa(unescape(encodeURIComponent(input))),
            };
            break;
          }

          case 'base64-decode': {
            try {
              toolResult = {
                type: 'base64-decode',
                success: true,
                result: decodeURIComponent(escape(atob(input))),
              };
            } catch (error) {
              toolResult = {
                type: 'base64-decode',
                success: false,
                error: 'Invalid Base64 string',
              };
            }
            break;
          }

          case 'url-encode': {
            toolResult = {
              type: 'url-encode',
              success: true,
              result: encodeURIComponent(input),
            };
            break;
          }

          case 'url-decode': {
            try {
              toolResult = {
                type: 'url-decode',
                success: true,
                result: decodeURIComponent(input),
              };
            } catch (error) {
              toolResult = {
                type: 'url-decode',
                success: false,
                error: 'Invalid URL encoding',
              };
            }
            break;
          }

          default:
            toolResult = {
              type: selectedTool,
              success: false,
              error: 'Unknown tool',
            };
        }
      } catch (error) {
        toolResult = {
          type: selectedTool,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }

      setResult(toolResult);
      setIsLoading(false);
    }, 300);
  };

  const handleReset = () => {
    setInput('');
    setResult(null);
    setSelectedTool(null);
  };

  const selectedToolData = tools.find(t => t.id === selectedTool);

  return (
    <PluginUIContainer
      title="开发者工具"
      subtitle="JSON 格式化、Base64、URL 编码等实用工具"
      icon="🛠️"
      actions={
        <>
          <Button
            variant="primary"
            onClick={handleExecute}
            isLoading={isLoading}
            disabled={!selectedTool || !input.trim()}
          >
            执行
          </Button>
          <Button variant="ghost" onClick={handleReset}>
            重置
          </Button>
        </>
      }
      isLoading={isLoading && !result}
    >
      {/* Tool Selection */}
      <div className="devtools-section">
        <label className="devtools-label">选择工具</label>
        <div className="devtools-grid">
          {tools.map((tool) => (
            <Card
              key={tool.id}
              variant={selectedTool === tool.id ? 'elevated' : 'outlined'}
              padding="md"
              hover
              className="devtools-tool-card"
              onClick={() => handleToolSelect(tool.id)}
            >
              <div className="devtools-tool-icon">{tool.icon}</div>
              <div className="devtools-tool-name">{tool.name}</div>
              <div className="devtools-tool-desc">{tool.description}</div>
            </Card>
          ))}
        </div>
      </div>

      {/* Input Section */}
      {selectedToolData && (
        <div className="devtools-section">
          <label className="devtools-label">
            {selectedToolData.icon} {selectedToolData.name}
          </label>
          <Input
            placeholder="请输入内容..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            multiline
            rows={6}
          />
        </div>
      )}

      {/* Result Display */}
      {result && (
        <Card variant="outlined" padding="md" className="devtools-result-card">
          <div className="devtools-result-header">
            <h3 className="devtools-result-title">
              {result.success ? '✓ 处理成功' : '✗ 处理失败'}
            </h3>
            <Badge variant={result.success ? 'success' : 'error'}>
              {result.success ? '成功' : '错误'}
            </Badge>
          </div>
          {result.success && result.result && (
            <div className="devtools-result-content">
              <pre className="devtools-result-text">{result.result}</pre>
            </div>
          )}
          {result.error && (
            <div className="devtools-error">
              <span className="devtools-error-text">{result.error}</span>
            </div>
          )}
        </Card>
      )}

      {/* Quick Actions */}
      <div className="devtools-section">
        <h3 className="devtools-section-title">快速操作</h3>
        <div className="devtools-quick-actions">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setSelectedTool('json');
              setInput('{"name":"example","value":123}');
            }}
          >
            JSON 示例
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setSelectedTool('base64-encode');
              setInput('Hello World!');
            }}
          >
            Base64 示例
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setSelectedTool('url-encode');
              setInput('hello world');
            }}
          >
            URL 示例
          </Button>
        </div>
      </div>
    </PluginUIContainer>
  );
}
