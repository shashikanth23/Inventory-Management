interface StatCardProps {
  label: string;
  value: string;
  accent?: 'default' | 'warning';
}

export default function StatCard({ label, value, accent = 'default' }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
      <p
        className={`mt-2 text-2xl font-bold ${
          accent === 'warning' ? 'text-amber-600' : 'text-gray-900'
        }`}
      >
        {value}
      </p>
    </div>
  );
}
