"use client";
import React from "react";
import styles from "../../styles/generics/serachInputStyles.module.css";

const SearchInput = ({ onSearch, placeholder }) => {
  const handleChange = (e) => {
    onSearch(e.target.value);
  };

  return (
    <div className={styles.parent}>
      <img
        src="/searchGlass.svg"
        height={20}
        width={20}
        className="ml-2 mr-2"
        alt="Search"
      />
      <input
        className={styles.inputBox}
        type="text"
        placeholder={placeholder || "Search"}
        onChange={handleChange}
      />
    </div>
  );
};

export default SearchInput;
