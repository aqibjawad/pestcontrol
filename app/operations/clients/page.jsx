"use client";

import React, { useState, useRef, useEffect } from "react";
import tableStyles from "../../../styles/upcomingJobsStyles.module.css";
import SearchInput from "@/components/generic/SearchInput";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

import { addClients } from "@/networkUtil/Constants";
import APICall from "@/networkUtil/APICall";

import styles from "../../../styles/loginStyles.module.css";

const rows = Array.from({ length: 10 }, (_, index) => ({
  clientName: "Olivia Rhye",
  clientContact: "10",
  quoteSend: "10",
  quoteApproved: "50",
  cashAdvance: "$50,000",
}));

const listServiceTable = () => {
  return (
    <div className={tableStyles.tableContainer}>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-5 px-4 border-b border-gray-200 text-left">
              {" "}
              Customer{" "}
            </th>
            <th className="py-2 px-4 border-b border-gray-200 text-left">
              {" "}
              Reference{" "}
            </th>
            <th className="py-2 px-4 border-b border-gray-200 text-left">
              {" "}
              Phone Number{" "}
            </th>
            <th className="py-2 px-4 border-b border-gray-200 text-left">
              {" "}
              Firm{" "}
            </th>
            <th className="py-2 px-4 border-b border-gray-200 text-left">
              {" "}
              Address{" "}
            </th>
            <th className="py-2 px-4 border-b border-gray-200 text-left">
              {" "}
              Date{" "}
            </th>
            <th className="py-2 px-4 border-b border-gray-200 text-left">
              {" "}
              Longitude{" "}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="border-b border-gray-200">
              <td className="py-5 px-4">{row.clientName}</td>
              <td className="py-2 px-4">
                <div className={tableStyles.clientContact}>
                  {row.clientContact}
                </div>
              </td>
              <td className="py-2 px-4">
                <div className={tableStyles.clientContact}>
                  {row.clientContact}
                </div>
              </td>
              <td className="py-2 px-4">
                <div className={tableStyles.clientContact}>
                  {row.clientContact}
                </div>
              </td>
              <td className="py-2 px-4">
                <div className={tableStyles.clientContact}>
                  {row.clientContact}
                </div>
              </td>
              <td className="py-2 px-4">
                <div className={tableStyles.clientContact}>
                  {row.clientContact}
                </div>
              </td>
              <td className="py-2 px-4">
                <div className={tableStyles.clientContact}>
                  {row.clientContact}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Page = () => {
  const api = new APICall();

  const inputRef = useRef(null);

  const autocompleteRef = useRef(null);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [firm_name, setFirmName] = useState("");
  const [email, setEmail] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [mobile_number, setMobileNumber] = useState("");
  const [industry_name, setIndustryName] = useState("");
  const [references  , setReferences] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setName("");
    setFirmName("");
    setEmail("");
    setPhoneNumber("");
    setMobileNumber("");
    setIndustryName("");
    setReferences("");
  };

  const handleSubmit = async () => {
    const formData = {
      name,
      firm_name,
      email,
      phone_number,
      mobile_number,
      industry_name,
      references,
      role: 5,
      latitude: "12.45555",
      longitude: "32.45555",
      tags: "Javascript,test,test",
    };

    try {
      const response = await api.postFormDataWithToken(addClients, formData);

      const data = await response.data;
      console.log("Success:", data);

      // Close the modal and reset form
      handleClose();
    } catch (error) {
      console.error("Error:", error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeAutocomplete;
      document.head.appendChild(script);
    };

    const initializeAutocomplete = () => {
      if (inputRef.current && window.google) {
        const autocomplete = new window.google.maps.places.Autocomplete(
          inputRef.current,
          {
            types: ["geocode"],
            componentRestrictions: { country: "us" },
          }
        );

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          const addressComponents = place.address_components;
          const geometry = place.geometry;

          if (addressComponents) {
            const fullAddress = place.formatted_address;
            const city =
              addressComponents.find((component) =>
                component.types.includes("locality")
              )?.long_name || "";
            const latitude = geometry.location.lat();
            const longitude = geometry.location.lng();

            setAddress(fullAddress);
            setCity(city);
            setLatitude(latitude);
            setLongitude(longitude);
          }
        });

        autocompleteRef.current = autocomplete;
      }
    };

    loadGoogleMapsScript();

    return () => {
      // Clean up the script when component unmounts
      const script = document.querySelector(
        'script[src^="https://maps.googleapis.com/maps/api/js"]'
      );
      if (script) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return (
    <div>
      <div style={{ padding: "30px", borderRadius: "10px" }}>
        <div
          style={{
            fontSize: "20px",
            fontFamily: "semibold",
            marginBottom: "-4rem",
          }}
        >
          Clients
        </div>
        <div className="flex">
          <div className="flex-grow"></div>
          <div
            className="flex"
            style={{ display: "flex", alignItems: "center" }}
          >
            <div style={{ marginTop: "2rem", marginRight: "2rem" }}>
              <SearchInput />
            </div>
            <div
              style={{
                marginTop: "2rem",
                border: "1px solid #38A73B",
                borderRadius: "8px",
                height: "40px",
                width: "100px",
                alignItems: "center",
                display: "flex",
              }}
            >
              <img
                src="/Filters lines.svg"
                height={20}
                width={20}
                className="ml-2 mr-2"
              />
              Filters
            </div>
            <div
              onClick={handleClickOpen}
              style={{
                marginTop: "2rem",
                backgroundColor: "#32A92E",
                color: "white",
                fontWeight: "600",
                fontSize: "16px",
                marginLeft: "auto",
                marginRight: "auto",
                height: "48px",
                width: "150px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginLeft: "1rem",
                cursor: "pointer",
              }}
            >
              + Clients
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "2rem",
          }}
        >
          <div
            style={{
              backgroundColor: "#32A92E",
              color: "white",
              fontWeight: "600",
              fontSize: "16px",
              height: "44px",
              width: "202px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginLeft: "1rem",
              padding: "12px, 16px, 12px, 16px",
              borderRadius: "10px",
            }}
          >
            Download all
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">{listServiceTable()}</div>
      </div>

      <Dialog open={open} onClose={handleClose}>
        <DialogContent style={{ backgroundColor: "white" }}>
          <div>
            <div
              style={{
                textAlign: "center",
                fontSize: "24px",
                fontWeight: "600",
                marginTop: "2.6rem",
              }}
            >
              Add Clients
            </div>

            <div
              style={{
                color: "#667085",
                fontSize: "16px",
                textAlign: "center",
                marginTop: "1rem",
              }}
            >
              Thank you for choosing us to meet your needs. We look forward to
              serving you with excellence
            </div>

            <div
              className={styles.userFormContainer}
              style={{ fontSize: "16px" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "1rem",
                  marginTop: "1rem",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ marginBottom: "0.5rem", color: "#344054" }}>
                    {" "}
                    Name{" "}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      border: "1px solid #38A73B",
                      borderRadius: "8px",
                      padding: "12px 16px",
                      width: "100%",
                      height: "49px",
                      boxSizing: "border-box",
                    }}
                    placeholder="Enter name"
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ marginBottom: "0.5rem", color: "#344054" }}>
                    {" "}
                    Firm Name{" "}
                  </label>
                  <input
                    type="text"
                    value={firm_name}
                    onChange={(e) => setFirmName(e.target.value)}
                    style={{
                      border: "1px solid #38A73B",
                      borderRadius: "8px",
                      padding: "12px 16px",
                      width: "100%",
                      height: "49px",
                      boxSizing: "border-box",
                    }}
                    placeholder="Firm name"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className={styles.userFormContainer}>
                <div
                  style={{
                    color: "#344054",
                    fontSize: "16px",
                    marginBottom: "0.5rem",
                  }}
                >
                  Email
                </div>
                <div style={{ position: "relative", width: "489px" }}>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      border: "1px solid #38A73B",
                      borderRadius: "8px",
                      padding: "12px 16px 12px 40px",
                      width: "100%",
                      height: "49px",
                      boxSizing: "border-box",
                    }}
                    placeholder="Please enter Email"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className={styles.userFormContainer}>
                <div
                  style={{
                    color: "#344054",
                    fontSize: "16px",
                    marginBottom: "0.5rem",
                  }}
                >
                  Phone Number
                </div>
                <div style={{ position: "relative", width: "489px" }}>
                  <input
                    type="text"
                    value={phone_number}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    style={{
                      border: "1px solid #38A73B",
                      borderRadius: "8px",
                      padding: "12px 16px 12px 40px",
                      width: "100%",
                      height: "49px",
                      boxSizing: "border-box",
                    }}
                    placeholder="Please enter Phone Number"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className={styles.userFormContainer}>
                <div
                  style={{
                    color: "#344054",
                    fontSize: "16px",
                    marginBottom: "0.5rem",
                  }}
                >
                  Mobile Number
                </div>
                <div style={{ position: "relative", width: "489px" }}>
                  <input
                    type="text"
                    value={mobile_number}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    style={{
                      border: "1px solid #38A73B",
                      borderRadius: "8px",
                      padding: "12px 16px 12px 40px",
                      width: "100%",
                      height: "49px",
                      boxSizing: "border-box",
                    }}
                    placeholder="Please enter Mobile Number"
                  />
                </div>
              </div>
            </div>

            <div
              className={styles.userFormContainer}
              style={{ fontSize: "16px" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "1rem",
                  marginTop: "1rem",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ marginBottom: "0.5rem", color: "#344054" }}>
                    {" "}
                    Industry Name{" "}
                  </label>
                  <input
                    type="text"
                    value={industry_name}
                    onChange={(e) => setIndustryName(e.target.value)}
                    style={{
                      border: "1px solid #38A73B",
                      borderRadius: "8px",
                      padding: "12px 16px",
                      width: "100%",
                      height: "49px",
                      boxSizing: "border-box",
                    }}
                    placeholder=" SAP "
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ marginBottom: "0.5rem", color: "#344054" }}>
                    {" "}
                    References{" "}
                  </label>
                  <input
                    type="text"
                    value={references}
                    onChange={(e) => setReferences(e.target.value)}
                    style={{
                      border: "1px solid #38A73B",
                      borderRadius: "8px",
                      padding: "12px 16px",
                      width: "100%",
                      height: "49px",
                      boxSizing: "border-box",
                    }}
                    placeholder=" Umair Khan "
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4 mt-10">
            {/* Left Grid */}
            <div className="col-span-8 md:col-span-9">
              <div className={styles.userFormContainer}>
                <div style={{ position: "relative", width: "489px" }}>
                  <input
                    ref={inputRef}
                    type="search"
                    style={{
                      border: "1px solid #38A73B",
                      borderRadius: "8px",
                      padding: "12px 16px 12px 40px",
                      width: "100%",
                      height: "49px",
                      boxSizing: "border-box",
                    }}
                    placeholder="Search"
                  />
                </div>
              </div>

              <div className={styles.userFormContainer}>
                <div
                  style={{
                    color: "#344054",
                    fontSize: "16px",
                    marginBottom: "0.5rem",
                  }}
                >
                  Address
                </div>
                <div style={{ position: "relative", width: "489px" }}>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    style={{
                      border: "1px solid #38A73B",
                      borderRadius: "8px",
                      padding: "12px 16px 12px 40px",
                      width: "100%",
                      height: "49px",
                      boxSizing: "border-box",
                    }}
                    placeholder="Please enter Address"
                  />
                </div>
              </div>

              <div className={styles.userFormContainer}>
                <div
                  style={{
                    color: "#344054",
                    fontSize: "16px",
                    marginBottom: "0.5rem",
                  }}
                >
                  City
                </div>
                <div style={{ position: "relative", width: "489px" }}>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    style={{
                      border: "1px solid #38A73B",
                      borderRadius: "8px",
                      padding: "12px 16px 12px 40px",
                      width: "100%",
                      height: "49px",
                      boxSizing: "border-box",
                    }}
                    placeholder="Please enter City"
                  />
                </div>
              </div>

              <div
                className={styles.userFormContainer}
                style={{ fontSize: "16px" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "1rem",
                    marginTop: "1rem",
                  }}
                ></div>
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions style={{ justifyContent: "center" }}>
          <div
            onClick={handleSubmit}
            style={{
              backgroundColor: "#32A92E",
              color: "white",
              fontWeight: "600",
              fontSize: "16px",
              height: "48px",
              width: "325px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "12px 16px",
              borderRadius: "10px",
              cursor: "pointer",
            }}
          >
            Add Client
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Page;
