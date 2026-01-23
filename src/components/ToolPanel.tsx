import { useMemo } from 'react';
import type { ToolCategory, Tool } from '../types';
import { ToolCard } from './ToolCard';
import './ToolPanel.css';

interface ToolPanelProps {
  tools: Tool[];
  selectedToolId: string | null;
  onToolSelect: (toolId: string) => void;
  categories: ToolCategory[];
  selectedCategory: ToolCategory | 'all';
  onCategoryChange: (category: ToolCategory | 'all') => void;
}

const categoryLabels: Record<ToolCategory | 'all', string> = {
  all: '全部',
  encoding: '编码',
  cryptography: '加密',
  developer: '开发',
  time: '时间',
  convert: '转换',
  generate: '生成',
  text: '文本',
  network: '网络',
};

const categoryIcons: Record<ToolCategory | 'all', string> = {
  all: '📦',
  encoding: '🔐',
  cryptography: '🔒',
  developer: '🛠️',
  time: '🕐',
  convert: '🔄',
  generate: '✨',
  text: '📝',
  network: '🌐',
};

export function ToolPanel({
  tools,
  selectedToolId,
  onToolSelect,
  categories,
  selectedCategory,
  onCategoryChange,
}: ToolPanelProps) {
  const filteredTools = useMemo(
    () => (selectedCategory === 'all' ? tools : tools.filter((tool) => tool.category === selectedCategory)),
    [tools, selectedCategory]
  );

  return (
    <div className="tool-panel">
      <div className="tool-panel-categories">
        <button
          className={`category-tab ${selectedCategory === 'all' ? 'category-tab-active' : ''}`}
          onClick={() => onCategoryChange('all')}
        >
          {categoryIcons.all} {categoryLabels.all}
        </button>
        {categories.map((category) => (
          <button
            key={category}
            className={`category-tab ${selectedCategory === category ? 'category-tab-active' : ''}`}
            onClick={() => onCategoryChange(category)}
          >
            {categoryIcons[category]} {categoryLabels[category]}
          </button>
        ))}
      </div>

      <div className="tool-panel-grid">
        {filteredTools.map((tool) => (
          <ToolCard
            key={tool.id}
            tool={tool}
            isSelected={selectedToolId === tool.id}
            onClick={() => onToolSelect(tool.id)}
          />
        ))}
      </div>

      {filteredTools.length === 0 && (
        <div className="tool-panel-empty">
          <p>该分类下暂无工具</p>
        </div>
      )}
    </div>
  );
}
