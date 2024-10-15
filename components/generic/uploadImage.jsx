"use client";
import { useRef, useState } from "react";
import styles from "../../styles/superAdmin/uploadImageStyles.module.css";
import Image from "next/image";

const UploadImagePlaceholder = ({ title, onFileSelect, multiple = false }) => {
  const fileInputRef = useRef(null);
  const [fileNames, setFileNames] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      setFileNames(files.map((file) => file.name));
      setSelectedImages(files.map((file) => URL.createObjectURL(file)));
      onFileSelect(multiple ? files : files[0]);
    }
  };

  return (
    <>
      <div className={styles.titleText}>{title}</div>
      <div onClick={handleClick} className={styles.mainContainer}>
        <div>
          <center>
            {selectedImages.length > 0 ? (
              <div className={styles.imageGrid}>
                {selectedImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    height={100}
                    width={100}
                    alt={`Selected file ${index + 1}`}
                    style={{
                      borderRadius: "5%",
                      objectFit: "cover",
                      objectPosition: "center",
                    }}
                  />
                ))}
              </div>
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
            <div className={styles.paragraphText}>
              {fileNames.length > 0
                ? fileNames.join(", ")
                : "No files selected"}
            </div>
          </center>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          accept=".png, .jpg, .jpeg"
          onChange={handleFileChange}
          style={{ display: "none" }}
          multiple={multiple}
        />
      </div>
    </>
  );
};

export default UploadImagePlaceholder;
