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
import useServices from "./useServices";
import { AppAlerts } from "../../../Helper/AppAlerts";
import { CircularProgress } from "@mui/material";
const Page = () => {
  const alert = new AppAlerts();
  const { isLoading, services, addService, addingService } = useServices();
  const [agreementsList, setAgreementsList] = useState([]);
  const [fetchingData, setFetchingData] = useState(false);
  const [name, setServiceName] = useState("");
  const [pestName, setPestName] = useState("");
  const [work_scope, setScope] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);

  const handleFormSubmit = async () => {
    if (pestName === "") {
      alert.errorAlert("Pest Name is required");
    } else if (name === "") {
      alert.errorAlert("Name is required");
    } else if (work_scope === "") {
      alert.errorAlert("Please enter scope of work");
    } else {
      addService(pestName, name, work_scope);
    }
  };

  useEffect(() => {
    if (isLoading) {
      setServiceName("");
      setPestName("");
      setScope("");
    }
  }, [isLoading]);

  const handleDelete = async (item) => {
    setIsUpdate(true);
    setServiceName(item.service_name);
    setPestName("");
    setScope("");
  };

  return (
    <div>
      <div className="pageTitle">Service Agreements</div>
      <div className="grid grid-cols-2 gap-10">
        <div>
          {isLoading ? (
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
                {services.map((item, index) => (
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
                        onClick={() => handleDelete(item)}
                      >
                        Update
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
            title="Pest Name"
            placeholder="Fly, Rat etc"
            value={pestName}
            onChange={setPestName}
          />

          <div className="mt-5">
            <InputWithTitle
              title="Service Name"
              placeholder="Rat Control"
              value={name}
              onChange={setServiceName}
            />
          </div>

          <div className="mt-5"></div>
          <MultilineInput
            value={work_scope}
            onChange={setScope}
            placeholder="Scope of work"
            title="Scope of Work"
          />
          <div className="mt-5"></div>
          <GreenButton
            onClick={() => handleFormSubmit()}
            title={
              addingService ? (
                <CircularProgress color="inherit" size={20} />
              ) : isUpdate ? (
                "Update"
              ) : (
                "Add"
              )
            }
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
