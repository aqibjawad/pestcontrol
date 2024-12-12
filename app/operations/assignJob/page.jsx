"use client";

import React, { useState, useEffect } from "react";
import Dropdown2 from "../../../components/generic/DropDown2";
import MultilineInput from "../../../components/generic/MultilineInput";
import GreenButton from "@/components/generic/GreenButton";
import { useRouter } from "next/navigation";
import APICall from "@/networkUtil/APICall";
import { job, getAllEmpoyesUrl } from "@/networkUtil/Constants";
import withAuth from "@/utils/withAuth";

import Swal from "sweetalert2";

import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Skeleton,
  Grid,
  Button,
} from "@mui/material";

import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const getIdFromUrl = (url) => {
  const parts = url.split("?");
  if (parts.length > 1) {
    const queryParams = parts[1].split("&");
    for (const param of queryParams) {
      const [key, value] = param.split("=");
      if (key === "id") {
        return value;
      }
    }
  }
  return null;
};

const Page = () => {
  const router = useRouter();
  const api = new APICall();

  const [id, setId] = useState();
  const [fetchingData, setFetchingData] = useState(false);
  const [jobList, setJobList] = useState({});
  const [salesManagers, setSalesManagers] = useState([]);
  const [managerNames, setManagerNames] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [loadingManagers, setLoadingManagers] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [jobStatus, setJobStatus] = useState("not_started");
  const [selectedCaptainId, setSelectedCaptainId] = useState(null);
  const [selectedCaptainName, setSelectedCaptainName] = useState("");

  useEffect(() => {
    const currentUrl = window.location.href;
    const urlId = getIdFromUrl(currentUrl);
    setId(urlId);
  }, []);

  useEffect(() => {
    if (id !== undefined && id !== null) {
      setFormData((prev) => ({
        ...prev,
        job_id: id,
      }));
      getAllJobs();
    }
  }, [id]);

  useEffect(() => {
    getAllSalesManagers();
  }, []);

  const getAllJobs = async () => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(`${job}/${id}`);
      setJobList(response.data || {});
      setJobStatus(response.data.status || "not_started");
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
    if (!value) {
      setSelectedCaptainId(null);
      setSelectedCaptainName(""); // Clear the captain name
      return;
    }

    const selectedCaptain = salesManagers.find(
      (manager) => manager.name === value
    );

    if (selectedCaptain) {
      setSelectedCaptainId(selectedCaptain.id);
      setSelectedCaptainName(value); // Set the captain name
      setFormData((prev) => ({
        ...prev,
        captain_id: selectedCaptain.id,
        team_member_ids: prev.team_member_ids.filter(
          (id) => id !== selectedCaptain.id
        ),
      }));
    }
  };

  const handleTeamMemberChange = (managerId) => {
    if (managerId === selectedCaptainId) return;

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
    setLoadingSubmit(true);
    try {
      const endpoint = `${job}/sales_manager/assign`;
      const response = await api.postFormDataWithToken(endpoint, formData);
      if (response.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Data has been added successfully!",
        });
        router.back();
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
      setLoadingSubmit(false);
    }
  };

  const mapContainerStyle = {
    height: "400px",
    width: "100%",
  };

  const lat = parseFloat(jobList?.client_address?.lat);
  const lng = parseFloat(jobList?.client_address?.lang);

  const center = {
    lat: lat,
    lng: lng,
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
                <TableCell>{formatDate(jobList.job_date)}</TableCell>
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
        <Grid container spacing={3}>
          <Grid item lg={8} xs={12} md={4}>
            <div className="mt-5">
              {loadingManagers ? (
                <Skeleton variant="rect" width="100%" height={56} />
              ) : (
                <Dropdown2
                  onChange={handleCaptainChange}
                  title="Select Captain"
                  value={selectedCaptainName} // Add this prop
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
                  {salesManagers.map(
                    (manager) =>
                      // Only render checkbox if manager is not the selected captain
                      manager.id !== selectedCaptainId && (
                        <Grid item key={manager.id} xs={6} sm={4} md={3}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={formData.team_member_ids.includes(
                                  manager.id
                                )}
                                onChange={() =>
                                  handleTeamMemberChange(manager.id)
                                }
                              />
                            }
                            label={manager.name}
                          />
                        </Grid>
                      )
                  )}
                </Grid>
              )}
            </div>

            <MultilineInput
              placeholder="Job Details"
              title="Job Details"
              value={formData.job_instructions}
              onChange={handleJobInstructionsChange}
            />

            <div>
              {jobList.reschedule_dates?.length > 1 ? (
                // Show a time input field instead of "Reschedule"
                <input
                  type="time"
                  style={{ fontSize: "15px" }}
                  placeholder="Select Time"
                />
              ) : (
                <span style={{ fontSize: "15px" }}>Regular Job</span>
              )}
            </div>
          </Grid>

          <Grid item lg={12} xs={12} md={4}>
            <div className="mr-10">
              <div className="pageTitle">Job Location</div>
              <LoadScript googleMapsApiKey="AIzaSyBHNqsXFQqg_-f6BkI5UH7X7nXK2KQzk8">
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={center}
                  zoom={15}
                >
                  <Marker position={center} />
                </GoogleMap>
              </LoadScript>
            </div>
          </Grid>
        </Grid>
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

export default withAuth(Page);
