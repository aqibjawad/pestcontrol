"use client";

import React, { useState, useEffect } from "react";
import ServiceReport from "@/app/allServiceReports/serviceReport";
import ProductReport from "../allServiceReports/serviceReport";
import ServiceProductReport from "../allServiceReports/products";

const serviceReport = () => {
  return (
    <div style={{ padding: "30px" }}>
      <div
        style={{
          fontSize: "20px",
          fontFamily: "semibold",
          marginBottom: "0.5rem",
        }}
      >
        Services report
      </div>
      <ServiceReport />
    </div>
  );
};

const productReport = () => {
  return (
    <div style={{ padding: "30px" }}>
      <div
        style={{
          fontSize: "20px",
          fontFamily: "semibold",
          marginBottom: "0.5rem",
        }}
      >
        Product Report
      </div>
      <ProductReport />
    </div>
  );
};


const ServiceReports = () => {
  return (
    <div style={{ padding: "30px" }}>
      <ServiceProductReport />
    </div>
  );
};


const Reports = () => {
  return (
    <div>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">{serviceReport()}</div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">{productReport()}</div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">{ServiceReports()}</div>
      </div>
    </div>
  );
};

export default Reports;
