import React, { useEffect, useState } from "react";
import { services } from "../../networkUtil/Constants";
import APICall from "../../networkUtil/APICall";

const ServiceAgreement = ({ formData, setFormData }) => {
  const api = new APICall();
  const [allServices, setAllServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getAllServices = async () => {
    setIsLoading(true);
    try {
      const response = await api.getDataWithToken(services);
      setAllServices(
        response.data.map((service) => ({
          ...service,
          isChecked: false,
        }))
      );
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllServices();
  }, []);

  const handleCheckboxChange = (serviceId) => {
    setAllServices((prevServices) => {
      const updatedServices = prevServices.map((service) =>
        service.id === serviceId
          ? { ...service, isChecked: !service.isChecked }
          : service
      );

      const selectedServiceIds = updatedServices
        .filter((service) => service.isChecked)
        .map((service) => parseInt(service.id))
        .join(",");

      setFormData((prev) => ({
        ...prev,
        service_ids: selectedServiceIds || "",
      }));

      return updatedServices;
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-10 p-5 border border-[#D0D5DD]">
      <div className="text-xl font-semibold mt-5">Service Agreement</div>

      {/* Checkbox List */}
      <div className="flex flex-wrap gap-4 mt-4">
        {allServices.map((service) => (
          <div key={service.id} className="flex items-center">
            <input
              type="checkbox"
              checked={service.isChecked}
              onChange={() => handleCheckboxChange(service.id)}
              className="mr-2"
            />
            <label>{service.pest_name}</label>
          </div>
        ))}
      </div>

      {/* Dropdown to Show All Service Titles */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700">
          Select a Service
        </label>
        <select className="mt-1 block w-full px-3 py-2 text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
          {allServices.map((service) => (
            <option key={service.id} value={service.service_title}>
              {service.service_title}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ServiceAgreement;
