"use client";
import React from "react";
import InputWithTitle from "../../components/generic/InputWithTitle";
import styles from ".././../styles/superAdmin/addVendor.module.css";
import GreenButton from "@/components/generic/GreenButton";
import { useVendor } from "./useAddVendor"; // Adjust the import path as needed

import Link from "next/link";
import withAuth from "@/utils/withAuth";

const Page = () => {
  const { vendorData, handleInputChange, sendingData, addRequest } =
    useVendor();

  return (
    <div>
      <div className="flex">
        <div className="flex-grow">
          <div className="pageTitle">Add Vendor</div>
        </div>
        <div>
          <div className={styles.addProd}>
            <Link href="/allVendors">View Vendors</Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-5">
        <div className="mt-5">
          <InputWithTitle
            onChange={(value) => handleInputChange("name", value)}
            title={"Vendor Name"}
            value={vendorData.name}
            placeholder={"Vendor Name"}
          />
        </div>

        <div className="mt-5">
          <InputWithTitle
            onChange={(value) => handleInputChange("firm_name", value)}
            title={"Firm Name"}
            value={vendorData.firm_name}
            placeholder={"Firm Name"}
          />
        </div>

        <div className="mt-5">
          <InputWithTitle
            value={vendorData.contact}
            onChange={(value) => handleInputChange("contact", value)}
            title={"Vendor Contact"}
            placeholder={"Vendor Contact"}
          />
        </div>

        <div className="mt-5">
          <InputWithTitle
            value={vendorData.email}
            onChange={(value) => handleInputChange("email", value)}
            title={"Vendor Email"}
            placeholder={"Vendor Email"}
          />
        </div>

        <div className="mt-5">
          <InputWithTitle
            value={vendorData.tag}
            onChange={(value) => handleInputChange("tag", value)}
            title={"Add Tag"}
            placeholder={"Add Tag"}
          />
        </div>

        <div className="mt-5">
          <InputWithTitle
            value={vendorData.vat}
            onChange={(value) => handleInputChange("vat", value)}
            title={"Vat"}
            placeholder={"Vat"}
          />
        </div>

        <div className="mt-5">
          <InputWithTitle
            value={vendorData.opening_balance}
            onChange={(value) => handleInputChange("opening_balance", value)}
            title={"Opening Balance"}
            placeholder={"Opening Balance"}
          />
        </div>
      </div>

      <div className={styles.itemTitle}>Manager</div>
      <div className="grid grid-cols-3 mt-5 gap-10">
        <div>
          <InputWithTitle
            onChange={(value) => handleInputChange("mng_name", value)}
            title={"Manager Name"}
            value={vendorData.mng_name}
            placeholder={"Manager Name"}
          />
        </div>
        <div>
          <InputWithTitle
            onChange={(value) => handleInputChange("mng_contact", value)}
            title={"Manager Contact"}
            value={vendorData.mng_contact}
            placeholder={"Manager Contact"}
          />
        </div>
        <div>
          <InputWithTitle
            onChange={(value) => handleInputChange("mng_email", value)}
            title={"Manager Email"}
            type={"email"}
            placeholder={"Manager Email"}
            value={vendorData.mng_email}
          />
        </div>
      </div>

      <div className={styles.itemTitle}>Accountant</div>
      <div className="grid grid-cols-3 mt-5 gap-10">
        <div>
          <InputWithTitle
            onChange={(value) => handleInputChange("acc_name", value)}
            title={"Accountant Name"}
            placeholder={"Accountant Name"}
            value={vendorData.acc_name}
          />
        </div>
        <div>
          <InputWithTitle
            onChange={(value) => handleInputChange("acc_contact", value)}
            title={"Accountant Contact"}
            placeholder={"Accountant Contact"}
            value={vendorData.acc_contact}
          />
        </div>
        <div>
          <InputWithTitle
            onChange={(value) => handleInputChange("acc_email", value)}
            title={"Accountant Email"}
            type={"email"}
            value={vendorData.acc_email}
            placeholder={"Accountant Email"}
          />
        </div>
      </div>

      <div className="mt-5">
        <InputWithTitle
          title={"Percentage"}
          onChange={(value) => handleInputChange("percentage", value)}
          placeholder={"Percentage"}
          value={vendorData.percentage}
        />
      </div>
      <div className="mt-20 ml-20 mr-20">
        <GreenButton
          sendingData={sendingData}
          onClick={addRequest}
          title={"Add Vendor"}
        />
      </div>
    </div>
  );
};

export default withAuth(Page);
