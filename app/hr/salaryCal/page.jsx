"use client";

import React, { useState } from "react";
import tableStyles from "../../../styles/upcomingJobsStyles.module.css";
import SearchInput from "@/components/generic/SearchInput";
import { Modal, Box, Typography, Button } from "@mui/material";

import InputWithTitle from "@/components/generic/InputWithTitle";

import styles from "../../../styles/salaryModal.module.css";

import GreenButton from "@/components/generic/GreenButton";

const Page = () => {
  const [employeeId, setEmployeeId] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const salaryCal = () => {
    return (
      <div>
        <div className="flex items-center justify-between">
          <div className="pageTitle">Salary Calculations</div>

          <div className="flex items-center">
            <div className="mr-5">
              <SearchInput />
            </div>

            <div
              style={{
                border: "1px solid #D0D5DD",
                borderRadius: "8px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "50px",
                width: "63px",
                marginRight: "2rem",
              }}
            >
              Filter
            </div>

            <GreenButton title={"+ Calculate"} onClick={handleOpenModal} />
          </div>
        </div>

        {salaryTable()}
      </div>
    );
  };

  const rows = Array.from({ length: 5 }, (_, index) => ({
    clientName: "Olivia Rhye",
    clientEmail: "ali@gmail.com",
    clientPhone: "0900 78601",
    service: "Pest Control",
    date: "5 May 2024",
    priority: "High",
    status: "Completed",
    teamCaptain: "Babar Azam",
    imageUrl: "/person.png",
  }));

  const salaryTable = () => {
    return (
      <div className={tableStyles.tableContainer}>
        <table className="min-w-full bg-white ">
          <thead>
            <tr>
              <th className="py-5 px-4 border-b border-gray-200 text-left">
                Sr.
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Employee Name
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Designation
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Attendance
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Commission
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Salary
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Receipt
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-5 px-4">{index + 1}</td>
                <td className="py-2 px-4">
                  <div className={tableStyles.clientName}>{row.clientName}</div>
                  <div className={tableStyles.clientEmail}>
                    {row.clientEmail}
                  </div>
                  <div className={tableStyles.clientPhone}>
                    {row.clientPhone}
                  </div>
                </td>
                <td className="py-2 px-4">{row.service}</td>
                <td className="py-2 px-4">{row.date}</td>
                <td className="py-2 px-4">{row.priority}</td>
                <td className="py-2 px-4">{row.status}</td>
                <td className="py-2 px-4">{row.teamCaptain}</td>
                <td className="py-2 px-4">{"View Statement"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div>
      <div className="mt-10 mb-10">{salaryCal()}</div>

      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 700,
            maxHeight: "90vh", // Adjust height as per your requirement
            overflowY: "auto", // Enable vertical scrolling
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            <div className={styles.modalHeader}>Salary Calculation</div>

            <div className={styles.modalDescrp}>Enter data here</div>
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <div className="mt-10" style={{ width: "100%" }}>
              <InputWithTitle
                title={"Employee Id"}
                type={"text"}
                name="name"
                placeholder={"Employee Id"}
                value={employeeId}
                onChange={setEmployeeId}
              />
            </div>

            <div className="mt-10" style={{ width: "100%" }}>
              <InputWithTitle
                title={"Designation"}
                type={"text"}
                name="name"
                placeholder={"Designation"}
                value={employeeId}
                onChange={setEmployeeId}
              />
            </div>

            <div className="mt-10" style={{ width: "100%" }}>
              <InputWithTitle
                title={"Attendence"}
                type={"text"}
                name="name"
                placeholder={"Attendence"}
                value={employeeId}
                onChange={setEmployeeId}
              />
            </div>

            <div className="mt-10" style={{ width: "100%" }}>
              <InputWithTitle
                title={"Comission"}
                type={"text"}
                name="name"
                placeholder={"Comission"}
                value={employeeId}
                onChange={setEmployeeId}
              />
            </div>

            <div className="mt-10" style={{ width: "100%" }}>
              <InputWithTitle
                title={"Salary"}
                type={"text"}
                name="name"
                placeholder={"Salary"}
                value={employeeId}
                onChange={setEmployeeId}
              />
            </div>
          </Typography>
          <div className="mt-5">
            <GreenButton
              title={"Save"}
            />
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default Page;
