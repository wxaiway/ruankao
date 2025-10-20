export function LoadingSpinner({ text = "加载中..." }: { text?: string }) {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      <span className="ml-2 text-gray-600 dark:text-gray-300">{text}</span>
    </div>
  );
}