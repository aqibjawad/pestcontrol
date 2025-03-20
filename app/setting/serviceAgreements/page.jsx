"use client";

import React, { useEffect, useState, useRef } from "react";
import InputWithTitle from "../../../components/generic/InputWithTitle";
import styles from "../../../styles/account/addServiceAgreementStyles.module.css";
import dynamic from "next/dynamic";
import GreenButton from "../../../components/generic/GreenButton";
import Loading from "../../../components/generic/Loading";
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
import withAuth from "@/utils/withAuth";

// Import React Quill dynamically to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

const Page = () => {
  const alert = new AppAlerts();
  const { isLoading, service, addService, updateService, addingService } =
    useServices();

  const [name, setServiceName] = useState("");
  const [pestName, setPestName] = useState("");
  const [work_scope, setScope] = useState("<p>Add your scope of work here...</p>");
  const [isUpdate, setIsUpdate] = useState(false);
  const [updateId, setUpdateId] = useState(null);

  const handleFormSubmit = async () => {
    if (pestName === "") {
      alert.errorAlert("Pest Name is required");
    } else if (name === "") {
      alert.errorAlert("Name is required");
    } else if (work_scope.trim() === "" || work_scope === "<p>Add your scope of work here...</p>") {
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
      setScope("<p>Add your scope of work here...</p>");
      setIsUpdate(false);
      setUpdateId(null);
    }
  }, [isLoading]);

  const handleDelete = (item) => {
    setIsUpdate(true);
    setUpdateId(item.id);
    setServiceName(item.service_title);
    setPestName(item.pest_name);
    setScope(item.term_and_conditions || "<p>Add your scope of work here...</p>");
  };

  // Quill editor modules and formats
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'],
      ['clean']
    ],
    clipboard: {
      matchVisual: false,
    }
  };
  
  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ];

  // Function to handle image upload
  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
    
    input.onchange = () => {
      const file = input.files[0];
      const formData = new FormData();
      formData.append('file', file);

      fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      })
        .then(response => response.json())
        .then(data => {
          const quill = document.querySelector('.quill-editor').querySelector('.ql-editor');
          const range = document.getSelection().getRangeAt(0);
          const img = document.createElement('img');
          img.src = data.location;
          range.insertNode(img);
        })
        .catch(err => {
          console.error(err);
          alert('Failed to upload image!');
        });
    };
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
                      <TableCell>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: item?.term_and_conditions,
                          }}
                        />
                      </TableCell>
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

          <div className="mt-5">
            <div className="mb-2 text-sm font-medium">Scope of Work</div>
            <ReactQuill
              className="quill-editor"
              theme="snow"
              value={work_scope}
              onChange={setScope}
              modules={modules}
              formats={formats}
            />
          </div>

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

export default withAuth(Page);