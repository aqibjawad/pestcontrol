"use client";

import React, { useState } from "react";

const TreatmentMethod = () => {
  const [agreements, setAgreements] = useState([
    { id: 1, text: "Agreement 1", checked: false },
    { id: 2, text: "Agreement 2", checked: false },
    { id: 3, text: "Agreement 3", checked: false }
  ]);

  const handleCheckboxChange = (id) => {
    setAgreements((prevAgreements) =>
      prevAgreements.map((agreement) =>
        agreement.id === id
          ? { ...agreement, checked: !agreement.checked }
          : agreement
      )
    );
  };

  return (
    <div>
      <h1 className="mt-5"> Treatment Method </h1>
      <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
        {agreements.map((agreement) => (
          <div key={agreement.id} style={{ display: "flex", alignItems: "center" }}>
            <input
              type="checkbox"
              checked={agreement.checked}
              onChange={() => handleCheckboxChange(agreement.id)}
            />
            <label style={{ marginLeft: "0.5rem" }}>{agreement.text}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TreatmentMethod;
