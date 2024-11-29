"use client";
import React from "react";
import { useBrands } from "./useBrandHook"; // Adjust the import path as needed
import Loading from "../../../components/generic/Loading";
import styles from "../../../styles/account/addBrandStyles.module.css";
import { Delete, Edit, Check, Close } from "@mui/icons-material";
import InputWithTitle from "@/components/generic/InputWithTitle";
import GreenButton from "@/components/generic/GreenButton";
import withAuth from "@/utils/withAuth";

const Page = () => {
  const {
    fetchingData,
    brandsList,
    brandName,
    setBrandName,
    sendingData,
    addBrand,
    updateBrand,
    editingBrandId,
    startEditing,
    cancelEditing,
  } = useBrands();

  const viewList = () => (
    <div className={styles.listContainer}>
      <div className={styles.tableHeaderContainer}>
        <div className={styles.srContainer}>Sr #</div>
        <div className="flex w-full">
          <div className="flex-grow">
            <div className={styles.brandContainer}>Brand Name</div>
          </div>
          <div className={styles.actionContainer}>Actions</div>
        </div>
      </div>
      {brandsList?.map((item, index) => (
        <div key={index} className={styles.tableItemContainer}>
          <div className={styles.tableHeaderContainer2}>
            <div className={styles.srNumberContainer}>{index + 1}</div>
            <div className="flex w-full">
              <div className="flex-grow">
                {editingBrandId === item.id ? (
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    className={styles.editInput}
                  />
                ) : (
                  <div className={styles.brandContainerName}>{item.name}</div>
                )}
              </div>
              <div className={styles.actionContainer}>
                {editingBrandId === item.id ? (
                  <>
                    <Check
                      sx={{ color: "#3deb49", cursor: "pointer" }}
                      onClick={() => updateBrand(item.id, brandName)}
                    />
                    <Close
                      sx={{
                        color: "red",
                        marginLeft: "10px",
                        cursor: "pointer",
                      }}
                      onClick={cancelEditing}
                    />
                  </>
                ) : (
                  <>
                    <Edit
                      sx={{ color: "#3deb49", cursor: "pointer" }}
                      onClick={() => startEditing(item.id, item.name)}
                    />
                    <Delete
                      sx={{
                        color: "red",
                        marginLeft: "10px",
                        cursor: "pointer",
                      }}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
          <hr />
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <div className="pageTitle">Brands</div>
      <div className="mt-10"></div>
      {fetchingData ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div className="">{viewList()}</div>
          <div className=" ">
            <div className="pageTitle">Add Brand</div>
            <InputWithTitle
              title={"Enter Brand Name"}
              placeholder={"Enter Brand name"}
              value={brandName}
              onChange={(value) => setBrandName(value)}
            />
            <div className="mt-10"></div>
            <GreenButton
              sendingData={sendingData}
              onClick={addBrand}
              title={"Add Brand"}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default withAuth(Page);
