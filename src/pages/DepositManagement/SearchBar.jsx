import React, { useState } from "react";

const SearchBar = ({ placeholder, onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    setQuery(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  return (
    <input
      type="text"
      className="search-bar"
      placeholder={placeholder}
      value={query}
      onChange={handleSearch}
    />
  );
};

export default SearchBar;
