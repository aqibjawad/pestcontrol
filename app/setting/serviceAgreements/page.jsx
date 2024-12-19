"use client";

import React, { useEffect, useState, useRef } from "react";
import InputWithTitle from "../../../components/generic/InputWithTitle";
import styles from "../../../styles/account/addServiceAgreementStyles.module.css";
import { Editor } from "@tinymce/tinymce-react";
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

const Page = () => {
  const alert = new AppAlerts();
  const { isLoading, service, addService, updateService, addingService } =
    useServices();

  const editorRef = useRef(null);
  const [name, setServiceName] = useState("");
  const [pestName, setPestName] = useState("");
  const [work_scope, setScope] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);
  const [updateId, setUpdateId] = useState(null);

  const handleFormSubmit = async () => {
    // Get the current content from TinyMCE editor
    const editorContent = editorRef.current
      ? editorRef.current.getContent()
      : "";

    if (pestName === "") {
      alert.errorAlert("Pest Name is required");
    } else if (name === "") {
      alert.errorAlert("Name is required");
    } else if (editorContent.trim() === "") {
      alert.errorAlert("Please enter scope of work");
    } else {
      if (isUpdate) {
        updateService(updateId, pestName, name, editorContent);
      } else {
        addService(pestName, name, editorContent);
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
      // Reset TinyMCE editor
      if (editorRef.current) {
        editorRef.current.setContent("");
      }
    }
  }, [isLoading]);

  const handleDelete = (item) => {
    setIsUpdate(true);
    setUpdateId(item.id);
    setServiceName(item.service_title);
    setPestName(item.pest_name);

    // Set the content in TinyMCE editor
    if (editorRef.current) {
      editorRef.current.setContent(item.term_and_conditions || "");
    }
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
            <Editor
              apiKey="gz7lzl53pn7erx245ajl5zprzl79zhcadvybrd9hzbil53sv"
              onInit={(evt, editor) => (editorRef.current = editor)}
              initialValue="<p>Add your scope of work here...</p>"
              init={{
                height: 300,
                menubar: true,
                plugins: [
                  "advlist autolink lists link image charmap print preview anchor",
                  "searchreplace visualblocks code fullscreen",
                  "insertdatetime media table paste code help wordcount",
                  "image imagetools lists",
                ],
                toolbar: [
                  "undo redo | formatselect | bold italic backcolor",
                  "alignleft aligncenter alignright alignjustify",
                  "numlist bullist | outdent indent",
                  "removeformat | link image",
                ].join(" | "),
                lists_indent_on_tab: true,
                automatic_uploads: true,
                images_upload_url: "/api/upload-image",
                file_picker_types: "image",
                file_picker_callback: (cb, value, meta) => {
                  const input = document.createElement("input");
                  input.setAttribute("type", "file");
                  input.setAttribute("accept", "image/*");
                  input.onchange = () => {
                    const file = input.files[0];
                    const formData = new FormData();
                    formData.append("file", file);

                    fetch("/api/upload-image", {
                      method: "POST",
                      body: formData,
                    })
                      .then((response) => response.json())
                      .then((data) => {
                        cb(data.location);
                      })
                      .catch((err) => {
                        console.error(err);
                        alert("Failed to upload image!");
                      });
                  };
                  input.click();
                },
              }}
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
