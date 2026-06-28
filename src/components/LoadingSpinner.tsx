export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-ink-100 rounded-full" />
        <div className="absolute inset-0 border-4 border-transparent border-t-primary-500 rounded-full animate-spin" />
      </div>
      <p className="mt-4 text-ink-500 text-sm animate-pulse">正在分析你的感悟...</p>
      <p className="mt-1 text-ink-400 text-xs">这可能需要几秒钟，哲学思考值得等待</p>
    </div>
  );
}
