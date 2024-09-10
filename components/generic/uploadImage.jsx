import { useRef, useState } from "react";
import styles from "../../styles/superAdmin/uploadImageStyles.module.css";

const UploadImagePlaceholder = ({ title, onFileSelect }) => {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("No file selected");

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      onFileSelect(file); // Call the callback function with the selected file
    }
  };

  return (
    <>
      <div className={styles.titleText}>{title}</div>
      <div onClick={handleClick} className={styles.mainContainer}>
        <div>
          <center>
            <img src="/addImage.svg" height={20} width={20} alt="Add file" />
          </center>

          <div className={styles.paragraphText}>
            Browse and choose the files you want to upload from your computer
          </div>
          <center>
            {/* <div className={styles.addBtn}>+</div> */}
            <div className={styles.paragraphText}>{fileName}</div>
          </center>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </div>
    </>
  );
};

export default UploadImagePlaceholder;
