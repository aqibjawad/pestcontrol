import React from "react";

import InputWithTitle from "@/components/generic/InputWithTitle";

import "./index.css";

const OtherInfo = ({ data, onChange }) => {
  return (
    <div>
      {/* First Section */}
      <div>
        <div className="health-head">Emergency Contact</div>

        <div
          className="grid grid-cols-12 gap-4"
          style={{ width: "100%", maxWidth: "1200px" }}
        >
          <div className="col-span-4">
            <div className="flex flex-wrap justify-between">
              <div className="mt-5" style={{ width: "100%" }}>
                <InputWithTitle
                  title={"Name and Contact"}
                  type={"text"}
                  placeholder={"Name and Contact"}
                  value={data.relative_name}
                  onChange={(e) => onChange("relative_name")}
                />
              </div>
            </div>
          </div>

          <div className="col-span-4">
            <div className="flex flex-wrap justify-between">
              <div className="mt-5" style={{ width: "100%" }}>
                <InputWithTitle
                  title={"Relation"}
                  type={"text"}
                  placeholder={"Relation"}
                  value={data.relation}
                  onChange={(e) => onChange("relation")}
                />
              </div>
            </div>
          </div>

          <div className="col-span-4">
            <div className="flex flex-wrap justify-between">
              <div className="mt-5" style={{ width: "100%" }}>
                <InputWithTitle
                  title={" Emergency Contact (Home Country"}
                  type={"text"}
                  placeholder={" Emergency Contact (Home Country"}
                  value={data.emergency_contact}
                  onChange={(e) => onChange("emergency_contact")}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="health-head">Financial condition</div>

        <div
          className="grid grid-cols-12 gap-4"
          style={{ width: "100%", maxWidth: "1200px" }}
        >
          <div className="col-span-12">
            <div className="flex flex-wrap justify-between">
              <div className="mt-5" style={{ width: "48%" }}>
                <InputWithTitle
                  title={"Basic Salary"}
                  type={"text"}
                  placeholder={"Basic Salary"}
                  value={data.basic_salary}
                  onChange={(e) => onChange("basic_salary")}
                />
              </div>
              <div className="mt-5" style={{ width: "48%" }}>
                <InputWithTitle
                  title={"Allowance"}
                  type={"text"}
                  placeholder={"Allowance"}
                  value={data.allowance}
                  onChange={(e) => onChange("allowance")}
                />
              </div>
            </div>
          </div>
        </div>

        <div
          className="grid grid-cols-12 gap-4"
          style={{ width: "100%", maxWidth: "1200px" }}
        >
          <div className="col-span-12">
            <div className="flex flex-wrap justify-between">
              <div className="mt-5" style={{ width: "48%" }}>
                <InputWithTitle
                  title={"Other"}
                  type={"text"}
                  placeholder={"Other"}
                  value={data.other}
                  onChange={(e) => onChange("other")}
                />
              </div>
              <div className="mt-5" style={{ width: "48%" }}>
                <InputWithTitle
                  title={"Total Salary"}
                  type={"text"}
                  placeholder={"Total Salary"}
                  value={data.total_salary}
                  onChange={(e) => onChange("total_salary")}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="info-button">Save Information</div>
      </div>
    </div>
  );
};

export default OtherInfo;
