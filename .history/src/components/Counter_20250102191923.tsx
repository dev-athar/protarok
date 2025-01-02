// src/components/Counter.js
interface CounterProps {
  label: string;
  value: number;
}

function Counter({ label, value }) {
  return (
    <div className="flex-1 p-4 mx-2 border rounded-lg shadow-sm">
      <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      <p className="text-gray-600">{label}</p>
    </div>
  );
}

export default Counter;
