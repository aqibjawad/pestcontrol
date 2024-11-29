"use client";
import React, { useState } from "react";
import Dropdown from "../../../components/generic/Dropdown";
import InputWithTitle from "@/components/generic/InputWithTitle";
import GreenButton from "@/components/generic/GreenButton";
import withAuth from "@/utils/withAuth";

const Page = () => {
  const [products, setProducts] = useState([
    "Super Delta",
    "P40",
    "Penzasodine",
  ]);

  const [selectedProduct, setSelectedProducts] = useState();
  const [assignStock, setAssignStock] = useState();

  return (
    <div>
      <div className="pageTitle"> Assign Stock</div>
      <div>
        <Dropdown
          title={"Product"}
          options={products}
          onChange={setSelectedProducts}
        />
      </div>
      <div className="mt-5">
        <InputWithTitle
          placeholder={"Available Stock"}
          title={"Avialble Stock"}
        />
      </div>
      <div className="mt-5">
        <InputWithTitle
          placeholder={"Assign Stock"}
          title={"Assign Stock"}
          value={assignStock}
          onChange={setAssignStock}
        />
      </div>

      <div className="mt-5">
        <InputWithTitle
          placeholder={"Remaing Stock"}
          title={"Remaining Stock"}
          value={assignStock}
          onChange={setAssignStock}
        />
      </div>
      <div className="mt-10">
        <GreenButton title={"Submit"} />
      </div>
    </div>
  );
};

export default withAuth(Page);
