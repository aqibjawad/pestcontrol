"use client";
import React, { useEffect, useState } from "react";
import InputWithTitle from "../../../components/generic/InputWithTitle";
import styles from "../../../styles/account/addServiceAgreementStyles.module.css";
import APICall from "@/networkUtil/APICall";
import {
  getServiceAgreements,
  addServiceAgreements,
} from "@/networkUtil/Constants";
import MultilineInput from "../../../components/generic/MultilineInput";
import GreenButton from "../../../components/generic/GreenButton";
import Loading from "../../../components/generic/Loading";

const Page = () => {
  const api = new APICall();

  const [agreementsList, setAgreementsList] = useState([]);
  const [fetchingData, setFetchingData] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [name, setServiceName] = useState("");
  const [work_scope, setScope] = useState("");

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
        alert(response.error.error);
        console.log(response.error.error);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error adding service agreement:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div>
      <div className="pageTitle">Service Agreements</div>
      <div className="grid grid-cols-2 gap-10">
        <div>
          {fetchingData ? (
            <Loading />
          ) : (
            agreementsList.map((item, index) => (
              <div
                key={index}
                style={{ display: "flex", gap:"50px", justifyContent:"justify", marginBottom:"1rem" }}
              >
                <div>{item.service_name}</div>
                <div>{item.scope_of_work}</div>
              </div>
            ))
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
