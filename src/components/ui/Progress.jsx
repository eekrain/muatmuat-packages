export default function Progress({ value }) {
  return (
    <div className="h-2 w-full rounded-full bg-gray-200">
      <div
        className="h-full rounded-full bg-blue-500 transition-all duration-300"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
