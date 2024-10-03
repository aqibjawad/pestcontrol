"use client";

import React, { useState, useEffect } from "react";
import Dropdown from "@/components/generic/Dropdown";
import MultilineInput from "../../../components/generic/MultilineInput";
import GreenButton from "@/components/generic/GreenButton";
import { useRouter, useSearchParams } from "next/navigation";
import APICall from "@/networkUtil/APICall";
import { job, getAllEmpoyesUrl } from "@/networkUtil/Constants";

import Swal from "sweetalert2";

import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  CircularProgress,
} from "@mui/material";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Skeleton,
  Grid,
} from "@mui/material";

const getIdFromUrl = (url) => {
  const parts = url.split('?');
  if (parts.length > 1) {
    const queryParams = parts[1].split('&');
    for (const param of queryParams) {
      const [key, value] = param.split('=');
      if (key === 'id') {
        return value;
      }
    }
  }
  return null;
};

const Page = () => {

  const router = useRouter();
  const api = new APICall();

  const [id, setId] = useState(null);

  const [fetchingData, setFetchingData] = useState(false);
  const [jobList, setJobList] = useState({});
  const [salesManagers, setSalesManagers] = useState([]);
  const [selectedManagerId, setSelectedManagerId] = useState("");
  const [managerNames, setManagerNames] = useState([]);
  const [selectedManagers, setSelectedManagers] = useState(new Set());

  const [loadingDetails, setLoadingDetails] = useState(true);
  const [loadingManagers, setLoadingManagers] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false); // New loading state

  useEffect(() => {
    // Get the current URL
    const currentUrl = window.location.href;
    
    const urlId = getIdFromUrl(currentUrl);
    setId(urlId);

    if (urlId) {
      getAllJobs(urlId);
    }
  }, []);


  useEffect(() => {
    getAllSalesManagers();
  }, []);

  const getAllJobs = async () => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(`${job}/${id}`);
      setJobList(response.data || {});
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setFetchingData(false);
      setLoadingDetails(false);
    }
  };

  const getAllSalesManagers = async () => {
    setLoadingManagers(true);
    try {
      const response = await api.getDataWithToken(
        `${getAllEmpoyesUrl}/sales_manager/get`
      );

      const managers = response.data || [];
      setSalesManagers(managers);

      if (managers.length) {
        const names = managers.map((manager) => manager.name);
        setManagerNames(names);
      }
    } catch (error) {
      console.error("Error fetching sales managers:", error);
    } finally {
      setLoadingManagers(false);
    }
  };

  const handleCaptainChange = (value) => {
    if (!value) return;

    const selectedCaptain = salesManagers.find(
      (manager) => manager.name === value
    );

    if (selectedCaptain) {
      setFormData((prev) => ({
        ...prev,
        captain_id: selectedCaptain.id,
      }));
    }
  };

  const handleTeamMemberChange = (managerId) => {
    setFormData((prev) => {
      const updatedTeamMembers = prev.team_member_ids.includes(managerId)
        ? prev.team_member_ids.filter((id) => id !== managerId)
        : [...prev.team_member_ids, managerId];

      return {
        ...prev,
        team_member_ids: updatedTeamMembers,
      };
    });
  };

  const handleJobInstructionsChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      job_instructions: value,
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const [formData, setFormData] = useState({
    job_id: id,
    captain_id: "",
    team_member_ids: [],
    job_instructions: "",
  });

  const handleSubmit = async () => {
    setLoadingSubmit(true); // Start loading
    try {
      const endpoint = `${job}/sales_manager/assign`;
      const response = await api.postFormDataWithToken(endpoint, formData);
      if (response.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Data has been added successfully!",
        });
        router.push(`/viewJob?=${id}`);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to submit data. Please try again.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "An error occurred.",
      });
      console.error("Error submitting data:", error);
    } finally {
      setLoadingSubmit(false); // End loading
    }
  };

  const handleCheckboxChange = (managerId) => {
    setSelectedManagers((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(managerId)) {
        newSelected.delete(managerId);
      } else {
        newSelected.add(managerId);
      }
      return newSelected;
    });
  };

  return (
    <div>
      <div className="pageTitle">Assign Job</div>

      <div className="mt-20">
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Detail</TableCell>
                <TableCell>Information</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Job Title</TableCell>
                <TableCell>{jobList.job_title || "N/A"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Region</TableCell>
                <TableCell>Dubai</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>{formatDate(jobList.updated_at)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Client Contact</TableCell>
                <TableCell>
                  {jobList?.user?.client?.phone_number || "N/A"}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <div className="flex justify-center align-center mt-20">
        <div className="pageTitle">Assign Crew Members</div>
      </div>

      <div className="mt-5">
        <div className="flex gap-20">
          <div className="flex-grow">
            <div className="mt-5">
              {loadingManagers ? (
                <Skeleton variant="rect" width="100%" height={56} />
              ) : (
                <Dropdown
                  onChange={handleCaptainChange}
                  title="Select Captain"
                  options={managerNames.map((name) => ({
                    value: name,
                    label: name,
                  }))}
                />
              )}
            </div>

            <div className="mt-5">
              {loadingManagers ? (
                <CircularProgress />
              ) : (
                <Grid container spacing={2}>
                  {salesManagers.map((manager) => (
                    <Grid item key={manager.id} xs={3}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.team_member_ids.includes(
                              manager.id
                            )}
                            onChange={() => handleTeamMemberChange(manager.id)}
                          />
                        }
                        label={manager.name}
                      />
                    </Grid>
                  ))}
                </Grid>
              )}
            </div>

            <MultilineInput
              placeholder="Job Details"
              title="Job Details"
              value={formData.job_instructions}
              onChange={handleJobInstructionsChange}
            />
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
                    <TableCell>Role</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loadingDetails ? (
                    <TableRow>
                      <TableCell colSpan={3} style={{ textAlign: "center" }}>
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : jobList.crew_members &&
                    jobList.crew_members.length > 0 ? (
                    jobList.crew_members.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>{member.id}</TableCell>
                        <TableCell>{member.name}</TableCell>
                        <TableCell>{member.role}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} style={{ textAlign: "center" }}>
                        No crew members assigned
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>

          <div className="flex-grow">
            <div className="mr-10">
              <div className="pageTitle">Job Location</div>
              <img
                className="mt-10"
                src="/map.png"
                alt="Job location map"
                height={400}
                width={400}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <GreenButton
          onClick={handleSubmit}
          title={loadingSubmit ? "Submitting..." : "Submit"}
        />
        {loadingSubmit && (
          <CircularProgress size={24} style={{ marginLeft: 10 }} />
        )}
      </div>
    </div>
  );
};

export default Page;
