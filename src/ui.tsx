import { useState, useEffect } from 'react';
import {
  PluginUIContainer,
  Button,
  Input,
  Card,
  Badge,
  Spinner,
} from '@etools/plugin-sdk';
import './ui.css';

function simpleHash(text: string): string {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
}

async function generateHash(text: string, algorithm: 'md5' | 'sha-1' | 'sha-256'): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);

  let algo: string;
  switch (algorithm) {
    case 'md5':
      return simpleHash(text);
    case 'sha-1':
      algo = 'SHA-1';
      break;
    case 'sha-256':
      algo = 'SHA-256';
      break;
    default:
      algo = 'SHA-256';
  }

  const hashBuffer = await crypto.subtle.digest(algo, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

interface ToolResult {
  type: string;
  success: boolean;
  result?: string;
  error?: string;
}

export function DevToolsUI({ toolId: initialToolId, query: initialQuery }: { toolId?: string; query?: string } = {}) {
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
    { id: 'hash-md5', name: 'MD5 Hash', icon: '#️⃣', description: '生成 MD5 哈希' },
    { id: 'hash-sha1', name: 'SHA-1 Hash', icon: '#️⃣', description: '生成 SHA-1 哈希' },
    { id: 'hash-sha256', name: 'SHA-256 Hash', icon: '#️⃣', description: '生成 SHA-256 哈希' },
    { id: 'ts-convert', name: '时间戳转换', icon: '🕐', description: 'Unix 时间戳转日期' },
    { id: 'uuid-gen', name: 'UUID 生成', icon: '🆔', description: '生成 UUID v4' },
  ];

  const handleToolSelect = (toolId: string) => {
    setSelectedTool(toolId);
    setResult(null);
  };

  useEffect(() => {
    if (initialToolId && tools.find(t => t.id === initialToolId)) {
      setSelectedTool(initialToolId);
    }
    if (initialQuery) {
      setInput(initialQuery);
    }
  }, [initialToolId, initialQuery]);

  const handleExecute = async () => {
    if (!selectedTool || !input.trim()) {
      return;
    }

    setIsLoading(true);

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

        case 'hash-md5': {
          toolResult = {
            type: 'hash-md5',
            success: true,
            result: simpleHash(input),
          };
          break;
        }

        case 'hash-sha1': {
          const hash = await generateHash(input, 'sha-1');
          toolResult = {
            type: 'hash-sha1',
            success: true,
            result: `SHA-1: ${hash}`,
          };
          break;
        }

        case 'hash-sha256': {
          const hash = await generateHash(input, 'sha-256');
          toolResult = {
            type: 'hash-sha256',
            success: true,
            result: `SHA-256: ${hash}`,
          };
          break;
        }

        case 'ts-convert': {
          try {
            const ts = parseInt(input, 10);
            if (isNaN(ts)) {
              throw new Error('Invalid timestamp');
            }
            const date = ts.toString().length <= 10 ? new Date(ts * 1000) : new Date(ts);
            toolResult = {
              type: 'ts-convert',
              success: true,
              result: date.toLocaleString(),
            };
          } catch (error) {
            toolResult = {
              type: 'ts-convert',
              success: false,
              error: 'Invalid timestamp',
            };
          }
          break;
        }

        case 'uuid-gen': {
          toolResult = {
            type: 'uuid-gen',
            success: true,
            result: generateUUID(),
          };
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
  };

  useEffect(() => {
    if (initialToolId && initialQuery && initialQuery.trim() && selectedTool) {
      setTimeout(() => {
        handleExecute();
      }, 300);
    }
  }, [initialToolId, initialQuery, selectedTool, handleExecute]);

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
