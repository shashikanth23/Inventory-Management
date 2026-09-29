import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface CategoryChartProps {
  data: Record<string, number>;
}

export default function CategoryChart({ data }: CategoryChartProps) {
  const chartData = Object.entries(data).map(([category, count]) => ({ category, count }));

  if (chartData.length === 0) {
    return <p className="text-sm text-gray-500">No products yet — add some to see the breakdown.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="category" tick={{ fontSize: 12 }} />
        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
        <Tooltip />
        <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
