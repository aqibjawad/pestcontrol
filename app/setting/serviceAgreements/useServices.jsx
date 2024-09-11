"use client";

import React, { useEffect, useState } from "react";
import { services } from "../../../networkUtil/Constants";
import APICall from "../../../networkUtil/APICall";
import { AppAlerts } from "@/Helper/AppAlerts";

const UseServices = () => {
  const api = new APICall();
  const alerts = new AppAlerts();
  const [service, setServices] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [addingService, setAddingService] = useState(false);
  const [updatingService, setUpdatingService] = useState(false);

  const getAllServices = async () => {
    setIsLoading(true);
    const response = await api.getDataWithToken(services);
    setServices(response.data);
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
      const response = await api.postDataWithTokn(`${services}/create`, obj);
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

  const updateService = async (id, pestName, name, work_scope) => {
    if (!updatingService) {
      setUpdatingService(true);
      let obj = {
        pest_name: pestName,
        service_title: name,
        term_and_conditions: work_scope,
      };
      const response = await api.updateFormDataWithToken(
        `${services}/update/${id}`,
        obj
      );
      setUpdatingService(false);
      if (response.error) {
        alerts.errorAlert(
          `Request failed with status ${response.status}: ${response.error}`
        );
      } else {
        getAllServices();
      }
    }
  };

  return {
    service,
    isLoading,
    addService,
    updateService,
    addingService,
    updatingService,
  };
};

export default UseServices;
