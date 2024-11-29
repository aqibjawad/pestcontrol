"use client";

import React from "react";
import EmpUpcomingJobs from "./upComing";

const Page = () => {
  const getAllEmployees = async (employeeId) => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(
        `${getAllEmpoyesUrl}/${employeeId}`
      );
      setEmployeeList(response.data);

      setEmployeeCompany(response.data.captain_all_jobs);
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setFetchingData(false);
    }
  };

  return <EmpUpcomingJobs />;
};

export default Page;
