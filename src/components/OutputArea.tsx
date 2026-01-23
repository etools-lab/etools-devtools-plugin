import { useState } from 'react';
import { Card, Badge, Button } from '@etools/plugin-sdk';
import { useClipboard } from '../hooks/useClipboard';
import type { ConversionResult } from '../types';
import './OutputArea.css';

interface OutputAreaProps<T = string> {
  result: ConversionResult<T> | null;
  title?: string;
  showCopy?: boolean;
  emptyMessage?: string;
}

export function OutputArea<T = string>({
  result,
  title = '结果',
  showCopy = true,
  emptyMessage = '暂无结果',
}: OutputAreaProps<T>) {
  const { copied, copyToClipboard } = useClipboard();
  const [showRaw, setShowRaw] = useState(false);

  if (!result) {
    return (
      <Card variant="outlined" padding="md" className="output-area">
        <div className="output-area-empty">{emptyMessage}</div>
      </Card>
    );
  }

  const handleCopy = () => {
    if (result.success && result.result) {
      copyToClipboard(String(result.result));
    }
  };

  return (
    <Card variant="outlined" padding="md" className="output-area">
      <div className="output-area-header">
        <div className="output-area-title">
          <span className="output-area-icon">
            {result.success ? '✓' : '✗'}
          </span>
          {title}
        </div>
        <div className="output-area-badges">
          <Badge variant={result.success ? 'success' : 'error'}>
            {result.success ? '成功' : '失败'}
          </Badge>
          {result.metadata?.duration && (
            <Badge variant="default">
              {result.metadata.duration}ms
            </Badge>
          )}
        </div>
      </div>

      {result.success && result.result && (
        <div className="output-area-content">
          <div className="output-area-actions">
            {showCopy && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
              >
                {copied ? '已复制!' : '📋 复制'}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowRaw(!showRaw)}
            >
              {showRaw ? '🔤 格式化' : '📄 原始'}
            </Button>
          </div>

          {typeof result.result === 'string' ? (
            <pre className="output-area-text">
              {showRaw ? result.result : formatOutput(result.result)}
            </pre>
          ) : (
            <pre className="output-area-text">
              {JSON.stringify(result.result, null, 2)}
            </pre>
          )}
        </div>
      )}

      {result.error && (
        <div className="output-area-error">
          <div className="output-area-error-icon">⚠️</div>
          <div className="output-area-error-message">{result.error}</div>
          {result.metadata?.extra && (
            <pre className="output-area-error-details">
              {JSON.stringify(result.metadata.extra, null, 2)}
            </pre>
          )}
        </div>
      )}
    </Card>
  );
}

function formatOutput(text: string): string {
  // Try to format as JSON
  try {
    const parsed = JSON.parse(text);
    return JSON.stringify(parsed, null, 2);
  } catch {
    // Not JSON, return as-is
  }
  return text;
}
