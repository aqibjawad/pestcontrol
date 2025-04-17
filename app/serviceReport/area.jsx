"use client";

import React, { useState, useEffect } from "react";
import styles from "../../styles/serviceReport.module.css";
import AddService from "../../components/addService";
import APICall from "@/networkUtil/APICall";
import { treatmentMethod, services } from "@/networkUtil/Constants";
import Grid from "@mui/material/Grid";

import { FaTrash } from "react-icons/fa";

const Area = ({ formData, setFormData }) => {
  const api = new APICall();

  const [open, setOpen] = useState(false);
  const [addresses, setServiceAreas] = useState([]);
  const [methodList, setMethodList] = useState([]);
  const [servicesList, setServicesList] = useState([]);
  const [selectedPests, setSelectedPests] = useState([]);
  const [selectedMethods, setSelectedMethods] = useState([]);

  useEffect(() => {
    getAllMethods();
    getAllPests();
  }, []);

  // Initialize from formData if it exists
  useEffect(() => {
    if (formData.addresses) {
      setServiceAreas(formData.addresses);
    }
    if (formData.pest_found_ids) {
      setSelectedPests(formData.pest_found_ids);
    }
    if (formData.tm_ids) {
      setSelectedMethods(formData.tm_ids);
    }
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const getAllMethods = async () => {
    try {
      const response = await api.getDataWithToken(`${treatmentMethod}`);
      setMethodList(response.data);
    } catch (error) {
      console.error("Error fetching quotes:", error);
    }
  };

  const getAllPests = async () => {
    try {
      const response = await api.getDataWithToken(`${services}`);
      setServicesList(response.data);
    } catch (error) {
      console.error("Error fetching quotes:", error);
    }
  };

  // In Area.jsx
  const handleAddService = (newService) => {
    const updatedAddresses = [...addresses, { ...newService, id: Date.now() }];
    setServiceAreas(updatedAddresses);

    // If there's a valid pest ID, add it to selectedPests if not already there
    if (newService.pest_id && !selectedPests.includes(newService.pest_id)) {
      const updatedPests = [...selectedPests, newService.pest_id];
      setSelectedPests(updatedPests);
      updateFormData(updatedAddresses, updatedPests, selectedMethods);
    } else {
      updateFormData(updatedAddresses, selectedPests, selectedMethods);
    }
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
            {addresses.map((area, index) => (
              <tr key={area.id}>
                <td>{index + 1}</td>
                <td>{area.pest_found}</td>
                <td>{area.infestation_level}</td>
                <td>{area.manifested_areas}</td>
                <td>{area.report_and_follow_up_detail}</td>
                <td>
                  <FaTrash
                    onClick={() => handleDeleteArea(area.id)}
                    style={{ color: "red", cursor: "pointer" }}
                  />
                </td>
              </tr>
            ))}
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
        pestList={servicesList} // Pass the pest list to the AddService component
      />
    </div>
  );
};

export default Area;
