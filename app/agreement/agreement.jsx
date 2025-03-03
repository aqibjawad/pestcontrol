"use client";

import GreenButton from "@/components/generic/GreenButton";
import InputWithTitle from "@/components/generic/InputWithTitle";
import InputWithTitle3 from "@/components/generic/InputWithTitle3";
import { CircularProgress, Skeleton } from "@mui/material";
import React, { useEffect, useState, useMemo } from "react";
import { AppAlerts } from "@/Helper/AppAlerts";
import APICall from "@/networkUtil/APICall";
import { agreement } from "@/networkUtil/Constants";
import { useRouter } from "next/navigation";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Menu, MenuItem } from "@mui/material";

import UploadImagePlaceholder from "../../components/generic/uploadImage";

const Agreement = () => {
  const api = new APICall();
  const alert = new AppAlerts();
  const router = useRouter();

  const [anchorEl, setAnchorEl] = React.useState(null);

  const [deviceName, setDeviceName] = useState("");
  const [type, setType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [desc, setDesc] = useState("");
  const [updateDeviceID, setUpdateDeviceID] = useState("");
  const [sendingData, setSendingData] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [allDevices, setAllDevices] = useState([]);
  const [file, setFile] = useState([]);

  const handleRemoveAssignment = (device) => {
    alert.confirmAlert(
      "Are you sure you want to Remove Assignment",
      async () => {
        setFetchingData(true);
        // Pass device ID directly in the URL path
        var response = await api.deleteDataWithToken(
          `${agreement}/${device.id}/delete`
        );
        getDevices();
      }
    );
  };
  const handleUpdate = (device) => {
    setUpdateDeviceID(device.id);
    setDeviceName(device.name);
    setType(device.type);
    setStartDate(device.start_date);
    setExpiryDate(device.expiry_date);
    setDesc(device.remarks);
  };

  const addAgreement = async () => {
    if (!deviceName) {
      alert.errorAlert("Please enter agreement name");
    } else if (!startDate) {
      alert.errorAlert("Please enter start date");
    } else if (!expiryDate) {
      alert.errorAlert("Please enter expiry date");
    } else {
      setSendingData(true);
      let obj = {
        name: deviceName,
        type: type,
        start_date: startDate,
        expiry_date: expiryDate,
        last_renew_date: startDate, // Using start date as initial renew date
        remarks: desc,
        notified: "1",
      };

      if (file) {
        obj.file = file;
      }

      const isUpdate = !!updateDeviceID; // Check if updateDeviceID has a valid value
      const url = isUpdate
        ? `${agreement}/${updateDeviceID}/update`
        : `${agreement}/create`;

      try {
        const response = isUpdate
          ? await api.postFormDataWithToken(url, obj)
          : await api.postFormDataWithToken(url, obj);

        resetValues();
        getDevices();
      } catch (error) {
        console.error("Error while submitting agreement:", error);
      } finally {
        setSendingData(false);
      }
    }
  };

  const resetValues = () => {
    setDeviceName("");
    setStartDate("");
    setExpiryDate("");
    setDesc("");
    setType("");
    setUpdateDeviceID("");
  };

  const getDevices = async () => {
    setFetchingData(true);
    var response = await api.getDataWithToken(agreement);
    setAllDevices(response?.data?.data?.data);
    resetValues();
    setFetchingData(false);
  };

  useEffect(() => {
    getDevices();
  }, []);

  const renderSkeletons = () => {
    return Array.from({ length: 10 }, (_, index) => (
      <Skeleton
        key={index}
        variant="rectangular"
        height={50}
        className="mb-5"
      />
    ));
  };

  const handleAttachmentSelect = (file) => {
    console.log("Selected Attachment:", file);
    setFile(file);
  };

  const sortedDevices = useMemo(() => {
    return [...allDevices]
      .map((item) => {
        const remainingDays = Math.ceil(
          (new Date(item.expiry_date) - new Date()) / (1000 * 60 * 60 * 24)
        );
        return { ...item, remainingDays };
      })
      .sort((a, b) => a.remainingDays - b.remainingDays); // Sorting ascending
  }, [allDevices]);

  return (
    <div>
      <div className="pageTitle">Agreements</div>

      <div className="grid grid-cols-10 gap-4 bg-white rounded">
        <div className="col-span-3">
          <div className="pageTitle">Add Agreement</div>
          <div className="mt-5">
            <InputWithTitle
              value={deviceName}
              title={"Agreement Name"}
              onChange={setDeviceName}
            />
          </div>
          <div className="mt-5">
            <InputWithTitle
              value={type}
              title={"Agreement type"}
              onChange={setType}
            />
          </div>
          <div className="mt-5">
            <InputWithTitle
              value={startDate}
              title={"Start Date Agreement"}
              type={"date"}
              onChange={setStartDate}
            />
          </div>
          <div className="mt-5">
            <InputWithTitle
              value={expiryDate}
              title={"Expiry Date Agreement"}
              type={"date"}
              onChange={setExpiryDate}
            />
          </div>
          <div className="mt-5">
            <InputWithTitle value={desc} title={"Remarks"} onChange={setDesc} />
          </div>

          <div>
            <UploadImagePlaceholder
              onFileSelect={handleAttachmentSelect}
              title={"Attachment"}
            />
          </div>

          <div className="mt-5">
            <GreenButton
              onClick={() => addAgreement()}
              title={
                sendingData ? (
                  <CircularProgress color="inherit" size={20} />
                ) : updateDeviceID === "" ? (
                  "Submit"
                ) : (
                  "Update Agreement"
                )
              }
            />
          </div>
        </div>

        <div className="col-span-7">
          <>
            <div className="pageTitle">Saved Agreememts</div>
            {fetchingData ? (
              renderSkeletons()
            ) : (
              <div className="w-full p-4">
                <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                          Sr No
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                          Image
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                          Start Date
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                          End Date
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                          Remaining Days
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {sortedDevices?.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <img
                              src={item?.file_path}
                              alt="device"
                              className="w-10 h-10 object-cover"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.start_date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.expiry_date}
                          </td>
                          <td
                            className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${
                              item.remainingDays <= 5
                                ? "text-red-500"
                                : "text-green-500"
                            }`}
                          >
                            {item.remainingDays} Days
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div
                              onClick={() => handleUpdate(item)}
                              style={{ cursor: "pointer" }}
                            >
                              Update
                            </div>
                          </td>
                          <td>
                            <div
                              style={{ cursor: "pointer" }}
                              onClick={() => handleRemoveAssignment(item)}
                            >
                              Delete
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        </div>
      </div>
    </div>
  );
};

export default Agreement;
