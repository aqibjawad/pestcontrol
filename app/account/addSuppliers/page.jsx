"use client";
import React, { useState } from "react";
import { Grid, Skeleton } from "@mui/material";
import InputWithTitle from "@/components/generic/InputWithTitle";
import Dropdown from "@/components/generic/Dropdown";
import MultilineInput from "@/components/generic/MultilineInput";
import GreenButton from "@/components/generic/GreenButton";
import { useSupplier } from "./useAddSupplier";

const Page = () => {
  const {
    supplierData,
    handleInputChange,
    emiratesOfDubai,
    handleSupplierType,
    handleCountryChanged,
    handleCityChanged,
    saveSupplier,
  } = useSupplier();

  const [loading, setLoading] = useState(false);

  const handleSaveSupplier = async () => {
    setLoading(true);
    await saveSupplier(); // Ensure saveSupplier is correctly handling async operations
    setLoading(false);
  };

  const renderSkeleton = () => (
    <div>
      <div className="flex gap-4">
        <div className="flex-grow">
          <Skeleton variant="text" width="100%" height={40} />
        </div>
        <div className="flex-grow">
          <Skeleton variant="text" width="100%" height={40} />
        </div>
      </div>
      <div className="flex gap-4 mt-10">
        <div className="flex-grow">
          <Skeleton variant="text" width="100%" height={40} />
        </div>
        <div className="flex-grow">
          <Skeleton variant="text" width="100%" height={40} />
        </div>
      </div>
      <div className="mt-10">
        <Skeleton variant="text" width="100%" height={40} />
      </div>
      <div className="mt-10">
        <Skeleton variant="text" width="100%" height={40} />
      </div>
    </div>
  );

  const firstSection = () => (
    <div>
      <div className="flex gap-4">
        <div className="flex-grow">
          <InputWithTitle
            onChange={(value) => handleInputChange("supplier_name", value)}
            name={"supplier_name"}
            placeholder={"Supplier Name"}
            title={"Supplier Name"}
            value={supplierData.supplier_name}
          />
        </div>
        <div className="flex-grow">
          <InputWithTitle
            onChange={(value) => handleInputChange("company_name", value)}
            name={"company_name"}
            title={"Company Name"}
            value={supplierData.company_name}
          />
        </div>
      </div>

      <div className="flex gap-4 mt-10">
        <div className="flex-grow">
          <InputWithTitle
            onChange={(value) => handleInputChange("email", value)}
            placeholder={"Email"}
            title={"Email"}
            value={supplierData.email}
          />
        </div>
        <div className="flex-grow">
          <InputWithTitle
            onChange={(value) => handleInputChange("number", value)}
            name={"number"}
            title={"Contact Number"}
            value={supplierData.number}
          />
        </div>
      </div>
      <div className="mt-10">
        <InputWithTitle
          onChange={(value) => handleInputChange("vat", value)}
          title="VAT"
          placeholder={"VAT"}
          value={supplierData.vat}
        />
      </div>

      <div className="mt-10">
        <InputWithTitle
          onChange={(value) => handleInputChange("trn_no", value)}
          title="TRN"
          placeholder={"TRN"}
          value={supplierData.trn_no}
        />
      </div>
    </div>
  );

  const secondSection = () => (
    <div>
      <div>
        <InputWithTitle
          onChange={(value) => handleInputChange("address", value)}
          placeholder={"Address"}
          title={"Address"}
          value={supplierData.address}
        />
      </div>
      <div className="mt-10">
        <div className="flex gap-4">
          <div className="flex-grow">
            <Dropdown
              title={"Country"}
              onChange={handleCountryChanged}
              options={["UAE"]}
              value={supplierData.country}
            />
          </div>

          <div className="flex-grow">
            <Dropdown
              title={"City"}
              onChange={handleCityChanged}
              options={emiratesOfDubai}
              value={supplierData.city}
            />
          </div>
        </div>
      </div>

      <div className="mt-10 flex gap-4">
        <div className="flex-grow">
          <InputWithTitle
            title={"HSN"}
            placeholder={"HSN"}
            onChange={(value) => handleInputChange("hsn", value)}
            value={supplierData.hsn}
          />
        </div>

        <div className="flex-grow">
          <InputWithTitle
            title={"Zip"}
            placeholder={"Zip"}
            onChange={(value) => handleInputChange("zip", value)}
            value={supplierData.zip}
          />
        </div>
      </div>

      <div className="mt-10">
        <MultilineInput
          title={"Item Notes"}
          placeholder={"Item Notes"}
          onChange={(value) => handleInputChange("item_notes", value)}
          value={supplierData.item_notes}
        />
      </div>
    </div>
  );

  return (
    <div>
      <div className="pageTitle mb-10">Add Suppliers</div>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          {loading ? renderSkeleton() : firstSection()}
        </Grid>
        <Grid item xs={6}>
          {loading ? renderSkeleton() : secondSection()}
        </Grid>
      </Grid>
      <div className="mt-10">
        <GreenButton
          title={"Save"}
          onClick={handleSaveSupplier}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default Page;
