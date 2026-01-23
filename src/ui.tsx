import { useState, useEffect, useCallback, useRef } from 'react';
import {
  PluginUIContainer,
  Button,
  Input,
  Card,
  Badge,
  Checkbox,
} from '@etools/plugin-sdk';
import type { Tool, ToolCategory } from './types';
import {
  TOOLS,
  CATEGORIES,
  TOOLS_BY_CATEGORY,
  getToolById,
} from './tools';
import { ToolPanel } from './components/ToolPanel';
import { useTool } from './hooks/useTool';
import { useClipboard } from './hooks/useClipboard';
import './ui.css';

// SVG Icons
const WifiOffIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="1" y1="1" x2="23" y2="23"></line>
    <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path>
    <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path>
    <path d="M10.71 5.05A16 16 0 0 1 22.58 9"></path>
    <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"></path>
    <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
    <line x1="12" y1="20" x2="12.01" y2="20"></line>
  </svg>
);

const SpinnerIcon = () => (
  <div className="devtools-spinner" />
);

interface ToolResult {
  type: string;
  success: boolean;
  result?: string;
  error?: string;
  metadata?: Record<string, any>;
}

const STORAGE_KEY = 'devtools-recent-tools';

// Tools that require extra input (password/secret/key)
const TOOLS_REQUIRING_EXTRA_INPUT = [
  'aes-encrypt',
  'aes-decrypt',
  'bcrypt-hash',
  'bcrypt-verify',
  'regex-test',
  'pinyin-convert',
];

// Online-only features that show warning when offline
const ONLINE_ONLY_FEATURES = ['qrcode-parse'];

// Category keyboard shortcut mapping
const CATEGORY_SHORTCUTS: Record<string, number> = {
  all: 0,
  encoding: 1,
  cryptography: 2,
  developer: 3,
  time: 4,
  generate: 5,
  convert: 6,
  text: 7,
};

interface DevToolsUIProps {
  toolId?: string;
  query?: string;
}

