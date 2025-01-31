"use client";
import Dropdown from "@/components/generic/Dropdown";
import InputWithTitle from "@/components/generic/InputWithTitle";
import InputWithTitle3 from "@/components/generic/InputWithTitle3";
import { Skeleton } from "@mui/material";
import { brand, product } from "@/networkUtil/Constants";
import React, { useEffect, useState } from "react";
import APICall from "@/networkUtil/APICall";
import Link from "next/link";
import styles from "../../../styles/account/addItemStyles.module.css";
import Swal from "sweetalert2";
import UploadImagePlaceholder from "../../../components/generic/uploadImage";
import MultilineInput from "@/components/generic/MultilineInput";
import GreenButton from "@/components/generic/GreenButton";
import { useRouter } from "next/navigation";
import CircularProgress from "@mui/material/CircularProgress";
import withAuth from "@/utils/withAuth";

const Page = () => {
  const api = new APICall();
  const router = useRouter();

  const [fetchingData, setFetchingData] = useState(false);
  const [allBrandsList, setAllBrandsList] = useState([]);
  const [selectedBrandId, setSelectedBrandId] = useState("");
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [brands, setBrandList] = useState([]);

  // Form States
  const [product_name, setItemName] = useState("");
  const [batch_number, setBatchNumber] = useState("");
  const [opening_stock_qty, setOpenQuant] = useState("");
  const [mfg_date, setManufactureDate] = useState("");
  const [exp_date, setExpiryDate] = useState("");
  const [product_type, setProductType] = useState("");
  const [unit, setUnit] = useState("");
  const [active_ingredients, setActiveIngredients] = useState("");
  const [others_ingredients, setOtherIngredients] = useState("");
  const [moccae_approval, setMoccaeApproved] = useState("");
  const [moccae_start_date, setMocaStartDate] = useState("");
  const [moccae_exp_date, setMocaExpiryDate] = useState("");
  const [description, setDescription] = useState("");
  const [per_item_qty, setPerItemQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [product_picture, setProductPicture] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [product_category, setProductCategory] = useState("");
  const [opening_stock_price, setOpenStkPrice] = useState("");

  useEffect(() => {
    getAllBrands();
  }, []);

  // Add new useEffect for product type and unit
  useEffect(() => {
    const isCategoryProtectionOrMachine =
      product_category === "Protection Equipment" ||
      product_category === "Machine";

    if (isCategoryProtectionOrMachine) {
      setProductType("Pieces");
      setUnit("No");
    }
  }, [product_category]);

  const getAllBrands = async () => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(`${brand}`);
      setAllBrandsList(response.data);
      const brandNames = response.data.map((item) => item.name);
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

  const handleAttachmentSelect = (file) => {
    console.log("Selected Attachment:", file);
    setAttachments(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);

    const obj = {
      product_name,
      batch_number,
      brand_id: selectedBrandId,
      mfg_date,
      exp_date,
      active_ingredients,
      product_type,
      unit,
      others_ingredients,
      moccae_approval,
      moccae_start_date,
      moccae_exp_date,
      description,
      per_item_qty,
      price,
      product_picture,
      product_category,
      opening_stock_qty,
      opening_stock_price,
    };
    attachments.forEach((file, index) => {
      obj[`attachments[${index}]`] = file;
    });

    const response = await api.postFormDataWithToken(`${product}/create`, obj);

    if (response.status === "success") {
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Data has been added successfully!",
      });
      router.push("/operations/viewInventory/");
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `${response.error.message}`,
      });
    }
  };

  const handleBrandChange = (name, index) => {
    const idAtIndex = allBrandsList[index].id;
    setSelectedBrandId(idAtIndex);
  };

  const handleProductPictureSelect = (file) => {
    console.log("Selected Product Picture:", file);
    setProductPicture(file);
  };

  const handleManufactureDateChange = (name, value) => {
    setManufactureDate(value);
  };

  const handleExpiryDateChange = (name, value) => {
    setExpiryDate(value);
  };

  const handleMocaStartDateChange = (name, value) => {
    setMocaStartDate(value);
  };

  const handleMocaExpiryDateChange = (name, value) => {
    setMocaExpiryDate(value);
  };

  const firstSection = () => {
    return (
      <div>
        <div className="mt-5 grid grid-cols-2 gap-10">
          <div>
            <InputWithTitle
              title={"Item Name"}
              type={"text"}
              placeholder={"Item Name"}
              value={product_name}
              onChange={setItemName}
            />
          </div>
          <div>
            <InputWithTitle
              title={"Batch Number"}
              type={"text"}
              placeholder={"Please enter a batch number"}
              value={batch_number}
              onChange={setBatchNumber}
            />
          </div>
          <div>
            <InputWithTitle
              title={"Opening Stock"}
              type={"text"}
              placeholder={"Please enter opening stock number"}
              value={opening_stock_qty}
              onChange={setOpenQuant}
            />
          </div>
          <div>
            <InputWithTitle
              title={"Opening Price"}
              type={"text"}
              placeholder={"Please enter opening stock number"}
              value={opening_stock_price}
              onChange={setOpenStkPrice}
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
                options={brands}
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

        {product_category === "Pest Control Chemical" && (
          <div className="mt-10">
            <div className="mt-5">
              <InputWithTitle3
                onChange={handleManufactureDateChange}
                title={"Manufacture Date"}
                type={"date"}
                value={mfg_date}
              />
            </div>
            <div className="mt-5">
              <InputWithTitle3
                onChange={handleExpiryDateChange}
                title={"Expiry Date"}
                type={"date"}
                value={exp_date}
                min={mfg_date}
              />
            </div>
            <div className="mt-5">
              <InputWithTitle
                placeholder={"Active Ingredient"}
                onChange={setActiveIngredients}
                title={"Active Ingredient"}
                type={"text"}
                value={active_ingredients}
              />
            </div>
            <div className="mt-5">
              <UploadImagePlaceholder
                onFileSelect={handleAttachmentSelect}
                title={"Attachment"}
                multiple
              />
            </div>
          </div>
        )}

        <div className="mt-5">
          <UploadImagePlaceholder
            onFileSelect={handleProductPictureSelect}
            title={"Product Image"}
          />
        </div>
      </div>
    );
  };

  const secondSection = () => {
    const isCategoryProtectionOrMachine =
      product_category === "Protection Equipment" ||
      product_category === "Machine";

    return (
      <div className="mt-10">
        <div className="mt-5 flex gap-4">
          <div className="flex-grow">
            <InputWithTitle
              title={"Per Item Quantity"}
              type={"text"}
              placeholder={"Per Item Quantity"}
              onChange={setPerItemQuantity}
              value={per_item_qty}
            />
          </div>
        </div>

        {product_category === "Pest Control Chemical" && (
          <>
            <div className="mt-10">
              <Dropdown
                options={["Powder", "Liquid", "Gel"]}
                title={"Product Type"}
                onChange={(value) => setProductType(value)}
                value={product_type}
              />
            </div>

            <div className="mt-10">
              <div className="flex gap-4">
                <div className="flex-grow">
                  <Dropdown
                    title={"Unit"}
                    options={["ML", "GRAM", "Pieces"]}
                    onChange={(value) => setUnit(value)}
                    value={unit}
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
                  onChange={setOtherIngredients}
                  value={others_ingredients}
                />
              </div>
            </div>

            <div className="mt-10">
              <div className="flex-grow">
                <Dropdown
                  options={["Approved", "Not Approved"]}
                  title={"MOCCAE Approval"}
                  onChange={(value) => setMoccaeApproved(value)}
                />
              </div>
            </div>

            <div className="mt-10">
              <div className="flex gap-4">
                <div className="flex-grow">
                  <InputWithTitle3
                    title={"MOCCAE Start Date"}
                    type={"date"}
                    onChange={handleMocaStartDateChange}
                    value={moccae_start_date}
                  />
                </div>
                <div className="flex-grow">
                  <InputWithTitle3
                    title={"MOCCAE Expiry Date"}
                    type={"date"}
                    onChange={handleMocaExpiryDateChange}
                    value={moccae_exp_date}
                    min={moccae_start_date}
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {isCategoryProtectionOrMachine && (
          <>
            <div className="mt-10">
              <InputWithTitle
                title={"Product Type"}
                type={"text"}
                value="Pieces"
                disabled
              />
            </div>

            <div className="mt-10">
              <InputWithTitle
                title={"Unit"}
                type={"text"}
                value="No"
                disabled
              />
            </div>
          </>
        )}

        <div className="mt-10">
          <MultilineInput
            title={"Description"}
            placeholder={"Description"}
            onChange={setDescription}
            value={description}
          />
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="pageTitle">Add Inventory Item</div>
      <div className="mt-5">
        <Dropdown
          options={["Pest Control Chemical", "Protection Equipment", "Machine"]}
          title={"Product Categories"}
          onChange={(value) => setProductCategory(value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-10">
        <div>{firstSection()}</div>
        <div>{secondSection()}</div>
      </div>

      <div className="mt-10">
        <GreenButton
          onClick={handleSubmit}
          title={
            loadingSubmit ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Submit"
            )
          }
          disabled={loadingSubmit}
        />
      </div>
    </div>
  );
};

export default withAuth(Page);
