import React from "react";
import styles from "../../styles/generics/inputStyles.module.css";

const InputWithTitle = ({
  children,
  type,
  title,
  placeholder,
  value,
  onChange,
  ...rest
}) => {
  return (
    <div className="w-full ">
      <div className={styles.title}>{title}</div>
      <div className={styles.inputContainer}>
        {children ? (
          children
        ) : (
          <input
            value={value}
            type={type}
            className={`w-full ${styles.inputField}`}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            {...rest}
          />
        )}
      </div>
    </div>
  );
};

export default InputWithTitle;
