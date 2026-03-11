import { AlertCircle } from 'lucide-react';
import Button from '../ui/Button.jsx';

export default function AttendanceWarningBanner({ missingCount, onFixNow }) {
  if (missingCount == null || missingCount <= 0) return null;

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100">
          <AlertCircle className="h-4 w-4 text-red-600" />
        </div>
        <div>
          <p className="font-semibold text-red-900">Missing Attendance Data</p>
          <p className="text-sm text-red-700">
            {missingCount} employee{missingCount !== 1 ? 's have' : ' has'} not been marked for
            today. Please review and complete the records.
          </p>
        </div>
      </div>
      <Button variant="danger" size="sm" onClick={onFixNow}>
        Fix Now
      </Button>
    </div>
  );
}
