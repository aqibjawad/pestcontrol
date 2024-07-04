import React, { useState } from "react";
import tableStyles from "../../../../styles/upcomingJobsStyles.module.css";
import SearchInput from "@/components/generic/SearchInput";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

import styles from "../../../../styles/loginStyles.module.css";

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
              Firm Name
            </th>
            <th className="py-2 px-4 border-b border-gray-200 text-left">
              Manager Name
            </th>
            <th className="py-2 px-4 border-b border-gray-200 text-left">
              Contact Number
            </th>
            <th className="py-2 px-4 border-b border-gray-200 text-left">
              Accountant Name
            </th>
            <th className="py-2 px-4 border-b border-gray-200 text-left">
              Accountant Number
            </th>
            <th className="py-2 px-4 border-b border-gray-200 text-left">
              Accountant Email
            </th>
            <th className="py-2 px-4 border-b border-gray-200 text-left">
              Percentage
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

const Vendor = () => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
          Vendors
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
              + Vendors
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
              Add Vendor
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

            <div>
              <div className={styles.userFormContainer}>
                <div
                  style={{
                    color: "#344054",
                    fontSize: "16px",
                    marginBottom: "0.5rem",
                  }}
                >
                  Firm name
                </div>
                <div>
                  <input
                    type="email"
                    style={{
                      border: "1px solid #38A73B",
                      borderRadius: "8px",
                      padding: "12px 16px",
                      width: "489px",
                      height: "49px",
                    }}
                    placeholder="Please enter email"
                  />
                </div>
              </div>
            </div>

            {/* Manager Area */}
            <div
              className={styles.userFormContainer}
              style={{ fontSize: "16px" }}
            >
              <div style={{ color: "#344054", marginBottom: "0.5rem" }}>
                Manager
              </div>
              <div
                style={{
                  display: "                        flex",
                  justifyContent: "space-between",
                  gap: "1rem",
                  marginTop: "1rem",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ marginBottom: "0.5rem", color: "#344054" }}>
                    {" "}
                    Manager name{" "}
                  </label>
                  <input
                    type="text"
                    style={{
                      border: "1px solid #38A73B",
                      borderRadius: "8px",
                      padding: "12px 16px",
                      width: "100%",
                      height: "49px",
                      boxSizing: "border-box",
                    }}
                    placeholder=" Manager name "
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ marginBottom: "0.5rem", color: "#344054" }}>
                    {" "}
                    Contact number{" "}
                  </label>
                  <input
                    type="text"
                    style={{
                      border: "1px solid #38A73B",
                      borderRadius: "8px",
                      padding: "12px 16px",
                      width: "100%",
                      height: "49px",
                      boxSizing: "border-box",
                    }}
                    placeholder="Contact number"
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ marginBottom: "0.5rem", color: "#344054" }}>
                    Email
                  </label>
                  <input
                    type="email"
                    style={{
                      border: "1px solid #38A73B",
                      borderRadius: "8px",
                      padding: "12px 16px",
                      width: "100%",
                      height: "49px",
                      boxSizing: "border-box",
                    }}
                    placeholder="Email"
                  />
                </div>
              </div>
            </div>

            {/* Accountant Area */}
            <div
              className={styles.userFormContainer}
              style={{ fontSize: "16px" }}
            >
              <div style={{ color: "#344054", marginBottom: "0.5rem" }}>
                Accountant
              </div>
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
                    style={{
                      border: "1px solid #38A73B",
                      borderRadius: "8px",
                      padding: "12px 16px",
                      width: "100%",
                      height: "49px",
                      boxSizing: "border-box",
                    }}
                    placeholder=" Manager name "
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ marginBottom: "0.5rem", color: "#344054" }}>
                    {" "}
                    Contact number{" "}
                  </label>
                  <input
                    type="text"
                    style={{
                      border: "1px solid #38A73B",
                      borderRadius: "8px",
                      padding: "12px 16px",
                      width: "100%",
                      height: "49px",
                      boxSizing: "border-box",
                    }}
                    placeholder="Contact number"
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ marginBottom: "0.5rem", color: "#344054" }}>
                    Email
                  </label>
                  <input
                    type="email"
                    style={{
                      border: "1px solid #38A73B",
                      borderRadius: "8px",
                      padding: "12px 16px",
                      width: "100%",
                      height: "49px",
                      boxSizing: "border-box",
                    }}
                    placeholder="Email"
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
                  Percentage
                </div>
                <div style={{ position: "relative", width: "489px" }}>
                  <input
                    type="text"
                    style={{
                      border: "1px solid #38A73B",
                      borderRadius: "8px",
                      padding: "12px 16px 12px 40px", // Adjust padding for the image
                      width: "100%",
                      height: "49px",
                      boxSizing: "border-box",
                    }}
                    placeholder="Please enter Percentage"
                  />
                  <img
                    src="/Vector.png"
                    alt="icon"
                    style={{
                      position: "absolute",
                      left: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "24px",
                      height: "24px",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions style={{ justifyContent: "center" }}>
          <div
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
            }}
          >
            Add Vendor
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Vendor;
