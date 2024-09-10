"use client";
import Dropdown from "@/components/generic/Dropdown";
import InputWithTitle from "@/components/generic/InputWithTitle";
import { Skeleton } from "@mui/material";
import { getAllBrandNames } from "@/networkUtil/Constants";
import React, { useEffect, useState } from "react";
import APICall from "@/networkUtil/APICall";
import Link from "next/link";
import styles from "../../../styles/account/addItemStyles.module.css";
import Swal from "sweetalert2";
import UploadImagePlaceholder from "../../../components/generic/uploadImage";
import MultilineInput from "@/components/generic/MultilineInput";
import GreenButton from "@/components/generic/GreenButton";

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
  const [productFor, setProductFor] = useState("");
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [productImage, setProductForImage] = useState();
  const [attachmentImage, setAttachmentImage] = useState();
  const [productType, setProductType] = useState();
  const [totalQuantity, setTotalQunantity] = useState();
  const [perItemQuantity, setPerItemQuantity] = useState();
  const [unit, setUnit] = useState();
  const [perUnitPrice, setPerUnitPrice] = useState();
  const [ingredient, setIngredients] = useState();
  const [moccae, setMoccaeApproved] = useState();
  const [mocaStartDate, setMocaStartDate] = useState();
  const [mocaExpiryDate, setMocaExpiryDate] = useState();
  const [vat, setVat] = useState();
  const [supplierName, setSupplierName] = useState();
  const [desc, setDescription] = useState();

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

  const handleProductForChange = (value, index) => {
    setProductFor(value);
  };

  const handleFileSelect = (file) => {
    setProductForImage(file);
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
          <Dropdown
            options={["Option 1", "Option 2", "Option 3"]}
            title={"Product For"}
            onChange={handleProductForChange}
          />

          <UploadImagePlaceholder
            onFileSelect={handleFileSelect}
            title={"Product Image"}
          />

          <UploadImagePlaceholder
            onFileSelect={setAttachmentImage}
            title={"Attachment"}
          />
        </div>
      </div>
    );
  };

  const handleProductTypeChange = (value, index) => {
    setProductType(value);
  };

  const handleUnitChanged = (value, index) => {
    setUnit(value);
  };

  const mocaChanged = (value, index) => {
    setMoccaeApproved(value);
  };

  const secondSection = () => {
    return (
      <div className="mt-10">
        <Dropdown
          options={["Powder", "Chemical"]}
          title={"Product Type"}
          onChange={handleProductTypeChange}
        />
        <div className="mt-10">
          <div className="flex gap-4">
            <div className="flex-grow">
              <InputWithTitle
                title={"Total Quantity"}
                type={"text"}
                placeholder={"Total Quantity"}
                onChange={setTotalQunantity}
              />
            </div>
            <div className="flex-grow">
              <InputWithTitle
                title={"Per Item Quantity"}
                type={"text"}
                placeholder={"Per Item Quantity"}
                onChange={setPerItemQuantity}
              />
            </div>
          </div>
        </div>

        <div className="mt-10">
          <div className="flex gap-4">
            <div className="flex-grow">
              <Dropdown
                title={"Unit"}
                options={["ML", "GRAM"]}
                onChange={handleUnitChanged}
              />
            </div>
            <div className="flex-grow">
              <InputWithTitle
                title={"Per Unit Price"}
                type={"text"}
                placeholder={"Per Item Price"}
                onChange={setPerUnitPrice}
              />
            </div>
          </div>
        </div>

        <div className="mt-10">
          <div className="flex-grow">
            <InputWithTitle
              title={"Other Ingredients"}
              type={"text"}
              placeholder={"Other Ingredients"}
              onChange={setIngredients}
            />
          </div>
        </div>

        <div className="mt-10">
          <div className="flex-grow">
            <Dropdown
              options={["Approved", "Not Approved"]}
              title={"MOCCAE Approval"}
              onChange={mocaChanged}
            />
          </div>
        </div>

        <div className="mt-10">
          <div className="flex gap-4">
            <div className="flex-grow">
              <InputWithTitle
                title={"MOCCAE Start Date"}
                type={"date"}
                placeholder={"Per Item Price"}
                onChange={setMocaStartDate}
              />
            </div>
            <div className="flex-grow">
              <InputWithTitle
                title={"MOCCAE Expiry Date"}
                type={"date"}
                placeholder={"Per Item Price"}
                onChange={setMocaExpiryDate}
              />
            </div>
          </div>
        </div>

        <div className="mt-10">
          <div className="flex gap-4">
            <div className="flex-grow">
              <InputWithTitle
                title={"VAT"}
                type={"text"}
                placeholder={"VAT"}
                onChange={setVat}
              />
            </div>
            <div className="flex-grow">
              <InputWithTitle
                title={"Supplier Name"}
                type={"text"}
                placeholder={"Supplier Name"}
                onChange={setSupplierName}
              />
            </div>
          </div>
        </div>

        <div className="mt-10">
          <InputWithTitle title={"Price"} type={"text"} placeholder={"Price"} />
        </div>

        <div className="mt-10">
          <MultilineInput
            title={"Description"}
            placeholder={"Description"}
            onChange={setDescription}
          />
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="pageTitle">Add Inventory Item</div>
      <div className="grid grid-cols-2 gap-10">
        <div>{firstSection()}</div>
        <div>{secondSection()}</div>
      </div>
      <div className="mt-20">
        <GreenButton title={"Save"} />
      </div>
    </div>
  );
};

export default Page;
