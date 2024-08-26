"use client";
import Dropdown from "@/components/generic/Dropdown";
import InputWithTitle from "@/components/generic/InputWithTitle";
import { Skeleton } from "@mui/material";
import {
  getAllBrandNames,
} from "@/networkUtil/Constants";
import React, { useEffect, useState } from "react";
import APICall from "@/networkUtil/APICall";
import Link from "next/link";
import styles from "../../../styles/account/addItemStyles.module.css";
import Swal from "sweetalert2";

const Page = () => {
  const api = new APICall();
  const [itemName, setItemName] = useState("");
  const [batchNumber, setBatchNumber] = useState("");
  const [brandsList, setBrandList] = useState([]);
  const [fetchingData, setFetchingData] = useState(false);
  const [allBrandsList, setAllBrandsList] = useState([]);
  const [selectedBrandId, setSelectedBrandId] = useState("");
  const [manufactureDate, setManufactureDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [activeIngredients, setActiveIngredients] = useState("");

  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    getAllBrands();
  }, []);

  const getAllBrands = async () => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(getAllBrandNames);
      const brandNames = [];
      setAllBrandsList(response.data.data);
      response.data.data.map((item) => {
        brandNames.push(item.name);
      });
      setBrandList(brandNames);
    } catch (error) {
      console.error("Error fetching brands:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch brands. Please try again.",
      });
    } finally {
      setFetchingData(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoadingSubmit(true);

    const formData = {
      itemName,
      batchNumber,
      brandId: selectedBrandId,
      manufactureDate,
      expiryDate,
      activeIngredients,
    };

    try {
      const response = await api.postFormDataWithToken(
        postFormDataWithToken,
        formData
      );
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Data has been added successfully!",
      });
      // Reset form fields after successful submission
      resetForm();
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to add data. Please try again.",
      });
    } finally {
      setLoadingSubmit(false);
    }
  };

  const validateForm = () => {
    if (
      !itemName ||
      !batchNumber ||
      !selectedBrandId ||
      !manufactureDate ||
      !expiryDate ||
      !activeIngredients
    ) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please fill in all fields.",
      });
      return false;
    }
    // Add more specific validation if needed
    return true;
  };

  const resetForm = () => {
    setItemName("");
    setBatchNumber("");
    setSelectedBrandId("");
    setManufactureDate("");
    setExpiryDate("");
    setActiveIngredients("");
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
              value={itemName}
              onChange={setItemName}
            />
          </div>
          <div>
            <InputWithTitle
              title={"Batch Number"}
              type={"text"}
              placeholder={"Please enter a batch number"}
              value={batchNumber}
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
                options={brandsList}
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
            onChange={setManufactureDate}
            title={"Manufacture Date"}
            type={"date"}
            value={manufactureDate}
          />
        </div>
        <div className="mt-5">
          <InputWithTitle
            onChange={setExpiryDate}
            title={"Expiry Date"}
            type={"date"}
            value={expiryDate}
          />
        </div>
        <div className="mt-5">
          <InputWithTitle
            placeholder={"Active Ingredient"}
            onChange={setActiveIngredients}
            title={"Active Ingredient"}
            type={"text"}
            value={activeIngredients}
          />
        </div>
        <div className="mt-5">
          <button
            onClick={handleSubmit}
            disabled={loadingSubmit}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {loadingSubmit ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="pageTitle">Add Inventory Item</div>
      <div className="grid grid-cols-2 gap-10">
        <div>{firstSection()}</div>
        <div>adfs</div>
      </div>
    </div>
  );
};

export default Page;
