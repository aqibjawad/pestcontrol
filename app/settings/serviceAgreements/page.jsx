"use client";
import React, { useEffect, useState } from "react";
import InputWithTitle from "../../../components/generic/InputWithTitle";
import styles from "../../../styles/account/addServiceAgreementStyles.module.css";
import APICall from "@/networkUtil/APICall";
import { getServiceAgreements } from "@/networkUtil/Constants";
import MultilineInput from "../../../components/generic/MultilineInput";
import GreenButton from "../../../components/generic/GreenButton";
import Loading from "../../../components/generic/Loading";

const Page = () => {
  const [serviceName, setSerivceName] = useState();
  const [agreementsList, setAgreementsList] = useState();
  const [fetchindData, setFetchingData] = useState(false);
  const [scope, setScope] = useState();
  const api = new APICall();

  useEffect(() => {
    getServices();
  }, []);

  const getServices = async () => {
    setFetchingData(true);
    const services = await api.getDataWithToken(getServiceAgreements);
    setAgreementsList(services.data.data);
    setFetchingData(false);
  };

  const setList = () => {
    {
      agreementsList &&
        agreementsList.map((item, index) => {
          return <div>adfs</div>;
        });
    }
  };

  return (
    <div>
      <div className="pageTitle">Service Agreements</div>
      <div className="grid grid-cols-2 gap-10">
        <div>{fetchindData ? <Loading /> : setList()}</div>

        <div>
          <InputWithTitle
            title={"Name"}
            placeholder={"Name"}
            onChange={setSerivceName}
          />

          <div className="mt-5"></div>
          <MultilineInput
            onChange={setScope}
            placeholder={"Scope of work"}
            title={"Scope of Work"}
          />
          <div className="mt-5"></div>
          <GreenButton title={"Add"} />
        </div>
      </div>
    </div>
  );
};

export default Page;
