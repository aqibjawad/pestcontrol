"use client";
import React, { useEffect, useState } from "react";
import InputWithTitle from "../../../components/generic/InputWithTitle";
import Dropdown from "../../../components/generic/Dropdown";
import GreenButton from "../../../components/generic/GreenButton";
import APICall from "@/networkUtil/APICall";
import { getCountriesURL, addSupplier } from "@/networkUtil/Constants";
import { CircularProgress, Skeleton } from "@mui/material";
import Util from "../../../utils/utils";
import styles from "../../../styles/supplier/addSupplierStyles.module.css";
import Link from "next/link";

const Page = () => {
  const apiCall = new APICall();
  const [supplierName, setSupplierName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setNumber] = useState("");
  const [vat, setVat] = useState("");
  const [trnNumber, setTrnNumber] = useState("");
  const [supplierType, setSupplierType] = useState("");
  const [address, setAddress] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [city, setCity] = useState("");
  const [countryName, setCountryName] = useState("");
  const [hsn, setHsn] = useState("");
  const [countriesData, setCountriesData] = useState();
  const [fetchingCountries, setFetchingCountries] = useState();
  const [onlyCountires, setOnlyCountires] = useState();
  const [onlyCountryNames, setOnlyCountryNames] = useState([]);
  const [selectedCountryID, setSelectedCountryID] = useState("");
  const [allStates, setAllStates] = useState();
  const [selectedStateID, setSelectedStateID] = useState("");
  const [stateName, setStateName] = useState([]);
  const [sendingData, setSendingData] = useState();
  const [supplierTypes, setSupplierTypes] = useState(["Material", "Service"]);
  const [selectedSupplierType, setSelectedSupplierType] = useState("");

  const saveBtnPressed = async () => {
    if (supplierName === "") {
      alert("Please enter a supplier name");
    } else if (companyName === "") {
      alert("Please enter a company name");
    } else if (!Util.validateEmail(email)) {
      alert("Please enter a valid email address");
    } else if (phone === "") {
      alert("Please enter a phone number");
    } else if (vat === "") {
      alert("Please enter VAT");
    } else if (trnNumber === "") {
      alert("Please enter a trn number");
    } else if (selectedSupplierType === "") {
      alert("Please enter a supplier type");
    } else if (address === "") {
      alert("Please enter supplier address");
    } else if (countryName == "") {
      alert("Please enter a country name");
    } else if (selectedStateID === "") {
      alert("Please enter state");
    } else if (hsn === "") {
      alert("Please enter HSN");
    } else if (selectedCountryID === "") {
      alert("Please Select Country");
    } else if (selectedStateID === "") {
      alert("Please Select State");
    } else if (zipCode === "") {
      alert("Please enter zip code");
    } else {
      setSendingData(true);
      const obj = {
        supplier_name: supplierName,
        company_name: companyName,
        email: email,
        number: phone,
        vat: vat,
        tin_no: trnNumber,
        supplier_type: selectedSupplierType,
        item_notes: "Scope of work",
        address: address,
        country: selectedCountryID,
        state: selectedStateID,
        zip: zipCode,
        city: selectedStateID,
      };
      var response = await apiCall.postDataWithTokn(addSupplier, obj);
      setSendingData(false);
      if (response.message === "Supplier Added") {
        alert("Supplier Added");
      } else {
        alert("Supplier could not be added, please try later");
      }
    }
  };

  useEffect(() => {
    getCountries();
  }, []);

  const getCountries = async () => {
    setFetchingCountries(true);
    const response = await apiCall.getDataWithToken(getCountriesURL);
    setCountriesData(response);
    var countries = [];
    response.data.map((item) => {
      countries.push(item.name);
    });
    setOnlyCountryNames(countries);
    setOnlyCountires(response.data);
    setFetchingCountries(false);
  };

  const countyValueChanged = (value, index) => {
    setCountryName(value);
    setSelectedCountryID(countriesData.data[index].id);
  };

  const satateValueChanged = (value, index) => {
    setSelectedStateID(allStates[index].id);
  };

  useEffect(() => {
    if (selectedCountryID !== "") {
      console.log(selectedCountryID);
      var states;
      countriesData.data.map((item) => {
        if (item.id === selectedCountryID) {
          states = item.states;
        }
      });
      setAllStates(states);
      const names = [];
      states.map((state) => {
        names.push(state.name);
      });
      setStateName(names);
    }
  }, [selectedCountryID]);

  const supplierChnage = (value, index) => {
    setSelectedSupplierType(value);
  };

  return (
    <div>
      <div className="flex">
        <div className="flex-grow">
          <div className="pageTitle">Add Supplier</div>
        </div>
        <div>
          <Link href={"/operations/viewSuppliers"}>
            <div className={styles.viewAll}>View All</div>
          </Link>
        </div>
      </div>
      <div className="mt-10"></div>
      <div className="flex gap-10">
        <div className="flex-grow">
          <div className="flex gap-10">
            <div className="flex-grow">
              <InputWithTitle
                type={"text"}
                title={"Supplier Name"}
                placeholder={"Supplier Name"}
                onChange={setSupplierName}
              />
            </div>
            <div className="flex-grow">
              <InputWithTitle
                type={"text"}
                title={"Company Name"}
                placeholder={"Company Name"}
                onChange={setCompanyName}
              />
            </div>
          </div>

          <div className="flex gap-10 mt-10">
            <div className="flex-grow">
              <InputWithTitle
                type={"email"}
                title={"Email"}
                placeholder={"Email"}
                onChange={setEmail}
              />
            </div>
            <div className="flex-grow">
              <InputWithTitle
                type={"text"}
                title={"Phone Number"}
                placeholder={"Phone Number"}
                onChange={setNumber}
              />
            </div>
          </div>
          <div className="flex gap-10 mt-10">
            <div className="flex-grow">
              <InputWithTitle
                type={"text"}
                title={"VAT"}
                placeholder={"VAT"}
                onChange={setVat}
              />
            </div>
            <div className="flex-grow">
              <InputWithTitle
                type={"text"}
                title={"TRN"}
                placeholder={"TRN"}
                onChange={setTrnNumber}
              />
            </div>
          </div>

          <div className="flex gap-10 mt-10">
            <div className="flex-grow">
              <Dropdown
                title={"Supplier Type"}
                options={supplierTypes}
                onChange={supplierChnage}
              />
            </div>
          </div>
        </div>
        <div className="flex-grow">
          <div className="flex gap-10">
            <div className="flex-grow">
              <InputWithTitle
                type={"text"}
                title={"Address"}
                placeholder={"Address"}
                onChange={setAddress}
              />
            </div>
          </div>

          <div className="flex gap-10">
            <div className="flex-grow mt-10">
              <div className="flex gap-10">
                <div className="flex-grow">
                  {fetchingCountries ? (
                    <div className="mt-8">
                      <Skeleton variant="rectangular" height={40} />
                    </div>
                  ) : (
                    <Dropdown
                      onChange={countyValueChanged}
                      title={"Select Country"}
                      options={onlyCountryNames && onlyCountryNames}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="flex-grow mt-10">
              <div className="flex gap-10">
                <div className="flex-grow">
                  {fetchingCountries ? (
                    <div className="mt-8">
                      <Skeleton variant="rectangular" height={40} />
                    </div>
                  ) : (
                    <Dropdown
                      onChange={satateValueChanged}
                      title={"Select State"}
                      options={stateName}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-10 mt-8">
            <div className="flex-grow">
              <InputWithTitle
                type={"text"}
                title={"HSN"}
                placeholder={"HSN"}
                onChange={setHsn}
              />
            </div>
          </div>

          <div className="flex gap-10 mt-10">
            {/* <div className="flex-grow">
              <InputWithTitle
                type={"text"}
                title={"City"}
                placeholder={"Enter City"}
                onChange={setCity}
              />
            </div> */}
            <div className="flex-grow">
              <InputWithTitle
                type={"text"}
                title={"Zip Code"}
                placeholder={"Zip Code"}
                onChange={setZipCode}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-10 h-50 max-w-[200px] mx-auto flex justify-center cursor-pointer">
        {sendingData ? (
          <CircularProgress color="inherit" />
        ) : (
          <GreenButton title={"Submit"} onClick={() => saveBtnPressed()} />
        )}
      </div>
    </div>
  );
};

export default Page;
