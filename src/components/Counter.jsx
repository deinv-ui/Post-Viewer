import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow w-48 text-center">
      <h2 className="text-lg font-bold mb-2">Counter</h2>
      <p className="text-2xl font-mono mb-3">{count}</p>
      <div className="flex justify-center gap-2">
        <button
          onClick={() => setCount(count - 1)}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          -
        </button>
        <button
          onClick={() => setCount(count + 1)}
          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
        >
          +
        </button>
      </div>
    </div>
  );
}
