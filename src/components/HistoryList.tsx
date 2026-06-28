import { useState, useEffect } from 'react';
import type { HistoryItem } from '../types';

interface HistoryListProps {
  onSelect: (item: HistoryItem) => void;
  refreshTrigger: number;
}

export function HistoryList({ onSelect, refreshTrigger }: HistoryListProps) {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, [refreshTrigger]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/history?limit=15');
      const data = await res.json();
      if (data.success) {
        setItems(data.data);
      }
    } catch {
      // 静默处理
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMin = Math.floor(diffMs / 60000);

    if (diffMin < 1) return '刚刚';
    if (diffMin < 60) return `${diffMin}分钟前`;
    if (diffMin < 1440) return `${Math.floor(diffMin / 60)}小时前`;
    return d.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="text-center py-6 text-ink-400 text-sm">加载中...</div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-6 text-ink-400 text-sm">
        <p>暂无历史记录</p>
        <p className="text-xs mt-1">写下感悟并分析后，记录会出现在这里</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">📋</span>
        <h3 className="text-sm font-semibold text-ink-500 uppercase tracking-wide">历史记录</h3>
      </div>
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect(item)}
          className="w-full text-left p-3 bg-white rounded-lg border border-ink-100
                     hover:border-primary-200 hover:shadow-sm transition-all duration-150
                     group"
        >
          <p className="text-sm text-ink-700 line-clamp-1 group-hover:text-primary-700 transition-colors">
            {item.user_text.slice(0, 60)}{item.user_text.length > 60 ? '...' : ''}
          </p>
          <span className="text-xs text-ink-400 mt-1 block">{formatDate(item.created_at)}</span>
        </button>
      ))}
    </div>
  );
}
