import ReactModal from 'react-modal';
import { X } from 'lucide-react';

/**
 * Common modal built with react-modal.
 * @param {boolean} isOpen
 * @param {() => void} onClose
 * @param {string} title
 * @param {React.ReactNode} children
 * @param {React.ReactNode} [footer]
 * @param {boolean} [showCloseButton=true]
 * @param {string} [contentLabel] - Aria label (defaults to title)
 * @param {string} [className] - Extra class for content box
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  showCloseButton = true,
  contentLabel,
  className = '',
}) {
  const label = contentLabel ?? title;
  const titleId = 'modal-title';

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      className={`relative w-full max-w-lg rounded-xl bg-white shadow-xl outline-none ${className}`.trim()}
      overlayClassName="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      contentLabel={label}
      aria={{ labelledby: titleId }}
    >
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <h2 id={titleId} className="text-lg font-semibold text-gray-900">
          {title}
        </h2>
        {showCloseButton && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      <div className="px-6 py-4">{children}</div>
      {footer != null && (
        <div className="flex justify-end gap-2 border-t border-gray-200 px-6 py-4">
          {footer}
        </div>
      )}
    </ReactModal>
  );
}
