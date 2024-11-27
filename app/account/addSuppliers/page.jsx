"use client";
import React, { useState } from "react";
import { Grid, Skeleton } from "@mui/material";
import InputWithTitle from "@/components/generic/InputWithTitle";
import Dropdown from "@/components/generic/Dropdown";
import MultilineInput from "@/components/generic/MultilineInput";
import GreenButton from "@/components/generic/GreenButton";
import { useSupplier } from "./useAddSupplier";
import { useRouter } from "next/navigation";
import withAuth from "@/utils/withAuth";

const Page = () => {
  const router = new useRouter();
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

  const [bankSections, setBankSections] = useState([{}]);

  const handleAddBankSection = () => {
    setBankSections([...bankSections, {}]);
  };

  const handleBankInputChange = (index, field, value) => {
    const updatedBankSections = [...bankSections];
    updatedBankSections[index] = {
      ...updatedBankSections[index],
      [field]: value,
    };
    setBankSections(updatedBankSections);
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
          onChange={(value) => handleInputChange("trn_no", value)}
          title="TRN"
          placeholder={"TRN"}
          value={supplierData.trn_no}
        />
      </div>

      <div className="mt-10">
        <InputWithTitle
          onChange={(value) => handleInputChange("opening_balance", value)}
          title="Opening Balance"
          placeholder={"Opening Balance"}
          value={supplierData.opening_balance}
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
            title={"Add Tag"}
            placeholder={"Add Tag"}
            onChange={(value) => handleInputChange("tag", value)}
            value={supplierData.tag}
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
          title={"Extra Notes"}
          placeholder={"Notes"}
          onChange={(value) => handleInputChange("item_notes", value)}
          value={supplierData.item_notes}
        />
      </div>
    </div>
  );

  <div className="mt-10">
    <MultilineInput
      title={"Extra Notes"}
      placeholder={"Notes"}
      onChange={(value) => handleInputChange("item_notes", value)}
      value={supplierData.item_notes}
    />
  </div>;

  //
  return (
    <div>
      <div className="flex">
        <div className="flex-grow">
          <div className="pageTitle mb-10">Add Suppliers</div>
        </div>
        <GreenButton
          onClick={() => {
            router.push("/operations/viewSuppliers");
          }}
          title={"View All "}
        />
      </div>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          {loading ? renderSkeleton() : firstSection()}
        </Grid>
        <Grid item xs={6}>
          {loading ? renderSkeleton() : secondSection()}
        </Grid>
      </Grid>
      <div
        style={{
          borderBottom: "1px solid black",
          marginTop: "2rem",
          width: "100%",
        }}
      ></div>

      <div className="mt-1">{loading ? renderSkeleton() : <></>}</div>

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

export default withAuth(Page);
