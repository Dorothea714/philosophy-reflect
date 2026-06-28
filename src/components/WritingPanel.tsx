import { useState } from 'react';

interface WritingPanelProps {
  onSubmit: (text: string) => void;
  onClear: () => void;
  loading: boolean;
}

export function WritingPanel({ onSubmit, onClear, loading }: WritingPanelProps) {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    if (text.trim().length >= 2) {
      onSubmit(text.trim());
    }
  };

  const handleClear = () => {
    setText('');
    onClear();
  };

  const charCount = text.length;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">📝</span>
        <h2 className="text-lg font-semibold text-ink-800">写下你的感悟</h2>
      </div>

      <textarea
        className="flex-1 w-full p-4 bg-white border border-ink-200 rounded-xl
                   resize-none text-ink-900 placeholder-ink-300
                   focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent
                   transition-all duration-200 font-serif text-base leading-relaxed"
        placeholder="在这里写下你的感悟、手记、思考或困惑...

例如：
• 有时候我觉得做什么都没有意义，但又不想放弃...
• 最近常常思考，人与人之间的理解真的可能吗？
• 大自然让我感到自己是如此渺小，同时又是如此自由..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        maxLength={5000}
        disabled={loading}
      />

      <div className="flex items-center justify-between mt-3">
        <span className={`text-xs ${charCount > 4500 ? 'text-red-400' : 'text-ink-400'}`}>
          {charCount} / 5000
        </span>
        <div className="flex gap-2">
          <button
            onClick={handleClear}
            disabled={loading || !text}
            className="px-4 py-2 text-sm text-ink-500 bg-ink-100 rounded-lg
                       hover:bg-ink-200 disabled:opacity-40 disabled:cursor-not-allowed
                       transition-colors duration-150"
          >
            清除
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || text.trim().length < 2}
            className="px-6 py-2 text-sm text-white bg-primary-600 rounded-lg
                       hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed
                       transition-all duration-150 font-medium
                       shadow-sm hover:shadow-md"
          >
            {loading ? '分析中...' : '🔍 分析感悟'}
          </button>
        </div>
      </div>
    </div>
  );
}
