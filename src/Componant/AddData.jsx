import React from "react";

function AddData({ data, setData, addItem }) {
  return (
    <div className="flex gap-3 mb-4">
      <input
        type="text"
        className="flex-1 px-4 py-2 rounded-xl border border-gray-200 shadow focus:outline-none focus:ring-2 focus:ring-indigo-400"
        placeholder="Enter new task..."
        value={data}
        onChange={(e) => setData(e.target.value)}
      />
      <button
        className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition shadow"
        onClick={addItem}
      >
        Add
      </button>
    </div>
  );
}

export default AddData;
