"use client";

import React, { useEffect, useState } from "react";
import InputWithTitle from "../../../components/generic/InputWithTitle";
import styles from "../../../styles/account/addServiceAgreementStyles.module.css";
import APICall from "@/networkUtil/APICall";
import {
  getServiceAgreements,
  addServiceAgreements,
  deleteServiceAgreement,
} from "@/networkUtil/Constants";
import MultilineInput from "../../../components/generic/MultilineInput";
import GreenButton from "../../../components/generic/GreenButton";
import Loading from "../../../components/generic/Loading";
import Swal from "sweetalert2";

const Page = () => {
  const api = new APICall();

  const [agreementsList, setAgreementsList] = useState([]);
  const [fetchingData, setFetchingData] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [name, setServiceName] = useState("");
  const [work_scope, setScope] = useState("");

  useEffect(() => {
    getServices();
  }, []);

  const getServices = async () => {
    setFetchingData(true);
    try {
      const response = await api.getDataWithToken(getServiceAgreements);
      if (response.data && response.data.data) {
        setAgreementsList(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching service agreements:", error);
    } finally {
      setFetchingData(false);
    }
  };

  const handleFormSubmit = async () => {
    setLoading(true);

    const formData = {
      name: name,
      work_scope: work_scope,
    };

    try {
      const response = await api.postDataWithTokn(
        addServiceAgreements,
        formData
      );

      if (response.error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.error.error || "Unknown error occurred.",
        });
        console.log(response.error.error);
      } else {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Service agreement added successfully!",
        });
        getServices(); // Refresh the list after adding a new agreement
      }
    } catch (error) {
      console.error("Error adding service agreement:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);

    try {
      const response = await api.deleteDataWithToken(deleteServiceAgreement(id));

      if (response.error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.error.error || "Failed to delete service agreement.",
        });
        console.log(response.error.error);
      } else {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Service agreement deleted successfully!",
        });
        getServices(); // Refresh the list after deleting an agreement
      }
    } catch (error) {
      console.error("Error deleting service agreement:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="pageTitle">Service Agreements</div>
      <div className="grid grid-cols-2 gap-10">
        <div>
          {fetchingData ? (
            <Loading />
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Scope of Work
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {agreementsList.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {item.service_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {item.scope_of_work}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        className="text-indigo-600 hover:text-indigo-900"
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div>
          <InputWithTitle
            title="Name"
            placeholder="Name"
            value={name}
            onChange={setServiceName}
          />

          <div className="mt-5"></div>
          <MultilineInput
            value={work_scope}
            onChange={setScope}
            placeholder="Scope of work"
            title="Scope of Work"
          />
          <div className="mt-5"></div>
          <GreenButton onClick={handleFormSubmit} title="Add" />
        </div>
      </div>
    </div>
  );
};

export default Page;
