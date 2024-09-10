"use client";

import React, { useEffect, useState } from "react";
import { getServices, addServicesURL } from "../../../networkUtil/Constants";
import APICall from "../../../networkUtil/APICall";
import { AppAlerts } from "@/Helper/AppAlerts";
const UseServices = () => {
  const api = new APICall();
  const alerts = new AppAlerts();
  const [services, setServices] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [addingService, setAddingService] = useState();

  const getAllServices = async () => {
    setIsLoading(true);
    const response = await api.getDataWithToken(getServices);
    setServices(response.data.data);
    setIsLoading(false);
  };
  useEffect(() => {
    getAllServices();
  }, []);

  const addService = async (pestName, name, work_scope) => {
    if (!addingService) {
      setAddingService(true);
      let obj = {
        pest_name: pestName,
        service_title: name,
        term_and_conditions: work_scope,
      };
      const response = await api.postDataWithTokn(addServicesURL, obj);
      setAddingService(false);
      if (response.error) {
        alerts.errorAlert(
          `Request failed with status ${response.status}: ${response.error}`
        );
      } else {
        getAllServices();
      }
    }
  };

  return { services, isLoading, addService, addingService };
};

export default UseServices;
