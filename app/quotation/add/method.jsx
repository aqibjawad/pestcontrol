"use client";

import React, { useEffect, useState } from "react";
import { treatmentMethod } from "../../../networkUtil/Constants";
import APICall from "../../../networkUtil/APICall";

const Method = ({ setFormData, formData }) => {
  const api = new APICall();
  const [service, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [myServices, setMyServices] = useState([]);

  const getAllServices = async () => {
    try {
      setIsLoading(true);
      const response = await api.getDataWithToken(treatmentMethod);
      if (response.data) {
        setServices(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch services:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllServices();
  }, []);

  // Helper function to convert tm_ids to array
  const parseTmIds = (tmIds) => {
    if (Array.isArray(tmIds)) {
      return tmIds;
    }

    if (typeof tmIds === "string") {
      try {
        // First attempt: Parse as JSON
        return JSON.parse(tmIds);
      } catch {
        // Second attempt: Clean and split string
        return tmIds
          .replace(/[\[\]\s]/g, "")
          .split(",")
          .map(Number)
          .filter((id) => !isNaN(id));
      }
    }

    return [];
  };

  useEffect(() => {
    if (service.length > 0) {
      // Convert tm_ids to array format when component mounts
      if (formData.tm_ids && typeof formData.tm_ids === "string") {
        const parsedIds = parseTmIds(formData.tm_ids);
        setFormData((prev) => ({
          ...prev,
          tm_ids: parsedIds,
        }));
      }
      makeServicesList();
    }
  }, [service, formData.tm_ids]);

  const makeServicesList = () => {
    const currentTmIds = parseTmIds(formData.tm_ids);

    const servicesWithCheck = service.map((item) => ({
      id: item.id,
      name: item.name,
      isChecked: currentTmIds.includes(item.id),
    }));
    setMyServices(servicesWithCheck);
  };

  const handleCheckboxChange = (index) => {
    setMyServices((prevServices) => {
      const updatedServices = prevServices.map((service, i) =>
        i === index ? { ...service, isChecked: !service.isChecked } : service
      );

      // Get the IDs of the checked services as an array of numbers
      const selectedIds = updatedServices
        .filter((service) => service.isChecked)
        .map((service) => Number(service.id));

      // Update the form data with the selected IDs array
      setFormData((prevData) => ({
        ...prevData,
        tm_ids: selectedIds, // Always store as array
      }));

      return updatedServices;
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4">Loading...</div>
    );
  }

  return (
    <div className="mt-10 border border-[#D0D5DD] p-5 rounded-md">
      <div className="text-xl font-semibold mb-4">Treatment Method</div>
      <div className="flex flex-wrap gap-4">
        {myServices.length > 0 ? (
          myServices.map((agreement, index) => (
            <div key={agreement.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`treatment-${agreement.id}`}
                checked={agreement.isChecked}
                onChange={() => handleCheckboxChange(index)}
                className="rounded border-gray-300 focus:ring-blue-500"
              />
              <label
                htmlFor={`treatment-${agreement.id}`}
                className="text-sm text-gray-700"
              >
                {agreement.name}
              </label>
            </div>
          ))
        ) : (
          <div className="text-gray-500">No services available</div>
        )}
      </div>
    </div>
  );
};

export default Method;
 