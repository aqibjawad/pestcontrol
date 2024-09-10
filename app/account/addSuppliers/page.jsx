"use client";
import React, { useState } from "react";
import { Grid } from "@mui/material";
import InputWithTitle from "@/components/generic/InputWithTitle";
import Dropdown from "@/components/generic/Dropdown";
import MultilineInput from "@/components/generic/MultilineInput";
import GreenButton from "@/components/generic/GreenButton";

const page = () => {
  const [supplierName, setSupplierName] = useState();
  const [comapnyName, setCompanyName] = useState();
  const [email, setEmail] = useState();
  const [number, setNumber] = useState();
  const [vat, setVat] = useState();
  const [trn, setTrn] = useState();
  const [address, setAddress] = useState();
  const [country, setCountry] = useState();
  const [state, setState] = useState();
  const [HSN, setHSN] = useState();
  const [city, setCity] = useState();
  const [zip, setZip] = useState();
  const [itemNotes, setItemNotes] = useState();
  const [supplierType, setSupplierType] = useState();

  const emiratesOfDubai = [
    "Abu Dhabi",
    "Dubai",
    "Sharjah",
    "Ajman",
    "Umm Al Quwain",
    "Ras Al Khaimah",
    "Fujairah",
  ];

  const handleSupplierType = (value, index) => {
    setSupplierType(value);
  };

  const firstSection = () => {
    return (
      <div>
        <div className="flex gap-4">
          <div className="flex-grow">
            <InputWithTitle
              onChange={setSupplierName}
              name={"supplierName"}
              placeholder={"Supplier Name"}
              title={"Supplier Name"}
            />
          </div>
          <div className="flex-grow">
            <InputWithTitle
              onChange={setSupplierName}
              name={"Company Name"}
              title={"Comapny Name"}
            />
          </div>
        </div>

        <div className="flex gap-4 mt-10">
          <div className="flex-grow">
            <InputWithTitle
              onChange={setEmail}
              placeholder={"Email"}
              title={"Email"}
            />
          </div>
          <div className="flex-grow">
            <InputWithTitle
              onChange={setNumber}
              name={"Contact Number"}
              title={"Contact Number"}
            />
          </div>
        </div>
        <div className="mt-10">
          <InputWithTitle onChange={setVat} title="VAT" placeholder={"VAT"} />
        </div>

        <div className="mt-10">
          <InputWithTitle onChange={setTrn} title="TRN" placeholder={"TRN"} />
        </div>

        <div className="mt-10">
          <Dropdown
            options={["Supplier type1, Supplier type2"]}
            onChange={handleSupplierType}
            title={"Supplier Type"}
          />
        </div>
      </div>
    );
  };

  const handleCountryChanged = (value, index) => {
    setCountry(value);
  };

  const handleCityChanged = (value, index) => {
    setCity(value);
  };

  const secontSection = () => {
    return (
      <div className="">
        <div className="">
          <InputWithTitle
            onChange={setAddress}
            placeholder={"Address"}
            title={"Address"}
          />
        </div>
        <div className="mt-10">
          <div className="flex gap-4">
            <div className="flex-grow">
              <Dropdown
                title={"Country"}
                onChange={handleCountryChanged}
                options={["UAE"]}
              />
            </div>

            <div className="flex-grow">
              <Dropdown
                title={"City"}
                onChange={handleCityChanged}
                options={emiratesOfDubai}
              />
            </div>
          </div>
        </div>

        <div className="mt-10 flex gap-4">
          <div className="flex-grow">
            <InputWithTitle
              title={"HSN"}
              placeholder={"HSN"}
              onChange={setHSN}
            />
          </div>

          <div className="flex-grow">
            <InputWithTitle
              title={"Zip"}
              placeholder={"Zip"}
              onChange={setZip}
            />
          </div>
        </div>

        <div className="mt-10">
          <MultilineInput
            title={"Item Notes"}
            placeholder={"Item Notes"}
            onChange={setItemNotes}
          />
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="pageTitle mb-10">Add Suppliers</div>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          {firstSection()}
        </Grid>
        <Grid item xs={6}>
          {secontSection()}
        </Grid>
      </Grid>
      <div className="mt-10">
        <GreenButton title={"Save"} />
      </div>
    </div>
  );
};

export default page;
