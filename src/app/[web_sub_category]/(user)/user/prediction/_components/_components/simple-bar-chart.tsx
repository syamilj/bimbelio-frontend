export default function SimpleBarChart({
  data,
  labels,
  title,
}: {
  data: number[];
  labels: string[];
  title: string;
}) {
  const maxValue = Math.max(...data, 1);

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-700 text-center">
        {title}
      </h4>
      <div className="space-y-3">
        {data.map((value, index) => (
          <div
            key={index}
            className="space-y-2"
          >
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-gray-600">
                {labels[index]}
              </span>
              <span className="text-xs font-bold text-gray-900">
                {isNaN(value) ? '-' : value?.toFixed(1) || 0}
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.max((value / maxValue) * 100, 2)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
