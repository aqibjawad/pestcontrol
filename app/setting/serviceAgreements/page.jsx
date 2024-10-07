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
import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";

const Page = () => {
  const alert = new AppAlerts();
  const { isLoading, service, addService, updateService, addingService } =
    useServices();

  const [name, setServiceName] = useState("");
  const [pestName, setPestName] = useState("");
  const [work_scope, setScope] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);
  const [updateId, setUpdateId] = useState(null);

  const handleFormSubmit = async () => {
    if (pestName === "") {
      alert.errorAlert("Pest Name is required");
    } else if (name === "") {
      alert.errorAlert("Name is required");
    } else if (work_scope === "") {
      alert.errorAlert("Please enter scope of work");
    } else {
      if (isUpdate) {
        updateService(updateId, pestName, name, work_scope);
      } else {
        addService(pestName, name, work_scope);
      }
    }
  };

  useEffect(() => {
    if (isLoading) {
      setServiceName("");
      setPestName("");
      setScope("");
      setIsUpdate(false);
      setUpdateId(null);
    }
  }, [isLoading]);

  const handleDelete = (item) => {
    setIsUpdate(true);
    setUpdateId(item.id); // Assuming each item has a unique id
    setServiceName(item.service_title);
    setPestName(item.pest_name);
    setScope(item.term_and_conditions);
  };

  return (
    <div>
      <div className="pageTitle">Service Agreements</div>
      <div className="grid grid-cols-2 gap-10">
        <div>
          {isLoading ? (
            <Loading />
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Pest Name</TableCell>
                    <TableCell>Service Name</TableCell>
                    <TableCell>Scope Of Work</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {service?.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item?.pest_name}</TableCell>
                      <TableCell>{item?.service_title}</TableCell>
                      <TableCell>{item?.term_and_conditions}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleDelete(item)}
                        >
                          Update
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </div>

        <div>
          <InputWithTitle
            title="Pest"
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
