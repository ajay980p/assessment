import { WifiOff, AlertCircle } from 'lucide-react';
import Button from './Button.jsx';

/**
 * User-friendly API/connection error banner with optional retry.
 * @param {{ message: string, onRetry?: () => void | Promise<void>, isRetrying?: boolean }} props
 */
export default function ApiErrorBanner({ message, onRetry, isRetrying = false }) {
  const isConnectionError =
    !message ||
    message.toLowerCase().includes('failed to fetch') ||
    message.toLowerCase().includes('network') ||
    message.toLowerCase().includes('connection');

  const title = isConnectionError ? 'Could not connect to the server' : 'Something went wrong';
  const description = isConnectionError
    ? 'Please try again.'
    : message;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100">
          {isConnectionError ? (
            <WifiOff className="h-5 w-5 text-amber-700" />
          ) : (
            <AlertCircle className="h-5 w-5 text-amber-700" />
          )}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-amber-900">{title}</p>
          <p className="mt-0.5 text-sm text-amber-800">{description}</p>
        </div>
      </div>
      {onRetry && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onRetry}
          disabled={isRetrying}
          className="shrink-0"
        >
          {isRetrying ? 'Retrying…' : 'Retry'}
        </Button>
      )}
    </div>
  );
}