export function DevToolsUI({ toolId: initialToolId, query: initialQuery }: DevToolsUIProps = {}) {
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | 'all'>('all');
  const [input, setInput] = useState('');
  const [extraInput, setExtraInput] = useState('');
  const [recentTools, setRecentTools] = useState<string[]>([]);
  const [regexFlags, setRegexFlags] = useState({
    g: true,
    i: false,
    m: false,
    s: false,
    u: false,
    y: false,
  });
  const [timezoneOffset, setTimezoneOffset] = useState<number | undefined>(undefined);
  // Pinyin options
  const [pinyinToneType, setPinyinToneType] = useState<'symbol' | 'none' | 'number'>('none');
  const [pinyinOutputType, setPinyinOutputType] = useState<'full' | 'initials' | 'array'>('full');
  const [pinyinSeparator, setPinyinSeparator] = useState(' ');
  // Network status
  const [isOnline, setIsOnline] = useState(true);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Get current tool
  const selectedTool = selectedToolId ? getToolById(selectedToolId) : null;

  // Check if current tool requires extra input
  const requiresExtraInput = selectedToolId && TOOLS_REQUIRING_EXTRA_INPUT.includes(selectedToolId);

  // Use the useTool hook
  const { execute, isLoading, result: toolResult, reset } = useTool({
    tool: selectedTool!,
    extraInput: requiresExtraInput
      ? (selectedToolId === 'pinyin-convert'
          ? `${pinyinToneType},${pinyinOutputType},${pinyinSeparator}`
          : extraInput)
      : undefined,
    regexFlags: selectedToolId === 'regex-test' ? regexFlags : undefined,
    timezoneOffset: (selectedToolId === 'ts-to-date' || selectedToolId === 'date-to-ts') ? timezoneOffset : undefined,
    onComplete: (result) => {
      // Save to recent tools
      if (selectedToolId) {
        saveRecentTool(selectedToolId);
      }
    },
  });

  // Clipboard hook
  const { copyToClipboard, copyResult } = useClipboard();

  // Monitor network status
  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Number keys for category selection (0-7)
      const num = parseInt(e.key, 10);
      if (!isNaN(num) && num >= 0 && num <= 7) {
        const categoryEntry = Object.entries(CATEGORY_SHORTCUTS).find(([, v]) => v === num);
        if (categoryEntry) {
          setSelectedCategory(categoryEntry[0] as ToolCategory | 'all');
        }
      }

      // Enter to execute (when input is focused)
      if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
        const activeEl = document.activeElement;
        if (activeEl instanceof HTMLInputElement || activeEl instanceof HTMLTextAreaElement) {
          handleExecute();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedToolId, input, execute]);

  // Load recent tools from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setRecentTools(JSON.parse(saved));
      }
    } catch (err) {
      console.warn('Failed to load recent tools from localStorage:', err);
    }
  }, []);

  // Save tool to recent tools
  const saveRecentTool = useCallback((toolId: string) => {
    setRecentTools((prev) => {
      const filtered = prev.filter((id) => id !== toolId);
      const updated = [toolId, ...filtered].slice(0, 5); // Keep last 5 tools
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.warn('Failed to save recent tools to localStorage:', err);
      }
      return updated;
    });
  }, []);

  // Initialize from props
  useEffect(() => {
    if (initialToolId) {
      setSelectedToolId(initialToolId);
    }
    if (initialQuery) {
      setInput(initialQuery);
    }
  }, [initialToolId, initialQuery]);

  // Auto-execute if tool and query are provided
  useEffect(() => {
    if (initialToolId && initialQuery && initialQuery.trim() && selectedToolId) {
      const timer = setTimeout(() => {
        handleExecute();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [initialToolId, initialQuery, selectedToolId]);

  // Handle tool selection
  const handleToolSelect = useCallback(
    (toolId: string) => {
      setSelectedToolId(toolId);
      setInput('');
      setExtraInput('');
      setRegexFlags({
        g: true,
        i: false,
        m: false,
        s: false,
        u: false,
        y: false,
      });
      setTimezoneOffset(undefined);
      setPinyinToneType('none');
      setPinyinOutputType('full');
      setPinyinSeparator(' ');
      reset();
      saveRecentTool(toolId);
    },
    [reset, saveRecentTool]
  );

  // Handle execute
  const handleExecute = useCallback(async () => {
    if (!selectedToolId || !input.trim()) {
      return;
    }

    await execute(input);
  }, [selectedToolId, input, execute]);

  // Handle reset
  const handleReset = useCallback(() => {
    setInput('');
    setExtraInput('');
    reset();
  }, [reset]);

  // Handle copy result
  const handleCopy = useCallback(() => {
    if (toolResult?.success && toolResult.result) {
      copyToClipboard(toolResult.result);
    }
  }, [toolResult, copyToClipboard]);

  // Get recent tools
  const recentToolObjects = recentTools
    .map((id) => getToolById(id))
    .filter((t): t is Tool => t !== undefined);

  // Get displayed tools based on category
  const displayedTools =
    selectedCategory === 'all'
      ? TOOLS
      : TOOLS_BY_CATEGORY[selectedCategory] || [];

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
            disabled={!selectedToolId || !input.trim() || (requiresExtraInput && !extraInput.trim())}
          >
            执行
          </Button>
          <Button variant="ghost" onClick={handleReset}>
            重置
          </Button>
        </>
      }
      isLoading={isLoading && !toolResult}
    >
      {/* Network status indicator */}
      {!isOnline && (
        <div className="devtools-offline-indicator" style={{ marginBottom: '12px' }}>
          <WifiOffIcon />
          <span>离线模式 - 所有功能均可正常使用</span>
        </div>
      )}

      {/* Category tabs and tool grid */}
      <ToolPanel
        tools={TOOLS}
        selectedToolId={selectedToolId}
        onToolSelect={handleToolSelect}
        categories={CATEGORIES}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* Recent tools */}
      {recentToolObjects.length > 0 && selectedCategory === 'all' && (
        <div className="devtools-section">
          <label className="devtools-label">最近使用</label>
          <div className="devtools-recent-tools">
            {recentToolObjects.map((tool) => (
              <button
                key={tool.id}
                className="devtools-recent-tool"
                onClick={() => handleToolSelect(tool.id)}
              >
                {tool.icon} {tool.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tool input area */}
      {selectedTool && (
        <div className="devtools-section">
          <label className="devtools-label">
            {selectedTool.icon} {selectedTool.name}
          </label>
          <Input
            placeholder={
              selectedToolId === 'regex-test'
                ? '正则表达式|要匹配的文本 (例如: \\w+@\\w+\\.com|test@example.com)'
                : `请输入${selectedTool.description}...`
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            multiline
            rows={6}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                handleExecute();
              }
            }}
          />

          {/* Extra input for encryption/password tools */}
          {requiresExtraInput && selectedToolId !== 'pinyin-convert' && (
            <div className="devtools-extra-input" style={{ marginTop: '12px' }}>
              <Input
                placeholder={
                  selectedToolId?.includes('bcrypt')
                    ? 'Bcrypt rounds (默认 10)'
                    : selectedToolId === 'regex-test'
                      ? '替换文本 (可选)'
                      : '请输入密码/密钥...'
                }
                value={extraInput}
                onChange={(e) => setExtraInput(e.target.value)}
                type={selectedToolId === 'regex-test' ? 'text' : 'password'}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                    handleExecute();
                  }
                }}
              />
            </div>
          )}

          {/* Pinyin options UI */}
          {selectedToolId === 'pinyin-convert' && (
            <div className="devtools-pinyin-options" style={{ marginTop: '12px' }}>
              <label className="devtools-label">拼音选项</label>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '8px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary, #666)', marginBottom: '4px' }}>声调</label>
                  <select
                    value={pinyinToneType}
                    onChange={(e) => setPinyinToneType(e.target.value as 'symbol' | 'none' | 'number')}
                    style={{
                      padding: '6px 10px',
                      borderRadius: '4px',
                      border: '1px solid var(--border-color, #e0e0e0)',
                      backgroundColor: 'var(--bg-color, #fff)',
                      fontSize: '14px',
                    }}
                  >
                    <option value="none">无声调</option>
                    <option value="symbol">符号声调</option>
                    <option value="number">数字声调</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary, #666)', marginBottom: '4px' }}>输出类型</label>
                  <select
                    value={pinyinOutputType}
                    onChange={(e) => setPinyinOutputType(e.target.value as 'full' | 'initials' | 'array')}
                    style={{
                      padding: '6px 10px',
                      borderRadius: '4px',
                      border: '1px solid var(--border-color, #e0e0e0)',
                      backgroundColor: 'var(--bg-color, #fff)',
                      fontSize: '14px',
                    }}
                  >
                    <option value="full">完整拼音</option>
                    <option value="initials">首字母</option>
                    <option value="array">数组格式</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary, #666)', marginBottom: '4px' }}>分隔符</label>
                  <Input
                    value={pinyinSeparator}
                    onChange={(e) => setPinyinSeparator(e.target.value)}
                    style={{ width: '80px' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Regex flags UI */}
          {selectedToolId === 'regex-test' && (
            <div className="devtools-regex-flags" style={{ marginTop: '12px' }}>
              <label className="devtools-label">正则标志位</label>
              <div className="devtools-flags-row">
                <Checkbox
                  checked={regexFlags.g}
                  onChange={(e) => setRegexFlags((f) => ({ ...f, g: e.target.checked }))}
                  label="g (全局)"
                />
                <Checkbox
                  checked={regexFlags.i}
                  onChange={(e) => setRegexFlags((f) => ({ ...f, i: e.target.checked }))}
                  label="i (忽略大小写)"
                />
                <Checkbox
                  checked={regexFlags.m}
                  onChange={(e) => setRegexFlags((f) => ({ ...f, m: e.target.checked }))}
                  label="m (多行)"
                />
                <Checkbox
                  checked={regexFlags.s}
                  onChange={(e) => setRegexFlags((f) => ({ ...f, s: e.target.checked }))}
                  label="s (.匹配换行)"
                />
                <Checkbox
                  checked={regexFlags.u}
                  onChange={(e) => setRegexFlags((f) => ({ ...f, u: e.target.checked }))}
                  label="u (Unicode)"
                />
                <Checkbox
                  checked={regexFlags.y}
                  onChange={(e) => setRegexFlags((f) => ({ ...f, y: e.target.checked }))}
                  label="y (粘性)"
                />
              </div>
            </div>
          )}

          {/* Timezone selector for time tools */}
          {(selectedToolId === 'ts-to-date' || selectedToolId === 'date-to-ts') && (
            <div className="devtools-timezone" style={{ marginTop: '12px' }}>
              <label className="devtools-label">时区</label>
              <select
                value={timezoneOffset ?? ''}
                onChange={(e) => setTimezoneOffset(e.target.value ? parseInt(e.target.value, 10) : undefined)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color, #e0e0e0)',
                  backgroundColor: 'var(--bg-color, #fff)',
                  fontSize: '14px',
                }}
              >
                <option value="">自动 (本地时区)</option>
                <option value="-12">UTC-12</option>
                <option value="-11">UTC-11</option>
                <option value="-10">UTC-10 (夏威夷)</option>
                <option value="-9">UTC-9 (阿拉斯加)</option>
                <option value="-8">UTC-8 (洛杉矶)</option>
                <option value="-7">UTC-7 (丹佛)</option>
                <option value="-6">UTC-6 (芝加哥)</option>
                <option value="-5">UTC-5 (纽约)</option>
                <option value="-4">UTC-4 (多伦多)</option>
                <option value="-3">UTC-3 (圣保罗)</option>
                <option value="-2">UTC-2</option>
                <option value="-1">UTC-1 (亚速尔)</option>
                <option value="0">UTC+0 (伦敦)</option>
                <option value="1">UTC+1 (巴黎)</option>
                <option value="2">UTC+2 (开罗)</option>
                <option value="3">UTC+3 (莫斯科)</option>
                <option value="4">UTC+4 (迪拜)</option>
                <option value="5">UTC+5 (卡拉奇)</option>
                <option value="5.5">UTC+5:30 (孟买)</option>
                <option value="6">UTC+6 (达卡)</option>
                <option value="7">UTC+7 (曼谷)</option>
                <option value="8">UTC+8 (北京时间)</option>
                <option value="9">UTC+9 (东京)</option>
                <option value="9.5">UTC+9:30 (阿德莱德)</option>
                <option value="10">UTC+10 (悉尼)</option>
                <option value="11">UTC+11 (所罗门)</option>
                <option value="12">UTC+12 (奥克兰)</option>
              </select>
            </div>
          )}
        </div>
      )}

      {/* Loading state */}
      {isLoading && !toolResult && (
        <Card variant="outlined" padding="md" className="devtools-loading">
          <SpinnerIcon />
          <span>正在处理...</span>
        </Card>
      )}

      {/* Result area */}
      {toolResult && (
        <Card variant="outlined" padding="md" className="devtools-result-card">
          <div className="devtools-result-header">
            <h3 className="devtools-result-title">
              {toolResult.success ? '✓ 处理成功' : '✗ 处理失败'}
            </h3>
            <div className="devtools-result-actions">
              <Badge variant={toolResult.success ? 'success' : 'error'}>
                {toolResult.success ? '成功' : '错误'}
              </Badge>
              {toolResult.success && toolResult.result && (
                <Button variant="ghost" size="sm" onClick={handleCopy}>
                  {copyResult ? '已复制!' : '复制'}
                </Button>
              )}
            </div>
          </div>

          {toolResult.success && toolResult.result && (
            <div className="devtools-result-content">
              <pre className="devtools-result-text">{toolResult.result}</pre>
              {toolResult.metadata && (
                <div className="devtools-result-meta">
                  {toolResult.metadata.duration !== undefined && (
                    <span>耗时: {toolResult.metadata.duration}ms</span>
                  )}
                  {toolResult.metadata.inputLength !== undefined && (
                    <span>输入: {toolResult.metadata.inputLength} 字符</span>
                  )}
                  {toolResult.metadata.outputLength !== undefined && (
                    <span>输出: {toolResult.metadata.outputLength} 字符</span>
                  )}
                </div>
              )}
            </div>
          )}

          {toolResult.error && (
            <div className="devtools-error">
              <span className="devtools-error-text">{toolResult.error}</span>
            </div>
          )}
        </Card>
      )}

      {/* Quick actions */}
      <div className="devtools-section">
        <h3 className="devtools-section-title">快捷操作</h3>
        <div className="devtools-quick-actions">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setSelectedToolId('json-format');
              setInput('{"name":"example","value":123}');
            }}
          >
            JSON 示例
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setSelectedToolId('base64-encode');
              setInput('Hello World!');
            }}
          >
            Base64 示例
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setSelectedToolId('url-encode');
              setInput('hello world');
            }}
          >
            URL 示例
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setSelectedToolId('unicode-encode');
              setInput('你好世界');
            }}
          >
            Unicode 示例
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setSelectedToolId('hex-encode');
              setInput('Hello');
            }}
          >
            Hex 示例
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setSelectedToolId('hash-sha256');
              setInput('Hello World!');
            }}
          >
            Hash 示例
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setSelectedToolId('aes-encrypt');
              setInput('Secret message');
              setExtraInput('myPassword123');
            }}
          >
            AES 示例
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setSelectedToolId('regex-test');
              setInput('\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}|test@example.com');
            }}
          >
            正则示例
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setSelectedToolId('ts-to-date');
              setInput(String(Math.floor(Date.now() / 1000)));
            }}
          >
            时间戳示例
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setSelectedToolId('qrcode-gen');
              setInput('https://example.com');
            }}
          >
            二维码示例
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setSelectedToolId('barcode-gen');
              setInput('123456789012');
            }}
          >
            条形码示例
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setSelectedToolId('pinyin-convert');
              setInput('你好世界');
            }}
          >
            拼音示例
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setSelectedToolId('s2t-convert');
              setInput('你好世界');
            }}
          >
            繁简转换示例
          </Button>
        </div>
      </div>

      {/* Online-only feature warning */}
      {!isOnline && selectedToolId && ONLINE_ONLY_FEATURES.includes(selectedToolId) && (
        <div className="devtools-online-warning">
          <span className="devtools-online-warning-icon">⚠️</span>
          <div>
            <strong>此功能需要网络连接</strong>
            <p style={{ margin: '4px 0 0 0' }}>
              二维码解析需要访问摄像头和网络 API，请确保已连接网络后重试。
            </p>
          </div>
        </div>
      )}

      {/* Keyboard shortcuts hint */}
      <div className="devtools-shortcuts-hint">
        <strong>快捷键:</strong>{' '}
        <kbd>0</kbd> 全部{' '}
        <kbd>1</kbd> 编码{' '}
        <kbd>2</kbd> 加密{' '}
        <kbd>3</kbd> 开发{' '}
        <kbd>4</kbd> 时间{' '}
        <kbd>5</kbd> 生成{' '}
        <kbd>6</kbd> 转换{' '}
        <kbd>7</kbd> 文本{' '}
        <kbd>Enter</kbd> 执行
      </div>
    </PluginUIContainer>
  );
}
