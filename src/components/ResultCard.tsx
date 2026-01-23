import { Card, Badge } from '@etools/plugin-sdk';
import type { ConversionResult } from '../types';
import './ResultCard.css';

interface ResultCardProps {
  result: ConversionResult;
  title?: string;
}

export function ResultCard({ result, title = '处理结果' }: ResultCardProps) {
  return (
    <Card variant="outlined" padding="md" className="result-card">
      <div className="result-card-header">
        <span className="result-card-title">{title}</span>
        <Badge variant={result.success ? 'success' : 'error'}>
          {result.success ? '成功' : '失败'}
        </Badge>
      </div>

      {result.success && result.result && (
        <div className="result-card-success">
          <pre className="result-card-content">{String(result.result)}</pre>
        </div>
      )}

      {result.error && (
        <div className="result-card-error">
          <span className="result-card-error-icon">⚠️</span>
          <span className="result-card-error-message">{result.error}</span>
        </div>
      )}

      {result.metadata && (
        <div className="result-card-meta">
          {result.metadata.inputLength !== undefined && (
            <span>输入: {result.metadata.inputLength} 字符</span>
          )}
          {result.metadata.outputLength !== undefined && (
            <span>输出: {result.metadata.outputLength} 字符</span>
          )}
          {result.metadata.duration !== undefined && (
            <span>耗时: {result.metadata.duration}ms</span>
          )}
        </div>
      )}
    </Card>
  );
}
