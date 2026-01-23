import { Card } from '@etools/plugin-sdk';
import type { Tool } from '../types';
import './ToolCard.css';

interface ToolCardProps {
  tool: Tool;
  isSelected: boolean;
  onClick: () => void;
}

export function ToolCard({ tool, isSelected, onClick }: ToolCardProps) {
  return (
    <Card
      variant={isSelected ? 'elevated' : 'outlined'}
      padding="md"
      hover
      className={`tool-card ${isSelected ? 'tool-card-selected' : ''}`}
      onClick={onClick}
    >
      <div className="tool-card-icon">{tool.icon}</div>
      <div className="tool-card-name">{tool.name}</div>
      <div className="tool-card-description">{tool.description}</div>
      {tool.offlineSupported && (
        <div className="tool-card-offline">可离线</div>
      )}
    </Card>
  );
}
