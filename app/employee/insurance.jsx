import React from "react";

import InputWithTitle from "@/components/generic/InputWithTitle";

import "./index.css";

const Insurance = ({ data, onChange }) => {
  return (
    <div>
      {/* First Section */}
      <div>
        <div className="health-head">Health Insurance</div>
        <div className="mt-5" style={{ width: "1000px" }}>
          <InputWithTitle
            title={"Health Insurance Status"}
            type={"text"}
            placeholder={"Health Insurance Status"}
            value={data.hi_status}
            onChange={(e) => onChange("hi_status")}
          />
        </div>

        <div
          className="grid grid-cols-12 gap-4"
          style={{ width: "100%", maxWidth: "1200px" }}
        >
          <div className="col-span-12">
            <div className="flex flex-wrap justify-between">
              <div className="mt-5" style={{ width: "48%" }}>
                <InputWithTitle
                  title={"Insurance Start"}
                  type={"date"}
                  placeholder={"Insurance Start"}
                  value={data.hi_start}
                  onChange={(e) => onChange("hi_start")}
                />
              </div>
              <div className="mt-5" style={{ width: "48%" }}>
                <InputWithTitle
                  title={"Insurrance Expiry"}
                  type={"text"}
                  placeholder={"Insurrance Expiry"}
                  value={data.hi_expiry}
                  onChange={(e) => onChange("hi_expiry")}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="health-head">Unemployment insurance</div>

        <div className="mt-5" style={{ width: "1000px" }}>
          <InputWithTitle
            title={"Unemployment Insurance  Status"}
            type={"text"}
            placeholder={"Unemployment Insurance  Status"}
            value={data.ui_status}
            onChange={(e) => onChange("ui_status")}
          />
        </div>

        <div
          className="grid grid-cols-12 gap-4"
          style={{ width: "100%", maxWidth: "1200px" }}
        >
          <div className="col-span-12">
            <div className="flex flex-wrap justify-between">
              <div className="mt-5" style={{ width: "48%" }}>
                <InputWithTitle
                  title={"Insurance Start"}
                  type={"date"}
                  placeholder={"Insurance Start"}
                  value={data.ui_start}
                  onChange={(e) => onChange("ui_start")}
                />
              </div>
              <div className="mt-5" style={{ width: "48%" }}>
                <InputWithTitle
                  title={"Insurrance Expiry"}
                  type={"text"}
                  placeholder={"Insurrance Expiry"}
                  value={data.ui_expiry}
                  onChange={(e) => onChange("ui_expiry")}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5" style={{ width: "1000px" }}>
          <InputWithTitle
            title={"DM Card"}
            type={"text"}
            placeholder={"DM Card"}
            value={data.dm_card}
            onChange={(e) => onChange("dm_card")}
          />
        </div>

        <div className="mt-5" style={{ width: "1000px" }}>
          <InputWithTitle
            title={"Card Start"}
            type={"date"}
            placeholder={"Card Start"}
            value={data.dm_start}
            onChange={(e) => onChange("dm_start")}
          />
        </div>

        <div className="mt-5" style={{ width: "1000px" }}>
          <InputWithTitle
            title={"Card Expiry"}
            type={"date"}
            placeholder={"Card Expiry"}
            value={data.dm_expiry}
            onChange={(e) => onChange("dm_expiry")}
          />
        </div>
      </div>
    </div>
  );
};

export default Insurance;
