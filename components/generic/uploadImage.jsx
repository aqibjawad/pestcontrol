import { useRef, useState } from "react";
import styles from "../../styles/superAdmin/uploadImageStyles.module.css";
import Image from "next/image";

const UploadImagePlaceholder = ({ title, onFileSelect }) => {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("No file selected");
  const [selectedImage, setSelectedImage] = useState(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      setSelectedImage(URL.createObjectURL(file)); // Add this line
      onFileSelect(file); // Call the callback function with the selected file
    }
  };

  return (
    <>
      <div className={styles.titleText}>{title}</div>
      <div onClick={handleClick} className={styles.mainContainer}>
        <div>
          <center>
            {selectedImage ? (
              <img
                src={selectedImage}
                height={200}
                width={200}
                alt="Selected file"
                style={{
                  borderRadius: "50%",
                  objectFit: "cover",
                  objectPosition: "center", // Add this line
                }}
              />
            ) : (
              <>
                <img
                  src="/addImage.svg"
                  height={20}
                  width={20}
                  alt="Add file"
                />
                <div className={styles.paragraphText}>
                  Browse and choose the files you want to upload from your
                  computer
                </div>
              </>
            )}
          </center>
          <center>
            <div className={styles.paragraphText}>{fileName}</div>
          </center>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          accept=".png, .jpg, .jpeg"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </div>
    </>
  );
};

export default UploadImagePlaceholder;
