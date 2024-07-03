"use client";

import React, { useState } from "react";

import MultilineInput from "@/components/generic/MultilineInput";
import InputWithTitle from "@/components/generic/InputWithTitle";

const SecondSection = () => {
  const [name, setName] = useState("");

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  return (
    <div>
      <div className="mt-5">
        <MultilineInput
          title={"Description"}
          type={"text"}
          placeholder={"Enter description"}
          value={name}
          onChange={handleNameChange}
        />
      </div>

      <div className="mt-10" >
        <InputWithTitle
          title={"TRN"}
          type={"text"}
          name="name"
          placeholder={"TRN"}
          value={name}
          onChange={handleNameChange}
        />
      </div>

      <div className="mt-10">
        <InputWithTitle
          title={"Tag"}
          type={"text"}
          name="name"
          placeholder={"Tag"}
          value={name}
          onChange={handleNameChange}
        />
      </div>

      <div className="mt-10">
        <InputWithTitle
          title={"Duration in Month"}
          type={"text"}
          name="name"
          placeholder={"Duration in Month"}
          value={name}
          onChange={handleNameChange}
        />
      </div>

      <div className="mt-10">
        <InputWithTitle
          title={"Tag"}
          type={"text"}
          name="name"
          placeholder={"Tag"}
          value={name}
          onChange={handleNameChange}
        />
      </div>

      <div className="mt-10">
        <InputWithTitle
          title={"Food Watch Account"}
          type={"text"}
          name="name"
          placeholder={"Food Watch Account"}
          value={name}
          onChange={handleNameChange}
        />
      </div>

    </div>
  );
};

export default SecondSection;
