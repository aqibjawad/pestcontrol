"use client";

import GreenButton from "@/components/generic/GreenButton";
import InputWithTitle from "@/components/generic/InputWithTitle";
import {
  CircularProgress,
  Paper,
  Skeleton,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { AppAlerts } from "@/Helper/AppAlerts";
import APICall from "@/networkUtil/APICall";
import Dropdown from "@/components/generic/Dropdown";
import {
  addDeviceURL,
  getDevicesURL,
  updateDevicesURL,
  getAllEmpoyesUrl,
  removeDeviceAssignment,
} from "@/networkUtil/Constants";
import { useRouter } from "next/navigation";

const Page = () => {
  const api = new APICall();
  const alert = new AppAlerts();
  const router = useRouter();

  const [deviceName, setDeviceName] = useState("");
  const [deviceModel, setDeviceModel] = useState("");
  const [code, setCode] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [sendingData, setSendingData] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [updateDeviceID, setUpdateDeviceID] = useState("");
  const [allDevices, setAllDevices] = useState([]);

  const [selectedIndex, setSelectedIndex] = useState([]);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedItem, setSelectedItem] = React.useState({});
  const [allEmployees, setAllEmployees] = React.useState(null);
  const [employessNames, setEmployessNames] = React.useState([]);
  const [showAssginDevice, setShowAssginDevice] = useState(false);
  const [deviceToAssign, setDeviceToAssign] = React.useState();
  const [selectedEmployeeId, setSelectedEmployeeId] = React.useState();

  const handleMenu = (event, item, index) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(item); // Ensure you store the correct item
    setSelectedIndex(index); // Store index properly
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAssignToEmployee = () => {
    setShowAssginDevice(true);
    setDeviceToAssign(selectedItem.item);
    handleClose();
  };

  const handleRemoveAssignment = () => {
    alert.confirmAlert(
      "Are you sure you want to Remove Assignment",
      async () => {
        setFetchingData(true);
        const obj = { device_id: selectedItem.item.id };
        var response = await api.postDataWithTokn(removeDeviceAssignment, obj);
        getDevices();
      }
    );

    handleClose();
  };

  const getAllEmployees = async () => {
    var response = await api.getDataWithToken(getAllEmpoyesUrl);
    var list = [];
    response.data.map((item) => {
      list.push(item.name);
    });

    setEmployessNames(list);
    setAllEmployees(response.data);
  };

  const addDevice = async () => {
    if (deviceName === "") {
      alert.errorAlert("Please enter device name");
    } else if (deviceModel === "") {
      alert.errorAlert("Please enter device model");
    } else if (code === "") {
      alert.errorAlert("Please enter device indenfication code");
    } else if (desc === "") {
      alert.errorAlert("Please enter device description");
    } else {
      setSendingData(true);
      let obj = {
        name: deviceName,
        model: deviceModel,
        code_no: code,
        desc: desc,
        price: price,
      };
      const url =
        updateDeviceID === ""
          ? addDeviceURL
          : `${updateDevicesURL}${updateDeviceID}`;
      var response = await api.postFormDataWithToken(url, obj);
      resetValues();
      getDevices();
      setSendingData(false);
    }
  };

  const resetValues = () => {
    setDeviceName("");
    setDeviceModel("");
    setCode("");
    setDesc("");
    setPrice("");
    setUpdateDeviceID("");
    setSelectedEmployeeId("");
    setDeviceToAssign(false);
    setShowAssginDevice(false);
  };

  const getDevices = async () => {
    setFetchingData(true);
    var response = await api.getDataWithToken(getDevicesURL);
    setAllDevices(response.data);
    // You might want to add console.log here to check the data
    resetValues();
    setFetchingData(false);
  };

  useEffect(() => {
    getDevices();
    getAllEmployees();
  }, []);

  const handleUpdate = (index) => {
    handleClose();
    setUpdateDeviceID(allDevices[index].id);
    setDeviceName(allDevices[index].name);
    setDeviceModel(allDevices[index].model);
    setCode(allDevices[index].code_no);
    setDesc(allDevices[index].desc);
    setPrice(allDevices[index].price);
  };

  const handleDoc = (index) => {
    router.push(`/deviceDoc/?id=${selectedItem.item.id}`);
  };

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

  const handleEmployeeChange = (value, index) => {
    setSelectedEmployeeId(allEmployees[index].id);
  };

  const assignDevice = () => {
    alert.confirmAlert(
      "Are you sure you want to Assign this device",
      async () => {
        setFetchingData(true);
        const obj = {
          device_id: selectedItem.item.id,
          user_id: selectedEmployeeId,
        };
        var response = await api.postDataWithTokn(removeDeviceAssignment, obj);
        getDevices();
      }
    );
  };

  return (
    <div>
      <div className="pageTitle">Devices</div>

      <div className="grid grid-cols-10 gap-4 bg-white rounded">
        <div className="col-span-3">
          <div className="pageTitle">Add Device</div>
          <div className="mt-5">
            <InputWithTitle
              value={deviceName}
              title={"Device Name"}
              onChange={setDeviceName}
            />
          </div>
          <div className="mt-5">
            <InputWithTitle
              value={deviceModel}
              title={"Model"}
              onChange={setDeviceModel}
            />
          </div>
          <div className="mt-5">
            <InputWithTitle
              value={code}
              title={"Identification Number (e.g IMEI)"}
              onChange={setCode}
            />
          </div>
          <div className="mt-5">
            <InputWithTitle
              value={desc}
              title={"Accessories"}
              onChange={setDesc}
            />
          </div>
          <div className="mt-5">
            <InputWithTitle value={price} title={"Price"} onChange={setPrice} />
          </div>
          <div className="mt-5">
            <GreenButton
              onClick={() => addDevice()}
              title={
                sendingData ? (
                  <CircularProgress color="inherit" size={20} />
                ) : updateDeviceID === "" ? (
                  "Submit"
                ) : (
                  "Update Device "
                )
              }
            />
          </div>
        </div>
        <div className="col-span-7">
          <>
            <div className="pageTitle">Saved Device</div>
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
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                          Model
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                          Code No
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {allDevices?.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-['regular']">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-['regular']">
                            <div>
                              {item.name}

                              <div className="contractHeader">
                                {item?.user?.name &&
                                  `Assinged To : ${item?.user?.name}`}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-['regular']">
                            {item.model}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-['regular']">
                            {item.code_no}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 font-['regular']">
                            {item.desc}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 font-['regular']">
                            {item.price || 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div>
                              <MoreVertIcon
                                id="basic-button"
                                aria-controls={open ? "basic-menu" : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? "true" : undefined}
                                onClick={(e) => handleMenu(e, item, index)}
                              />
                              <Menu
                                id={`${selectedIndex}`}
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                                MenuListProps={{
                                  "aria-labelledby": "basic-button",
                                }}
                                sx={{ boxShadow: "none" }}
                              >
                                {" "}
                                <MenuItem onClick={() => handleDoc(index)}>
                                  View Document
                                </MenuItem>
                                <MenuItem
                                  onClick={() => handleUpdate(selectedIndex)}
                                >
                                  Update
                                </MenuItem>
                                <MenuItem
                                  onClick={() => handleAssignToEmployee(index)}
                                >
                                  Assign to Employee
                                </MenuItem>
                                <MenuItem
                                  onClick={() => handleRemoveAssignment(index)}
                                >
                                  Remove Assignment
                                </MenuItem>
                              </Menu>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {/* Total Row */}
                      <tr className="bg-gray-100 font-medium">
                        <td
                          colSpan={5}
                          className="px-6 py-4 text-right text-sm text-gray-900"
                        >
                          Total Price:
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                          {allDevices?.reduce(
                            (total, item) => total + (Number(item.price) || 0),
                            0
                          )}
                        </td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                  <div>
                    {showAssginDevice ? (
                      <div className="mb-10 mt-10 p-5">
                        <div className="pageTitle mt-10 mb-5">
                          Assign Device
                        </div>
                        <div className="flex">
                          <div className="contractTable">
                            Device Name :&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                          </div>
                          <div className="contractHeader">
                            {deviceToAssign.model}
                          </div>
                        </div>
                        <Dropdown
                          title={"Please Select Employee"}
                          options={employessNames}
                          onChange={handleEmployeeChange}
                        />
                        <div className="mb-5 mt-5">
                          <GreenButton
                            onClick={() => assignDevice()}
                            title={"Assign Device"}
                          />
                        </div>
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        </div>
      </div>
    </div>
  );
};

export default Page;
