"use client";
import Dropdown from "@/components/generic/Dropdown";
import InputWithTitle from "@/components/generic/InputWithTitle";
import { Skeleton } from "@mui/material";
import { getAllBrandNames } from "@/networkUtil/Constants";
import React, { useEffect, useState } from "react";
import APICall from "@/networkUtil/APICall";
import Link from "next/link";
import styles from "../../../styles/account/addItemStyles.module.css";

const Page = () => {
  const api = new APICall();
  const [itemName, setItemName] = useState();
  const [batchNumber, setBatchNumber] = useState();
  const [brandsList, setBrandList] = useState([]);
  const [fetchingData, setFetchingData] = useState();
  const [allBrandsList, setAllBrandsList] = useState([]);
  const [selectedBrandId, setSelectedBrandId] = useState();
  const [manufectureDate, setManufectureDate] = useState();
  const [expiryDate, setExpiryDate] = useState();
  const [activeIndgredients, setActiveIndgredients] = useState();

  useEffect(() => {
    getAllBrands();
  }, []);

  const getAllBrands = async () => {
    setFetchingData(true);
    const response = await api.getDataWithToken(getAllBrandNames);
    const brandNames = [];
    setAllBrandsList(response.data.data);
    response.data.data.map((item) => {
      brandNames.push(item.name);
    });
    setBrandList(brandNames);
    setFetchingData(false);
  };

  const handleBrandChange = (name, index) => {
    const idAtIndex = allBrandsList[index].id;
    setSelectedBrandId(idAtIndex);
  };

  const firstSection = () => {
    return (
      <div className="mt-10">
        <div className="grid grid-cols-2 gap-10">
          <div>
            <InputWithTitle
              title={"Item Name"}
              type={"text"}
              placeholder={"Item Name"}
              onChange={setItemName}
            />
          </div>
          <div>
            <InputWithTitle
              title={"Batch Number"}
              type={"text"}
              placeholder={"Please enter a batch number"}
              onChange={setBatchNumber}
            />
          </div>
        </div>
        <div className="mt-5">
          {fetchingData ? (
            <Skeleton height={40} />
          ) : (
            <>
              <Dropdown
                onChange={handleBrandChange}
                title={"Brand"}
                options={brandsList && brandsList}
              />
              <div className="flex">
                <div className="flex-grow"></div>
                <Link
                  className={styles.addBrandContainer}
                  href={"/operations/brands"}
                >
                  Add Brand
                </Link>
              </div>
            </>
          )}
        </div>
        <div className="mt-5">
          <InputWithTitle
            onChange={setManufectureDate}
            title={"Manufecture Date"}
            type={"date"}
          />
        </div>
        <div className="mt-5">
          <InputWithTitle
            onChange={setExpiryDate}
            title={"Expiry Date"}
            type={"date"}
          />
        </div>

        <div className="mt-5">
          <InputWithTitle
            placeholder={"Active Ingredient"}
            onChange={setActiveIndgredients}
            title={"Active Ingredient"}
            type={"text"}
          />
        </div>

        <div className="mt-5">
          <InputWithTitle
            placeholder={"Active Ingredient"}
            onChange={setActiveIndgredients}
            title={"Active Ingredient"}
            type={"text"}
          />
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="pageTitle">Add Intevtory Item</div>
      <div className="grid grid-cols-2 gap-10">
        <div>{firstSection()}</div>
        <div>adfs</div>
      </div>
    </div>
  );
};

export default Page;
