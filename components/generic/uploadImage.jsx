import { useRef } from "react";
import styles from "../../styles/superAdmin/uploadImageStyles.module.css";
const UploadImagePlacehlder = () => {
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Handle the selected file here
      console.log("Selected file:", file.name);
    }
  };

  return (
    <div onClick={handleClick} className={styles.mainContainer}>
      <div>
        <center>
          <img src="/addImage.svg" height={20} width={20} alt="Add file" />
        </center>

        <div className={styles.titleText}>
          Browse and choose the files you want to upload from your computer
        </div>
        <center>
          <div className={styles.addBtn}>+</div>
        </center>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
    </div>
  );
};

export default UploadImagePlacehlder;
