import React from "react";
import styles from "../../styles/generics/inputStyles.module.css";
const InputWithTitle = ({
  type,
  title,
  placeholder,
  value,
  onChange,
  rest,
}) => {
  return (
    <div className="w-full ">
      <div className={styles.title}>{title}</div>
      <div className={styles.inputContainer}>
        <input
          value={value}
          type={type}
          className={`w-full ${styles.inputField}`}
          placeholder={placeholder}
          onChange={onChange}
          {...rest}
        />
      </div>
    </div>
  );
};

export default InputWithTitle;
