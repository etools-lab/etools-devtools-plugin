import { Input, Button } from '@etools/plugin-sdk';
import { useFileInput } from '../hooks/useFileInput';
import './InputArea.css';

interface InputAreaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  multiline?: boolean;
  rows?: number;
  onFileSelect?: (content: string, fileName: string) => void;
  accept?: string;
  showFileUpload?: boolean;
}

export function InputArea({
  value,
  onChange,
  placeholder = '请输入内容...',
  label,
  multiline = true,
  rows = 6,
  onFileSelect,
  accept = '.json,.txt,.csv,.xml,.yaml,.yml',
  showFileUpload = false,
}: InputAreaProps) {
  const { fileInputRef, handleFileSelect, isLoading: isReadingFile } = useFileInput({
    onFileRead: (content, fileName) => {
      if (onFileSelect) {
        onFileSelect(content, fileName);
      } else {
        onChange(content);
      }
    },
  });

  return (
    <div className="input-area">
      {label && <label className="input-area-label">{label}</label>}

      <div className="input-area-container">
        <Input
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          multiline={multiline}
          rows={rows}
          className="input-area-input"
        />

        {showFileUpload && (
          <div className="input-area-actions">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept={accept}
              style={{ display: 'none' }}
            />
            <Button
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              isLoading={isReadingFile}
            >
              📁 上传文件
            </Button>
          </div>
        )}
      </div>

      {value && (
        <div className="input-area-hint">
          {value.length} 字符
        </div>
      )}
    </div>
  );
}
