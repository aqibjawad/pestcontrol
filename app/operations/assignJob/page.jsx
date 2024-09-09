"use client";
import React, { useState } from "react";
import styles from "../../../styles/operations/assignJobStyles.module.css";
import Dropdown from "@/components/generic/Dropdown";
import MultilineInput from "../../../components/generic/MultilineInput";
import GreenButton from "@/components/generic/GreenButton";
import Image from "next/image";
import { useRouter } from "next/navigation";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const Page = () => {
  const router = new useRouter();

  const [memberName, setMemberNames] = useState([
    "Umair",
    "Akbar",
    "Aslam",
    "Sajid",
    "Aqib",
  ]);

  const sampleData = [
    {
      id: 1,
      name: "John Doe",
      role: "Developer",
      email: "john.doe@example.com",
    },
    {
      id: 2,
      name: "Jane Smith",
      role: "Designer",
      email: "jane.smith@example.com",
    },
    {
      id: 3,
      name: "Bob Johnson",
      role: "Project Manager",
      email: "bob.johnson@example.com",
    },
  ];

  const userInforItem = (title, value) => {
    return (
      <div className="mt-10">
        <div className="flex mr-20 ml-20">
          <div className="flex-grow">
            <div className={styles.itemTitle}>{title}</div>
          </div>
          <div className={styles.itemValue}>{value}</div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="pageTitle">Assign Job</div>
      <div className="mt-20">
        {userInforItem("Job Title", "Pest Control Item")}
        {userInforItem("Region", "Duabi")}
        {userInforItem("Address", "JLT Marina Near Jumera Lake")}
        {userInforItem("Date", "5 May 2024")}
        {userInforItem("Client Contact", "090078601")}
      </div>

      <div className="flex justify-center align-center mt-20">
        <div className="pageTitle">Assign Crew Members</div>
      </div>

      <div className="mt-5">
        <div className="flex gap-20">
          <div className="flex-grow">
            <div className="mt-5">
              <Dropdown title={"Select Captain"} options={memberName} />
            </div>

            <div className="mt-5">
              <Dropdown title={"Add Crew Members"} options={memberName} />
            </div>
            <MultilineInput placeholder={"Job Details"} title={"Job Details"} />
          </div>

          <div className="flex-grow">
            <TableContainer
              component={Paper}
              style={{ marginTop: "20px", marginBottom: "20px" }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Members</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sampleData.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.role}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>

          <div className="flex-grow ">
            <div className="mr-10">
              <div className="pageTitle">Job Location </div>
              <img className="mt-10" src="/map.png" height={400} width={400} />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-10">
        <GreenButton
          onClick={() => {
            router.push("/viewJob");
          }}
          title={"Submit"}
        />
      </div>
    </div>
  );
};

export default Page;
