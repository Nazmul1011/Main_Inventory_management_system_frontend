export default function StatCard({ title, value, change, icon }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col">
      <div className="flex items-center justify-between">
        <div className="text-gray-500 text-sm">{title}</div>
        <div className="text-indigo-600">{icon}</div>
      </div>
      <div className="mt-2 text-2xl font-bold text-gray-900">{value}</div>
      <div
        className={`text-sm font-medium ${
          change.includes("-") ? "text-rose-600" : "text-emerald-600"
        }`}
      >
        {change}
      </div>
    </div>
  );
}
