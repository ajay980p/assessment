export default function EmployeeTableSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4">
          <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 animate-pulse rounded-full bg-gray-200" />
            <div className="h-4 w-40 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
          <div className="h-5 w-24 animate-pulse rounded-full bg-gray-200" />
          <div className="ml-auto h-8 w-8 animate-pulse rounded bg-gray-200" />
        </div>
      ))}
    </div>
  );
}
