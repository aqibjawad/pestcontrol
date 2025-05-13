"use client";

import React, { useState, useEffect } from "react";
import styles from "../../styles/serviceReport.module.css";
import AddService from "../../components/addService";
import APICall from "@/networkUtil/APICall";
import { treatmentMethod, services } from "@/networkUtil/Constants";
import Grid from "@mui/material/Grid";
import { FaTrash, FaEdit } from "react-icons/fa";

const Area = ({ formData, setFormData, serviceReport }) => {
  const api = new APICall();

  const [open, setOpen] = useState(false);
  const [addresses, setServiceAreas] = useState([]);
  const [methodList, setMethodList] = useState([]);
  const [servicesList, setServicesList] = useState([]);
  const [selectedPests, setSelectedPests] = useState([]);
  const [selectedMethods, setSelectedMethods] = useState([]);

  // New state for editing
  const [editingArea, setEditingArea] = useState(null);

  // Initialization useEffect
  useEffect(() => {
    const initializeAddresses = () => {
      let initialAddresses = [];

      // First, check if there are existing addresses in formData
      if (formData && formData.addresses && Array.isArray(formData.addresses)) {
        initialAddresses = formData.addresses.map((addr) => ({
          ...addr,
          id: addr.id || Date.now(),
        }));
      }

      // Then, merge with addresses from serviceReport if they exist
      if (
        serviceReport &&
        serviceReport.areas &&
        Array.isArray(serviceReport.areas)
      ) {
        const serviceReportAreas = serviceReport.areas.map((area) => ({
          id: area.id || Date.now(),
          inspected_areas: area.inspected_areas || "Unknown",
          pest_found: area.pest_found || "Unknown",
          pest_id: area.pest_id || null,
          infestation_level: area.infestation_level || "Not Specified",
          manifested_areas: area.manifested_areas || "Not Defined",
          report_and_follow_up_detail:
            area.report_and_follow_up_detail || "No Details",
        }));

        // Merge without duplicates
        initialAddresses = [
          ...initialAddresses,
          ...serviceReportAreas.filter(
            (serviceArea) =>
              !initialAddresses.some((addr) => addr.id === serviceArea.id)
          ),
        ];
      }

      // Remove any potential duplicates
      const uniqueAddresses = initialAddresses.filter(
        (area, index, self) => index === self.findIndex((t) => t.id === area.id)
      );

      return uniqueAddresses;
    };

    const initializedAddresses = initializeAddresses();
    setServiceAreas(initializedAddresses);

    if (formData) {
      setSelectedPests(formData.pest_found_ids || []);
      setSelectedMethods(formData.tm_ids || []);
    }

    getAllMethods();
    getAllPests();
  }, [serviceReport, formData]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setEditingArea(null); // Reset editing area when closing
  };

  const getAllMethods = async () => {
    try {
      const response = await api.getDataWithToken(`${treatmentMethod}`);
      setMethodList(response.data || []);
    } catch (error) {
      console.error("Error fetching treatment methods:", error);
      setMethodList([]);
    }
  };

  const getAllPests = async () => {
    try {
      const response = await api.getDataWithToken(`${services}`);
      setServicesList(response.data || []);
    } catch (error) {
      console.error("Error fetching services/pests:", error);
      setServicesList([]);
    }
  };

  const handleAddService = (newService) => {
    // Check if we're editing an existing area or adding a new one
    if (editingArea) {
      // Update existing area
      const updatedAddresses = addresses.map((area) =>
        area.id === editingArea.id ? { ...newService } : area
      );
      setServiceAreas(updatedAddresses);
      updateFormData(updatedAddresses, selectedPests, selectedMethods);
    } else {
      // Add new area
      const updatedAddresses = [
        ...addresses,
        {
          ...newService,
          id: Date.now(),
        },
      ];

      setServiceAreas(updatedAddresses);

      // Update selected pests if a new pest is added
      const updatedPests =
        newService.pest_id && !selectedPests.includes(newService.pest_id)
          ? [...selectedPests, newService.pest_id]
          : selectedPests;

      setSelectedPests(updatedPests);

      updateFormData(updatedAddresses, updatedPests, selectedMethods);
    }

    // Reset editing state
    setEditingArea(null);
  };

  const handleEditArea = (area) => {
    setEditingArea(area);
    setOpen(true);
  };

  const handleDeleteArea = (areaId) => {
    const updatedAddresses = addresses.filter((area) => area.id !== areaId);
    setServiceAreas(updatedAddresses);
    updateFormData(updatedAddresses, selectedPests, selectedMethods);
  };

  const handlePestToggle = (pestId) => {
    const updatedPests = selectedPests.includes(pestId)
      ? selectedPests.filter((id) => id !== pestId)
      : [...selectedPests, pestId];

    setSelectedPests(updatedPests);
    updateFormData(addresses, updatedPests, selectedMethods);
  };

  const handleMethodToggle = (methodId) => {
    const updatedMethods = selectedMethods.includes(methodId)
      ? selectedMethods.filter((id) => id !== methodId)
      : [...selectedMethods, methodId];

    setSelectedMethods(updatedMethods);
    updateFormData(addresses, selectedPests, updatedMethods);
  };

  const updateFormData = (updatedAddresses, updatedPests, updatedMethods) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      addresses: updatedAddresses,
      pest_found_ids: updatedPests,
      tm_ids: updatedMethods,
    }));
  };

  return (
    <div>
      <div className="flex justify-between" style={{ padding: "34px" }}>
        <div className="flex flex-col">
          <div className={styles.areaHead}>Areas</div>
        </div>

        <div className="flex flex-col">
          <div onClick={handleOpen} className={styles.areaButton}>
            + Area
          </div>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Sr No.</th>
              <th>Pest Found</th>
              <th>Treatment Area</th>
              <th>Main Infected areas</th>
              <th>Report and follow up detail</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {addresses.length > 0 ? (
              addresses.map((area, index) => (
                <tr key={area.id || index}>
                  <td>{index + 1}</td>
                  <td>{area.pest_found || "N/A"}</td>
                  <td>{area.inspected_areas || "N/A"}</td>
                  <td>{area.manifested_areas || "N/A"}</td>
                  <td>{area.report_and_follow_up_detail || "N/A"}</td>
                  <td>
                    <div className="flex items-center space-x-2">
                      <FaEdit
                        onClick={() => handleEditArea(area)}
                        style={{
                          color: "blue",
                          cursor: "pointer",
                          marginRight: "10px",
                        }}
                      />
                      <FaTrash
                        onClick={() => handleDeleteArea(area.id)}
                        style={{ color: "red", cursor: "pointer" }}
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No areas added yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Pest Found</th>
              <th>Type of Treatment</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div className={styles.checkboxesContainer}>
                  <Grid container spacing={2}>
                    {servicesList?.map((pest, index) => (
                      <Grid item lg={4} xs={3} key={index}>
                        <label className={styles.checkboxLabel}>
                          <input
                            type="checkbox"
                            checked={selectedPests.includes(pest.id)}
                            onChange={() => handlePestToggle(pest.id)}
                          />
                          {pest.pest_name}
                        </label>
                      </Grid>
                    ))}
                  </Grid>
                </div>
              </td>
              <td>
                <div className={styles.checkboxesContainer}>
                  <Grid container spacing={2}>
                    {methodList?.map((method, index) => (
                      <Grid item lg={4} xs={3} key={index}>
                        <label className={styles.checkboxLabel}>
                          <input
                            type="checkbox"
                            checked={selectedMethods.includes(method.id)}
                            onChange={() => handleMethodToggle(method.id)}
                          />
                          {method.name}
                        </label>
                      </Grid>
                    ))}
                  </Grid>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <AddService
        open={open}
        handleClose={handleClose}
        onAddService={handleAddService}
        serviceReport={serviceReport}
        pestList={servicesList}
        initialData={editingArea} // Pass the editing area data
      />
    </div>
  );
};

export default Area;
