import { useState, useEffect } from 'react';
import Modal from '../ui/Modal.jsx';
import Button from '../ui/Button.jsx';

const STATUS_OPTIONS = [
  { value: 'present', label: 'Present' },
  { value: 'absent', label: 'Absent' },
];

export default function EditAttendanceModal({ isOpen, onClose, record, onSave }) {
  const [status, setStatus] = useState(record?.status ?? 'present');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (record) {
      setStatus(record.status ?? 'present');
      setError(null);
    }
  }, [record]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!record) return;
    setError(null);
    setSaving(true);
    try {
      await onSave(record.id, { status });
      onClose?.();
    } catch (err) {
      setError(err?.message ?? 'Failed to update record');
    } finally {
      setSaving(false);
    }
  };

  if (!record) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Attendance">
      <form onSubmit={handleSubmit}>
        <p className="text-sm text-gray-600">
          Update status for <strong>{record.employee_name}</strong> on{' '}
          {new Date(record.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
          .
        </p>
        <div className="mt-4">
          <label className="mb-2 block text-sm font-medium text-gray-700">Status</label>
          <div className="flex gap-2">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setStatus(opt.value)}
                className={`rounded-lg border px-4 py-2 text-sm font-medium ${
                  status === opt.value
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        {error && (
          <p className="mt-3 text-sm text-red-600">{error}</p>
        )}
        <div className="mt-6 flex justify-end gap-2 border-t border-gray-200 pt-4">
          <Button type="button" variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
