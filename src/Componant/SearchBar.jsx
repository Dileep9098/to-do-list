import React from "react";

function SearchBar({ search, setSearch }) {
  return (
    <div className="mb-6">
      <input
        type="text"
        className="w-full px-4 py-2 rounded-xl border border-gray-200 shadow focus:outline-none focus:ring-2 focus:ring-purple-400"
        placeholder=" Search data..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}

export default SearchBar;
