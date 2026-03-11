import { X, Check } from 'lucide-react';

export default function Toast({ show, title, message, onDismiss }) {
  if (!show) return null;
  return (
    <div
      role="status"
      className="fixed bottom-6 right-6 z-[100] flex max-w-sm items-start gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-lg"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
        <Check className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-gray-900">{title}</p>
        <p className="text-sm text-gray-600">{message}</p>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="shrink-0 rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
