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

  useEffect(() => {
    if (service.length > 0) {
      makeServicesList();
    }
  }, [service, formData.tm_ids]);

  const makeServicesList = () => {
    // Handle different types of tm_ids input
    let currentTmIds = [];

    if (Array.isArray(formData.tm_ids)) {
      currentTmIds = formData.tm_ids;
    } else if (typeof formData.tm_ids === "string") {
      // Handle string input like "[12,11,10,9]"
      try {
        currentTmIds = JSON.parse(formData.tm_ids);
      } catch {
        // If JSON.parse fails, try splitting the string
        currentTmIds = formData.tm_ids
          .replace(/[\[\]\s]/g, "") // Remove brackets and whitespace
          .split(",")
          .map((id) => Number(id))
          .filter((id) => !isNaN(id)); // Filter out any invalid numbers
      }
    }

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
        tm_ids: selectedIds,
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
