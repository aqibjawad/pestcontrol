import React from "react";
import styles from "../../styles/generics/serachInputStyles.module.css";
const SearchInput = () => {
  return (
    <div className={styles.parent}>
      <img
        src="/searchGlass.svg"
        height={20}
        width={20}
        className="ml-2 mr-2"
      />
      <input className={styles.inputBox} type="text" placeholder="Search" />
    </div>
  );
};

export default SearchInput;
