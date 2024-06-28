"use client";
import React, { useEffect, useState } from "react";
import { getAllBrandNames, addBrand } from "@/networkUtil/Constants";
import APICall from "@/networkUtil/APICall";
import Loading from "../../../components/generic/Loading";
import styles from "../../../styles/account/addBrandStyles.module.css";
import { Delete, Edit } from "@mui/icons-material";
import InputWithTitle from "@/components/generic/InputWithTitle";
import GreenButton from "@/components/generic/GreenButton";
const Page = () => {
  const api = new APICall();
  const [fetchindData, setFetchingData] = useState(false);
  const [suppliersList, setSupplierList] = useState();
  const [brandName, setBrandName] = useState("");
  const [sendingData, setSendingData] = useState(false);
  useEffect(() => {
    getAllBrads();
  }, []);

  const getAllBrads = async () => {
    setFetchingData(true);
    const response = await api.getDataWithToken(getAllBrandNames);
    setSupplierList(response.data.data);
    setFetchingData(false);
  };

  const viewList = () => {
    return (
      <>
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
        </div>
        {suppliersList?.map((item, index) => {
          return (
            <div key={index} className={styles.tableItemContainer}>
              <div className={styles.tableHeaderContainer2}>
                <div className={styles.srNumberContainer}>{index + 1}</div>
                <div className="flex w-full">
                  <div className="flex-grow">
                    <div className={styles.brandContainerName}>{item.name}</div>
                  </div>
                  <div className={styles.actionContainer}>
                    <Edit sx={{ color: "#3deb49", cursor: "pointer" }} />
                    <Delete
                      sx={{
                        color: "red",
                        marginLeft: "10px",
                        cursor: "pointer",
                      }}
                    />
                  </div>
                </div>
              </div>
              <hr />
            </div>
          );
        })}
      </>
    );
  };

  const addBrandRequest = async () => {
    if (!sendingData) {
      if (brandName === "") {
        alert("Please select a brand name");
      } else {
        setSendingData(true);
        const obj = { name: brandName };
        const response = await api.postFormDataWithToken(addBrand, obj);
        setSendingData(false);
        if (response.message === "Brand has been added") {
          alert("Brand has been added");
          setBrandName("");
          getAllBrads();
        } else {
          alert("Could not add the brand, please try again");
        }
      }
    }
  };

  return (
    <div>
      <div className="pageTitle">Brands</div>
      <div className="mt-10"></div>
      {fetchindData ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div className="">{viewList()}</div>
          <div className=" ">
            <div className="pageTitle">Add Brand</div>
            <InputWithTitle
              title={"Enter Brand Name"}
              placeholder={"Enter Brand name"}
              onChange={setBrandName}
            />
            <div className="mt-10"></div>
            <GreenButton
              sendingData={sendingData}
              onClick={() => addBrandRequest()}
              title={"Add Brand"}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
