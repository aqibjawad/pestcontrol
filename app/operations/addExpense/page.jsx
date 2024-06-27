"use client";
import React, { useState } from "react";
import styles from "../../../styles/superAdmin/addExpensesStyles.module.css";
import UploadImagePlaceholder from "../../../components/generic/uploadImage";
import InputWithTitle from "@/components/generic/InputWithTitle";
import MultilineInput from "@/components/generic/MultilineInput";
import Dropdown from "@/components/generic/Dropdown";
import GreenButton from "@/components/generic/GreenButton";
const Page = () => {
  const [expName, setExpName] = useState();
  const [netAmount, setNetAmount] = useState();
  const [vat, setVat] = useState();
  const [total, setTotal] = useState();
  const [desc, setDesc] = useState();

  const imageContainer = () => {
    return (
      <div>
        <div className={styles.expenseTitle}>Expense</div>
        <div className={styles.imageContainer}>
          <UploadImagePlaceholder />
        </div>
      </div>
    );
  };

  const expenseForm = () => {
    return (
      <div>
        <InputWithTitle
          title={"Expense Name"}
          type={"text"}
          placeholder={"Please enter expense name"}
          onChange={setExpName}
        />
        <div className="mt-5">
          <Dropdown
            title={"Category"}
            options={["Maintaince", "Assets", "Products"]}
          />
        </div>

        <div className="mt-5">
          <InputWithTitle
            title={"Net Amount"}
            type={"text"}
            placeholder={"Net Amount"}
            onChange={setNetAmount}
          />
        </div>

        <div className="mt-5">
          <InputWithTitle
            title={"VAT"}
            type={"text"}
            placeholder={"VAT"}
            onChange={setVat}
          />
        </div>

        <div className="mt-5">
          <InputWithTitle
            title={"Total "}
            type={"text"}
            placeholder={"Total"}
            onChange={setTotal}
          />
        </div>

        <div className="mt-5">
          <MultilineInput
            title={"Description"}
            type={"text"}
            placeholder={"Enter description"}
            onChange={setDesc}
          />
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="pageTitle">Add Expenses</div>
      <div className="mt-10"></div>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4">{imageContainer()}</div>
        <div className="p-4">{expenseForm()}</div>
      </div>
      <div>
        <GreenButton title={"Save"} />
      </div>
    </div>
  );
};

export default Page;
