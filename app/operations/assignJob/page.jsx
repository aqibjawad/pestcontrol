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
  Card,
  CardContent,
  Typography,
  IconButton,
} from "@mui/material";

import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";

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

// Individual Crew Assignment Component
const CrewAssignmentSection = ({ 
  index, 
  crewData, 
  salesManagers, 
  managerNames, 
  loadingManagers, 
  onCrewChange, 
  onRemove, 
  canRemove,
  usedManagerIds 
}) => {
  const handleCaptainChange = (value) => {
    if (!value) {
      onCrewChange(index, {
        ...crewData,
        captain_id: null,
        captain_name: "",
        team_member_ids: crewData.team_member_ids
      });
      return;
    }

    const selectedCaptain = salesManagers.find(
      (manager) => manager.name === value
    );

    if (selectedCaptain) {
      onCrewChange(index, {
        ...crewData,
        captain_id: selectedCaptain.id,
        captain_name: value,
        team_member_ids: crewData.team_member_ids.filter(
          (id) => id !== selectedCaptain.id
        )
      });
    }
  };

  // Filter out managers that are already used in other crew assignments
  const getAvailableCaptainOptions = () => {
    return managerNames.filter(name => {
      const manager = salesManagers.find(m => m.name === name);
      if (!manager) return false;
      
      // Include current captain or managers not used elsewhere
      return manager.id === crewData.captain_id || !usedManagerIds.includes(manager.id);
    });
  };

  const getAvailableTeamMembers = () => {
    return salesManagers.filter(manager => {
      // Exclude current captain and managers used in other assignments
      return manager.id !== crewData.captain_id && 
             (crewData.team_member_ids.includes(manager.id) || !usedManagerIds.includes(manager.id));
    });
  };

  const handleTeamMemberChange = (managerId) => {
    if (managerId === crewData.captain_id) return;

    const updatedTeamMembers = crewData.team_member_ids.includes(managerId)
      ? crewData.team_member_ids.filter((id) => id !== managerId)
      : [...crewData.team_member_ids, managerId];

    onCrewChange(index, {
      ...crewData,
      team_member_ids: updatedTeamMembers
    });
  };

  const handleJobInstructionsChange = (value) => {
    onCrewChange(index, {
      ...crewData,
      job_instructions: value
    });
  };

  return (
    <Card className="mb-4" variant="outlined">
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <Typography variant="h6" component="h3">
            Crew Assignment {index + 1}
          </Typography>
          {canRemove && (
            <IconButton 
              onClick={() => onRemove(index)}
              color="error"
              size="small"
            >
              <DeleteIcon />
            </IconButton>
          )}
        </div>

        <Grid container spacing={3}>
          <Grid item lg={8} xs={12} md={8}>
            <div className="mt-5">
              {loadingManagers ? (
                <Skeleton variant="rect" width="100%" height={56} />
              ) : (
                <Dropdown2
                  onChange={handleCaptainChange}
                  title="Select Captain"
                  value={crewData.captain_name}
                  options={getAvailableCaptainOptions().map((name) => ({
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
                  {getAvailableTeamMembers().map((manager) => (
                    <Grid item key={manager.id} xs={6} sm={4} md={3}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={crewData.team_member_ids.includes(
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
                  ))}
                </Grid>
              )}
            </div>
          </Grid>

          <Grid item lg={4} xs={12} md={4}>
            <MultilineInput
              placeholder="Caption Instructions"
              title="Caption Instructions"
              value={crewData.job_instructions}
              onChange={handleJobInstructionsChange}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
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

  // Multiple crew assignments state
  const [crewAssignments, setCrewAssignments] = useState([
    {
      captain_id: null,
      captain_name: "",
      team_member_ids: [],
      job_instructions: ""
    }
  ]);

  useEffect(() => {
    const currentUrl = window.location.href;
    const urlId = getIdFromUrl(currentUrl);
    setId(urlId);
  }, []);

  useEffect(() => {
    if (id !== undefined && id !== null) {
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

  // Get all manager IDs that are currently used across all crew assignments
  const getUsedManagerIds = () => {
    const allUsedIds = [];
    crewAssignments.forEach(crew => {
      if (crew.captain_id) allUsedIds.push(crew.captain_id);
      allUsedIds.push(...crew.team_member_ids);
    });
    return allUsedIds;
  };

  const handleCrewChange = (index, updatedCrew) => {
    setCrewAssignments(prev => 
      prev.map((crew, i) => i === index ? updatedCrew : crew)
    );
  };

  const addNewCrewAssignment = () => {
    setCrewAssignments(prev => [
      ...prev,
      {
        captain_id: null,
        captain_name: "",
        team_member_ids: [],
        job_instructions: ""
      }
    ]);
  };

  const removeCrewAssignment = (index) => {
    if (crewAssignments.length > 1) {
      setCrewAssignments(prev => prev.filter((_, i) => i !== index));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleSubmit = async () => {
    // Validate that at least one crew has a captain assigned
    const validCrews = crewAssignments.filter(crew => crew.captain_id);
    
    if (validCrews.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Please assign at least one captain to proceed.",
      });
      return;
    }

    setLoadingSubmit(true);
    try {
      const formData = {
        job_id: id,
        crew_assignments: crewAssignments.filter(crew => crew.captain_id) // Only send crews with captains
      };

      const endpoint = `${job}/sales_manager/assign`;
      const response = await api.postFormDataWithToken(endpoint, formData);
      
      if (response.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Crew assignments have been added successfully!",
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

      <div className="mt-2">
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
                <TableCell>Firm Name</TableCell>
                <TableCell>
                  {jobList.user?.client?.firm_name || "N/A"}
                </TableCell>
              </TableRow>
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
              <TableRow>
                <TableCell>Price</TableCell>
                <TableCell>{jobList?.sub_total || "N/A"}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <div className="flex justify-center align-center mt-3">
        <div className="pageTitle">Assign Crew Members</div>
      </div>

      <div className="mt-5">
        {crewAssignments.map((crew, index) => (
          <CrewAssignmentSection
            key={index}
            index={index}
            crewData={crew}
            salesManagers={salesManagers}
            managerNames={managerNames}
            loadingManagers={loadingManagers}
            onCrewChange={handleCrewChange}
            onRemove={removeCrewAssignment}
            canRemove={crewAssignments.length > 1}
            usedManagerIds={getUsedManagerIds()}
          />
        ))}

        <div className="mt-4 mb-6">
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={addNewCrewAssignment}
            className="w-full"
            style={{ 
              borderColor: '#4CAF50', 
              color: '#4CAF50',
              '&:hover': {
                borderColor: '#45a049',
                backgroundColor: '#f1f8e9'
              }
            }}
          >
            Add Another Crew Assignment
          </Button>
        </div>
      </div>

      <div className="mt-10">
        <GreenButton
          onClick={handleSubmit}
          title={loadingSubmit ? "Submitting..." : "Assign Jobs"}
        />
        {loadingSubmit && (
          <CircularProgress size={24} style={{ marginLeft: 10 }} />
        )}
      </div>
    </div>
  );
};

export default withAuth(Page);